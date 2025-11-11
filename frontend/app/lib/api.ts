export const API =
  (process.env.NEXT_PUBLIC_API ?? 'http://localhost:8000/api').replace(/\/+$/, '');

export function authHeaders(): Record<string, string> {
  const token =
    typeof window !== 'undefined' ? localStorage.getItem('token') : null;
  return token ? { Authorization: `Bearer ${token}` } : {};
}

// Use this for JSON requests so TS is happy about HeadersInit
export function jsonHeaders(): HeadersInit {
  return { 'Content-Type': 'application/json', ...authHeaders() };
}
