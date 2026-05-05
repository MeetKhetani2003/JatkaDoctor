"use client";
import React, { useState, useEffect } from 'react';
import { Plus, Trash2, Edit2, Loader2, Tags, X, Check } from 'lucide-react';

export default function AdminCategories() {
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [editingCategory, setEditingCategory] = useState(null);
  const [formData, setFormData] = useState({ name: '', description: '' });

  const fetchData = async () => {
    try {
      const res = await fetch('/api/categories');
      const data = await res.json();
      setCategories(Array.isArray(data) ? data : []);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      const slug = formData.name.toLowerCase().replace(/ /g, '-').replace(/[^\w-]+/g, '');
      const url = editingCategory ? `/api/categories/${editingCategory._id}` : '/api/categories';
      const method = editingCategory ? 'PUT' : 'POST';

      const res = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...formData, slug })
      });
      if (res.ok) {
        setShowModal(false);
        setEditingCategory(null);
        fetchData();
        setFormData({ name: '', description: '' });
      }
    } catch (e) {
      alert("Error saving category");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleEdit = (cat) => {
    setEditingCategory(cat);
    setFormData({ name: cat.name, description: cat.description || '' });
    setShowModal(true);
  };

  const handleDelete = async (id) => {
    if (!confirm("Are you sure you want to delete this category?")) return;
    try {
      const res = await fetch(`/api/categories/${id}`, { method: 'DELETE' });
      if (res.ok) fetchData();
    } catch (e) {
      alert("Error deleting category");
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h3 className="text-sm font-normal text-gray-500 uppercase tracking-widest flex items-center gap-2">
          <Tags className="w-4 h-4" /> Category List
        </h3>
        <button 
          onClick={() => {
            setEditingCategory(null);
            setFormData({ name: '', description: '' });
            setShowModal(true);
          }}
          className="bg-primary text-white px-5 py-2.5 rounded-xl text-sm font-normal flex items-center gap-2 hover:bg-primary-dark transition shadow-lg shadow-primary/20"
        >
          <Plus className="w-4 h-4" /> New Category
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {loading ? (
          <div className="col-span-full flex justify-center py-20">
            <Loader2 className="w-10 h-10 animate-spin text-primary" />
          </div>
        ) : categories.length === 0 ? (
          <div className="col-span-full bg-white rounded-3xl p-20 text-center border border-gray-100">
            <p className="text-gray-400 text-sm font-normal">No categories defined yet.</p>
          </div>
        ) : (
          categories.map((cat) => (
            <div key={cat._id} className="bg-white rounded-3xl border border-gray-100 p-6 shadow-sm flex flex-col justify-between group hover:shadow-md transition-all">
              <div>
                <h4 className="text-lg font-normal text-black tracking-tight mb-2">{cat.name}</h4>
                <p className="text-gray-500 text-xs font-normal leading-relaxed line-clamp-2">{cat.description || 'No description provided.'}</p>
                <code className="text-[10px] bg-gray-50 text-gray-400 px-2 py-1 rounded mt-4 inline-block">slug: {cat.slug}</code>
              </div>
              <div className="mt-6 flex justify-end gap-2 border-t border-gray-50 pt-4 opacity-0 group-hover:opacity-100 transition-opacity">
                <button 
                  onClick={() => handleEdit(cat)}
                  className="p-2 text-gray-400 hover:text-primary hover:bg-primary-light rounded-lg"
                >
                  <Edit2 className="w-4 h-4" />
                </button>
                <button 
                  onClick={() => handleDelete(cat._id)}
                  className="p-2 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-lg"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>
          ))
        )}
      </div>

      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
          <div className="bg-white rounded-[32px] w-full max-w-lg overflow-hidden shadow-2xl animate-in zoom-in-95 duration-200">
            <div className="px-8 py-6 bg-primary text-white flex justify-between items-center">
              <h3 className="text-xl font-normal tracking-tight">{editingCategory ? 'Edit Category' : 'Create Category'}</h3>
              <button onClick={() => setShowModal(false)} className="p-2 hover:bg-white/20 rounded-full transition-colors">
                <X className="w-5 h-5" />
              </button>
            </div>
            <form onSubmit={handleSubmit} className="p-8 space-y-5">
              <div className="space-y-1.5">
                <label className="text-xs font-normal text-gray-400 uppercase tracking-wider ml-1">Category Name</label>
                <input 
                  required
                  value={formData.name}
                  onChange={(e) => setFormData({...formData, name: e.target.value})}
                  type="text" 
                  placeholder="e.g. Doctors, Nursing, ICU"
                  className="w-full px-4 py-3 bg-gray-50 border border-gray-100 rounded-2xl text-sm focus:outline-none focus:ring-2 focus:ring-primary/20"
                />
              </div>
              <div className="space-y-1.5">
                <label className="text-xs font-normal text-gray-400 uppercase tracking-wider ml-1">Description</label>
                <textarea 
                  value={formData.description}
                  onChange={(e) => setFormData({...formData, description: e.target.value})}
                  rows="3"
                  className="w-full px-4 py-3 bg-gray-50 border border-gray-100 rounded-2xl text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 resize-none"
                  placeholder="Briefly describe this category..."
                ></textarea>
              </div>
              <div className="pt-4 flex gap-3">
                <button 
                  type="button"
                  onClick={() => setShowModal(false)}
                  className="flex-1 px-6 py-4 bg-gray-100 text-gray-600 rounded-2xl text-sm font-normal hover:bg-gray-200 transition"
                >
                  Cancel
                </button>
                <button 
                  disabled={isSubmitting}
                  type="submit"
                  className="flex-1 px-6 py-4 bg-primary text-white rounded-2xl text-sm font-normal hover:bg-primary-dark transition shadow-lg shadow-primary/20 flex items-center justify-center gap-2"
                >
                  {isSubmitting ? <Loader2 className="w-4 h-4 animate-spin" /> : <Check className="w-4 h-4" />}
                  {editingCategory ? 'Update Category' : 'Create Category'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
