"use client";

import { useState, useRef, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Save, Image as ImageIcon, Plus, Trash2, ArrowLeft, Loader2, Bold, Heading1, Heading2, Heading3, List, ListOrdered, Highlighter, Link as LinkIcon } from "lucide-react";
import Link from "next/link";
import Image from "next/image";

export default function BlogForm({ initialData = null, isEdit = false }) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [categories, setCategories] = useState([]);
  const [authors, setAuthors] = useState([]);
  const editorRef = useRef(null);

  const [formData, setFormData] = useState({
    title: initialData?.title || "",
    slug: initialData?.slug || "",
    category: initialData?.category || "",
    status: initialData?.status || "Draft",
    publishDate: initialData?.publishDate ? new Date(initialData.publishDate).toISOString().split('T')[0] : "",
    author: initialData?.author?._id || "",
    content: initialData?.content || "",
    image: null,
    imageAlt: initialData?.imageAlt || "",
    imageTitle: initialData?.imageTitle || "",
    imageCaption: initialData?.imageCaption || "",
    metaTitle: initialData?.metaTitle || "",
    metaDescription: initialData?.metaDescription || "",
    focusKeyword: initialData?.focusKeyword || "",
    secondaryKeywords: initialData?.secondaryKeywords || "",
    canonicalUrl: initialData?.canonicalUrl || "",
    faqs: initialData?.faqs || []
  });

  const [existingImage, setExistingImage] = useState(
    initialData?.image || (initialData?.imageFileId ? `/api/images/${initialData.imageFileId}` : "")
  );

  useEffect(() => {
    fetch("/api/categories").then(r => r.json()).then(data => setCategories(data));
    fetch("/api/admin/blog-authors").then(r => r.json()).then(data => setAuthors(data));
    
    // Fallback initialize categories if none
    fetch("/api/admin/blog-categories/init", { method: 'POST' });
  }, []);

  // Auto-generate slug from title if slug is empty
  useEffect(() => {
    if (!isEdit && formData.title && !formData.slug) {
      setFormData(prev => ({
        ...prev,
        slug: formData.title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)+/g, '')
      }));
    }
  }, [formData.title, isEdit, formData.slug]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleImageChange = (e) => {
    if (e.target.files && e.target.files[0]) {
      setFormData(prev => ({ ...prev, image: e.target.files[0] }));
      setExistingImage(URL.createObjectURL(e.target.files[0]));
    }
  };

  const execCmd = (command, value = null) => {
    document.execCommand(command, false, value);
    if (editorRef.current) {
      editorRef.current.focus();
    }
  };

  const handleEditorInput = () => {
    if (editorRef.current) {
      setFormData(prev => ({ ...prev, content: editorRef.current.innerHTML }));
    }
  };

  useEffect(() => {
    if (editorRef.current && initialData?.content) {
      editorRef.current.innerHTML = initialData.content;
    }
  }, [initialData]);

  const handleAddFaq = () => {
    setFormData(prev => ({
      ...prev,
      faqs: [...prev.faqs, { question: "", answer: "" }]
    }));
  };

  const handleFaqChange = (index, field, value) => {
    setFormData(prev => {
      const newFaqs = [...prev.faqs];
      newFaqs[index][field] = value;
      return { ...prev, faqs: newFaqs };
    });
  };

  const handleRemoveFaq = (index) => {
    setFormData(prev => ({
      ...prev,
      faqs: prev.faqs.filter((_, i) => i !== index)
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const data = new FormData();
      Object.keys(formData).forEach(key => {
        if (key === 'faqs') {
          data.append(key, JSON.stringify(formData[key]));
        } else if (formData[key] !== null && formData[key] !== undefined) {
          data.append(key, formData[key]);
        }
      });

      const url = isEdit ? `/api/admin/blogs/${initialData._id}` : "/api/admin/blogs";
      const method = isEdit ? "PUT" : "POST";

      const res = await fetch(url, {
        method,
        body: data,
      });

      const result = await res.json();
      if (res.ok) {
        // Trigger sitemap update silently
        fetch("/api/sitemap/blogs");
        router.push("/admin/blogs");
      } else {
        alert(result.error || "Failed to save blog");
      }
    } catch (error) {
      alert("Error saving blog");
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-8 pb-20">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <Link href="/admin/blogs" className="p-2 bg-white rounded-lg border hover:bg-gray-50 text-gray-500">
            <ArrowLeft className="w-5 h-5" />
          </Link>
          <h1 className="text-2xl font-bold text-gray-900">{isEdit ? "Edit Blog Post" : "Create New Blog"}</h1>
        </div>
        <button
          type="submit"
          disabled={loading}
          className="flex items-center gap-2 px-6 py-2.5 bg-primary text-white font-bold rounded-xl hover:bg-primary-dark transition shadow-md disabled:opacity-50"
        >
          {loading ? <Loader2 className="w-5 h-5 animate-spin" /> : <Save className="w-5 h-5" />}
          {isEdit ? "Update Blog" : "Save & Publish"}
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Main Content Column */}
        <div className="lg:col-span-2 space-y-6">
          {/* Basic Details */}
          <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm space-y-4">
            <h2 className="text-lg font-bold text-gray-900">General Information</h2>
            <div>
              <label className="block text-xs font-bold text-gray-700 mb-1">Blog Title *</label>
              <input
                type="text"
                name="title"
                required
                value={formData.title}
                onChange={handleChange}
                className="w-full px-4 py-2 border rounded-xl outline-none focus:border-primary focus:ring-1 focus:ring-primary"
                placeholder="Enter blog title"
              />
            </div>
            <div>
              <label className="block text-xs font-bold text-gray-700 mb-1">URL Slug *</label>
              <input
                type="text"
                name="slug"
                required
                value={formData.slug}
                onChange={handleChange}
                className="w-full px-4 py-2 border rounded-xl outline-none focus:border-primary focus:ring-1 focus:ring-primary font-mono text-sm"
                placeholder="e.g. home-physiotherapy-lucknow"
              />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold text-gray-700 mb-1">Category *</label>
                <select
                  name="category"
                  required
                  value={formData.category}
                  onChange={handleChange}
                  className="w-full px-4 py-2 border rounded-xl outline-none focus:border-primary focus:ring-1 focus:ring-primary"
                >
                  <option value="">Select Category</option>
                  {categories.map(c => (
                    <option key={c._id} value={c.name}>{c.name}</option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-xs font-bold text-gray-700 mb-1">Author</label>
                <select
                  name="author"
                  value={formData.author}
                  onChange={handleChange}
                  className="w-full px-4 py-2 border rounded-xl outline-none focus:border-primary focus:ring-1 focus:ring-primary"
                >
                  <option value="">Select Author</option>
                  {authors.map(a => (
                    <option key={a._id} value={a._id}>{a.name}</option>
                  ))}
                </select>
              </div>
            </div>
          </div>

          {/* Advanced Rich Text Editor */}
          <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden flex flex-col">
            <div className="px-6 py-4 border-b border-gray-100 flex items-center justify-between bg-gray-50/50">
              <h2 className="text-lg font-bold text-gray-900">Blog Content</h2>
            </div>
            
            {/* Toolbar */}
            <div className="px-4 py-2 border-b border-gray-200 bg-white flex flex-wrap gap-2 sticky top-0 z-10">
              <button type="button" onClick={() => execCmd('formatBlock', 'H1')} className="p-2 hover:bg-gray-100 rounded text-gray-700" title="Heading 1"><Heading1 className="w-4 h-4" /></button>
              <button type="button" onClick={() => execCmd('formatBlock', 'H2')} className="p-2 hover:bg-gray-100 rounded text-gray-700" title="Heading 2"><Heading2 className="w-4 h-4" /></button>
              <button type="button" onClick={() => execCmd('formatBlock', 'H3')} className="p-2 hover:bg-gray-100 rounded text-gray-700" title="Heading 3"><Heading3 className="w-4 h-4" /></button>
              <div className="w-px h-6 bg-gray-300 mx-1 self-center"></div>
              <button type="button" onClick={() => execCmd('bold')} className="p-2 hover:bg-gray-100 rounded text-gray-700" title="Bold"><Bold className="w-4 h-4" /></button>
              <button type="button" onClick={() => execCmd('hiliteColor', '#ffff00')} className="p-2 hover:bg-gray-100 rounded text-gray-700" title="Highlight"><Highlighter className="w-4 h-4" /></button>
              <div className="w-px h-6 bg-gray-300 mx-1 self-center"></div>
              <button type="button" onClick={() => execCmd('insertUnorderedList')} className="p-2 hover:bg-gray-100 rounded text-gray-700" title="Bullet List"><List className="w-4 h-4" /></button>
              <button type="button" onClick={() => execCmd('insertOrderedList')} className="p-2 hover:bg-gray-100 rounded text-gray-700" title="Numbered List"><ListOrdered className="w-4 h-4" /></button>
              <div className="w-px h-6 bg-gray-300 mx-1 self-center"></div>
              <button type="button" onClick={() => {
                const url = prompt("Enter link URL:");
                if (url) execCmd('createLink', url);
              }} className="p-2 hover:bg-gray-100 rounded text-gray-700" title="Insert Link"><LinkIcon className="w-4 h-4" /></button>
              <button type="button" onClick={() => {
                const url = prompt("Enter image URL:");
                if (url) execCmd('insertImage', url);
              }} className="p-2 hover:bg-gray-100 rounded text-gray-700" title="Insert Image"><ImageIcon className="w-4 h-4" /></button>
            </div>

            {/* Editor Area */}
            <div 
              ref={editorRef}
              contentEditable
              onInput={handleEditorInput}
              className="p-6 min-h-[400px] outline-none prose max-w-none text-gray-800"
              style={{ whiteSpace: 'pre-wrap' }}
            />
          </div>

          {/* FAQs */}
          <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm space-y-4">
            <div className="flex items-center justify-between">
              <h2 className="text-lg font-bold text-gray-900">Frequently Asked Questions</h2>
              <button type="button" onClick={handleAddFaq} className="flex items-center gap-1 text-sm text-primary font-bold hover:underline">
                <Plus className="w-4 h-4" /> Add FAQ
              </button>
            </div>
            {formData.faqs.map((faq, index) => (
              <div key={index} className="p-4 border rounded-xl bg-gray-50 relative group">
                <button type="button" onClick={() => handleRemoveFaq(index)} className="absolute top-2 right-2 p-1 text-red-500 opacity-0 group-hover:opacity-100 transition">
                  <Trash2 className="w-4 h-4" />
                </button>
                <div className="space-y-3">
                  <input
                    type="text"
                    value={faq.question}
                    onChange={e => handleFaqChange(index, 'question', e.target.value)}
                    placeholder="Q. Question here?"
                    className="w-full px-3 py-2 bg-white border rounded outline-none font-bold text-sm"
                  />
                  <textarea
                    value={faq.answer}
                    onChange={e => handleFaqChange(index, 'answer', e.target.value)}
                    placeholder="A. Answer here."
                    rows={2}
                    className="w-full px-3 py-2 bg-white border rounded outline-none text-sm resize-none"
                  />
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Sidebar Column */}
        <div className="space-y-6">
          {/* Publishing */}
          <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm space-y-4">
            <h2 className="text-lg font-bold text-gray-900">Publishing</h2>
            <div>
              <label className="block text-xs font-bold text-gray-700 mb-1">Status</label>
              <select
                name="status"
                value={formData.status}
                onChange={handleChange}
                className="w-full px-4 py-2 border rounded-xl outline-none focus:border-primary"
              >
                <option value="Draft">Draft</option>
                <option value="Published">Published</option>
                <option value="Scheduled">Scheduled</option>
              </select>
            </div>
            {formData.status === 'Scheduled' && (
              <div>
                <label className="block text-xs font-bold text-gray-700 mb-1">Publish Date</label>
                <input
                  type="date"
                  name="publishDate"
                  value={formData.publishDate}
                  onChange={handleChange}
                  className="w-full px-4 py-2 border rounded-xl outline-none focus:border-primary"
                />
              </div>
            )}
          </div>

          {/* Featured Image & SEO */}
          <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm space-y-4">
            <h2 className="text-lg font-bold text-gray-900">Featured Image</h2>
            <div className="border-2 border-dashed rounded-xl p-4 text-center">
              {existingImage ? (
                <div className="relative w-full aspect-video rounded-lg overflow-hidden mb-3">
                  <Image src={existingImage} alt="Featured" fill className="object-cover" />
                </div>
              ) : (
                <div className="w-full aspect-video bg-gray-50 rounded-lg flex items-center justify-center mb-3">
                  <ImageIcon className="w-8 h-8 text-gray-300" />
                </div>
              )}
              <input type="file" accept="image/*" onChange={handleImageChange} className="text-xs w-full" />
            </div>
            <div className="space-y-3 mt-4">
              <div>
                <label className="block text-xs font-bold text-gray-700 mb-1">Image Alt Text (SEO) *</label>
                <input type="text" name="imageAlt" value={formData.imageAlt} onChange={handleChange} required className="w-full px-3 py-2 border rounded-lg text-sm outline-none" />
              </div>
              <div>
                <label className="block text-xs font-bold text-gray-700 mb-1">Image Title</label>
                <input type="text" name="imageTitle" value={formData.imageTitle} onChange={handleChange} className="w-full px-3 py-2 border rounded-lg text-sm outline-none" />
              </div>
              <div>
                <label className="block text-xs font-bold text-gray-700 mb-1">Image Caption</label>
                <input type="text" name="imageCaption" value={formData.imageCaption} onChange={handleChange} className="w-full px-3 py-2 border rounded-lg text-sm outline-none" />
              </div>
            </div>
          </div>

          {/* Google SEO Settings */}
          <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm space-y-4">
            <h2 className="text-lg font-bold text-gray-900">Google SEO</h2>
            <div>
              <label className="block text-xs font-bold text-gray-700 mb-1">Meta Title *</label>
              <input type="text" name="metaTitle" required value={formData.metaTitle} onChange={handleChange} className="w-full px-3 py-2 border rounded-lg text-sm outline-none" />
              <p className="text-[10px] text-gray-400 mt-1">{formData.metaTitle.length}/60 characters</p>
            </div>
            <div>
              <label className="block text-xs font-bold text-gray-700 mb-1">Meta Description *</label>
              <textarea name="metaDescription" required value={formData.metaDescription} onChange={handleChange} rows={3} className="w-full px-3 py-2 border rounded-lg text-sm outline-none resize-none" />
              <p className="text-[10px] text-gray-400 mt-1">{formData.metaDescription.length}/160 characters</p>
            </div>
            <div>
              <label className="block text-xs font-bold text-gray-700 mb-1">Focus Keyword *</label>
              <input type="text" name="focusKeyword" required value={formData.focusKeyword} onChange={handleChange} className="w-full px-3 py-2 border rounded-lg text-sm outline-none" />
            </div>
            <div>
              <label className="block text-xs font-bold text-gray-700 mb-1">Secondary Keywords (comma separated)</label>
              <input type="text" name="secondaryKeywords" value={formData.secondaryKeywords} onChange={handleChange} className="w-full px-3 py-2 border rounded-lg text-sm outline-none" />
            </div>
            <div>
              <label className="block text-xs font-bold text-gray-700 mb-1">Canonical URL</label>
              <input type="url" name="canonicalUrl" value={formData.canonicalUrl} onChange={handleChange} placeholder="https://" className="w-full px-3 py-2 border rounded-lg text-sm outline-none" />
            </div>
          </div>
        </div>
      </div>
    </form>
  );
}
