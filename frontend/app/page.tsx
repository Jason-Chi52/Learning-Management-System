'use client';
import { useState } from 'react';
import { API } from './lib/api';
import { useRouter } from 'next/navigation';

export default function LoginPage() {
  const [username, setU] = useState('');
  const [password, setP] = useState('');
  const [err, setErr] = useState('');
  const router = useRouter();

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setErr('');
    try {
      const res = await fetch(`${API}/auth/token/`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, password }),
      });
      if (!res.ok) throw new Error('Bad credentials');
      const data = await res.json();
      localStorage.setItem('token', data.access);

      const meRes = await fetch(`${API}/auth/me/`, { headers: { Authorization: `Bearer ${data.access}` }});
      const me = await meRes.json();
      if (me.role === 'Instructor') router.replace('/instructor');
      else router.replace('/student');
    } catch (e:any) {
      setErr(e.message || 'Login failed');
    }
  }

  return (
    <main style={{maxWidth:420, margin:'60px auto', fontFamily:'sans-serif'}}>
      <h2>Log in</h2>
      {err && <p style={{color:'red'}}>{err}</p>}
      <form onSubmit={onSubmit} style={{display:'grid', gap:10}}>
        <input placeholder="Username" value={username} onChange={e=>setU(e.target.value)} />
        <input placeholder="Password" type="password" value={password} onChange={e=>setP(e.target.value)} />
        <button type="submit">Sign in</button>
      </form>
    </main>
  );
}
