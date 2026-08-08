"use client";

import { useState, useEffect } from "react";
import { Loader2, Plus, Trash2, ArrowLeft } from "lucide-react";
import Link from "next/link";

export default function BlogCategoriesPage() {
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [newCategory, setNewCategory] = useState("");
  const [adding, setAdding] = useState(false);

  const fetchCategories = async () => {
    try {
      const res = await fetch("/api/categories");
      if (res.ok) {
        const data = await res.json();
        setCategories(data);
      }
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    // Initial fetch, and fallback init
    fetch("/api/admin/blog-categories/init", { method: 'POST' }).then(() => fetchCategories());
  }, []);

  const handleAdd = async (e) => {
    e.preventDefault();
    if (!newCategory.trim()) return;
    setAdding(true);
    try {
      const slug = newCategory.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)+/g, '');
      const res = await fetch("/api/categories", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name: newCategory, slug })
      });
      if (res.ok) {
        setNewCategory("");
        fetchCategories();
      }
    } finally {
      setAdding(false);
    }
  };

  return (
    <div className="space-y-6 max-w-4xl mx-auto">
      <div className="flex items-center gap-3">
        <Link href="/admin/blogs" className="p-2 bg-white rounded-lg border hover:bg-gray-50 text-gray-500">
          <ArrowLeft className="w-5 h-5" />
        </Link>
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Blog Categories</h1>
          <p className="text-sm text-gray-500">Manage categories for your healthcare blogs.</p>
        </div>
      </div>

      <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm">
        <form onSubmit={handleAdd} className="flex gap-3 mb-6">
          <input
            type="text"
            value={newCategory}
            onChange={e => setNewCategory(e.target.value)}
            placeholder="New category name..."
            className="flex-1 px-4 py-2 border rounded-xl outline-none focus:border-primary"
          />
          <button
            type="submit"
            disabled={adding || !newCategory.trim()}
            className="flex items-center gap-2 px-6 py-2 bg-primary text-white font-bold rounded-xl hover:bg-primary-dark transition disabled:opacity-50"
          >
            {adding ? <Loader2 className="w-4 h-4 animate-spin" /> : <Plus className="w-4 h-4" />}
            Add
          </button>
        </form>

        {loading ? (
          <div className="flex justify-center py-10"><Loader2 className="w-6 h-6 animate-spin text-primary" /></div>
        ) : (
          <ul className="divide-y divide-gray-100 border rounded-xl overflow-hidden">
            {categories.map(cat => (
              <li key={cat._id} className="flex items-center justify-between p-4 bg-gray-50 hover:bg-gray-100 transition">
                <div>
                  <p className="font-bold text-gray-900">{cat.name}</p>
                  <p className="text-xs text-gray-500 font-mono">/{cat.slug}</p>
                </div>
              </li>
            ))}
            {categories.length === 0 && (
              <li className="p-4 text-center text-gray-500 text-sm">No categories found.</li>
            )}
          </ul>
        )}
      </div>
    </div>
  );
}
