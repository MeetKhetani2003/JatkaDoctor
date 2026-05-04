"use client";

import React, { useState, useEffect } from "react";
import { Plus, Trash2, MapPin, Star, Image as ImageIcon, Loader2 } from "lucide-react";
import Navbar from "@/components/Header";

export default function AdminPhysioCenters() {
  const [centers, setCenters] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isAdding, setIsAdding] = useState(false);
  
  // Form State
  const [formData, setFormData] = useState({
    name: "Dr Jhatka Medicare Physiotherapy Center",
    subtitle: "",
    location: "",
    rating: "5.0",
    experience: "",
    features: ["Certified Physiotherapist", "Background Verified", "Advance physiotherapy Equipment"],
    treatments: [],
    numbers: ["8874744756", "9026365448"],
  });
  const [image, setImage] = useState(null);
  const [newFeature, setNewFeature] = useState("");
  const [newTreatment, setNewTreatment] = useState("");

  const fetchCenters = async () => {
    try {
      const res = await fetch("/api/centers");
      const data = await res.json();
      setCenters(data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCenters();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    const data = new FormData();
    Object.keys(formData).forEach(key => {
      if (Array.isArray(formData[key])) {
        data.append(key, JSON.stringify(formData[key]));
      } else {
        data.append(key, formData[key]);
      }
    });
    if (image) data.append("image", image);

    try {
      const res = await fetch("/api/centers", {
        method: "POST",
        body: data,
      });
      if (res.ok) {
        setIsAdding(false);
        fetchCenters();
        // Reset form
        setFormData({
          name: "Dr Jhatka Medicare Physiotherapy Center",
          subtitle: "",
          location: "",
          rating: "5.0",
          experience: "",
          features: ["Certified Physiotherapist", "Background Verified", "Advance physiotherapy Equipment"],
          treatments: [],
          numbers: ["8874744756", "9026365448"],
        });
        setImage(null);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const addFeature = () => {
    if (newFeature) {
      setFormData({ ...formData, features: [...formData.features, newFeature] });
      setNewFeature("");
    }
  };

  const addTreatment = () => {
    if (newTreatment) {
      setFormData({ ...formData, treatments: [...formData.treatments, newTreatment] });
      setNewTreatment("");
    }
  };

  return (
    <main className="min-h-screen bg-gray-50 pb-20">
      <Navbar />
      
      <div className="max-w-7xl mx-auto px-4 mt-24">
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Physio Centers Admin</h1>
            <p className="text-gray-500 mt-1">Manage your physiotherapy network</p>
          </div>
          <button 
            onClick={() => setIsAdding(!isAdding)}
            className="bg-emerald-600 text-white px-6 py-3 rounded-xl font-bold flex items-center gap-2 hover:bg-emerald-700 transition shadow-lg"
          >
            {isAdding ? "Cancel" : <><Plus className="w-5 h-5" /> Add New Center</>}
          </button>
        </div>

        {isAdding && (
          <div className="bg-white rounded-[32px] p-8 border border-gray-100 shadow-xl mb-12">
            <h2 className="text-xl font-bold mb-6">Add New Physiotherapy Center</h2>
            <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-4">
                <div>
                  <label className="block text-xs font-bold text-gray-400 uppercase mb-2">Clinic Name</label>
                  <input 
                    type="text" 
                    value={formData.name}
                    onChange={(e) => setFormData({...formData, name: e.target.value})}
                    className="w-full px-4 py-3 rounded-xl bg-gray-50 border border-gray-200 focus:ring-2 focus:ring-emerald-500 outline-none"
                    placeholder="Dr Jhatka Medicare..."
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-gray-400 uppercase mb-2">Subtitle (@ Clinic Name)</label>
                  <input 
                    type="text" 
                    value={formData.subtitle}
                    onChange={(e) => setFormData({...formData, subtitle: e.target.value})}
                    className="w-full px-4 py-3 rounded-xl bg-gray-50 border border-gray-200 focus:ring-2 focus:ring-emerald-500 outline-none"
                    placeholder="@ Gurudwara Physiotherapy Clinic"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-gray-400 uppercase mb-2">Location Address</label>
                  <textarea 
                    value={formData.location}
                    onChange={(e) => setFormData({...formData, location: e.target.value})}
                    className="w-full px-4 py-3 rounded-xl bg-gray-50 border border-gray-200 focus:ring-2 focus:ring-emerald-500 outline-none h-24"
                    placeholder="Full address..."
                  />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-bold text-gray-400 uppercase mb-2">Rating</label>
                    <input 
                      type="text" 
                      value={formData.rating}
                      onChange={(e) => setFormData({...formData, rating: e.target.value})}
                      className="w-full px-4 py-3 rounded-xl bg-gray-50 border border-gray-200 focus:ring-2 focus:ring-emerald-500 outline-none"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-gray-400 uppercase mb-2">Experience</label>
                    <input 
                      type="text" 
                      value={formData.experience}
                      onChange={(e) => setFormData({...formData, experience: e.target.value})}
                      className="w-full px-4 py-3 rounded-xl bg-gray-50 border border-gray-200 focus:ring-2 focus:ring-emerald-500 outline-none"
                      placeholder="20+ years"
                    />
                  </div>
                </div>
                <div>
                  <label className="block text-xs font-bold text-gray-400 uppercase mb-2">Clinic Image</label>
                  <div className="relative h-40 rounded-2xl bg-gray-50 border-2 border-dashed border-gray-200 flex flex-col items-center justify-center gap-2 cursor-pointer hover:bg-gray-100 transition">
                    <input 
                      type="file" 
                      onChange={(e) => setImage(e.target.files[0])}
                      className="absolute inset-0 opacity-0 cursor-pointer"
                    />
                    {image ? (
                      <span className="text-sm font-medium text-emerald-600">{image.name}</span>
                    ) : (
                      <><ImageIcon className="w-8 h-8 text-gray-300" /> <span className="text-xs text-gray-400">Click to upload image</span></>
                    )}
                  </div>
                </div>
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

                <div>
                  <label className="block text-xs font-bold text-gray-400 uppercase mb-2">Treatments</label>
                  <div className="flex gap-2 mb-3">
                    <input 
                      type="text" 
                      value={newTreatment}
                      onChange={(e) => setNewTreatment(e.target.value)}
                      className="flex-1 px-4 py-3 rounded-xl bg-gray-50 border border-gray-200 outline-none"
                      placeholder="Add treatment..."
                    />
                    <button type="button" onClick={addTreatment} className="bg-gray-900 text-white p-3 rounded-xl"><Plus className="w-5 h-5" /></button>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {formData.treatments.map((t, i) => (
                      <span key={i} className="text-[10px] bg-emerald-50 text-emerald-700 px-3 py-1.5 rounded-full flex items-center gap-1">
                        {t} <Trash2 className="w-3 h-3 text-red-500 cursor-pointer" onClick={() => setFormData({...formData, treatments: formData.treatments.filter((_, idx) => idx !== i)})} />
                      </span>
                    ))}
                  </div>
                </div>

                <div className="pt-6">
                  <button 
                    disabled={loading}
                    className="w-full bg-emerald-600 text-white py-4 rounded-[20px] font-bold shadow-xl shadow-emerald-200 hover:bg-emerald-700 transition active:scale-95 flex items-center justify-center gap-2"
                  >
                    {loading ? <Loader2 className="w-5 h-5 animate-spin" /> : "Save Center & Publish"}
                  </button>
                </div>
              </div>
            </form>
          </div>
        )}

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {centers.map((center) => (
            <div key={center._id} className="bg-white rounded-3xl p-5 border border-gray-100 shadow-sm flex flex-col">
              <div className="relative h-40 rounded-2xl overflow-hidden bg-gray-100 mb-4">
                {center.imageFileId ? (
                  <img src={`/api/images/${center.imageFileId}`} alt="" className="w-full h-full object-cover" />
                ) : (
                  <div className="flex items-center justify-center h-full text-gray-300"><ImageIcon className="w-10 h-10" /></div>
                )}
              </div>
              <h3 className="font-bold text-gray-900">{center.name}</h3>
              <p className="text-xs text-emerald-600 font-medium mb-2">{center.subtitle}</p>
              <div className="flex items-center gap-1 mb-4">
                <Star className="w-3 h-3 text-yellow-500 fill-yellow-500" />
                <span className="text-xs font-bold">{center.rating}</span>
                <span className="mx-2 text-gray-200">|</span>
                <span className="text-[10px] text-gray-500">{center.experience}</span>
              </div>
              <div className="flex items-start gap-2 mb-4">
                <MapPin className="w-3 h-3 text-gray-400 shrink-0 mt-0.5" />
                <p className="text-[10px] text-gray-500 line-clamp-2">{center.location}</p>
              </div>
              <button className="mt-auto w-full py-2.5 rounded-xl border-2 border-red-50 text-red-500 text-[11px] font-bold hover:bg-red-50 transition flex items-center justify-center gap-2">
                <Trash2 className="w-3.5 h-3.5" /> Delete Center
              </button>
            </div>
          ))}
        </div>
      </div>
    </main>
  );
}
