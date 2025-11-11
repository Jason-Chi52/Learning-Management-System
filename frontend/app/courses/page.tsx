'use client';
import { useEffect, useState } from 'react';
import { API } from '../lib/api';

type Course = { id: number; title: string; description: string };

export default function CoursesPage() {
  const [courses, setCourses] = useState<Course[]>([]);

  useEffect(() => {
    fetch(`${API}/courses/`)
      .then(r => r.json())
      .then(setCourses)
      .catch(console.error);
  }, []);

  return (
    <main style={{ maxWidth: 800, margin: '40px auto' }}>
      <h1>Courses</h1>
      <ul>
        {courses.map(c => (
          <li key={c.id}>
            <a href={`/courses/${c.id}`}>{c.title}</a>
          </li>
        ))}
      </ul>
    </main>
  );
}
