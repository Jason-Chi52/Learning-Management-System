'use client';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { API } from '../lib/api';

export default function SignupPage() {
  const [username, setU] = useState('');
  const [password, setP] = useState('');
  const [role, setRole]   = useState<'Instructor'|'Student'>('Student');
  const [err, setErr]     = useState('');
  const router = useRouter();

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault(); setErr('');
    try {
      const res = await fetch(`${API}/auth/signup/`, {
        method: 'POST',
        headers: {'Content-Type':'application/json'},
        body: JSON.stringify({ username, password, role })
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data?.error || 'Signup failed');

      localStorage.setItem('token', data.access);
      router.replace(role === 'Instructor' ? '/instructor' : '/student');
    } catch (e:any) {
      setErr(e.message || 'Signup failed');
    }
  }

  return (
    <main style={{maxWidth:420, margin:'60px auto', fontFamily:'sans-serif'}}>
      <h2>Create account</h2>
      {err && <p style={{color:'red'}}>{err}</p>}
      <form onSubmit={onSubmit} style={{display:'grid', gap:10}}>
        <input placeholder="Username" value={username} onChange={e=>setU(e.target.value)} />
        <input placeholder="Password" type="password" value={password} onChange={e=>setP(e.target.value)} />
        <select value={role} onChange={e=>setRole(e.target.value as any)}>
          <option>Student</option>
          <option>Instructor</option>
        </select>
        <button type="submit">Sign up</button>
      </form>
      <p style={{marginTop:10}}>Already have an account? <a href="/">Log in</a></p>
    </main>
  );
}
