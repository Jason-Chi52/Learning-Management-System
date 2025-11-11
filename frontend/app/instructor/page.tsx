'use client';

import { useEffect, useState } from 'react';
import { API, authHeaders } from '../lib/api';

type Course = { id: number; title: string; description?: string | null };

export default function InstructorCoursesPage() {
  const [courses, setCourses] = useState<Course[]>([]);
  const [form, setForm] = useState({ title: '', description: '' });
  const [editingId, setEditingId] = useState<number | null>(null);
  const [loading, setLoading] = useState(false);

  async function fetchCourses() {
    setLoading(true);
    try {
      const res = await fetch(`${API}/courses/`);
      const data = await res.json();
      setCourses(Array.isArray(data) ? data : data?.results ?? []);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    fetchCourses();
  }, []);

  async function createCourse(e: React.FormEvent) {
    e.preventDefault();
    const res = await fetch(`${API}/courses/`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', ...authHeaders() },
      body: JSON.stringify(form),
    });
    if (res.ok) {
      setForm({ title: '', description: '' });
      fetchCourses();
    } else {
      alert('Failed to create course');
    }
  }

  async function updateCourse(id: number) {
    const res = await fetch(`${API}/courses/${id}/`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json', ...authHeaders() },
      body: JSON.stringify(form),
    });
    if (res.ok) {
      setEditingId(null);
      setForm({ title: '', description: '' });
      fetchCourses();
    } else {
      alert('Update failed');
    }
  }

  async function deleteCourse(id: number) {
    if (!confirm('Delete this course?')) return;
    const res = await fetch(`${API}/courses/${id}/`, {
      method: 'DELETE',
      headers: authHeaders(),
    });
    if (res.ok) fetchCourses();
    else alert('Delete failed');
  }

  return (
    <div style={{ maxWidth: 800, margin: '2rem auto', padding: '1rem' }}>
      <h1>Instructor — My Courses</h1>

      <form onSubmit={createCourse} style={{ margin: '1rem 0' }}>
        <h3>Create Course</h3>
        <input
          placeholder="Title"
          value={form.title}
          onChange={(e) => setForm({ ...form, title: e.target.value })}
          required
          style={{ width: '100%', padding: 8, marginBottom: 8 }}
        />
        <textarea
          placeholder="Description"
          value={form.description}
          onChange={(e) => setForm({ ...form, description: e.target.value })}
          style={{ width: '100%', padding: 8, minHeight: 80, marginBottom: 8 }}
        />
        <button disabled={loading}>Create</button>
      </form>

      <hr />

      <h3 style={{ marginTop: 16 }}>Your Courses</h3>
      {loading ? <p>Loading…</p> : null}
      {!loading && courses.length === 0 ? <p>No courses yet.</p> : null}

      <ul style={{ listStyle: 'none', padding: 0 }}>
        {courses.map((c) => (
          <li key={c.id} style={{ border: '1px solid #ddd', borderRadius: 8, padding: 12, marginBottom: 8 }}>
            {editingId === c.id ? (
              <>
                <input
                  placeholder="Title"
                  value={form.title}
                  onChange={(e) => setForm({ ...form, title: e.target.value })}
                  style={{ width: '100%', padding: 8, marginBottom: 8 }}
                />
                <textarea
                  placeholder="Description"
                  value={form.description}
                  onChange={(e) => setForm({ ...form, description: e.target.value })}
                  style={{ width: '100%', padding: 8, minHeight: 80, marginBottom: 8 }}
                />
                <button onClick={() => updateCourse(c.id)}>Save</button>{' '}
                <button
                  onClick={() => {
                    setEditingId(null);
                    setForm({ title: '', description: '' });
                  }}
                >
                  Cancel
                </button>
              </>
            ) : (
              <>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline' }}>
                  <h4 style={{ margin: 0 }}>{c.title}</h4>
                  <a href={`/courses/${c.id}`}>Manage chapters →</a>
                </div>
                <p style={{ whiteSpace: 'pre-wrap' }}>{c.description ?? ''}</p>
                <div style={{ display: 'flex', gap: 8 }}>
                  <button
                    onClick={() => {
                      setEditingId(c.id);
                      setForm({ title: c.title, description: c.description ?? '' });
                    }}
                  >
                    Edit
                  </button>
                  <button onClick={() => deleteCourse(c.id)} style={{ color: 'crimson' }}>
                    Delete
                  </button>
                </div>
              </>
            )}
          </li>
        ))}
      </ul>
    </div>
  );
}
