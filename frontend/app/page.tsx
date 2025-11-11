'use client';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { API } from './lib/api';

export default function LoginPage() {
  const [username, setU] = useState('');
  const [password, setP] = useState('');
  const [err, setErr] = useState('');
  const router = useRouter();

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault(); setErr('');
    try {
      const res = await fetch(`${API}/auth/token/`, {
        method: 'POST',
        headers: {'Content-Type':'application/json'},
        body: JSON.stringify({ username, password })
      });
      if (!res.ok) throw new Error('Invalid username or password');
      const { access } = await res.json();
      localStorage.setItem('token', access);

      const meRes = await fetch(`${API}/auth/me/`, { headers: { Authorization: `Bearer ${access}` }});
      const me = await meRes.json();
      router.replace(me.role === 'Instructor' ? '/instructor' : '/student');
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

      {/* Sign up button/link */}
      <div style={{marginTop:14}}>
        <Link href="/signup"><button type="button">Create an account (Sign up)</button></Link>
      </div>
    </main>
  );
}
