'use client';

import { useState, useCallback, useEffect } from 'react';
import { useDropzone } from 'react-dropzone';
import { Upload, FileText, Trash2, LogOut, CheckCircle2, AlertCircle, Loader2, BookOpen } from 'lucide-react';

interface Document {
  id: string;
  name: string;
  fileName: string;
  fileType: string;
  charCount: number;
  createdAt: string;
  status: string;
}

export default function AdminPage() {
  const [password, setPassword] = useState('');
  const [authed, setAuthed] = useState(false);
  const [authError, setAuthError] = useState('');
  const [documents, setDocuments] = useState<Document[]>([]);
  const [uploading, setUploading] = useState(false);
  const [uploadStatus, setUploadStatus] = useState<{ type: 'success' | 'error'; message: string } | null>(null);
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [docTitle, setDocTitle] = useState('');
  const [loadingDocs, setLoadingDocs] = useState(false);

  async function loadDocuments(pwd: string) {
    setLoadingDocs(true);
    try {
      const res = await fetch('/api/documents', {
        headers: { Authorization: `Bearer ${pwd}` },
      });
      if (res.ok) {
        const data = await res.json();
        setDocuments(data.documents || []);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoadingDocs(false);
    }
  }

  function handleLogin(e: React.FormEvent) {
    e.preventDefault();
    if (!password.trim()) return;
    // We'll verify by trying to hit the documents API
    setAuthed(true);
    loadDocuments(password);
  }

  async function handleDelete(docId: string) {
    if (!confirm('Delete this document and all its indexed chunks?')) return;
    setDeletingId(docId);
    try {
      const res = await fetch('/api/documents', {
        method: 'DELETE',
        headers: {
          Authorization: `Bearer ${password}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ docId }),
      });
      if (res.ok) {
        setDocuments(prev => prev.filter(d => d.id !== docId));
      }
    } catch (err) {
      console.error(err);
    } finally {
      setDeletingId(null);
    }
  }

  const onDrop = useCallback(async (acceptedFiles: File[]) => {
    const file = acceptedFiles[0];
    if (!file) return;

    setUploading(true);
    setUploadStatus(null);

    const formData = new FormData();
    formData.append('file', file);
    formData.append('title', docTitle || file.name.replace(/\.[^/.]+$/, ''));

    try {
      const res = await fetch('/api/upload', {
        method: 'POST',
        headers: { Authorization: `Bearer ${password}` },
        body: formData,
      });
      const data = await res.json();
      if (res.ok) {
        setUploadStatus({ type: 'success', message: `"${data.name}" indexed — ${data.chunks} chunks created` });
        setDocTitle('');
        loadDocuments(password);
      } else {
        setUploadStatus({ type: 'error', message: data.error || 'Upload failed' });
      }
    } catch (err) {
      setUploadStatus({ type: 'error', message: 'Network error during upload' });
    } finally {
      setUploading(false);
    }
  }, [password, docTitle]);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      'application/pdf': ['.pdf'],
      'text/markdown': ['.md'],
      'text/plain': ['.txt'],
    },
    maxFiles: 1,
    disabled: uploading,
  });

  if (!authed) {
    return (
      <div className="min-h-screen bg-kaizen-dark flex items-center justify-center px-4">
        <div className="w-full max-w-sm">
          <div className="flex items-center gap-3 mb-8">
            <img
              src="http://practitioner.kaizenacademy.education/logo_round.png"
              alt="Kaizen Academy"
              className="w-10 h-10 rounded-full border border-kaizen-yellow/30"
            />
            <div>
              <div className="font-display text-xs tracking-widest text-kaizen-yellow/70 uppercase">Kaizen Academy</div>
              <div className="text-white/50 text-xs">Admin Panel</div>
            </div>
          </div>

          <form onSubmit={handleLogin}>
            <div className="mb-4">
              <label className="block text-xs text-white/40 mb-1.5 tracking-wider uppercase">Password</label>
              <input
                type="password"
                value={password}
                onChange={e => setPassword(e.target.value)}
                placeholder="Enter admin password"
                className="w-full bg-kaizen-grey border border-white/10 rounded-lg px-4 py-3 text-sm text-white outline-none focus:border-kaizen-yellow/40 transition-colors"
                autoFocus
              />
            </div>
            {authError && <p className="text-red-400 text-xs mb-3">{authError}</p>}
            <button
              type="submit"
              className="w-full bg-kaizen-yellow text-black font-medium text-sm py-3 rounded-lg hover:bg-kaizen-yellow/90 transition-colors"
            >
              Enter
            </button>
          </form>

          <div className="mt-6 text-center">
            <a href="/" className="text-xs text-white/20 hover:text-white/40 transition-colors">
              ← Back to Sensei
            </a>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-kaizen-dark">
      {/* Header */}
      <header className="border-b border-white/5 px-6 py-4 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <img
            src="http://practitioner.kaizenacademy.education/logo_round.png"
            alt="Kaizen Academy"
            className="w-8 h-8 rounded-full border border-kaizen-yellow/30"
          />
          <div>
            <span className="font-display text-xs tracking-widest text-kaizen-yellow/70 uppercase">Kaizen Academy</span>
            <span className="text-white/30 text-xs ml-2">/ Admin</span>
          </div>
        </div>
        <div className="flex items-center gap-4">
          <a href="/" className="text-xs text-white/30 hover:text-white/60 transition-colors flex items-center gap-1.5">
            <BookOpen size={12} />
            Open Sensei
          </a>
          <button
            onClick={() => { setAuthed(false); setPassword(''); }}
            className="text-xs text-white/30 hover:text-white/60 transition-colors flex items-center gap-1.5"
          >
            <LogOut size={12} />
            Sign out
          </button>
        </div>
      </header>

      <div className="max-w-3xl mx-auto px-6 py-10">
        {/* Upload section */}
        <section className="mb-10">
          <h2 className="font-display text-lg font-light text-white/80 mb-1">Upload Knowledge</h2>
          <p className="text-white/30 text-sm mb-6">PDFs and Markdown files are automatically indexed for the Sensei to search.</p>

          <div className="mb-3">
            <label className="block text-xs text-white/40 mb-1.5 tracking-wider uppercase">Document title (optional)</label>
            <input
              type="text"
              value={docTitle}
              onChange={e => setDocTitle(e.target.value)}
              placeholder="e.g. Gemba Kaizen Book — Chapter 3"
              className="w-full bg-kaizen-grey border border-white/10 rounded-lg px-4 py-2.5 text-sm text-white outline-none focus:border-kaizen-yellow/40 transition-colors placeholder-white/20"
            />
          </div>

          <div
            {...getRootProps()}
            className={`border-2 border-dashed rounded-xl px-8 py-10 text-center cursor-pointer transition-all duration-200
              ${isDragActive ? 'border-kaizen-yellow/60 bg-kaizen-yellow/5' : 'border-white/10 hover:border-kaizen-yellow/30 hover:bg-white/2'}
              ${uploading ? 'opacity-50 cursor-not-allowed' : ''}
            `}
          >
            <input {...getInputProps()} />
            {uploading ? (
              <div className="flex flex-col items-center gap-3">
                <Loader2 size={24} className="text-kaizen-yellow animate-spin" />
                <p className="text-sm text-white/50">Uploading and indexing…</p>
              </div>
            ) : (
              <div className="flex flex-col items-center gap-3">
                <Upload size={24} className={isDragActive ? 'text-kaizen-yellow' : 'text-white/20'} />
                <div>
                  <p className="text-sm text-white/60">
                    {isDragActive ? 'Drop it here' : 'Drag & drop a PDF or Markdown file'}
                  </p>
                  <p className="text-xs text-white/25 mt-1">or click to browse · .pdf, .md, .txt</p>
                </div>
              </div>
            )}
          </div>

          {uploadStatus && (
            <div className={`mt-3 flex items-center gap-2 text-sm px-4 py-3 rounded-lg
              ${uploadStatus.type === 'success' ? 'bg-green-500/10 text-green-400 border border-green-500/20' : 'bg-red-500/10 text-red-400 border border-red-500/20'}`
            }>
              {uploadStatus.type === 'success'
                ? <CheckCircle2 size={14} />
                : <AlertCircle size={14} />
              }
              {uploadStatus.message}
            </div>
          )}
        </section>

        {/* Documents list */}
        <section>
          <div className="flex items-center justify-between mb-4">
            <h2 className="font-display text-lg font-light text-white/80">Knowledge Base</h2>
            <span className="text-xs text-white/30">{documents.length} document{documents.length !== 1 ? 's' : ''}</span>
          </div>

          {loadingDocs ? (
            <div className="flex items-center gap-2 text-white/30 text-sm">
              <Loader2 size={14} className="animate-spin" />
              Loading documents…
            </div>
          ) : documents.length === 0 ? (
            <div className="border border-dashed border-white/8 rounded-xl px-6 py-10 text-center">
              <FileText size={24} className="text-white/15 mx-auto mb-3" />
              <p className="text-sm text-white/30">No documents indexed yet.</p>
              <p className="text-xs text-white/20 mt-1">Upload your first PDF or Markdown file above.</p>
            </div>
          ) : (
            <div className="space-y-2">
              {documents.map(doc => (
                <div
                  key={doc.id}
                  className="flex items-center gap-4 px-4 py-3 bg-kaizen-grey/50 border border-white/6 rounded-xl hover:border-white/10 transition-colors group"
                >
                  <div className="flex-shrink-0 w-8 h-8 rounded-lg bg-kaizen-yellow/10 border border-kaizen-yellow/20 flex items-center justify-center">
                    <FileText size={14} className="text-kaizen-yellow/60" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm text-white/80 truncate">{doc.name}</p>
                    <p className="text-xs text-white/25 mt-0.5">
                      {doc.fileType.toUpperCase()} · {(doc.charCount / 1000).toFixed(1)}k chars ·{' '}
                      {doc.createdAt ? new Date(doc.createdAt).toLocaleDateString() : '—'}
                    </p>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-xs text-green-400/60 bg-green-400/10 px-2 py-0.5 rounded-full">
                      {doc.status}
                    </span>
                    <button
                      onClick={() => handleDelete(doc.id)}
                      disabled={deletingId === doc.id}
                      className="opacity-0 group-hover:opacity-100 p-1.5 text-white/20 hover:text-red-400 transition-all rounded-lg hover:bg-red-400/10"
                    >
                      {deletingId === doc.id
                        ? <Loader2 size={14} className="animate-spin" />
                        : <Trash2 size={14} />
                      }
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </section>
      </div>
    </div>
  );
}
