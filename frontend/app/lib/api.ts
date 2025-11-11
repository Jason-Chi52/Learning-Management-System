export const API =
  process.env.NEXT_PUBLIC_API_URL || 'http://127.0.0.1:8000/api';

export function authHeaders(): Record<string,string> {
  if (typeof window === 'undefined') return {};
  const t = localStorage.getItem('token');
  return t ? { Authorization: `Bearer ${t}` } : {};
}