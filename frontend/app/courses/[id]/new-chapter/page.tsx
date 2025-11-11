
// 'use client';
// import React, { useEffect, useState } from 'react';

// const API = process.env.NEXT_PUBLIC_API_BASE as string;
// const authHeaders = (): Record<string, string> => {
//   const t = localStorage.getItem('token');
//   return t ? { Authorization: `Bearer ${t}` } : {};
// };

// export default function NewChapterPage() {

//   // derive course id from the pathname (client-side) to avoid importing next/navigation
//   const [id, setId] = useState<string | undefined>(undefined);
//   useEffect(() => {
//     if (typeof window === 'undefined') return;
//     const parts = window.location.pathname.split('/').filter(Boolean);
//     const idx = parts.indexOf('courses');
//     if (idx >= 0 && parts.length > idx + 1) {
//       setId(parts[idx + 1]);
//     }
//   }, []);

//   // simple router shim for navigation without next/navigation
//   const router = {
//     replace: (url: string) => { window.location.href = url; }
//   };

//   const [title, setTitle] = useState('');
//   const [content, setContent] = useState('[]'); 
//   const [isPublic, setIsPublic] = useState(false);
//   const [order, setOrder] = useState<number>(0);
//   const [err, setErr] = useState('');

//   async function submit(e: React.FormEvent) {
//     e.preventDefault();
//     setErr('');

//     if (!id) {
//       setErr('Missing course id');
//       return;
//     }

//     const headers = { 'Content-Type': 'application/json', ...authHeaders() } as HeadersInit;
//     const res = await fetch(`${API}/instructor/courses/${id}/chapters/`, {
//       method: 'POST',
//       headers,
//       body: JSON.stringify({ title, content, is_public: isPublic, order }),
//     });
//     if (!res.ok) { setErr('Create failed'); return; }
//     router.replace(`/courses/${id}`); // back to course page
//   }

//   return (
//     <main style={{maxWidth:800, margin:'40px auto', display:'grid', gap:12}}>
//       <h1>New Chapter</h1>
//       {err && <p style={{color:'red'}}>{err}</p>}
//       <form onSubmit={submit} style={{display:'grid', gap:8}}>
//         <input placeholder="Title" value={title} onChange={e=>setTitle(e.target.value)} />
//         <label><input type="checkbox" checked={isPublic} onChange={e=>setIsPublic(e.target.checked)} /> Public</label>
//         <input type="number" placeholder="Order" value={order} onChange={e=>setOrder(Number(e.target.value))} />
//         <textarea placeholder="Content (JSON or HTML)" rows={8} value={content} onChange={e=>setContent(e.target.value)} />
//         <button type="submit">Create Chapter</button>
//       </form>
//     </main>
//   );
// }
