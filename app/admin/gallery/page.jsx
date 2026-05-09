"use client";
import React, { useState, useEffect } from "react";
import { Plus, Trash2, Image as ImageIcon, Video, Loader2 } from "lucide-react";

export default function AdminGallery() {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [type, setType] = useState("photo");
  const [url, setUrl] = useState("");
  const [title, setTitle] = useState("");
  const [file, setFile] = useState(null);

  useEffect(() => {
    fetchItems();
  }, []);

  const fetchItems = async () => {
    try {
      const res = await fetch("/api/gallery");
      if (res.ok) {
        const data = await res.json();
        setItems(data);
      }
    } catch (error) {
      console.error("Error fetching gallery items:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      let res;
      if (type === "photo") {
        if (!file) return;
        const formData = new FormData();
        formData.append("type", "photo");
        formData.append("file", file);
        formData.append("title", title);

        res = await fetch("/api/gallery", {
          method: "POST",
          body: formData,
        });
      } else {
        if (!url) return;
        res = await fetch("/api/gallery", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ type: "video", url, title }),
        });
      }

      if (res.ok) {
        setFile(null);
        setUrl("");
        setTitle("");
        fetchItems();
      } else {
        console.error("Failed to upload");
      }
    } catch (error) {
      console.error("Error uploading:", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDelete = async (id) => {
    if (!confirm("Are you sure you want to delete this item?")) return;
    try {
      const res = await fetch(`/api/gallery/${id}`, { method: "DELETE" });
      if (res.ok) {
        setItems(items.filter((item) => item._id !== id));
      }
    } catch (error) {
      console.error("Error deleting:", error);
    }
  };

  const getYouTubeVideoId = (url) => {
    const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|&v=)([^#&?]*).*/;
    const match = url.match(regExp);
    return (match && match[2].length === 11) ? match[2] : null;
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-semibold text-gray-900">Gallery Management</h1>
          <p className="text-sm text-gray-500 mt-1">Upload photos and videos to display on the website.</p>
        </div>
      </div>

      <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
        <h2 className="text-lg font-medium mb-4">Add New Item</h2>
        
        <div className="flex gap-4 mb-6">
          <button
            onClick={() => setType("photo")}
            className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
              type === "photo" ? "bg-primary text-white" : "bg-gray-100 text-gray-600 hover:bg-gray-200"
            }`}
          >
            <ImageIcon className="w-4 h-4" /> Photo
          </button>
          <button
            onClick={() => setType("video")}
            className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
              type === "video" ? "bg-primary text-white" : "bg-gray-100 text-gray-600 hover:bg-gray-200"
            }`}
          >
            <Video className="w-4 h-4" /> Video URL
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4 max-w-xl">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Title (Optional)</label>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="w-full px-4 py-2 border border-gray-200 rounded-xl focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none transition-all"
              placeholder="e.g. Health Camp 2024"
            />
          </div>

          {type === "photo" ? (
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Upload Photo</label>
              <input
                type="file"
                accept="image/*"
                onChange={(e) => setFile(e.target.files[0])}
                required
                className="w-full px-4 py-2 border border-gray-200 rounded-xl focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none transition-all file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-primary/10 file:text-primary hover:file:bg-primary/20"
              />
            </div>
          ) : (
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Video URL (YouTube)</label>
              <input
                type="url"
                value={url}
                onChange={(e) => setUrl(e.target.value)}
                required
                className="w-full px-4 py-2 border border-gray-200 rounded-xl focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none transition-all"
                placeholder="https://www.youtube.com/watch?v=..."
              />
            </div>
          )}

          <button
            type="submit"
            disabled={isSubmitting || (type === "photo" && !file) || (type === "video" && !url)}
            className="flex items-center gap-2 px-6 py-2.5 bg-primary text-white rounded-xl hover:bg-primary/90 transition-colors disabled:opacity-50"
          >
            {isSubmitting ? <Loader2 className="w-4 h-4 animate-spin" /> : <Plus className="w-4 h-4" />}
            {isSubmitting ? "Uploading..." : "Upload Item"}
          </button>
        </form>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {loading ? (
          <div className="col-span-full flex justify-center py-12">
            <Loader2 className="w-8 h-8 animate-spin text-primary" />
          </div>
        ) : items.length === 0 ? (
          <div className="col-span-full text-center py-12 text-gray-500 bg-white rounded-2xl border border-gray-100">
            No items in the gallery yet. Upload some above!
          </div>
        ) : (
          items.map((item) => (
            <div key={item._id} className="bg-white rounded-2xl border border-gray-100 overflow-hidden shadow-sm group">
              <div className="relative aspect-video bg-gray-100">
                {item.type === "photo" ? (
                  <img src={item.url} alt={item.title || "Gallery photo"} className="w-full h-full object-cover" />
                ) : (
                  <img 
                    src={`https://img.youtube.com/vi/${getYouTubeVideoId(item.url)}/hqdefault.jpg`} 
                    alt={item.title || "Gallery video"} 
                    className="w-full h-full object-cover"
                    onError={(e) => { e.target.src = "https://via.placeholder.com/640x360?text=Video" }}
                  />
                )}
                <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-3">
                  <button
                    onClick={() => handleDelete(item._id)}
                    className="p-2 bg-red-500 text-white rounded-full hover:bg-red-600 transition-colors"
                    title="Delete Item"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
                <div className="absolute top-2 left-2 px-2 py-1 bg-black/60 backdrop-blur-sm text-white text-xs font-medium rounded-lg flex items-center gap-1">
                  {item.type === "photo" ? <ImageIcon className="w-3 h-3" /> : <Video className="w-3 h-3" />}
                  <span className="capitalize">{item.type}</span>
                </div>
              </div>
              {(item.title) && (
                <div className="p-3">
                  <p className="text-sm font-medium text-gray-900 truncate">{item.title}</p>
                </div>
              )}
            </div>
          ))
        )}
      </div>
    </div>
  );
}
