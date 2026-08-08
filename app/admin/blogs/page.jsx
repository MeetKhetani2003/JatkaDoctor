"use client";

import { useState, useEffect } from "react";
import { Plus, Loader2, Eye, Pencil, Trash2, Globe, FileText, CheckCircle2 } from "lucide-react";
import Link from "next/link";
import Image from "next/image";

export default function AdminBlogsPage() {
  const [blogs, setBlogs] = useState([]);
  const [analytics, setAnalytics] = useState({ totalViews: 0, publishedCount: 0, totalCount: 0 });
  const [loading, setLoading] = useState(true);
  const [deletingId, setDeletingId] = useState(null);

  const fetchBlogs = async () => {
    try {
      const res = await fetch("/api/admin/blogs");
      if (res.ok) {
        const data = await res.json();
        setBlogs(data.blogs);
        setAnalytics(data.analytics);
      }
    } catch (error) {
      console.error("Failed to fetch blogs", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBlogs();
  }, []);

  const handleDelete = async (id) => {
    if (!confirm("Are you sure you want to delete this blog?")) return;
    setDeletingId(id);
    try {
      const res = await fetch(`/api/admin/blogs/${id}`, { method: 'DELETE' });
      if (res.ok) fetchBlogs();
    } catch (e) {
      console.error(e);
      alert("Failed to delete");
    } finally {
      setDeletingId(null);
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center py-20">
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Blog Management</h1>
          <p className="text-sm text-gray-500">Manage your SEO content and healthcare articles.</p>
        </div>
        <div className="flex items-center gap-3">
          <Link href="/admin/blogs/categories" className="px-4 py-2 bg-white text-gray-700 font-bold rounded-xl border hover:bg-gray-50 transition text-sm">
            Categories
          </Link>
          <Link href="/admin/blogs/authors" className="px-4 py-2 bg-white text-gray-700 font-bold rounded-xl border hover:bg-gray-50 transition text-sm">
            Authors
          </Link>
          <Link href="/admin/blogs/create" className="flex items-center gap-2 px-4 py-2 bg-primary text-white font-bold rounded-xl hover:bg-primary-dark transition text-sm shadow-md">
            <Plus className="w-4 h-4" />
            Write Blog
          </Link>
        </div>
      </div>

      {/* Analytics Dashboard */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-white p-5 rounded-2xl border border-gray-100 shadow-sm flex items-center gap-4">
          <div className="w-12 h-12 bg-blue-50 text-blue-600 rounded-xl flex items-center justify-center">
            <Eye className="w-6 h-6" />
          </div>
          <div>
            <p className="text-xs text-gray-500 font-medium uppercase tracking-wider">Total Views</p>
            <h3 className="text-2xl font-black text-gray-900">{analytics.totalViews}</h3>
          </div>
        </div>
        <div className="bg-white p-5 rounded-2xl border border-gray-100 shadow-sm flex items-center gap-4">
          <div className="w-12 h-12 bg-emerald-50 text-emerald-600 rounded-xl flex items-center justify-center">
            <CheckCircle2 className="w-6 h-6" />
          </div>
          <div>
            <p className="text-xs text-gray-500 font-medium uppercase tracking-wider">Published Blogs</p>
            <h3 className="text-2xl font-black text-gray-900">{analytics.publishedCount}</h3>
          </div>
        </div>
        <div className="bg-white p-5 rounded-2xl border border-gray-100 shadow-sm flex items-center gap-4">
          <div className="w-12 h-12 bg-purple-50 text-purple-600 rounded-xl flex items-center justify-center">
            <FileText className="w-6 h-6" />
          </div>
          <div>
            <p className="text-xs text-gray-500 font-medium uppercase tracking-wider">Total Blogs</p>
            <h3 className="text-2xl font-black text-gray-900">{analytics.totalCount}</h3>
          </div>
        </div>
      </div>

      {/* Blog List */}
      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead className="bg-gray-50/50">
              <tr>
                <th className="px-6 py-4 text-xs font-bold text-gray-500 uppercase">Blog Title</th>
                <th className="px-6 py-4 text-xs font-bold text-gray-500 uppercase">Category</th>
                <th className="px-6 py-4 text-xs font-bold text-gray-500 uppercase">Status</th>
                <th className="px-6 py-4 text-xs font-bold text-gray-500 uppercase">Views</th>
                <th className="px-6 py-4 text-xs font-bold text-gray-500 uppercase text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {blogs.map(blog => (
                <tr key={blog._id} className="hover:bg-gray-50/50 transition">
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-3">
                      <div className="relative w-10 h-10 rounded-lg overflow-hidden bg-gray-100 border">
                        {(blog.image || blog.imageFileId) ? (
                          <Image src={blog.image || `/api/images/${blog.imageFileId}`} alt="" fill className="object-cover" />
                        ) : (
                          <FileText className="w-4 h-4 absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-gray-400" />
                        )}
                      </div>
                      <div>
                        <p className="text-sm font-bold text-gray-900">{blog.title}</p>
                        <p className="text-xs text-gray-500 truncate max-w-[250px]">{blog.metaDescription || "No description"}</p>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <span className="inline-flex items-center px-2 py-1 rounded bg-gray-100 text-gray-700 text-xs font-medium">
                      {blog.category}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <span className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider
                      ${blog.status === 'Published' ? 'bg-emerald-50 text-emerald-700 border border-emerald-200' : 
                        blog.status === 'Scheduled' ? 'bg-blue-50 text-blue-700 border border-blue-200' : 
                        'bg-gray-100 text-gray-600 border border-gray-200'}
                    `}>
                      {blog.status}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-1.5 text-gray-500 text-sm">
                      <Eye className="w-4 h-4" />
                      {blog.views || 0}
                    </div>
                  </td>
                  <td className="px-6 py-4 text-right">
                    <div className="flex items-center justify-end gap-2">
                      <a href={`/blog/${blog.slug}`} target="_blank" rel="noopener noreferrer" className="p-2 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition" title="View Live">
                        <Globe className="w-4 h-4" />
                      </a>
                      <Link href={`/admin/blogs/${blog._id}/edit`} className="p-2 text-gray-400 hover:text-primary hover:bg-primary/10 rounded-lg transition" title="Edit Blog">
                        <Pencil className="w-4 h-4" />
                      </Link>
                      <button 
                        onClick={() => handleDelete(blog._id)}
                        disabled={deletingId === blog._id}
                        className="p-2 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition disabled:opacity-50"
                        title="Delete"
                      >
                        {deletingId === blog._id ? <Loader2 className="w-4 h-4 animate-spin" /> : <Trash2 className="w-4 h-4" />}
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
              {blogs.length === 0 && (
                <tr>
                  <td colSpan="5" className="px-6 py-12 text-center text-gray-500">
                    <div className="flex flex-col items-center">
                      <FileText className="w-12 h-12 text-gray-300 mb-3" />
                      <p className="font-medium text-gray-900">No blogs found</p>
                      <p className="text-sm mt-1">Create your first blog post to start driving traffic.</p>
                      <Link href="/admin/blogs/create" className="mt-4 px-4 py-2 bg-primary text-white text-sm font-bold rounded-lg shadow-sm hover:bg-primary-dark transition">
                        Write Blog
                      </Link>
                    </div>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
