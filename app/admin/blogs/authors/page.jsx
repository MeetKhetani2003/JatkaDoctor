"use client";

import { useState, useEffect } from "react";
import { Loader2, Plus, Trash2, ArrowLeft, Image as ImageIcon } from "lucide-react";
import Link from "next/link";
import Image from "next/image";

export default function BlogAuthorsPage() {
  const [authors, setAuthors] = useState([]);
  const [loading, setLoading] = useState(true);
  
  const [showForm, setShowForm] = useState(false);
  const [saving, setSaving] = useState(false);
  const [deletingId, setDeletingId] = useState(null);
  
  const [formData, setFormData] = useState({
    name: "",
    qualification: "",
    designation: "",
    bio: "",
    photo: null
  });
  const [preview, setPreview] = useState("");

  const fetchAuthors = async () => {
    try {
      const res = await fetch("/api/admin/blog-authors");
      if (res.ok) {
        const data = await res.json();
        setAuthors(data);
      }
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAuthors();
  }, []);

  const handleChange = (e) => {
    setFormData(prev => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleImageChange = (e) => {
    if (e.target.files && e.target.files[0]) {
      setFormData(prev => ({ ...prev, photo: e.target.files[0] }));
      setPreview(URL.createObjectURL(e.target.files[0]));
    }
  };

  const handleSave = async (e) => {
    e.preventDefault();
    setSaving(true);
    try {
      const data = new FormData();
      Object.keys(formData).forEach(k => {
        if (formData[k]) data.append(k, formData[k]);
      });

      const res = await fetch("/api/admin/blog-authors", {
        method: "POST",
        body: data
      });
      if (res.ok) {
        setShowForm(false);
        setFormData({ name: "", qualification: "", designation: "", bio: "", photo: null });
        setPreview("");
        fetchAuthors();
      }
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id) => {
    if (!confirm("Are you sure?")) return;
    setDeletingId(id);
    try {
      const res = await fetch(`/api/admin/blog-authors/${id}`, { method: 'DELETE' });
      if (res.ok) fetchAuthors();
    } finally {
      setDeletingId(null);
    }
  };

  return (
    <div className="space-y-6 max-w-5xl mx-auto">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <Link href="/admin/blogs" className="p-2 bg-white rounded-lg border hover:bg-gray-50 text-gray-500">
            <ArrowLeft className="w-5 h-5" />
          </Link>
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Blog Authors</h1>
            <p className="text-sm text-gray-500">Manage author profiles for your blogs.</p>
          </div>
        </div>
        <button
          onClick={() => setShowForm(!showForm)}
          className="flex items-center gap-2 px-4 py-2 bg-primary text-white font-bold rounded-xl hover:bg-primary-dark transition text-sm shadow-md"
        >
          {showForm ? "Cancel" : <><Plus className="w-4 h-4" /> Add Author</>}
        </button>
      </div>

      {showForm && (
        <form onSubmit={handleSave} className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm space-y-4 animate-in fade-in slide-in-from-top-4">
          <h2 className="text-lg font-bold text-gray-900 border-b pb-2">New Author Profile</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-gray-700 mb-1">Name *</label>
              <input type="text" name="name" required value={formData.name} onChange={handleChange} className="w-full px-4 py-2 border rounded-xl outline-none focus:border-primary" />
            </div>
            <div>
              <label className="block text-xs font-bold text-gray-700 mb-1">Qualification</label>
              <input type="text" name="qualification" value={formData.qualification} onChange={handleChange} placeholder="e.g. MBBS, MD" className="w-full px-4 py-2 border rounded-xl outline-none focus:border-primary" />
            </div>
            <div>
              <label className="block text-xs font-bold text-gray-700 mb-1">Designation</label>
              <input type="text" name="designation" value={formData.designation} onChange={handleChange} placeholder="e.g. Senior Cardiologist" className="w-full px-4 py-2 border rounded-xl outline-none focus:border-primary" />
            </div>
            <div>
              <label className="block text-xs font-bold text-gray-700 mb-1">Photo</label>
              <div className="flex items-center gap-3">
                {preview ? (
                  <div className="w-10 h-10 rounded-full overflow-hidden relative border">
                    <Image src={preview} alt="preview" fill className="object-cover" />
                  </div>
                ) : (
                  <div className="w-10 h-10 rounded-full bg-gray-100 flex items-center justify-center border text-gray-400">
                    <ImageIcon className="w-4 h-4" />
                  </div>
                )}
                <input type="file" accept="image/*" onChange={handleImageChange} className="text-xs" />
              </div>
            </div>
            <div className="md:col-span-2">
              <label className="block text-xs font-bold text-gray-700 mb-1">Author Bio</label>
              <textarea name="bio" rows="3" value={formData.bio} onChange={handleChange} className="w-full px-4 py-2 border rounded-xl outline-none focus:border-primary resize-none" />
            </div>
          </div>
          <div className="flex justify-end pt-2">
            <button type="submit" disabled={saving || !formData.name} className="px-6 py-2 bg-primary text-white font-bold rounded-xl hover:bg-primary-dark transition flex items-center gap-2 disabled:opacity-50">
              {saving ? <Loader2 className="w-4 h-4 animate-spin" /> : "Save Author"}
            </button>
          </div>
        </form>
      )}

      {loading ? (
        <div className="flex justify-center py-10"><Loader2 className="w-6 h-6 animate-spin text-primary" /></div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {authors.map(author => (
            <div key={author._id} className="bg-white p-5 rounded-2xl border border-gray-100 shadow-sm flex flex-col relative group">
              <button 
                onClick={() => handleDelete(author._id)}
                disabled={deletingId === author._id}
                className="absolute top-3 right-3 p-2 bg-red-50 text-red-500 rounded-lg opacity-0 group-hover:opacity-100 transition disabled:opacity-50"
              >
                {deletingId === author._id ? <Loader2 className="w-4 h-4 animate-spin" /> : <Trash2 className="w-4 h-4" />}
              </button>
              
              <div className="flex items-center gap-4 mb-4">
                <div className="w-16 h-16 rounded-full overflow-hidden bg-gray-100 border relative shrink-0">
                  {(author.photoUrl || author.photoFileId) ? (
                    <Image src={author.photoUrl || `/api/images/${author.photoFileId}`} alt={author.name} fill className="object-cover" />
                  ) : (
                    <ImageIcon className="w-6 h-6 absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-gray-400" />
                  )}
                </div>
                <div>
                  <h3 className="font-bold text-gray-900 leading-tight">{author.name}</h3>
                  <p className="text-xs text-primary font-semibold">{author.qualification}</p>
                  <p className="text-xs text-gray-500">{author.designation}</p>
                </div>
              </div>
              <p className="text-sm text-gray-600 line-clamp-3 bg-gray-50 p-3 rounded-xl flex-1">
                {author.bio || "No bio provided."}
              </p>
            </div>
          ))}
          {authors.length === 0 && (
            <div className="col-span-full py-10 text-center text-gray-500">
              No authors found. Click "Add Author" to create one.
            </div>
          )}
        </div>
      )}
    </div>
  );
}
