'use client';

import { useEffect, useMemo, useState } from 'react';
import { useParams } from 'next/navigation';
import { API, authHeaders } from '../../lib/api';

type Course = { id: number; title: string; description?: string | null };
type Chapter = { id: number; course: number; title: string; content: string; is_public: boolean };

export default function CourseDetailPage() {
  const params = useParams<{ id: string }>();
  const courseId = Number(params.id);

  const [course, setCourse] = useState<Course | null>(null);
  const [chapters, setChapters] = useState<Chapter[]>([]);
  const [meRole, setMeRole] = useState<'Instructor' | 'Student' | null>(null);
  const [loading, setLoading] = useState(true);

  // form state for creating/editing a chapter
  const [editing, setEditing] = useState<Chapter | null>(null);
  const [title, setTitle] = useState('');
  const [isPublic, setIsPublic] = useState(true);
  const [content, setContent] = useState('');

  async function load() {
    setLoading(true);
    try {
      // course list (no dedicated detail API in backend), so fetch all and pick
      const cRes = await fetch(`${API}/courses/`);
      const cAll: Course[] = await cRes.json();
      setCourse(cAll.find((c) => c.id === courseId) || null);

      // fetch all chapters (backend has no filter param); filter client-side
      const chRes = await fetch(`${API}/chapters/`, { headers: authHeaders() });
      const chAll: Chapter[] = await chRes.json();
      setChapters(chAll.filter((ch) => ch.course === courseId));

      // discover role if logged in
      try {
        const meRes = await fetch(`${API}/auth/me/`, { headers: authHeaders() });
        if (meRes.ok) {
          const me = await meRes.json();
          setMeRole(me.role);
        } else setMeRole(null);
      } catch {
        setMeRole(null);
      }
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => { load(); }, [courseId]);

  const visibleChapters = useMemo(() => {
    const isInstructor = meRole === 'Instructor';
    return isInstructor ? chapters : chapters.filter((c) => c.is_public);
  }, [chapters, meRole]);

  function resetForm() {
    setEditing(null);
    setTitle('');
    setIsPublic(true);
    setContent('');
  }

  function startCreate() {
    setEditing(null);
    setTitle('');
    setIsPublic(true);
    setContent('');
  }

  function startEdit(ch: Chapter) {
    setEditing(ch);
    setTitle(ch.title);
    setIsPublic(ch.is_public);
    setContent(ch.content || '');
  }

  async function saveChapter(e: React.FormEvent) {
    e.preventDefault();
    const body = { course: courseId, title, content, is_public: isPublic };

    const res = await fetch(
      editing ? `${API}/chapters/${editing.id}/` : `${API}/chapters/`,
      {
        method: editing ? 'PUT' : 'POST',
        headers: { 'Content-Type': 'application/json', ...authHeaders() },
        body: JSON.stringify(body),
      }
    );
    if (!res.ok) {
      alert('Save failed');
      return;
    }
    resetForm();
    load();
  }

  async function deleteChapter(id: number) {
    if (!confirm('Delete this chapter?')) return;
    const res = await fetch(`${API}/chapters/${id}/`, {
      method: 'DELETE',
      headers: authHeaders(),
    });
    if (res.ok) load();
    else alert('Delete failed');
  }

  if (loading) return <main style={{ padding: 24 }}>Loading…</main>;
  if (!course) return <main style={{ padding: 24 }}>Course not found.</main>;

  return (
    <main style={{ maxWidth: 900, margin: '40px auto', fontFamily: 'sans-serif' }}>
      <a href="/instructor">← Back</a>
      <h1 style={{ marginTop: 8 }}>{course.title}</h1>
      {course.description ? <p>{course.description}</p> : null}

      <section style={{ marginTop: 24 }}>
        <h2>Chapters</h2>
        {visibleChapters.length === 0 ? <p>No chapters yet.</p> : (
          <ul style={{ listStyle: 'none', padding: 0 }}>
            {visibleChapters.map((ch) => (
              <li key={ch.id} style={{ border: '1px solid #ddd', borderRadius: 8, padding: 12, marginBottom: 10 }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', gap: 12 }}>
                  <strong>{ch.title}</strong>
                  <span style={{ opacity: 0.7 }}>{ch.is_public ? 'Public' : 'Private'}</span>
                </div>
                <div style={{ whiteSpace: 'pre-wrap', marginTop: 8 }}>{ch.content}</div>

                {meRole === 'Instructor' && (
                  <div style={{ display: 'flex', gap: 8, marginTop: 8 }}>
                    <button onClick={() => startEdit(ch)}>Edit</button>
                    <button onClick={() => deleteChapter(ch.id)} style={{ color: 'crimson' }}>Delete</button>
                  </div>
                )}
              </li>
            ))}
          </ul>
        )}
      </section>

      {meRole === 'Instructor' && (
        <section style={{ marginTop: 32 }}>
          <h2>{editing ? 'Edit Chapter' : 'Create Chapter'}</h2>
          <form onSubmit={saveChapter} style={{ display: 'grid', gap: 10 }}>
            <input
              placeholder="Chapter title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              required
            />
            {/* ---- Content editor (simple textarea by default) ---- */}
            <textarea
              placeholder="Write chapter content…"
              value={content}
              onChange={(e) => setContent(e.target.value)}
              style={{ minHeight: 160, padding: 8 }}
            />
            <label style={{ display: 'inline-flex', gap: 8, alignItems: 'center' }}>
              <input type="checkbox" checked={isPublic} onChange={(e) => setIsPublic(e.target.checked)} />
              Public (visible to students)
            </label>
            <div style={{ display: 'flex', gap: 8 }}>
              <button type="submit">{editing ? 'Save changes' : 'Create chapter'}</button>
              {editing && <button type="button" onClick={resetForm}>Cancel</button>}
            </div>
          </form>

        </section>
      )}
    </main>
  );
}
