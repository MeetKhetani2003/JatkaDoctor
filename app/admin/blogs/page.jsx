"use client";

import { useState, useEffect, useRef } from "react";
import { Plus, Trash2, Loader2, Image as ImageIcon, User, Calendar, Clock, Tag, ChevronUp, ChevronDown, Pencil, X } from "lucide-react";
import Image from "next/image";

export default function AdminBlogsPage() {
  const [blogs, setBlogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  
  const [showForm, setShowForm] = useState(false);
  const [editingBlogId, setEditingBlogId] = useState(null);
  const [canvasSections, setCanvasSections] = useState([]);
  const [existingImageUrl, setExistingImageUrl] = useState("");
  const [existingAvatarUrl, setExistingAvatarUrl] = useState("");
  
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

  // Canvas Editor Handlers
  const handleAddSection = () => {
    setCanvasSections(prev => [...prev, { heading: "", text: "" }]);
  };

  const handleRemoveSection = (index) => {
    setCanvasSections(prev => prev.filter((_, i) => i !== index));
  };

  const handleSectionChange = (index, field, value) => {
    setCanvasSections(prev => prev.map((sec, i) => i === index ? { ...sec, [field]: value } : sec));
  };

  const handleMoveSection = (index, direction) => {
    if (direction === "up" && index === 0) return;
    if (direction === "down" && index === canvasSections.length - 1) return;
    
    const targetIndex = direction === "up" ? index - 1 : index + 1;
    setCanvasSections(prev => {
      const newSections = [...prev];
      const temp = newSections[index];
      newSections[index] = newSections[targetIndex];
      newSections[targetIndex] = temp;
      return newSections;
    });
  };

  const toggleForm = () => {
    if (showForm) {
      // Reset all states when closing form
      setEditingBlogId(null);
      setFormData({
        title: "",
        category: "Emergency",
        date: "",
        readTime: "",
        author: "",
        image: null,
        authorAvatar: null,
      });
      setCanvasSections([]);
      setExistingImageUrl("");
      setExistingAvatarUrl("");
      if (fileInputRef.current) fileInputRef.current.value = "";
      if (avatarInputRef.current) avatarInputRef.current.value = "";
    }
    setShowForm(!showForm);
  };

  const handleEdit = (blog) => {
    setEditingBlogId(blog._id);
    setFormData({
      title: blog.title,
      category: blog.category,
      date: blog.date,
      readTime: blog.readTime,
      author: blog.author,
      image: null,
      authorAvatar: null,
    });
    setExistingImageUrl(blog.image);
    setExistingAvatarUrl(blog.authorAvatar);
    
    // Parse content
    let sections = [];
    if (blog.content) {
      try {
        if (blog.content.trim().startsWith('[')) {
          sections = JSON.parse(blog.content);
        } else {
          sections = [{ heading: "", text: blog.content }];
        }
      } catch (e) {
        sections = [{ heading: "", text: blog.content }];
      }
    }
    setCanvasSections(sections);
    
    setShowForm(true);
    window.scrollTo({ top: 0, behavior: "smooth" });
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
    data.append("content", JSON.stringify(canvasSections));
    
    if (formData.image) data.append("image", formData.image);
    if (formData.authorAvatar) data.append("authorAvatar", formData.authorAvatar);

    try {
      const url = editingBlogId ? `/api/blogs/${editingBlogId}` : "/api/blogs";
      const method = editingBlogId ? "PUT" : "POST";
      
      const res = await fetch(url, {
        method,
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
        setCanvasSections([]);
        setEditingBlogId(null);
        setExistingImageUrl("");
        setExistingAvatarUrl("");
        if (fileInputRef.current) fileInputRef.current.value = "";
        if (avatarInputRef.current) avatarInputRef.current.value = "";
        setShowForm(false);
        fetchBlogs();
      } else {
        console.error("Failed to submit blog");
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
    <div className="max-w-6xl mx-auto space-y-8 pb-12">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Health Insights</h1>
          <p className="text-gray-500 mt-1">Manage your blog articles and health tips.</p>
        </div>
        <button
          onClick={toggleForm}
          className="flex items-center gap-2 bg-primary text-white px-4 py-2 rounded-xl hover:bg-primary-dark transition-colors font-medium"
        >
          {showForm ? <X className="w-5 h-5" /> : <Plus className="w-5 h-5" />}
          {showForm ? "Cancel" : "Add New Blog"}
        </button>
      </div>

      {showForm && (
        <form onSubmit={handleSubmit} className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm space-y-6">
          <h2 className="text-lg font-bold text-gray-800 border-b border-gray-100 pb-3">
            {editingBlogId ? "Edit Blog Article" : "Create New Blog Article"}
          </h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-1">Title</label>
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
              <label className="block text-sm font-semibold text-gray-700 mb-1">Category</label>
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
              <label className="block text-sm font-semibold text-gray-700 mb-1">Date</label>
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
              <label className="block text-sm font-semibold text-gray-700 mb-1">Read Time</label>
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
              <label className="block text-sm font-semibold text-gray-700 mb-1">Author Name</label>
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
              <label className="block text-sm font-semibold text-gray-700 mb-1">
                Author Avatar {editingBlogId && <span className="text-xs font-normal text-gray-400">(Optional if unchanged)</span>}
              </label>
              <div className="flex items-center gap-3">
                {editingBlogId && existingAvatarUrl && !formData.authorAvatar && (
                  <div className="relative w-10 h-10 rounded-full overflow-hidden border border-gray-200 flex-shrink-0">
                    <Image src={existingAvatarUrl} alt="Author avatar" fill className="object-cover" />
                  </div>
                )}
                <input
                  type="file"
                  accept="image/*"
                  required={!editingBlogId}
                  ref={avatarInputRef}
                  onChange={(e) => handleFileChange(e, "authorAvatar")}
                  className="w-full px-4 py-1.5 border border-gray-200 rounded-xl focus:outline-none focus:border-primary file:mr-4 file:py-1 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-primary/10 file:text-primary hover:file:bg-primary/20"
                />
              </div>
            </div>
            
            <div className="md:col-span-2">
              <label className="block text-sm font-semibold text-gray-700 mb-1">
                Cover Image {editingBlogId && <span className="text-xs font-normal text-gray-400">(Optional if unchanged)</span>}
              </label>
              <div className="space-y-2">
                {editingBlogId && existingImageUrl && !formData.image && (
                  <div className="relative w-40 h-24 rounded-xl overflow-hidden border border-gray-200">
                    <Image src={existingImageUrl} alt="Blog cover" fill className="object-cover" />
                  </div>
                )}
                <input
                  type="file"
                  accept="image/*"
                  required={!editingBlogId}
                  ref={fileInputRef}
                  onChange={(e) => handleFileChange(e, "image")}
                  className="w-full px-4 py-2 border border-gray-200 rounded-xl focus:outline-none focus:border-primary file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-primary/10 file:text-primary hover:file:bg-primary/20"
                />
              </div>
            </div>

            {/* Blog Content Canvas */}
            <div className="md:col-span-2 border-t border-gray-150 pt-6">
              <div className="flex items-center justify-between mb-4">
                <div>
                  <h3 className="text-base font-bold text-gray-800">Blog Content Canvas</h3>
                  <p className="text-xs text-gray-500 mt-0.5">Build structured articles with heading sections and detailed paragraphs.</p>
                </div>
                <button
                  type="button"
                  onClick={handleAddSection}
                  className="flex items-center gap-1.5 bg-emerald-50 text-emerald-600 hover:bg-emerald-100 px-4 py-2 rounded-xl text-xs font-bold transition-all shadow-sm"
                >
                  <Plus className="w-4 h-4" />
                  Add Content Block
                </button>
              </div>

              {canvasSections.length === 0 ? (
                <div className="text-center py-10 border-2 border-dashed border-gray-200 rounded-2xl bg-gray-50/50">
                  <ImageIcon className="w-8 h-8 text-gray-300 mx-auto mb-2" />
                  <p className="text-sm text-gray-500 font-medium">No content sections added yet.</p>
                  <p className="text-xs text-gray-400 mt-1">Click "Add Content Block" to add headings and paragraphs to your article.</p>
                </div>
              ) : (
                <div className="space-y-4">
                  {canvasSections.map((section, index) => (
                    <div key={index} className="bg-gray-50/50 border border-gray-200 rounded-2xl p-4 relative group/section hover:border-primary/30 hover:bg-gray-50 transition-all">
                      <div className="flex items-center justify-between mb-3 border-b border-gray-100 pb-2">
                        <span className="text-xs font-bold text-gray-400 uppercase tracking-wider">Block #{index + 1}</span>
                        <div className="flex items-center gap-1">
                          <button
                            type="button"
                            disabled={index === 0}
                            onClick={() => handleMoveSection(index, "up")}
                            className="p-1.5 rounded-lg text-gray-400 hover:text-gray-700 hover:bg-gray-200 disabled:opacity-30 disabled:pointer-events-none transition-colors"
                          >
                            <ChevronUp className="w-4 h-4" />
                          </button>
                          <button
                            type="button"
                            disabled={index === canvasSections.length - 1}
                            onClick={() => handleMoveSection(index, "down")}
                            className="p-1.5 rounded-lg text-gray-400 hover:text-gray-700 hover:bg-gray-200 disabled:opacity-30 disabled:pointer-events-none transition-colors"
                          >
                            <ChevronDown className="w-4 h-4" />
                          </button>
                          <button
                            type="button"
                            onClick={() => handleRemoveSection(index)}
                            className="p-1.5 rounded-lg text-red-500 hover:bg-red-50 transition-colors"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </div>

                      <div className="space-y-3">
                        <div>
                          <label className="block text-xs font-semibold text-gray-500 mb-1 uppercase tracking-wider">Heading (Optional)</label>
                          <input
                            type="text"
                            value={section.heading || ""}
                            onChange={(e) => handleSectionChange(index, "heading", e.target.value)}
                            placeholder="e.g., Recognizing Warning Signs"
                            className="w-full px-4 py-2 bg-white border border-gray-200 rounded-xl focus:outline-none focus:border-primary text-sm font-semibold text-gray-800"
                          />
                        </div>
                        <div>
                          <label className="block text-xs font-semibold text-gray-500 mb-1 uppercase tracking-wider">Paragraph Content</label>
                          <textarea
                            value={section.text || ""}
                            onChange={(e) => handleSectionChange(index, "text", e.target.value)}
                            placeholder="Write your article section context and insights here..."
                            rows={4}
                            required
                            className="w-full px-4 py-2 bg-white border border-gray-200 rounded-xl focus:outline-none focus:border-primary text-sm text-gray-600 leading-relaxed resize-y"
                          />
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
          
          <div className="pt-4 border-t border-gray-100 flex justify-end gap-3">
            <button
              type="button"
              onClick={toggleForm}
              className="bg-gray-150 hover:bg-gray-200 text-gray-700 px-6 py-2 rounded-xl text-sm font-medium transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={submitting}
              className="flex items-center gap-2 bg-primary text-white px-6 py-2 rounded-xl hover:bg-primary-dark transition-colors font-medium disabled:opacity-50"
            >
              {submitting ? <Loader2 className="w-5 h-5 animate-spin" /> : editingBlogId ? <Pencil className="w-5 h-5" /> : <Plus className="w-5 h-5" />}
              {editingBlogId ? "Update Blog" : "Publish Blog"}
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
            <div key={blog._id} className="bg-white rounded-2xl border border-gray-100 overflow-hidden shadow-sm flex flex-col justify-between group hover:shadow-md transition-shadow">
              <div>
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
                </div>
              </div>
              
              <div className="px-5 pb-5 pt-2 flex gap-3">
                <button
                  onClick={() => handleEdit(blog)}
                  className="flex-1 flex items-center justify-center gap-2 py-2.5 text-sm text-emerald-600 bg-emerald-50 hover:bg-emerald-100 rounded-xl transition-colors font-medium"
                >
                  <Pencil className="w-4 h-4" />
                  Edit
                </button>
                <button
                  onClick={() => handleDelete(blog._id)}
                  className="flex-1 flex items-center justify-center gap-2 py-2.5 text-sm text-red-500 bg-red-50 hover:bg-red-100 rounded-xl transition-colors font-medium"
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
