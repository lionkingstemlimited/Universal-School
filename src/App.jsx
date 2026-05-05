import { useEffect, useState } from 'react'
import {
  Bell,
  BookOpen,
  BriefcaseBusiness,
  Calculator,
  CheckCircle2,
  ClipboardCheck,
  GraduationCap,
  LayoutDashboard,
  MessageSquareText,
  Package,
  Pencil,
  Plus,
  Save,
  Send,
  ShieldCheck,
  UserPlus,
  Trash2,
  Users,
  WalletCards,
} from 'lucide-react'
import { aiMarkerApi, chatApi, notifyApi, payrollApi, recordsApi } from './api'

const dashboards = [
  { id: 'finance', label: 'Finance', icon: WalletCards },
  { id: 'admin', label: 'School Admin', icon: ShieldCheck },
  { id: 'reception', label: 'Receptionist', icon: ClipboardCheck },
  { id: 'hr', label: 'HR Manager', icon: BriefcaseBusiness },
  { id: 'classTeacher', label: 'Class Teacher', icon: Users },
  { id: 'subjectTeacher', label: 'Subject Teacher', icon: BookOpen },
  { id: 'student', label: 'Student', icon: GraduationCap },
  { id: 'parent', label: 'Parent', icon: Bell },
]

const demoNames = {
  finance: 'Finance Officer',
  admin: 'School Administrator',
  reception: 'Receptionist',
  hr: 'HR Manager',
  classTeacher: 'Class Teacher',
  subjectTeacher: 'Subject Teacher',
  student: 'Student',
  parent: 'Parent',
}

const demoEmails = {
  finance: 'finance@universal.school',
  admin: 'admin@universal.school',
  reception: 'reception@universal.school',
  hr: 'hr@universal.school',
  classTeacher: 'class.teacher@universal.school',
  subjectTeacher: 'subject.teacher@universal.school',
  student: 'student@universal.school',
  parent: 'parent@example.com',
}

const moduleMeta = {
  salaries: { title: 'Employee and Staff Salaries', icon: WalletCards, fields: ['Staff ID', 'Payroll No', 'Department', 'Pay Period', 'Basic Pay', 'Allowances', 'Deductions', 'Net Pay'] },
  fees: { title: 'Student School Fees Payments', icon: GraduationCap, fields: ['Admission No', 'Student Class', 'Parent Name', 'Parent Phone', 'Parent Email', 'Term Bill', 'Amount Paid', 'Balance'] },
  inventory: { title: 'Inventory and Stock Payments', icon: Package, fields: ['Supplier', 'Invoice No', 'Item Category', 'Quantity', 'Unit Cost', 'Payment Method', 'Balance'] },
  users: { title: 'Users and Permissions', icon: Users, fields: ['User Type', 'Email', 'Phone', 'Login Status', 'Permissions'] },
  roles: { title: 'Roles and Permissions', icon: ShieldCheck, fields: ['Role', 'Scope', 'Create', 'Read', 'Update', 'Delete', 'Permissions'] },
  twilio: { title: 'Twilio SMS, WhatsApp and Email Gateway', icon: Send, fields: ['Account SID', 'From SMS', 'From WhatsApp', 'Webhook URL', 'Status'] },
  mailgrid: { title: 'MailGrid Email Gateway', icon: Send, fields: ['API Key Label', 'Sender Email', 'Domain', 'Template Group', 'Status'] },
  otherGateways: { title: 'Other API Gateways', icon: LayoutDashboard, fields: ['Provider', 'Base URL', 'API Key Label', 'Purpose', 'Status'] },
  studentAdmissions: { title: 'New Student Admissions', icon: GraduationCap, fields: ['Admission No', 'Class', 'Stream', 'Parent Name', 'Parent Phone', 'Parent Email', 'Previous School', 'Admission Stage'] },
  staffRegistrations: { title: 'Staff Admissions and Registration', icon: BriefcaseBusiness, fields: ['Staff ID', 'Position', 'TSC/ID No', 'Department', 'Phone', 'Email', 'Registration Stage'] },
  staffApplications: { title: 'New Staff Applications', icon: ClipboardCheck, fields: ['Application No', 'Position Applied', 'Qualification', 'Years Experience', 'Interview Date', 'Application Stage'] },
  employees: { title: 'Staff and Employee Records', icon: Users, fields: ['Staff ID', 'Position', 'Department', 'Employment Type', 'KRA PIN', 'NSSF No', 'SHIF No'] },
  payroll: { title: 'Employee Payroll', icon: Calculator, fields: ['Staff ID', 'Payroll Month', 'Employee PIN', 'Gross Pay', 'PAYE', 'NSSF', 'SHIF', 'Housing Levy', 'Net Pay'] },
  classStudents: { title: 'Students Sent to Class', icon: Users, fields: ['Admission No', 'Class', 'Stream', 'Guardian', 'Parent Phone', 'Admission Status'] },
  classAttendance: { title: 'Class Attendance', icon: ClipboardCheck, fields: ['Admission No', 'Class', 'Date', 'Session', 'Present/Absent', 'Signed By'] },
  classPerformance: { title: 'Overall Subject Performance', icon: BookOpen, fields: ['Admission No', 'Class', 'Exam Type', 'Total Score', 'Average', 'Grade', 'Rank'] },
  subjectStudents: { title: 'Students Allocated to Subject Class', icon: Users, fields: ['Admission No', 'Subject', 'Class', 'Stream', 'Parent Phone'] },
  subjectAttendance: { title: 'Subject Attendance', icon: ClipboardCheck, fields: ['Admission No', 'Subject', 'Date', 'Lesson', 'Present/Absent', 'Signed By'] },
  assignments: { title: 'Assignments and Answer Sheets', icon: BookOpen, fields: ['Assignment ID', 'Subject', 'Class', 'Question', 'Due Date', 'Student Answer', 'AI Score', 'Teacher Score', 'Submission Status'] },
  subjectGrades: { title: 'Subject Grades and Averages', icon: CheckCircle2, fields: ['Admission No', 'Subject', 'Exam Type', 'Score', 'Average', 'Grade', 'Published To'] },
  studentAssignments: { title: 'My Assignments', icon: BookOpen, fields: ['Assignment ID', 'Subject', 'Question', 'Due Date', 'Answer Sheet', 'Answer Status'] },
  studentGrades: { title: 'My Grades and Performance', icon: CheckCircle2, fields: ['Subject', 'Score', 'Class Average', 'Grade', 'Teacher Comment'] },
  studentNotifications: { title: 'My Notifications', icon: Bell, fields: ['Sender', 'Channel', 'Message', 'Read Status'] },
  parentAssignments: { title: 'Student Assignment Checks', icon: BookOpen, fields: ['Student', 'Assignment ID', 'Subject', 'Due Date', 'Done?', 'Parent Comment'] },
  parentGrades: { title: 'Children Grades and Performance', icon: CheckCircle2, fields: ['Student', 'Subject', 'Score', 'Average', 'Grade', 'Teacher Comment'] },
  parentNotifications: { title: 'Parent Notifications', icon: Bell, fields: ['Student', 'Sender', 'Channel', 'Message', 'Read Status'] },
  notifications: { title: 'Notifications', icon: Bell, fields: ['Channels', 'Recipient', 'Message Type'] },
}

const seedRecords = {
  salaries: [
    { id: 1, title: 'Mary Achieng Salary', owner: 'Finance Office', amount: 78000, status: 'Paid', dueDate: '2026-05-30', payload: { 'Staff ID': 'STF-018', 'Payroll No': 'PAY-101', Department: 'Teaching', 'Pay Period': 'May 2026', 'Basic Pay': '72000', Allowances: '6000', Deductions: '0', 'Net Pay': '58973' } },
    { id: 2, title: 'Peter Mwangi Salary', owner: 'Finance Office', amount: 52000, status: 'Processing', dueDate: '2026-05-30', payload: { 'Staff ID': 'STF-027', 'Payroll No': 'PAY-127', Department: 'Administration', 'Pay Period': 'May 2026', 'Basic Pay': '48000', Allowances: '4000', Deductions: '1500', 'Net Pay': '42164' } },
  ],
  fees: [
    { id: 1, title: 'Brian Otieno Term 2 Fees', owner: 'Parent: Grace Otieno', amount: 42000, status: 'Balance Due', dueDate: '2026-05-20', payload: { 'Admission No': 'US-2041', 'Student Class': 'Grade 8 East', 'Parent Name': 'Grace Otieno', 'Parent Phone': '+254700000001', 'Parent Email': 'grace.otieno@example.com', 'Term Bill': '60500', 'Amount Paid': '42000', Balance: '18500' } },
    { id: 2, title: 'Amina Hassan Term 2 Fees', owner: 'Parent: Yusuf Hassan', amount: 60500, status: 'Cleared', dueDate: '2026-05-20', payload: { 'Admission No': 'US-2107', 'Student Class': 'Grade 7 North', 'Parent Name': 'Yusuf Hassan', 'Parent Phone': '+254700000002', 'Parent Email': 'yusuf.hassan@example.com', 'Term Bill': '60500', 'Amount Paid': '60500', Balance: '0' } },
  ],
  inventory: [
    { id: 1, title: 'Science Lab Reagents', owner: 'Bright Supplies', amount: 16500, status: 'Pending', dueDate: '2026-05-12', payload: { Supplier: 'Bright Supplies', 'Invoice No': 'INV-903', 'Item Category': 'Laboratory', Quantity: '24 packs', 'Unit Cost': '688', 'Payment Method': 'Bank Transfer', Balance: '4500' } },
    { id: 2, title: 'Kitchen Maize Flour Stock', owner: 'Mama Millers Ltd', amount: 38000, status: 'Paid', dueDate: '2026-05-09', payload: { Supplier: 'Mama Millers Ltd', 'Invoice No': 'INV-921', 'Item Category': 'Catering', Quantity: '40 bags', 'Unit Cost': '950', 'Payment Method': 'M-Pesa Paybill', Balance: '0' } },
  ],
  users: [
    { id: 1, title: 'Grace Otieno Parent Account', owner: 'Admin', amount: 0, status: 'Active', dueDate: '', payload: { 'User Type': 'Parent', Email: 'grace.otieno@example.com', Phone: '+254700000001', 'Login Status': 'Enabled', Permissions: 'view_child, chat, fees, notifications' } },
    { id: 2, title: 'Brian Otieno Student Account', owner: 'Admin', amount: 0, status: 'Active', dueDate: '', payload: { 'User Type': 'Student', Email: 'brian.otieno@student.universal.school', Phone: '', 'Login Status': 'Enabled', Permissions: 'assignments, answer_sheet, grades, chat' } },
    { id: 3, title: 'Mr Kamau Staff Account', owner: 'Admin', amount: 0, status: 'Active', dueDate: '', payload: { 'User Type': 'Staff', Email: 'kamau@universal.school', Phone: '+254700000010', 'Login Status': 'Enabled', Permissions: 'attendance, assignments, grading, messaging' } },
  ],
  roles: [
    { id: 1, title: 'Subject Teacher Role', owner: 'Admin', amount: 0, status: 'Active', dueDate: '', payload: { Role: 'Subject Teacher', Scope: 'Academics', Create: 'Assignments, Grades', Read: 'Class Lists, Answers', Update: 'Attendance, Marks', Delete: 'Draft assignments', Permissions: 'attendance, assignments, grading, chat' } },
    { id: 2, title: 'Parent Role', owner: 'Admin', amount: 0, status: 'Active', dueDate: '', payload: { Role: 'Parent', Scope: 'Portal', Create: 'Messages', Read: 'Child grades, notices, fees', Update: 'Profile', Delete: 'None', Permissions: 'view_child, chat, notifications' } },
    { id: 3, title: 'Student Role', owner: 'Admin', amount: 0, status: 'Active', dueDate: '', payload: { Role: 'Student', Scope: 'Portal', Create: 'Answer sheets, messages', Read: 'Assignments, grades, notices', Update: 'Answer drafts', Delete: 'Own drafts', Permissions: 'assignments, grades, chat' } },
  ],
  twilio: [
    { id: 1, title: 'Primary Twilio Gateway', owner: 'IT Office', amount: 0, status: 'Enabled', dueDate: '', payload: { 'Account SID': 'Stored securely', 'From SMS': '+254...', 'From WhatsApp': 'whatsapp:+254...' } },
  ],
  mailgrid: [
    { id: 1, title: 'School Email Gateway', owner: 'IT Office', amount: 0, status: 'Enabled', dueDate: '', payload: { 'API Key Label': 'mailgrid-main', 'Sender Email': 'info@universal.school', Domain: 'universal.school' } },
  ],
  otherGateways: [
    { id: 1, title: 'M-Pesa Daraja Payment Gateway', owner: 'IT Office', amount: 0, status: 'Sandbox', dueDate: '', payload: { Provider: 'Safaricom Daraja', 'Base URL': 'https://sandbox.safaricom.co.ke', 'API Key Label': 'daraja-school-payments', Purpose: 'Fee and inventory payments', Status: 'Testing' } },
  ],
  studentAdmissions: [
    { id: 1, title: 'Amina Hassan Admission', owner: 'Reception Desk', amount: 0, status: 'Approved', dueDate: '2026-05-06', payload: { 'Admission No': 'US-2107', Class: 'Grade 7', Stream: 'North', 'Parent Name': 'Yusuf Hassan', 'Parent Phone': '+254700000002', 'Parent Email': 'yusuf.hassan@example.com', 'Previous School': 'Lake View Primary', 'Admission Stage': 'Sent to Grade 7 North' } },
    { id: 2, title: 'Kevin Wekesa Admission', owner: 'Reception Desk', amount: 0, status: 'Pending Review', dueDate: '2026-05-08', payload: { 'Admission No': 'US-2112', Class: 'Grade 6', Stream: 'West', 'Parent Name': 'Ruth Wekesa', 'Parent Phone': '+254700000003', 'Parent Email': 'ruth.wekesa@example.com', 'Previous School': 'Green Valley Academy', 'Admission Stage': 'Documents check' } },
  ],
  staffRegistrations: [
    { id: 1, title: 'Lydia Njeri Staff Registration', owner: 'Reception Desk', amount: 0, status: 'Forwarded to HR', dueDate: '2026-05-07', payload: { 'Staff ID': 'STF-044', Position: 'English Teacher', 'TSC/ID No': 'TSC-88901', Department: 'Languages', Phone: '+254700000004', Email: 'lydia.njeri@example.com', 'Registration Stage': 'HR verification' } },
  ],
  staffApplications: [
    { id: 1, title: 'Daniel Kariuki Application', owner: 'HR Office', amount: 0, status: 'Shortlisted', dueDate: '2026-05-10', payload: { 'Application No': 'APP-332', 'Position Applied': 'Physics Teacher', Qualification: 'B.Ed Science', 'Years Experience': '6', 'Interview Date': '2026-05-13', 'Application Stage': 'Panel interview' } },
  ],
  employees: [
    { id: 1, title: 'Mary Achieng', owner: 'HR Office', amount: 78000, status: 'Active', dueDate: '', payload: { 'Staff ID': 'STF-018', Position: 'Mathematics Teacher', Department: 'STEM', 'Employment Type': 'Permanent', 'KRA PIN': 'A009999991Z', 'NSSF No': 'NSSF-4432', 'SHIF No': 'SHIF-8890' } },
  ],
  payroll: [
    { id: 1, title: 'Mary Achieng May Payroll', owner: 'HR Payroll', amount: 78000, status: 'Ready for Approval', dueDate: '2026-05-30', payload: { 'Staff ID': 'STF-018', 'Payroll Month': 'May 2026', 'Employee PIN': 'A009999991Z', 'Gross Pay': '78000', PAYE: '10472', NSSF: '2160', SHIF: '2145', 'Housing Levy': '1170', 'Net Pay': '62053' } },
  ],
  classStudents: [
    { id: 1, title: 'Brian Otieno', owner: 'Grade 8 East', amount: 0, status: 'New', dueDate: '', payload: { 'Admission No': 'US-2041', Class: 'Grade 8', Stream: 'East', Guardian: 'Grace Otieno', 'Parent Phone': '+254700000001', 'Admission Status': 'Allocated to class teacher' } },
    { id: 2, title: 'Amina Hassan', owner: 'Grade 7 North', amount: 0, status: 'New', dueDate: '', payload: { 'Admission No': 'US-2107', Class: 'Grade 7', Stream: 'North', Guardian: 'Yusuf Hassan', 'Parent Phone': '+254700000002', 'Admission Status': 'Allocated to class teacher' } },
  ],
  classAttendance: [
    { id: 1, title: 'Brian Otieno Attendance', owner: 'Grade 8 East', amount: 1, status: 'Present', dueDate: '2026-05-05', payload: { 'Admission No': 'US-2041', Class: 'Grade 8 East', Date: '2026-05-05', Session: 'Morning', 'Present/Absent': 'Present', 'Signed By': 'Class Teacher' } },
  ],
  classPerformance: [
    { id: 1, title: 'Brian Otieno Overall Performance', owner: 'Grade 8 East', amount: 81, status: 'Published', dueDate: '', payload: { 'Admission No': 'US-2041', Class: 'Grade 8 East', 'Exam Type': 'Term 2 CAT', 'Total Score': '648/800', Average: '81%', Grade: 'A-', Rank: '4' } },
  ],
  subjectStudents: [
    { id: 1, title: 'Brian Otieno Mathematics', owner: 'Mr Kamau', amount: 0, status: 'Allocated', dueDate: '', payload: { 'Admission No': 'US-2041', Subject: 'Mathematics', Class: 'Grade 8', Stream: 'East', 'Parent Phone': '+254700000001' } },
  ],
  subjectAttendance: [
    { id: 1, title: 'Brian Otieno Mathematics Attendance', owner: 'Mr Kamau', amount: 1, status: 'Present', dueDate: '2026-05-05', payload: { 'Admission No': 'US-2041', Subject: 'Mathematics', Date: '2026-05-05', Lesson: 'Algebra', 'Present/Absent': 'Present', 'Signed By': 'Mr Kamau' } },
  ],
  assignments: [
    { id: 1, title: 'Mathematics Algebra Assignment', owner: 'Mr Kamau', amount: 100, status: 'Open', dueDate: '2026-05-15', payload: { 'Assignment ID': 'ASN-501', Subject: 'Mathematics', Class: 'Grade 8 East', Question: 'Solve simultaneous equations and explain each step.', 'Due Date': '2026-05-15', 'Student Answer': 'Submitted by Brian Otieno', 'AI Score': '78', 'Teacher Score': '81', 'Submission Status': 'Marked draft' } },
  ],
  subjectGrades: [
    { id: 1, title: 'Chemistry CAT 1', owner: 'Grade 9 North', amount: 76, status: 'Published', dueDate: '', payload: { Subject: 'Chemistry', 'Exam Type': 'CAT', Average: '72%' } },
  ],
  studentGrades: [
    { id: 1, title: 'Mathematics Term Average', owner: 'Brian Otieno', amount: 81, status: 'A-', dueDate: '', payload: { Subject: 'Mathematics', Score: '81%', Average: '78%' } },
  ],
  studentAssignments: [
    { id: 1, title: 'Mathematics Algebra Assignment', owner: 'Brian Otieno', amount: 0, status: 'In Progress', dueDate: '2026-05-15', payload: { 'Assignment ID': 'ASN-501', Subject: 'Mathematics', Question: 'Solve simultaneous equations and explain each step.', 'Due Date': '2026-05-15', 'Answer Sheet': 'Draft saved', 'Answer Status': 'In Progress' } },
  ],
  studentNotifications: [
    { id: 1, title: 'Class Teacher Notice', owner: 'Brian Otieno', amount: 0, status: 'Unread', dueDate: '', payload: { Sender: 'Class Teacher', Channel: 'Portal + SMS', Message: 'Remember to complete Mathematics assignment by 15 May.', 'Read Status': 'Unread' } },
  ],
  parentAssignments: [
    { id: 1, title: 'Brian Mathematics Assignment Check', owner: 'Grace Otieno', amount: 0, status: 'Needs Parent Check', dueDate: '2026-05-15', payload: { Student: 'Brian Otieno', 'Assignment ID': 'ASN-501', Subject: 'Mathematics', 'Due Date': '2026-05-15', 'Done?': 'In progress', 'Parent Comment': 'Will review tonight' } },
  ],
  parentGrades: [
    { id: 1, title: 'Brian Otieno Mathematics', owner: 'Grace Otieno', amount: 81, status: 'Improving', dueDate: '', payload: { Student: 'Brian Otieno', Subject: 'Mathematics', Score: '81%', Average: '78%', Grade: 'A-', 'Teacher Comment': 'Strong algebra progress' } },
  ],
  parentNotifications: [
    { id: 1, title: 'Fee Balance Notice', owner: 'Grace Otieno', amount: 18500, status: 'Unread', dueDate: '', payload: { Student: 'Brian Otieno', Sender: 'Finance Office', Channel: 'SMS + WhatsApp + Email', Message: 'Term 2 fee balance is KES 18,500.', 'Read Status': 'Unread' } },
  ],
}

const dashboardModules = {
  finance: ['salaries', 'fees', 'inventory'],
  admin: ['users', 'roles', 'twilio', 'mailgrid', 'otherGateways'],
  reception: ['studentAdmissions', 'staffRegistrations'],
  hr: ['staffApplications', 'employees', 'payroll'],
  classTeacher: ['classStudents', 'classAttendance', 'classPerformance'],
  subjectTeacher: ['subjectStudents', 'subjectAttendance', 'assignments', 'subjectGrades'],
  student: ['studentAssignments', 'studentNotifications', 'studentGrades'],
  parent: ['parentAssignments', 'parentNotifications', 'parentGrades'],
}

function emptyRecord(module) {
  return {
    title: '',
    owner: '',
    amount: 0,
    status: 'Active',
    dueDate: '',
    payload: Object.fromEntries((moduleMeta[module]?.fields || []).map((field) => [field, ''])),
  }
}

function App() {
  const [activeDashboard, setActiveDashboard] = useState('finance')
  const [records, setRecords] = useState(seedRecords)
  const [activeModule, setActiveModule] = useState('fees')
  const [toast, setToast] = useState('Ready')
  const [session, setSession] = useState(null)

  useEffect(() => {
    if (session?.role) {
      setActiveDashboard(session.role)
      setActiveModule(dashboardModules[session.role][0])
    }
  }, [session])

  if (!session) {
    return <AuthShell setSession={setSession} setToast={setToast} />
  }

  const modules = dashboardModules[activeDashboard]
  const currentModule = modules.includes(activeModule) ? activeModule : modules[0]

  function upsertLocal(module, record) {
    setRecords((current) => {
      const existing = current[module] || []
      const nextRecord = { ...record, id: record.id || Date.now() }
      const exists = existing.some((item) => item.id === nextRecord.id)
      return { ...current, [module]: exists ? existing.map((item) => (item.id === nextRecord.id ? nextRecord : item)) : [nextRecord, ...existing] }
    })
  }

  function removeLocal(module, id) {
    setRecords((current) => ({ ...current, [module]: (current[module] || []).filter((item) => item.id !== id) }))
  }

  async function saveRecord(module, record) {
    upsertLocal(module, record)
    setToast(`${moduleMeta[module].title} saved locally`)
    try {
      const saved = record.id ? await recordsApi.update(module, record.id, record) : await recordsApi.create(module, record)
      upsertLocal(module, saved)
      setToast(`${moduleMeta[module].title} synced with API`)
    } catch {
      setToast('Saved in the browser. Start Flask/PostgreSQL to sync with the API.')
    }
  }

  async function deleteRecord(module, id) {
    removeLocal(module, id)
    try {
      await recordsApi.remove(module, id)
      setToast('Record deleted from API')
    } catch {
      setToast('Record deleted locally. API was not reachable.')
    }
  }

  return (
    <main className="min-h-screen">
      <Header toast={toast} session={session} setSession={setSession} />
      <section className="mx-auto flex w-full max-w-7xl gap-5 px-4 py-5 lg:px-6">
        <aside className="hidden w-64 shrink-0 lg:block">
          <Navigation session={session} activeDashboard={activeDashboard} setActiveDashboard={setActiveDashboard} setActiveModule={setActiveModule} />
        </aside>
        <div className="min-w-0 flex-1">
          <div className="mb-4 flex gap-2 overflow-x-auto pb-2 lg:hidden">
            {dashboards.filter((item) => item.id === session.role).map((item) => (
              <button key={item.id} onClick={() => { setActiveDashboard(item.id); setActiveModule(dashboardModules[item.id][0]) }} className={`shrink-0 rounded-md px-3 py-2 text-sm font-semibold ${activeDashboard === item.id ? 'bg-brand-green text-white' : 'bg-white text-slate-700'}`}>
                {item.label}
              </button>
            ))}
          </div>
          <DashboardIntro id={activeDashboard} />
          <KpiStrip dashboard={activeDashboard} records={records} />
          <ModuleTabs modules={modules} activeModule={currentModule} setActiveModule={setActiveModule} />
          <DashboardWorkspace
            dashboard={activeDashboard}
            module={currentModule}
            records={records[currentModule] || []}
            allRecords={records}
            onSave={saveRecord}
            onDelete={deleteRecord}
            setToast={setToast}
          />
        </div>
      </section>
    </main>
  )
}

function AuthShell({ setSession, setToast }) {
  const [mode, setMode] = useState('login')
  const [form, setForm] = useState({
    name: '',
    email: '',
    password: '',
    role: 'finance',
    admissionNo: '',
    staffId: '',
    parentPhone: '',
  })

  function submit(event) {
    event.preventDefault()
    const role = form.role
    const dashboard = dashboards.find((item) => item.id === role)
    setSession({
      name: form.name || demoNames[role],
      email: form.email || demoEmails[role],
      role,
      roleLabel: dashboard.label,
      admissionNo: form.admissionNo,
      staffId: form.staffId,
      parentPhone: form.parentPhone,
    })
    setToast(`${dashboard.label} signed in`)
  }

  return (
    <main className="min-h-screen bg-slate-50">
      <section className="mx-auto grid min-h-screen w-full max-w-7xl items-center gap-8 px-4 py-8 lg:grid-cols-[1fr_460px] lg:px-6">
        <div className="max-w-2xl">
          <div className="mb-6 flex items-center gap-3">
            <img src="/Universal-School-logo.jpg" alt="Universal School logo" className="h-16 w-16 rounded-md object-cover shadow-soft" />
            <div>
              <p className="text-sm font-semibold uppercase tracking-wide text-brand-green">Universal School</p>
              <h1 className="text-3xl font-black text-brand-ink sm:text-4xl">Role Based Portal</h1>
            </div>
          </div>
          <p className="text-lg leading-8 text-slate-700">
            Sign in or register as Finance, School Admin, Receptionist, HR Manager, Class Teacher, Subject Teacher, Student, or Parent. Each role opens only its matching dashboard and workflow.
          </p>
          <div className="mt-6 grid gap-3 sm:grid-cols-2">
            {dashboards.map((item) => {
              const Icon = item.icon
              return (
                <button key={item.id} type="button" onClick={() => setForm({ ...form, role: item.id })} className={`flex items-center gap-3 rounded-md border p-3 text-left shadow-soft ${form.role === item.id ? 'border-brand-green bg-white ring-2 ring-brand-green/20' : 'border-slate-200 bg-white'}`}>
                  <Icon className="h-5 w-5 text-brand-green" />
                  <span className="font-bold text-brand-ink">{item.label}</span>
                </button>
              )
            })}
          </div>
        </div>

        <form onSubmit={submit} className="rounded-md border border-slate-200 bg-white p-5 shadow-soft">
          <div className="mb-4 grid grid-cols-2 rounded-md bg-slate-100 p-1">
            <button type="button" onClick={() => setMode('login')} className={`rounded-md px-3 py-2 text-sm font-bold ${mode === 'login' ? 'bg-white text-brand-green shadow-sm' : 'text-slate-600'}`}>Login</button>
            <button type="button" onClick={() => setMode('register')} className={`rounded-md px-3 py-2 text-sm font-bold ${mode === 'register' ? 'bg-white text-brand-green shadow-sm' : 'text-slate-600'}`}>Register</button>
          </div>

          <h2 className="mb-1 text-2xl font-black text-brand-ink">{mode === 'login' ? 'Login to Dashboard' : 'Register New Account'}</h2>
          <p className="mb-4 text-sm text-slate-600">Selected role: <strong>{dashboards.find((item) => item.id === form.role)?.label}</strong></p>

          <div className="space-y-3">
            {mode === 'register' && <Field label="Full Name" value={form.name} onChange={(value) => setForm({ ...form, name: value })} required />}
            <Field label="Email or Username" type="email" value={form.email} onChange={(value) => setForm({ ...form, email: value })} required />
            <Field label="Password" type="password" value={form.password} onChange={(value) => setForm({ ...form, password: value })} required />
            <label className="block">
              <span className="mb-1 block text-xs font-bold uppercase tracking-wide text-slate-500">Dashboard Role</span>
              <select value={form.role} onChange={(event) => setForm({ ...form, role: event.target.value })} className="w-full rounded-md border border-slate-200 bg-white px-3 py-2 text-sm outline-none focus:border-brand-sky focus:ring-2 focus:ring-brand-sky/20">
                {dashboards.map((item) => <option key={item.id} value={item.id}>{item.label}</option>)}
              </select>
            </label>
            {['student', 'parent'].includes(form.role) && <Field label="Student Admission No" value={form.admissionNo} onChange={(value) => setForm({ ...form, admissionNo: value })} />}
            {form.role === 'parent' && <Field label="Parent Phone" value={form.parentPhone} onChange={(value) => setForm({ ...form, parentPhone: value })} />}
            {['hr', 'classTeacher', 'subjectTeacher', 'reception', 'finance', 'admin'].includes(form.role) && <Field label="Staff ID" value={form.staffId} onChange={(value) => setForm({ ...form, staffId: value })} />}
          </div>

          <button className="mt-5 inline-flex w-full items-center justify-center gap-2 rounded-md bg-brand-green px-4 py-3 text-sm font-black text-white">
            {mode === 'login' ? <ShieldCheck className="h-4 w-4" /> : <UserPlus className="h-4 w-4" />}
            {mode === 'login' ? 'Login' : 'Register and Login'}
          </button>
          <p className="mt-3 text-xs leading-5 text-slate-500">Demo mode accepts any email and password. The selected role controls which dashboard opens.</p>
        </form>
      </section>
    </main>
  )
}

function Header({ toast, session, setSession }) {
  return (
    <header className="border-b border-slate-200 bg-white">
      <div className="mx-auto flex max-w-7xl flex-col gap-4 px-4 py-4 sm:flex-row sm:items-center sm:justify-between lg:px-6">
        <div className="flex items-center gap-3">
          <img src="/Universal-School-logo.jpg" alt="Universal School logo" className="h-14 w-14 rounded-md object-cover" />
          <div>
            <p className="text-sm font-semibold uppercase tracking-wide text-brand-green">Universal School</p>
            <h1 className="text-xl font-bold text-brand-ink sm:text-2xl">Management System</h1>
          </div>
        </div>
        <div className="flex flex-col gap-2 sm:items-end">
          <div className="flex items-center gap-2 rounded-md border border-slate-200 bg-slate-50 px-3 py-2 text-sm text-slate-700">
            <CheckCircle2 className="h-4 w-4 text-brand-green" />
            <span>{toast}</span>
          </div>
          <div className="flex items-center gap-2 text-sm text-slate-600">
            <span className="font-semibold text-brand-ink">{session.name}</span>
            <span>{session.roleLabel}</span>
            <button type="button" onClick={() => setSession(null)} className="rounded-md border border-slate-200 px-2 py-1 text-xs font-bold text-brand-coral">Logout</button>
          </div>
        </div>
      </div>
    </header>
  )
}

function Navigation({ session, activeDashboard, setActiveDashboard, setActiveModule }) {
  const allowedDashboards = dashboards.filter((item) => item.id === session.role)
  return (
    <nav className="sticky top-5 space-y-2 rounded-md border border-slate-200 bg-white p-3 shadow-soft">
      <p className="px-3 pb-2 text-xs font-bold uppercase tracking-wide text-slate-500">Role Dashboard</p>
      {allowedDashboards.map((item) => {
        const Icon = item.icon
        return (
          <button key={item.id} onClick={() => { setActiveDashboard(item.id); setActiveModule(dashboardModules[item.id][0]) }} className={`flex w-full items-center gap-3 rounded-md px-3 py-2 text-left text-sm font-semibold ${activeDashboard === item.id ? 'bg-brand-green text-white' : 'text-slate-700 hover:bg-slate-100'}`}>
            <Icon className="h-4 w-4" />
            {item.label}
          </button>
        )
      })}
      <div className="rounded-md bg-slate-50 p-3 text-xs leading-5 text-slate-600">
        Signed in as <strong>{session.roleLabel}</strong>. Other dashboards are hidden by role permissions.
      </div>
    </nav>
  )
}

function DashboardIntro({ id }) {
  const copy = {
    finance: 'Manage salaries, school fee payments, stock payments, and balance notifications.',
    admin: 'Control users, roles, permissions, Twilio, MailGrid, and other system gateways.',
    reception: 'Register new learners and staff from the front office.',
    hr: 'Process applications, employee records, and Kenya payroll estimates.',
    classTeacher: 'Track class lists, attendance, parent notifications, and class performance.',
    subjectTeacher: 'Run subject attendance, assignments, AI marking, chats, and subject grading.',
    student: 'View and answer assignments, read notices, chat, and monitor grades.',
    parent: 'Check assignment completion, notices, chat, and children performance.',
  }
  return (
    <section className="mb-4 border-b border-slate-200 pb-4">
      <p className="text-sm font-semibold uppercase tracking-wide text-brand-coral">{dashboards.find((item) => item.id === id)?.label} Dashboard</p>
      <h2 className="mt-1 text-2xl font-bold text-brand-ink">{copy[id]}</h2>
    </section>
  )
}

function KpiStrip({ dashboard, records }) {
  const kpis = {
    finance: [
      ['Fee balances', money(sumPayload(records.fees, 'Balance'))],
      ['Salary payroll', money(sumAmounts(records.salaries))],
      ['Stock payments', money(sumAmounts(records.inventory))],
    ],
    admin: [
      ['Active users', countStatus(records.users, 'Active')],
      ['Permission roles', records.roles?.length || 0],
      ['Gateways', (records.twilio?.length || 0) + (records.mailgrid?.length || 0) + (records.otherGateways?.length || 0)],
    ],
    reception: [
      ['Student admissions', records.studentAdmissions?.length || 0],
      ['Staff registrations', records.staffRegistrations?.length || 0],
      ['Pending reviews', countIncludes(records.studentAdmissions, 'Pending') + countIncludes(records.staffRegistrations, 'Pending')],
    ],
    hr: [
      ['Applications', records.staffApplications?.length || 0],
      ['Employees', records.employees?.length || 0],
      ['Payroll gross', money(sumAmounts(records.payroll))],
    ],
    classTeacher: [
      ['Class students', records.classStudents?.length || 0],
      ['Attendance signed', records.classAttendance?.length || 0],
      ['Class average', averageAmount(records.classPerformance)],
    ],
    subjectTeacher: [
      ['Subject students', records.subjectStudents?.length || 0],
      ['Assignments', records.assignments?.length || 0],
      ['Subject average', averageAmount(records.subjectGrades)],
    ],
    student: [
      ['Open assignments', records.studentAssignments?.length || 0],
      ['Unread notices', countIncludes(records.studentNotifications, 'Unread')],
      ['My average', averageAmount(records.studentGrades)],
    ],
    parent: [
      ['Assignments to check', records.parentAssignments?.length || 0],
      ['Parent notices', records.parentNotifications?.length || 0],
      ['Child average', averageAmount(records.parentGrades)],
    ],
  }
  return (
    <section className="mb-4 grid gap-3 sm:grid-cols-3">
      {kpis[dashboard].map(([label, value]) => (
        <div key={label} className="rounded-md border border-slate-200 bg-white p-4 shadow-soft">
          <p className="text-xs font-bold uppercase tracking-wide text-slate-500">{label}</p>
          <p className="mt-1 text-2xl font-black text-brand-ink">{value}</p>
        </div>
      ))}
    </section>
  )
}

function ModuleTabs({ modules, activeModule, setActiveModule }) {
  return (
    <div className="mb-4 flex gap-2 overflow-x-auto pb-2">
      {modules.map((module) => {
        const Icon = moduleMeta[module].icon
        return (
          <button key={module} onClick={() => setActiveModule(module)} className={`flex shrink-0 items-center gap-2 rounded-md border px-3 py-2 text-sm font-semibold ${activeModule === module ? 'border-brand-green bg-brand-green text-white' : 'border-slate-200 bg-white text-slate-700 hover:border-brand-sky'}`}>
            <Icon className="h-4 w-4" />
            {moduleMeta[module].title}
          </button>
        )
      })}
    </div>
  )
}

function DashboardWorkspace({ dashboard, module, records, allRecords, onSave, onDelete, setToast }) {
  return (
    <div className="grid gap-4 xl:grid-cols-[minmax(0,1fr)_340px]">
      <CrudPanel module={module} records={records} onSave={onSave} onDelete={onDelete} />
      <div className="space-y-4">
        {dashboard === 'finance' && <FeeBalancePanel fees={allRecords.fees || []} setToast={setToast} />}
        {['finance', 'classTeacher'].includes(dashboard) && <NotificationPanel setToast={setToast} />}
        {dashboard === 'hr' && <PayrollPanel setToast={setToast} />}
        {dashboard === 'classTeacher' && <TeacherPublishPanel kind="class" setToast={setToast} />}
        {dashboard === 'subjectTeacher' && <AiMarkerPanel setToast={setToast} />}
        {dashboard === 'subjectTeacher' && <TeacherPublishPanel kind="subject" setToast={setToast} />}
        {dashboard === 'student' && <StudentAnswerPanel setToast={setToast} />}
        {dashboard === 'parent' && <ParentCheckPanel setToast={setToast} />}
        {['subjectTeacher', 'student', 'parent'].includes(dashboard) && <ChatPanel setToast={setToast} />}
        <WorkflowPanel dashboard={dashboard} />
      </div>
    </div>
  )
}

function CrudPanel({ module, records, onSave, onDelete }) {
  const [draft, setDraft] = useState(emptyRecord(module))
  const fields = moduleMeta[module].fields

  useEffect(() => {
    setDraft(emptyRecord(module))
  }, [module])

  function updatePayload(field, value) {
    setDraft((current) => ({ ...current, payload: { ...current.payload, [field]: value } }))
  }

  return (
    <section className="rounded-md border border-slate-200 bg-white shadow-soft">
      <div className="flex flex-col gap-3 border-b border-slate-200 p-4 md:flex-row md:items-center md:justify-between">
        <div>
          <h3 className="text-lg font-bold text-brand-ink">{moduleMeta[module].title}</h3>
          <p className="text-sm text-slate-600">Create, view, update, and delete records.</p>
        </div>
        <button onClick={() => setDraft(emptyRecord(module))} className="inline-flex items-center gap-2 rounded-md bg-brand-gold px-3 py-2 text-sm font-bold text-brand-ink">
          <Plus className="h-4 w-4" />
          New
        </button>
      </div>
      <form className="grid gap-3 border-b border-slate-200 p-4 md:grid-cols-2" onSubmit={(event) => { event.preventDefault(); onSave(module, draft); setDraft(emptyRecord(module)) }}>
        <Field label="Title" value={draft.title} onChange={(value) => setDraft({ ...draft, title: value })} required />
        <Field label="Owner" value={draft.owner} onChange={(value) => setDraft({ ...draft, owner: value })} />
        <Field label="Amount or Score" type="number" value={draft.amount} onChange={(value) => setDraft({ ...draft, amount: Number(value) })} />
        <Field label="Status" value={draft.status} onChange={(value) => setDraft({ ...draft, status: value })} />
        <Field label="Due Date" type="date" value={draft.dueDate} onChange={(value) => setDraft({ ...draft, dueDate: value })} />
        {fields.map((field) => (
          <Field key={field} label={field} value={draft.payload?.[field] || ''} onChange={(value) => updatePayload(field, value)} />
        ))}
        <div className="md:col-span-2">
          <button className="inline-flex items-center gap-2 rounded-md bg-brand-green px-4 py-2 text-sm font-bold text-white">
            <Save className="h-4 w-4" />
            Save Record
          </button>
        </div>
      </form>
      <div className="overflow-x-auto scrollbar-thin">
        <table className="w-full min-w-[760px] text-left text-sm">
          <thead className="bg-slate-50 text-xs uppercase tracking-wide text-slate-500">
            <tr>
              <th className="px-4 py-3">Title</th>
              <th className="px-4 py-3">Owner</th>
              <th className="px-4 py-3">Amount</th>
              <th className="px-4 py-3">Status</th>
              <th className="px-4 py-3">Details</th>
              <th className="px-4 py-3">Actions</th>
            </tr>
          </thead>
          <tbody>
            {records.map((record) => (
              <tr key={record.id} className="border-t border-slate-100">
                <td className="px-4 py-3 font-semibold text-brand-ink">{record.title}</td>
                <td className="px-4 py-3 text-slate-600">{record.owner}</td>
                <td className="px-4 py-3 text-slate-700">{Number(record.amount || 0).toLocaleString()}</td>
                <td className="px-4 py-3"><span className="rounded-md bg-slate-100 px-2 py-1 text-xs font-bold text-slate-700">{record.status}</span></td>
                <td className="px-4 py-3 text-slate-600">{Object.entries(record.payload || {}).slice(0, 2).map(([key, value]) => `${key}: ${value}`).join(' | ')}</td>
                <td className="px-4 py-3">
                  <div className="flex gap-2">
                    <button type="button" onClick={() => setDraft(record)} className="rounded-md border border-slate-200 p-2 text-brand-sky" aria-label="Edit record"><Pencil className="h-4 w-4" /></button>
                    <button type="button" onClick={() => onDelete(module, record.id)} className="rounded-md border border-slate-200 p-2 text-brand-coral" aria-label="Delete record"><Trash2 className="h-4 w-4" /></button>
                  </div>
                </td>
              </tr>
            ))}
            {!records.length && (
              <tr><td colSpan="6" className="px-4 py-8 text-center text-slate-500">No records yet.</td></tr>
            )}
          </tbody>
        </table>
      </div>
    </section>
  )
}

function Field({ label, value, onChange, type = 'text', required = false }) {
  return (
    <label className="block">
      <span className="mb-1 block text-xs font-bold uppercase tracking-wide text-slate-500">{label}</span>
      <input required={required} type={type} value={value} onChange={(event) => onChange(event.target.value)} className="w-full rounded-md border border-slate-200 bg-white px-3 py-2 text-sm outline-none focus:border-brand-sky focus:ring-2 focus:ring-brand-sky/20" />
    </label>
  )
}

function FeeBalancePanel({ fees, setToast }) {
  const balances = fees.filter((fee) => Number(fee.payload?.Balance || 0) > 0)
  const firstBalance = balances[0]
  const message = firstBalance
    ? `${firstBalance.title}: fee balance is KES ${Number(firstBalance.payload.Balance).toLocaleString()} for ${firstBalance.payload['Student Class']}.`
    : 'All listed student fee accounts are cleared.'

  async function sendBalanceNotice() {
    if (!firstBalance) {
      setToast('No fee balance found for notification')
      return
    }
    try {
      await notifyApi({
        recipients: `${firstBalance.payload['Parent Phone']}, ${firstBalance.payload['Parent Email']}`,
        channels: ['SMS', 'WhatsApp', 'Email'],
        message,
        sender: 'Finance Office',
      })
      setToast('Fee balance notice queued for parent and student')
    } catch {
      setToast('Fee balance notice prepared locally')
    }
  }

  return (
    <SidePanel title="Fee Balance Notices" icon={WalletCards}>
      <p className="rounded-md bg-slate-50 p-3 text-sm text-slate-700">{message}</p>
      <ActionButton onClick={sendBalanceNotice} icon={Send}>Send Balance Notice</ActionButton>
    </SidePanel>
  )
}

function TeacherPublishPanel({ kind, setToast }) {
  const [form, setForm] = useState({
    student: 'Brian Otieno',
    subject: kind === 'class' ? 'Overall Subjects' : 'Mathematics',
    score: '81',
    average: '78',
    channels: 'Parent, Student, School Admin',
  })

  async function publish() {
    const message = `${form.student} ${form.subject} performance: score ${form.score}%, average ${form.average}%.`
    try {
      await notifyApi({ recipients: form.channels, channels: ['Portal', 'Email'], message, sender: kind === 'class' ? 'Class Teacher' : 'Subject Teacher' })
      setToast(`${kind === 'class' ? 'Class' : 'Subject'} performance published`)
    } catch {
      setToast(`${kind === 'class' ? 'Class' : 'Subject'} performance prepared locally`)
    }
  }

  return (
    <SidePanel title={kind === 'class' ? 'Publish Class Performance' : 'Publish Subject Grades'} icon={CheckCircle2}>
      <Field label="Student" value={form.student} onChange={(value) => setForm({ ...form, student: value })} />
      <Field label="Subject or Overall" value={form.subject} onChange={(value) => setForm({ ...form, subject: value })} />
      <div className="grid grid-cols-2 gap-2">
        <Field label="Score %" type="number" value={form.score} onChange={(value) => setForm({ ...form, score: value })} />
        <Field label="Average %" type="number" value={form.average} onChange={(value) => setForm({ ...form, average: value })} />
      </div>
      <Field label="Publish To" value={form.channels} onChange={(value) => setForm({ ...form, channels: value })} />
      <ActionButton onClick={publish} icon={Send}>Publish Results</ActionButton>
    </SidePanel>
  )
}

function StudentAnswerPanel({ setToast }) {
  const [answer, setAnswer] = useState('I solved the simultaneous equations by eliminating y, then substituting x into the first equation.')
  function submit() {
    setToast('Answer sheet submitted to subject teacher')
  }
  return (
    <SidePanel title="Answer Assignment" icon={BookOpen}>
      <textarea value={answer} onChange={(event) => setAnswer(event.target.value)} rows="5" className="w-full rounded-md border border-slate-200 px-3 py-2 text-sm outline-none focus:border-brand-sky" />
      <ActionButton onClick={submit} icon={Save}>Submit Answer Sheet</ActionButton>
    </SidePanel>
  )
}

function ParentCheckPanel({ setToast }) {
  const [checked, setChecked] = useState(false)
  function confirm() {
    setToast(checked ? 'Parent assignment check confirmed' : 'Mark the assignment as checked first')
  }
  return (
    <SidePanel title="Assignment Completion Check" icon={ClipboardCheck}>
      <label className="flex items-center gap-2 rounded-md border border-slate-200 p-3 text-sm font-semibold text-slate-700">
        <input type="checkbox" checked={checked} onChange={(event) => setChecked(event.target.checked)} className="h-4 w-4 accent-brand-green" />
        Student has completed the assignment
      </label>
      <ActionButton onClick={confirm} icon={CheckCircle2}>Confirm Parent Check</ActionButton>
    </SidePanel>
  )
}

function NotificationPanel({ setToast }) {
  const [form, setForm] = useState({ recipients: '', channels: ['SMS'], message: '' })
  async function sendNotification() {
    setToast('Notification queued locally')
    try {
      await notifyApi({ ...form, sender: 'Universal School' })
      setToast('Notification queued through API')
    } catch {
      setToast('Start Flask to send notification queue records')
    }
  }
  return (
    <SidePanel title="Fee and School Notifications" icon={Bell}>
      <Field label="Recipients" value={form.recipients} onChange={(value) => setForm({ ...form, recipients: value })} />
      <label className="block">
        <span className="mb-1 block text-xs font-bold uppercase tracking-wide text-slate-500">Message</span>
        <textarea value={form.message} onChange={(event) => setForm({ ...form, message: event.target.value })} rows="4" className="w-full rounded-md border border-slate-200 px-3 py-2 text-sm outline-none focus:border-brand-sky" />
      </label>
      <div className="flex flex-wrap gap-2">
        {['SMS', 'WhatsApp', 'Email'].map((channel) => (
          <button key={channel} type="button" onClick={() => setForm((current) => ({ ...current, channels: current.channels.includes(channel) ? current.channels.filter((item) => item !== channel) : [...current.channels, channel] }))} className={`rounded-md border px-3 py-2 text-sm font-semibold ${form.channels.includes(channel) ? 'border-brand-green bg-brand-green text-white' : 'border-slate-200 text-slate-700'}`}>
            {channel}
          </button>
        ))}
      </div>
      <ActionButton onClick={sendNotification} icon={Send}>Send Notice</ActionButton>
    </SidePanel>
  )
}

function PayrollPanel({ setToast }) {
  const [gross, setGross] = useState(75000)
  const [result, setResult] = useState(null)
  async function calculate() {
    const local = localPayroll(gross)
    setResult(local)
    try {
      setResult(await payrollApi(gross))
      setToast('Payroll calculated through Flask API')
    } catch {
      setToast('Payroll calculated locally')
    }
  }
  return (
    <SidePanel title="Kenya Payroll PAYE" icon={Calculator}>
      <Field label="Gross Pay KES" type="number" value={gross} onChange={setGross} />
      <ActionButton onClick={calculate} icon={Calculator}>Calculate Net Pay</ActionButton>
      {result && <dl className="grid grid-cols-2 gap-2 text-sm">{Object.entries(result).map(([key, value]) => <div key={key} className="rounded-md bg-slate-50 p-2"><dt className="text-xs uppercase text-slate-500">{key}</dt><dd className="font-bold">{Number(value).toLocaleString()}</dd></div>)}</dl>}
    </SidePanel>
  )
}

function AiMarkerPanel({ setToast }) {
  const [answer, setAnswer] = useState('')
  const [result, setResult] = useState(null)
  async function mark() {
    try {
      setResult(await aiMarkerApi({ answer, rubric: 'Accuracy, completeness, working, presentation' }))
      setToast('Answer sheet marked by AI marker endpoint')
    } catch {
      setResult({ score: Math.min(100, 55 + answer.split(' ').length), grade: 'B', feedback: 'Local draft feedback: add clearer working and final units.' })
      setToast('AI marker using local fallback')
    }
  }
  return (
    <SidePanel title="AI Assignment Marker" icon={Pencil}>
      <textarea value={answer} onChange={(event) => setAnswer(event.target.value)} rows="5" placeholder="Paste student answer sheet..." className="w-full rounded-md border border-slate-200 px-3 py-2 text-sm outline-none focus:border-brand-sky" />
      <ActionButton onClick={mark} icon={Pencil}>Mark Answer</ActionButton>
      {result && <p className="rounded-md bg-slate-50 p-3 text-sm"><strong>{result.grade} - {result.score}%.</strong> {result.feedback}</p>}
    </SidePanel>
  )
}

function ChatPanel({ setToast }) {
  const [message, setMessage] = useState('')
  const [reply, setReply] = useState('Ask the school assistant a question.')
  async function send() {
    try {
      const data = await chatApi(message)
      setReply(data.reply)
      setToast('Chatbot replied through API')
    } catch {
      setReply(`School assistant draft reply: ${message || 'Please type a message first.'}`)
      setToast('Chatbot using local fallback')
    }
  }
  return (
    <SidePanel title="School Chatbot" icon={MessageSquareText}>
      <Field label="Message" value={message} onChange={setMessage} />
      <ActionButton onClick={send} icon={MessageSquareText}>Send Chat</ActionButton>
      <p className="rounded-md bg-slate-50 p-3 text-sm text-slate-700">{reply}</p>
    </SidePanel>
  )
}

function WorkflowPanel({ dashboard }) {
  const workflows = {
    finance: ['Record fee payment', 'Update balances', 'Send SMS, WhatsApp, or Email fee notice'],
    admin: ['Create users', 'Assign roles', 'Store gateway provider settings'],
    reception: ['Capture admission details', 'Attach parent or staff contacts', 'Send record to admin approval'],
    hr: ['Shortlist application', 'Create employee record', 'Calculate PAYE payroll'],
    classTeacher: ['Confirm class roster', 'Sign daily attendance', 'Publish class averages'],
    subjectTeacher: ['Post assignment', 'Review answer sheets', 'AI mark and publish grades'],
    student: ['Open assignment', 'Submit answer sheet', 'Review grades and notices'],
    parent: ['Check child assignment status', 'Read notices', 'Track grades and fee balances'],
  }
  return (
    <SidePanel title="Workflow" icon={LayoutDashboard}>
      {workflows[dashboard].map((item) => <div key={item} className="flex items-start gap-2 text-sm text-slate-700"><CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-brand-green" />{item}</div>)}
    </SidePanel>
  )
}

function SidePanel({ title, icon: Icon, children }) {
  return (
    <aside className="space-y-3 rounded-md border border-slate-200 bg-white p-4 shadow-soft">
      <h3 className="flex items-center gap-2 text-base font-bold text-brand-ink"><Icon className="h-4 w-4 text-brand-green" />{title}</h3>
      {children}
    </aside>
  )
}

function ActionButton({ onClick, icon: Icon, children }) {
  return (
    <button type="button" onClick={onClick} className="inline-flex w-full items-center justify-center gap-2 rounded-md bg-brand-sky px-3 py-2 text-sm font-bold text-white">
      <Icon className="h-4 w-4" />
      {children}
    </button>
  )
}

function localPayroll(value) {
  const gross = Number(value || 0)
  const nssf = Math.min(gross * 0.06, 2160)
  const shif = gross * 0.0275
  const housingLevy = gross * 0.015
  const taxablePay = Math.max(0, gross - nssf)
  const bands = [[24000, 0.1], [8333, 0.25], [467667, 0.3], [300000, 0.325]]
  let remaining = taxablePay
  let paye = 0
  bands.forEach(([width, rate]) => {
    const charge = Math.min(remaining, width)
    if (charge > 0) paye += charge * rate
    remaining -= charge
  })
  if (remaining > 0) paye += remaining * 0.35
  paye = Math.max(0, paye - 2400)
  return { grossPay: gross, taxablePay, paye, nssf, shif, housingLevy, netPay: gross - paye - nssf - shif - housingLevy }
}

function sumAmounts(records = []) {
  return records.reduce((total, record) => total + Number(record.amount || 0), 0)
}

function sumPayload(records = [], field) {
  return records.reduce((total, record) => total + Number(record.payload?.[field] || 0), 0)
}

function averageAmount(records = []) {
  if (!records.length) return '0%'
  const total = records.reduce((sum, record) => sum + Number(record.amount || 0), 0)
  return `${Math.round(total / records.length)}%`
}

function countStatus(records = [], status) {
  return records.filter((record) => record.status === status).length
}

function countIncludes(records = [], text) {
  return records.filter((record) => String(record.status || '').includes(text)).length
}

function money(value) {
  return `KES ${Number(value || 0).toLocaleString()}`
}

export default App
