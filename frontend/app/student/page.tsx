'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { API, authHeaders } from '../lib/api';

type Course = { id: number; title: string; description: string };

export default function StudentPage() {
  const router = useRouter();
  const [me, setMe] = useState<{ username: string; role: string } | null>(null);
  const [courses, setCourses] = useState<Course[]>([]);
  const [loading, setLoading] = useState(true);
  const [err, setErr] = useState('');

  useEffect(() => {
    (async () => {
      try {
        // must be logged in
        const meRes = await fetch(`${API}/auth/me/`, { headers: authHeaders() });
        if (!meRes.ok) throw new Error('Not authenticated');
        const meJson = await meRes.json();
        // only students should be here
        if (meJson.role !== 'Student') {
          router.replace('/instructor');
          return;
        }
        setMe(meJson);

        // students can view all courses (public)
        const cRes = await fetch(`${API}/courses/`);
        const cJson = await cRes.json();
        setCourses(cJson);
      } catch (e: any) {
        setErr(e.message || 'Failed to load');
        router.replace('/'); // go back to login
      } finally {
        setLoading(false);
      }
    })();
  }, [router]);

  function logout() {
    localStorage.removeItem('token');
    router.replace('/');
  }

  if (loading) return <main style={{ padding: 24 }}>Loading…</main>;
  if (err && !me) return <main style={{ padding: 24, color: 'red' }}>{err}</main>;

  return (
    <main style={{ maxWidth: 900, margin: '40px auto', fontFamily: 'sans-serif' }}>
      <header style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <h1>Student Dashboard</h1>
        <div>
          <span style={{ marginRight: 16 }}>
            {me ? <>Signed in as <b>{me.username}</b> • Role: <b>{me.role}</b></> : null}
          </span>
          <button onClick={logout}>Log out</button>
        </div>
      </header>

      <section style={{ marginTop: 24 }}>
        <h2>Available Courses</h2>
        {courses.length === 0 ? (
          <p>No courses yet.</p>
        ) : (
          <ul>
            {courses.map((c) => (
              <li key={c.id} style={{ marginBottom: 10 }}>
                <a href={`/courses/${c.id}`} style={{ fontWeight: 600 }}>{c.title}</a>
                <div style={{ color: '#555' }}>{c.description}</div>
              </li>
            ))}
          </ul>
        )}
      </section>
    </main>
  );
}
