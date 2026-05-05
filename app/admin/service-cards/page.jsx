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
  Stethoscope,
  Heart,
  Baby,
  Syringe,
  TestTube,
  Image as ImageIcon, 
  Loader2,
  ChevronDown,
  Edit
} from "lucide-react";
import Navbar from "@/components/Header";

const SERVICE_TYPES = [
  { id: 'ambulance', label: 'Ambulance' },
  { id: 'physiotherapy', label: 'Physiotherapy' },
  { id: 'doctor', label: 'Doctor Visit' },
  { id: 'icu', label: 'ICU at Home' },
  { id: 'nursing', label: 'Nursing Care' },
  { id: 'lab-tests', label: 'Lab Tests' },
  { id: 'home-care', label: 'Home Care' },
];

const ICON_OPTIONS = [
  { name: 'Ambulance', icon: Ambulance },
  { name: 'Activity', icon: Activity },
  { name: 'Bed', icon: Bed },
  { name: 'Shield', icon: Shield },
  { name: 'Monitor', icon: Monitor },
  { name: 'Stethoscope', icon: Stethoscope },
  { name: 'Heart', icon: Heart },
  { name: 'Baby', icon: Baby },
  { name: 'Syringe', icon: Syringe },
  { name: 'TestTube', icon: TestTube },
];

export default function AdminServiceCards() {
  const [packages, setPackages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isAdding, setIsAdding] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [activeTab, setActiveTab] = useState('ambulance');
  
  // Form State
  const [formData, setFormData] = useState({
    serviceType: "ambulance",
    title: "",
    description: "",
    icon: "Activity",
    price: "",
    originalPrice: "",
    discount: "",
    baseKm: "",
    pricePerKm: "",
    period: "",
    badge: "",
    isPopular: false,
    features: [],
  });
  const [image, setImage] = useState(null);
  const [newFeature, setNewFeature] = useState("");

  const fetchPackages = async (type) => {
    setLoading(true);
    try {
      const res = await fetch(`/api/service-packages?type=${type || activeTab}`);
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
  }, [activeTab]);

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
      const url = editingId ? `/api/service-packages/${editingId}` : "/api/service-packages";
      const method = editingId ? "PUT" : "POST";

      const res = await fetch(url, {
        method,
        body: data,
      });
      if (res.ok) {
        setIsAdding(false);
        setEditingId(null);
        fetchPackages();
        // Reset form but keep serviceType
        setFormData({
          ...formData,
          title: "",
          description: "",
          price: "",
          originalPrice: "",
          discount: "",
          baseKm: "",
          pricePerKm: "",
          period: "",
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
      serviceType: pkg.serviceType,
      title: pkg.title,
      description: pkg.description || "",
      icon: pkg.icon || "Activity",
      price: pkg.price,
      originalPrice: pkg.originalPrice || "",
      discount: pkg.discount || "",
      baseKm: pkg.baseKm || "",
      pricePerKm: pkg.pricePerKm || "",
      period: pkg.period || "",
      badge: pkg.badge || "",
      isPopular: pkg.isPopular || false,
      features: pkg.features || [],
    });
    setIsAdding(true);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleDelete = async (id) => {
    if (!confirm("Are you sure?")) return;
    try {
      await fetch(`/api/service-packages/${id}`, { method: "DELETE" });
      fetchPackages();
    } catch (err) { console.error(err); }
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
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Service Cards Admin</h1>
            <p className="text-gray-500 mt-1">Manage pricing cards for all services</p>
          </div>
          <button 
            onClick={() => {
              if (isAdding) {
                setIsAdding(false);
                setEditingId(null);
                setFormData({
                  ...formData,
                  title: "",
                  description: "",
                  price: "",
                  originalPrice: "",
                  discount: "",
                  baseKm: "",
                  pricePerKm: "",
                  period: "",
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
            {isAdding ? "Cancel" : <><Plus className="w-5 h-5" /> Add New Card</>}
          </button>
        </div>

        {/* Tabs */}
        <div className="flex overflow-x-auto gap-2 mb-8 no-scrollbar pb-2">
          {SERVICE_TYPES.map((type) => (
            <button
              key={type.id}
              onClick={() => setActiveTab(type.id)}
              className={`px-5 py-2.5 rounded-full text-sm font-medium transition whitespace-nowrap ${
                activeTab === type.id 
                ? 'bg-primary text-white shadow-md' 
                : 'bg-white text-gray-500 border border-gray-100 hover:bg-gray-50'
              }`}
            >
              {type.label}
            </button>
          ))}
        </div>

        {isAdding && (
          <div className="bg-white rounded-[32px] p-8 border border-gray-100 shadow-xl mb-12">
            <h2 className="text-xl font-bold mb-6">{editingId ? `Edit ${SERVICE_TYPES.find(t => t.id === formData.serviceType)?.label} Card` : `Create New ${SERVICE_TYPES.find(t => t.id === formData.serviceType)?.label} Card`}</h2>
            <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-4">
                <div>
                  <label className="block text-xs font-bold text-gray-400 uppercase mb-2">Service Category</label>
                  <select 
                    value={formData.serviceType}
                    onChange={(e) => setFormData({...formData, serviceType: e.target.value})}
                    className="w-full px-4 py-3 rounded-xl bg-gray-50 border border-gray-200 outline-none focus:ring-2 focus:ring-primary"
                  >
                    {SERVICE_TYPES.map(t => <option key={t.id} value={t.id}>{t.label}</option>)}
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-bold text-gray-400 uppercase mb-2">Title</label>
                  <input 
                    type="text" required
                    value={formData.title}
                    onChange={(e) => setFormData({...formData, title: e.target.value})}
                    className="w-full px-4 py-3 rounded-xl bg-gray-50 border border-gray-200 outline-none focus:ring-2 focus:ring-primary"
                    placeholder="e.g. 1 Session (Trial)"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-gray-400 uppercase mb-2">Description</label>
                  <input 
                    type="text"
                    value={formData.description}
                    onChange={(e) => setFormData({...formData, description: e.target.value})}
                    className="w-full px-4 py-3 rounded-xl bg-gray-50 border border-gray-200 outline-none focus:ring-2 focus:ring-primary"
                    placeholder="Brief summary"
                  />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-bold text-gray-400 uppercase mb-2">Price (₹)</label>
                    <input 
                      type="number" required
                      value={formData.price}
                      onChange={(e) => setFormData({...formData, price: e.target.value})}
                      className="w-full px-4 py-3 rounded-xl bg-gray-50 border border-gray-200 outline-none focus:ring-2 focus:ring-primary"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-gray-400 uppercase mb-2">Original Price</label>
                    <input 
                      type="number"
                      value={formData.originalPrice}
                      onChange={(e) => setFormData({...formData, originalPrice: e.target.value})}
                      className="w-full px-4 py-3 rounded-xl bg-gray-50 border border-gray-200 outline-none focus:ring-2 focus:ring-primary"
                    />
                  </div>
                </div>
                {formData.serviceType === 'ambulance' ? (
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-bold text-gray-400 uppercase mb-2">Base Km</label>
                      <input 
                        type="number"
                        value={formData.baseKm}
                        onChange={(e) => setFormData({...formData, baseKm: e.target.value})}
                        className="w-full px-4 py-3 rounded-xl bg-gray-50 border border-gray-200 outline-none focus:ring-2 focus:ring-primary"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-bold text-gray-400 uppercase mb-2">Extra ₹/Km</label>
                      <input 
                        type="number"
                        value={formData.pricePerKm}
                        onChange={(e) => setFormData({...formData, pricePerKm: e.target.value})}
                        className="w-full px-4 py-3 rounded-xl bg-gray-50 border border-gray-200 outline-none focus:ring-2 focus:ring-primary"
                      />
                    </div>
                  </div>
                ) : (
                  <div>
                    <label className="block text-xs font-bold text-gray-400 uppercase mb-2">Period (e.g. per day)</label>
                    <input 
                      type="text"
                      value={formData.period}
                      onChange={(e) => setFormData({...formData, period: e.target.value})}
                      className="w-full px-4 py-3 rounded-xl bg-gray-50 border border-gray-200 outline-none focus:ring-2 focus:ring-primary"
                    />
                  </div>
                )}
              </div>

              <div className="space-y-6">
                <div>
                  <label className="block text-xs font-bold text-gray-400 uppercase mb-2">Features</label>
                  <div className="flex gap-2 mb-3">
                    <input 
                      type="text" 
                      value={newFeature}
                      onChange={(e) => setNewFeature(e.target.value)}
                      className="flex-1 px-4 py-3 rounded-xl bg-gray-50 border border-gray-200 outline-none"
                      placeholder="Add feature..."
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

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-bold text-gray-400 uppercase mb-2">Badge Text</label>
                    <input 
                      type="text"
                      value={formData.badge}
                      onChange={(e) => setFormData({...formData, badge: e.target.value})}
                      className="w-full px-4 py-3 rounded-xl bg-gray-50 border border-gray-200 outline-none focus:ring-2 focus:ring-primary"
                    />
                  </div>
                  <div className="flex items-center gap-2 pt-8">
                    <input 
                      type="checkbox" id="isPopular"
                      checked={formData.isPopular}
                      onChange={(e) => setFormData({...formData, isPopular: e.target.checked})}
                      className="w-4 h-4 text-primary"
                    />
                    <label htmlFor="isPopular" className="text-sm font-medium text-gray-700">Popular</label>
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold text-gray-400 uppercase mb-2">Image</label>
                  <div className="relative h-32 rounded-2xl bg-gray-50 border-2 border-dashed border-gray-200 flex flex-col items-center justify-center gap-2 cursor-pointer hover:bg-gray-100 transition">
                    <input 
                      type="file" 
                      onChange={(e) => setImage(e.target.files[0])}
                      className="absolute inset-0 opacity-0 cursor-pointer"
                    />
                    {image ? (
                      <span className="text-sm font-medium text-primary">{image.name}</span>
                    ) : (
                      <><ImageIcon className="w-8 h-8 text-gray-300" /> <span className="text-xs text-gray-400">Click to upload</span></>
                    )}
                  </div>
                </div>

                  <button 
                    disabled={loading}
                    className="w-full bg-primary text-white py-4 rounded-2xl font-bold shadow-xl hover:bg-primary-dark transition active:scale-95 flex items-center justify-center gap-2"
                  >
                    {loading ? <Loader2 className="w-5 h-5 animate-spin" /> : (editingId ? "Update Card & Save" : "Save Card")}
                  </button>
              </div>
            </form>
          </div>
        )}

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {packages.map((pkg) => (
            <div key={pkg._id} className="bg-white rounded-3xl p-5 border border-gray-100 shadow-sm flex flex-col group">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-10 h-10 bg-primary/10 rounded-xl flex items-center justify-center text-primary">
                  <Activity className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="font-bold text-gray-900">{pkg.title}</h3>
                  <p className="text-[10px] text-gray-500">{pkg.description}</p>
                </div>
                {pkg.badge && (
                  <span className="ml-auto bg-red-50 text-red-600 text-[9px] font-bold px-2 py-1 rounded uppercase">
                    {pkg.badge}
                  </span>
                )}
              </div>

              <div className="relative h-40 rounded-2xl overflow-hidden bg-gray-100 mb-4">
                {pkg.imageFileId ? (
                  <img src={`/api/images/${pkg.imageFileId}`} alt="" className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                ) : pkg.image ? (
                  <img src={pkg.image} alt="" className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                ) : (
                  <div className="flex items-center justify-center h-full text-gray-300"><ImageIcon className="w-10 h-10" /></div>
                )}
              </div>

              <div className="flex items-center justify-between mb-4">
                <div>
                  <div className="flex items-center gap-2">
                    <span className="text-xl font-bold text-black">₹{pkg.price}</span>
                    {pkg.originalPrice && <span className="text-xs text-gray-400 line-through">₹{pkg.originalPrice}</span>}
                  </div>
                  <div className="text-[9px] text-gray-500">
                    {pkg.serviceType === 'ambulance' ? `Base: ${pkg.baseKm}km / ₹${pkg.pricePerKm}km` : pkg.period}
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <button 
                    onClick={() => handleEdit(pkg)}
                    className="p-2 rounded-xl bg-primary/5 text-primary hover:bg-primary/10 transition"
                  >
                    <Edit className="w-4 h-4" />
                  </button>
                  <button 
                    onClick={() => handleDelete(pkg._id)}
                    className="p-2 rounded-xl bg-red-50 text-red-500 hover:bg-red-100 transition"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </div>
          ))}
          {!loading && packages.length === 0 && (
            <div className="col-span-full py-20 text-center text-gray-400 bg-white rounded-3xl border-2 border-dashed border-gray-100">
              No cards found for this category. Click "Add New Card" to begin.
            </div>
          )}
        </div>
      </div>
    </main>
  );
}
