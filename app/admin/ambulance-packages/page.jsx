"use client";

import React, { useState, useEffect } from "react";
import { 
  Plus, 
  Trash2, 
  Ambulance, 
  Activity, 
  Bed, 
  Shield, 
  Monitor, 
  Image as ImageIcon, 
  Loader2,
  CheckCircle2,
  Clock,
  Star,
  Edit
} from "lucide-react";
import Navbar from "@/components/Header";

const ICON_OPTIONS = [
  { name: 'Ambulance', icon: Ambulance },
  { name: 'Activity', icon: Activity },
  { name: 'Bed', icon: Bed },
  { name: 'Shield', icon: Shield },
  { name: 'Monitor', icon: Monitor },
];

export default function AdminAmbulancePackages() {
  const [packages, setPackages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isAdding, setIsAdding] = useState(false);
  const [editingId, setEditingId] = useState(null);
  
  // Form State
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    icon: "Ambulance",
    price: "",
    originalPrice: "",
    discount: "",
    baseKm: "5",
    pricePerKm: "",
    badge: "",
    isPopular: false,
    features: [],
  });
  const [image, setImage] = useState(null);
  const [newFeature, setNewFeature] = useState("");

  const fetchPackages = async () => {
    try {
      const res = await fetch("/api/ambulance-packages");
      const data = await res.json();
      setPackages(data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPackages();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    const data = new FormData();
    Object.keys(formData).forEach(key => {
      if (key === 'features') {
        data.append(key, JSON.stringify(formData[key]));
      } else {
        data.append(key, formData[key]);
      }
    });
    if (image) data.append("image", image);

    try {
      const url = editingId ? `/api/ambulance-packages/${editingId}` : "/api/ambulance-packages";
      const method = editingId ? "PUT" : "POST";

      const res = await fetch(url, {
        method,
        body: data,
      });
      if (res.ok) {
        setIsAdding(false);
        setEditingId(null);
        fetchPackages();
        // Reset form
        setFormData({
          title: "",
          description: "",
          icon: "Ambulance",
          price: "",
          originalPrice: "",
          discount: "",
          baseKm: "5",
          pricePerKm: "",
          badge: "",
          isPopular: false,
          features: [],
        });
        setImage(null);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = (pkg) => {
    setEditingId(pkg._id);
    setFormData({
      title: pkg.title,
      description: pkg.description,
      icon: pkg.icon,
      price: pkg.price,
      originalPrice: pkg.originalPrice || "",
      discount: pkg.discount || "",
      baseKm: pkg.baseKm,
      pricePerKm: pkg.pricePerKm || "",
      badge: pkg.badge || "",
      isPopular: pkg.isPopular,
      features: pkg.features || [],
    });
    setIsAdding(true);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleDelete = async (id) => {
    if (!confirm("Are you sure you want to delete this package?")) return;
    
    try {
      const res = await fetch(`/api/ambulance-packages/${id}`, {
        method: "DELETE",
      });
      if (res.ok) {
        fetchPackages();
      }
    } catch (err) {
      console.error(err);
    }
  };

  const addFeature = () => {
    if (newFeature) {
      setFormData({ ...formData, features: [...formData.features, newFeature] });
      setNewFeature("");
    }
  };

  return (
    <main className="min-h-screen bg-gray-50 pb-20">
      <Navbar />
      
      <div className="max-w-7xl mx-auto px-4 mt-24">
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Ambulance Packages Admin</h1>
            <p className="text-gray-500 mt-1">Manage service cards and pricing</p>
          </div>
          <button 
            onClick={() => {
              if (isAdding) {
                setIsAdding(false);
                setEditingId(null);
                setFormData({
                  title: "",
                  description: "",
                  icon: "Ambulance",
                  price: "",
                  originalPrice: "",
                  discount: "",
                  baseKm: "5",
                  pricePerKm: "",
                  badge: "",
                  isPopular: false,
                  features: [],
                });
                setImage(null);
              } else {
                setIsAdding(true);
              }
            }}
            className="bg-primary text-white px-6 py-3 rounded-xl font-bold flex items-center gap-2 hover:bg-primary-dark transition shadow-lg"
          >
            {isAdding ? "Cancel" : <><Plus className="w-5 h-5" /> Add New Package</>}
          </button>
        </div>

        {isAdding && (
          <div className="bg-white rounded-[32px] p-8 border border-gray-100 shadow-xl mb-12">
            <h2 className="text-xl font-bold mb-6">{editingId ? "Edit Ambulance Package" : "Add New Ambulance Package"}</h2>
            <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-4">
                <div>
                  <label className="block text-xs font-bold text-gray-400 uppercase mb-2">Title</label>
                  <input 
                    type="text" 
                    required
                    value={formData.title}
                    onChange={(e) => setFormData({...formData, title: e.target.value})}
                    className="w-full px-4 py-3 rounded-xl bg-gray-50 border border-gray-200 focus:ring-2 focus:ring-primary outline-none"
                    placeholder="Normal Ambulance"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-gray-400 uppercase mb-2">Description</label>
                  <input 
                    type="text" 
                    value={formData.description}
                    onChange={(e) => setFormData({...formData, description: e.target.value})}
                    className="w-full px-4 py-3 rounded-xl bg-gray-50 border border-gray-200 focus:ring-2 focus:ring-primary outline-none"
                    placeholder="Standard emergency transport"
                  />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-bold text-gray-400 uppercase mb-2">Price (₹)</label>
                    <input 
                      type="number" 
                      required
                      value={formData.price}
                      onChange={(e) => setFormData({...formData, price: e.target.value})}
                      className="w-full px-4 py-3 rounded-xl bg-gray-50 border border-gray-200 focus:ring-2 focus:ring-primary outline-none"
                      placeholder="1199"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-gray-400 uppercase mb-2">Original Price (₹)</label>
                    <input 
                      type="number" 
                      value={formData.originalPrice}
                      onChange={(e) => setFormData({...formData, originalPrice: e.target.value})}
                      className="w-full px-4 py-3 rounded-xl bg-gray-50 border border-gray-200 focus:ring-2 focus:ring-primary outline-none"
                      placeholder="1499"
                    />
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-bold text-gray-400 uppercase mb-2">Discount Text</label>
                    <input 
                      type="text" 
                      value={formData.discount}
                      onChange={(e) => setFormData({...formData, discount: e.target.value})}
                      className="w-full px-4 py-3 rounded-xl bg-gray-50 border border-gray-200 focus:ring-2 focus:ring-primary outline-none"
                      placeholder="20% OFF"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-gray-400 uppercase mb-2">Badge (Top Right)</label>
                    <input 
                      type="text" 
                      value={formData.badge}
                      onChange={(e) => setFormData({...formData, badge: e.target.value})}
                      className="w-full px-4 py-3 rounded-xl bg-gray-50 border border-gray-200 focus:ring-2 focus:ring-primary outline-none"
                      placeholder="Most Used"
                    />
                  </div>
                </div>
                <div>
                  <label className="block text-xs font-bold text-gray-400 uppercase mb-2">Icon</label>
                  <div className="flex gap-2">
                    {ICON_OPTIONS.map((opt) => {
                      const Icon = opt.icon;
                      return (
                        <button
                          key={opt.name}
                          type="button"
                          onClick={() => setFormData({...formData, icon: opt.name})}
                          className={`p-3 rounded-xl border-2 transition ${formData.icon === opt.name ? 'border-primary bg-primary/5 text-primary' : 'border-gray-100 text-gray-400'}`}
                        >
                          <Icon className="w-6 h-6" />
                        </button>
                      );
                    })}
                  </div>
                </div>
              </div>

              <div className="space-y-6">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-bold text-gray-400 uppercase mb-2">Base Distance (Km)</label>
                    <input 
                      type="number" 
                      value={formData.baseKm}
                      onChange={(e) => setFormData({...formData, baseKm: e.target.value})}
                      className="w-full px-4 py-3 rounded-xl bg-gray-50 border border-gray-200 focus:ring-2 focus:ring-primary outline-none"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-gray-400 uppercase mb-2">Price Per Km (Extra)</label>
                    <input 
                      type="number" 
                      value={formData.pricePerKm}
                      onChange={(e) => setFormData({...formData, pricePerKm: e.target.value})}
                      className="w-full px-4 py-3 rounded-xl bg-gray-50 border border-gray-200 focus:ring-2 focus:ring-primary outline-none"
                      placeholder="18"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold text-gray-400 uppercase mb-2">Features</label>
                  <div className="flex gap-2 mb-3">
                    <input 
                      type="text" 
                      value={newFeature}
                      onChange={(e) => setNewFeature(e.target.value)}
                      className="flex-1 px-4 py-3 rounded-xl bg-gray-50 border border-gray-200 outline-none"
                      placeholder="Stretcher, O2, etc."
                    />
                    <button type="button" onClick={addFeature} className="bg-gray-900 text-white p-3 rounded-xl"><Plus className="w-5 h-5" /></button>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {formData.features.map((f, i) => (
                      <span key={i} className="text-[10px] bg-gray-100 px-3 py-1.5 rounded-full flex items-center gap-1">
                        {f} <Trash2 className="w-3 h-3 text-red-500 cursor-pointer" onClick={() => setFormData({...formData, features: formData.features.filter((_, idx) => idx !== i)})} />
                      </span>
                    ))}
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold text-gray-400 uppercase mb-2">Package Image</label>
                  <div className="relative h-40 rounded-2xl bg-gray-50 border-2 border-dashed border-gray-200 flex flex-col items-center justify-center gap-2 cursor-pointer hover:bg-gray-100 transition">
                    <input 
                      type="file" 
                      onChange={(e) => setImage(e.target.files[0])}
                      className="absolute inset-0 opacity-0 cursor-pointer"
                    />
                    {image ? (
                      <span className="text-sm font-medium text-primary">{image.name}</span>
                    ) : (
                      <><ImageIcon className="w-8 h-8 text-gray-300" /> <span className="text-xs text-gray-400">Upload ambulance photo</span></>
                    )}
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <input 
                    type="checkbox" 
                    id="isPopular"
                    checked={formData.isPopular}
                    onChange={(e) => setFormData({...formData, isPopular: e.target.checked})}
                    className="w-4 h-4 text-primary"
                  />
                  <label htmlFor="isPopular" className="text-sm font-medium text-gray-700">Mark as Popular</label>
                </div>

                <div className="pt-6">
                  <button 
                    disabled={loading}
                    className="w-full bg-primary text-white py-4 rounded-[20px] font-bold shadow-xl shadow-emerald-200 hover:bg-primary-dark transition active:scale-95 flex items-center justify-center gap-2"
                  >
                    {loading ? <Loader2 className="w-5 h-5 animate-spin" /> : (editingId ? "Update Package & Save" : "Save Package & Publish")}
                  </button>
                </div>
              </div>
            </form>
          </div>
        )}

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {packages.map((pkg) => {
            const IconComponent = ICON_OPTIONS.find(o => o.name === pkg.icon)?.icon || Ambulance;
            return (
              <div key={pkg._id} className="bg-white rounded-3xl p-5 border border-gray-100 shadow-sm flex flex-col group">
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-10 h-10 bg-primary/10 rounded-xl flex items-center justify-center text-primary">
                    <IconComponent className="w-5 h-5" />
                  </div>
                  <div>
                    <h3 className="font-bold text-gray-900">{pkg.title}</h3>
                    <p className="text-[10px] text-gray-500">{pkg.description}</p>
                  </div>
                  {pkg.badge && (
                    <span className="ml-auto bg-red-50 text-red-600 text-[9px] font-bold px-2 py-1 rounded uppercase tracking-wider">
                      {pkg.badge}
                    </span>
                  )}
                </div>

                <div className="relative h-48 rounded-2xl overflow-hidden bg-gray-100 mb-4">
                  {pkg.imageFileId ? (
                    <img src={`/api/images/${pkg.imageFileId}`} alt="" className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                  ) : (
                    <div className="flex items-center justify-center h-full text-gray-300"><ImageIcon className="w-10 h-10" /></div>
                  )}
                  <div className="absolute bottom-2 left-2 right-2 flex flex-wrap gap-1">
                    {pkg.features?.slice(0, 3).map((f, i) => (
                      <span key={i} className="bg-white/90 backdrop-blur-sm text-[8px] font-bold px-1.5 py-0.5 rounded shadow-sm">
                        {f}
                      </span>
                    ))}
                  </div>
                </div>

                <div className="flex items-center justify-between mb-4">
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="text-xl font-bold text-black">₹{pkg.price}</span>
                      {pkg.originalPrice && <span className="text-xs text-gray-400 line-through">₹{pkg.originalPrice}</span>}
                    </div>
                    <div className="text-[9px] text-gray-500 mt-0.5">Base ({pkg.baseKm}km) • Extra: ₹{pkg.pricePerKm}/km</div>
                  </div>
                  {pkg.discount && <span className="bg-green-50 text-primary text-[9px] font-bold px-1.5 py-0.5 rounded border border-primary/10">{pkg.discount}</span>}
                </div>

                <div className="mt-auto grid grid-cols-2 gap-2">
                  <button 
                    onClick={() => handleEdit(pkg)}
                    className="w-full py-2.5 rounded-xl border-2 border-primary/5 text-primary text-[11px] font-bold hover:bg-primary/5 transition flex items-center justify-center gap-2"
                  >
                    <Edit className="w-3.5 h-3.5" /> Edit
                  </button>
                  <button 
                    onClick={() => handleDelete(pkg._id)}
                    className="w-full py-2.5 rounded-xl border-2 border-red-50 text-red-500 text-[11px] font-bold hover:bg-red-50 transition flex items-center justify-center gap-2"
                  >
                    <Trash2 className="w-3.5 h-3.5" /> Delete
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </main>
  );
}
