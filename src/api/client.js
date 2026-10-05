async function request(path, options = {}) {
  const response = await fetch(`/.netlify/functions/${path}`, {
    headers: { 'Content-Type': 'application/json', ...(options.headers || {}) },
    ...options
  });
  const data = await response.json().catch(() => ({}));
  if (!response.ok) throw new Error(data.error || `Request failed: ${response.status}`);
  return data;
}

const qs = params => new URLSearchParams(Object.entries(params).filter(([, v]) => v !== undefined && v !== '')).toString();

export const api = {
  getTransactions: params => request(`transactions?${qs(params)}`),
  getSummary: params => request(`summary?${qs(params)}`),
  getProjection: params => request(`projection?${qs(params)}`),
  updateTransaction: payload => request('transaction-update', { method: 'POST', body: JSON.stringify(payload) }),
  getSubscriptions: params => request(`subscriptions?${qs(params)}`),
  updateSubscription: payload => request('subscription-update', { method: 'POST', body: JSON.stringify(payload) }),
  getSettings: () => request('settings'),
  saveSettings: payload => request('settings', { method: 'POST', body: JSON.stringify(payload) })
};
