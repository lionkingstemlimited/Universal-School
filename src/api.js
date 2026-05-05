const API_URL = import.meta.env.VITE_API_URL || '/api'

export async function apiRequest(path, options = {}) {
  const response = await fetch(`${API_URL}${path}`, {
    headers: { 'Content-Type': 'application/json', ...(options.headers || {}) },
    ...options,
  })
  if (!response.ok) throw new Error(`API ${response.status}`)
  return response.json()
}

export const recordsApi = {
  list: (module) => apiRequest(`/records/${module}`),
  create: (module, data) => apiRequest(`/records/${module}`, { method: 'POST', body: JSON.stringify(data) }),
  update: (module, id, data) => apiRequest(`/records/${module}/${id}`, { method: 'PUT', body: JSON.stringify(data) }),
  remove: (module, id) => apiRequest(`/records/${module}/${id}`, { method: 'DELETE' }),
}

export const notifyApi = (data) => apiRequest('/notifications/send', { method: 'POST', body: JSON.stringify(data) })
export const payrollApi = (grossPay) => apiRequest('/payroll/calculate', { method: 'POST', body: JSON.stringify({ grossPay }) })
export const aiMarkerApi = (data) => apiRequest('/ai/mark-assignment', { method: 'POST', body: JSON.stringify(data) })
export const chatApi = (message) => apiRequest('/chat', { method: 'POST', body: JSON.stringify({ message }) })
