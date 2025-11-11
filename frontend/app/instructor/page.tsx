'use client';
import { useEffect, useState } from 'react';
import { API, authHeaders } from '../lib/api';

export default function Instructor() {
  const [courses, setCourses] = useState<any[]>([]);
  useEffect(() => {
    fetch(`${API}/courses/`, { headers: authHeaders() })
      .then(r=>r.json()).then(setCourses).catch(console.error);
  }, []);
  return (
    <main style={{maxWidth:800, margin:'40px auto'}}>
      <h1>Instructor Dashboard</h1>
      <ul>{courses.map(c => <li key={c.id}>{c.title}</li>)}</ul>
    </main>
  );
}
