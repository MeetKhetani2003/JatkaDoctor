"use client";

import { useState, useEffect, useRef } from "react";
import { Plus, Trash2, Loader2, Image as ImageIcon, User, Calendar, Clock, Tag } from "lucide-react";
import Image from "next/image";

export default function AdminBlogsPage() {
  const [blogs, setBlogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  
  const [showForm, setShowForm] = useState(false);
  
  const fileInputRef = useRef(null);
  const avatarInputRef = useRef(null);

  const [formData, setFormData] = useState({
    title: "",
    category: "Emergency",
    date: "",
    readTime: "",
    author: "",
    image: null,
    authorAvatar: null,
  });

  const fetchBlogs = async () => {
    try {
      const res = await fetch("/api/blogs");
      if (res.ok) {
        const data = await res.json();
        setBlogs(data);
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

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleFileChange = (e, field) => {
    if (e.target.files && e.target.files[0]) {
      setFormData(prev => ({ ...prev, [field]: e.target.files[0] }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);

    const data = new FormData();
    data.append("title", formData.title);
    data.append("category", formData.category);
    data.append("date", formData.date);
    data.append("readTime", formData.readTime);
    data.append("author", formData.author);
    if (formData.image) data.append("image", formData.image);
    if (formData.authorAvatar) data.append("authorAvatar", formData.authorAvatar);

    try {
      const res = await fetch("/api/blogs", {
        method: "POST",
        body: data,
      });

      if (res.ok) {
        setFormData({
          title: "",
          category: "Emergency",
          date: "",
          readTime: "",
          author: "",
          image: null,
          authorAvatar: null,
        });
        if (fileInputRef.current) fileInputRef.current.value = "";
        if (avatarInputRef.current) avatarInputRef.current.value = "";
        setShowForm(false);
        fetchBlogs();
      } else {
        console.error("Failed to add blog");
      }
    } catch (error) {
      console.error("Error submitting blog:", error);
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = async (id) => {
    if (!confirm("Are you sure you want to delete this blog?")) return;
    
    try {
      const res = await fetch(`/api/blogs/${id}`, {
        method: "DELETE",
      });
      
      if (res.ok) {
        fetchBlogs();
      }
    } catch (error) {
      console.error("Error deleting blog:", error);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto space-y-8">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Health Insights</h1>
          <p className="text-gray-500 mt-1">Manage your blog articles and health tips.</p>
        </div>
        <button
          onClick={() => setShowForm(!showForm)}
          className="flex items-center gap-2 bg-primary text-white px-4 py-2 rounded-xl hover:bg-primary-dark transition-colors"
        >
          <Plus className="w-5 h-5" />
          {showForm ? "Cancel" : "Add New Blog"}
        </button>
      </div>

      {showForm && (
        <form onSubmit={handleSubmit} className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Title</label>
              <input
                type="text"
                name="title"
                required
                value={formData.title}
                onChange={handleInputChange}
                className="w-full px-4 py-2 border border-gray-200 rounded-xl focus:outline-none focus:border-primary"
                placeholder="e.g. When to Call an Ambulance"
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Category</label>
              <select
                name="category"
                required
                value={formData.category}
                onChange={handleInputChange}
                className="w-full px-4 py-2 border border-gray-200 rounded-xl focus:outline-none focus:border-primary bg-white"
              >
                <option value="Emergency">Emergency</option>
                <option value="Guide">Guide</option>
                <option value="Healthcare">Healthcare</option>
                <option value="Tips">Tips</option>
              </select>
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Date</label>
              <div className="relative">
                <Calendar className="absolute left-3 top-2.5 w-5 h-5 text-gray-400" />
                <input
                  type="text"
                  name="date"
                  required
                  value={formData.date}
                  onChange={handleInputChange}
                  className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-xl focus:outline-none focus:border-primary"
                  placeholder="e.g. Sep 2025"
                />
              </div>
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Read Time</label>
              <div className="relative">
                <Clock className="absolute left-3 top-2.5 w-5 h-5 text-gray-400" />
                <input
                  type="text"
                  name="readTime"
                  required
                  value={formData.readTime}
                  onChange={handleInputChange}
                  className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-xl focus:outline-none focus:border-primary"
                  placeholder="e.g. 5 min read"
                />
              </div>
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Author Name</label>
              <div className="relative">
                <User className="absolute left-3 top-2.5 w-5 h-5 text-gray-400" />
                <input
                  type="text"
                  name="author"
                  required
                  value={formData.author}
                  onChange={handleInputChange}
                  className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-xl focus:outline-none focus:border-primary"
                  placeholder="e.g. Dr. Sarah Johnson"
                />
              </div>
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Author Avatar</label>
              <input
                type="file"
                accept="image/*"
                required
                ref={avatarInputRef}
                onChange={(e) => handleFileChange(e, "authorAvatar")}
                className="w-full px-4 py-1.5 border border-gray-200 rounded-xl focus:outline-none focus:border-primary file:mr-4 file:py-1 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-primary/10 file:text-primary hover:file:bg-primary/20"
              />
            </div>
            
            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-1">Cover Image</label>
              <input
                type="file"
                accept="image/*"
                required
                ref={fileInputRef}
                onChange={(e) => handleFileChange(e, "image")}
                className="w-full px-4 py-2 border border-gray-200 rounded-xl focus:outline-none focus:border-primary file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-primary/10 file:text-primary hover:file:bg-primary/20"
              />
            </div>
          </div>
          
          <div className="pt-4 flex justify-end">
            <button
              type="submit"
              disabled={submitting}
              className="flex items-center gap-2 bg-primary text-white px-6 py-2 rounded-xl hover:bg-primary-dark transition-colors disabled:opacity-50"
            >
              {submitting ? <Loader2 className="w-5 h-5 animate-spin" /> : <Plus className="w-5 h-5" />}
              Publish Blog
            </button>
          </div>
        </form>
      )}

      {blogs.length === 0 ? (
        <div className="text-center py-12 bg-white rounded-2xl border border-gray-100">
          <div className="w-16 h-16 bg-gray-50 rounded-full flex items-center justify-center mx-auto mb-4">
            <ImageIcon className="w-8 h-8 text-gray-400" />
          </div>
          <h3 className="text-lg font-medium text-gray-900">No blogs yet</h3>
          <p className="text-gray-500 mt-1">Add your first insight blog to get started.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {blogs.map((blog) => (
            <div key={blog._id} className="bg-white rounded-2xl border border-gray-100 overflow-hidden shadow-sm group">
              <div className="relative h-48 w-full bg-gray-100">
                <Image
                  src={blog.image}
                  alt={blog.title}
                  fill
                  className="object-cover"
                />
                <div className="absolute top-3 left-3 bg-white/90 backdrop-blur-sm px-2 py-1 rounded-md text-xs font-bold uppercase text-gray-700">
                  {blog.category}
                </div>
              </div>
              <div className="p-5">
                <h3 className="text-lg font-bold text-gray-900 mb-2 line-clamp-2">{blog.title}</h3>
                
                <div className="flex items-center gap-2 mb-4">
                  <div className="relative w-6 h-6 rounded-full overflow-hidden">
                    <Image src={blog.authorAvatar} alt={blog.author} fill className="object-cover" />
                  </div>
                  <span className="text-sm text-gray-600">{blog.author}</span>
                </div>
                
                <div className="flex items-center justify-between text-xs text-gray-500 pt-4 border-t border-gray-50">
                  <span className="flex items-center gap-1"><Calendar className="w-3 h-3" /> {blog.date}</span>
                  <span className="flex items-center gap-1"><Clock className="w-3 h-3" /> {blog.readTime}</span>
                </div>
                
                <button
                  onClick={() => handleDelete(blog._id)}
                  className="w-full mt-4 flex items-center justify-center gap-2 py-2 text-sm text-red-500 bg-red-50 hover:bg-red-100 rounded-xl transition-colors"
                >
                  <Trash2 className="w-4 h-4" />
                  Delete
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
