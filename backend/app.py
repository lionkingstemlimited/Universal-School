import os
from datetime import datetime
from decimal import Decimal

from dotenv import load_dotenv
from flask import Flask, jsonify, request
from flask_cors import CORS
from flask_sqlalchemy import SQLAlchemy
from sqlalchemy import JSON

load_dotenv()

db = SQLAlchemy()


class Record(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    module = db.Column(db.String(80), index=True, nullable=False)
    title = db.Column(db.String(160), nullable=False)
    status = db.Column(db.String(60), default="Active")
    amount = db.Column(db.Numeric(12, 2), default=0)
    owner = db.Column(db.String(160), default="")
    due_date = db.Column(db.String(40), default="")
    payload = db.Column(JSON, default=dict)
    created_at = db.Column(db.DateTime, default=datetime.utcnow)
    updated_at = db.Column(db.DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)

    def to_dict(self):
        return {
            "id": self.id,
            "module": self.module,
            "title": self.title,
            "status": self.status,
            "amount": float(self.amount or 0),
            "owner": self.owner,
            "dueDate": self.due_date,
            "payload": self.payload or {},
            "createdAt": self.created_at.isoformat(),
            "updatedAt": self.updated_at.isoformat(),
        }


def kenya_payroll(gross_pay):
    gross = Decimal(str(gross_pay or 0))
    personal_relief = Decimal("2400")
    shif = gross * Decimal("0.0275")
    housing_levy = gross * Decimal("0.015")
    nssf = min(gross * Decimal("0.06"), Decimal("2160"))
    taxable = max(gross - nssf, Decimal("0"))
    bands = [
        (Decimal("24000"), Decimal("0.10")),
        (Decimal("8333"), Decimal("0.25")),
        (Decimal("467667"), Decimal("0.30")),
        (Decimal("300000"), Decimal("0.325")),
    ]
    remaining = taxable
    paye = Decimal("0")
    for width, rate in bands:
        charge = min(remaining, width)
        if charge <= 0:
            break
        paye += charge * rate
        remaining -= charge
    if remaining > 0:
        paye += remaining * Decimal("0.35")
    paye = max(paye - personal_relief, Decimal("0"))
    net = gross - paye - nssf - shif - housing_levy
    return {
        "grossPay": round(float(gross), 2),
        "taxablePay": round(float(taxable), 2),
        "paye": round(float(paye), 2),
        "nssf": round(float(nssf), 2),
        "shif": round(float(shif), 2),
        "housingLevy": round(float(housing_levy), 2),
        "netPay": round(float(net), 2),
    }


def create_app():
    app = Flask(__name__)
    database_url = os.getenv("DATABASE_URL", "sqlite:///universal_school_dev.db")
    if database_url.startswith("postgresql"):
        separator = "&" if "?" in database_url else "?"
        database_url = f"{database_url}{separator}connect_timeout=5"
    app.config["SQLALCHEMY_DATABASE_URI"] = database_url
    app.config["SQLALCHEMY_TRACK_MODIFICATIONS"] = False
    app.config["SECRET_KEY"] = os.getenv("FLASK_SECRET_KEY", "dev")
    CORS(app)
    db.init_app(app)

    @app.get("/")
    def index():
        return {
            "ok": True,
            "service": "Universal School API",
            "message": "Backend is running. Use /api/health for health checks and /api/records/<module> for CRUD endpoints.",
            "frontend": "http://127.0.0.1:5173",
        }

    @app.get("/api/health")
    def health():
        return {"ok": True, "service": "Universal School API"}

    @app.post("/api/init-db")
    def init_db():
        db.create_all()
        return {"ok": True}

    @app.get("/api/records/<module>")
    def list_records(module):
        rows = Record.query.filter_by(module=module).order_by(Record.updated_at.desc()).all()
        return jsonify([row.to_dict() for row in rows])

    @app.post("/api/records/<module>")
    def create_record(module):
        data = request.get_json(force=True)
        row = Record(
            module=module,
            title=data.get("title", "Untitled"),
            status=data.get("status", "Active"),
            amount=data.get("amount", 0) or 0,
            owner=data.get("owner", ""),
            due_date=data.get("dueDate", ""),
            payload=data.get("payload", {}),
        )
        db.session.add(row)
        db.session.commit()
        return jsonify(row.to_dict()), 201

    @app.put("/api/records/<module>/<int:record_id>")
    def update_record(module, record_id):
        row = Record.query.filter_by(module=module, id=record_id).first_or_404()
        data = request.get_json(force=True)
        for key, attr in {"title": "title", "status": "status", "amount": "amount", "owner": "owner", "dueDate": "due_date"}.items():
            if key in data:
                setattr(row, attr, data[key])
        if "payload" in data:
            row.payload = data["payload"]
        db.session.commit()
        return jsonify(row.to_dict())

    @app.delete("/api/records/<module>/<int:record_id>")
    def delete_record(module, record_id):
        row = Record.query.filter_by(module=module, id=record_id).first_or_404()
        db.session.delete(row)
        db.session.commit()
        return {"ok": True}

    @app.post("/api/payroll/calculate")
    def calculate_payroll():
        data = request.get_json(force=True)
        return jsonify(kenya_payroll(data.get("grossPay", 0)))

    @app.post("/api/notifications/send")
    def send_notification():
        data = request.get_json(force=True)
        channels = data.get("channels", [])
        message = data.get("message", "")
        recipients = data.get("recipients", "")
        row = Record(
            module="notifications",
            title=f"Notification to {recipients}",
            status="Queued",
            owner=data.get("sender", "System"),
            payload={"channels": channels, "message": message, "recipients": recipients},
        )
        db.session.add(row)
        db.session.commit()
        return jsonify({"ok": True, "deliveryStatus": "Queued", "record": row.to_dict()})

    @app.post("/api/ai/mark-assignment")
    def mark_assignment():
        data = request.get_json(force=True)
        answer = data.get("answer", "")
        rubric = data.get("rubric", "Accuracy, completeness, clarity")
        score = min(100, max(35, 55 + len(answer.split()) // 4))
        return jsonify({
            "score": score,
            "grade": "A" if score >= 80 else "B" if score >= 70 else "C" if score >= 55 else "D",
            "feedback": f"Draft AI marker feedback using rubric: {rubric}. Strengthen explanations and show working where needed.",
        })

    @app.post("/api/chat")
    def chat():
        data = request.get_json(force=True)
        return jsonify({
            "reply": f"Universal School assistant received: {data.get('message', '')}. A staff member can follow up from the dashboard."
        })

    return app


if __name__ == "__main__":
    app = create_app()
    with app.app_context():
        db.create_all()
    app.run(host="127.0.0.1", port=8000, debug=True)
