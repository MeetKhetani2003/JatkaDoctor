"use client";

import React, { useState, useEffect } from "react";
import { Plus, Trash2, MapPin, Clock, Shield, Building2, Landmark, Hotel, Building, School, Loader2, ChevronLeft, Edit } from "lucide-react";
import Link from "next/link";
import Header from "@/components/Header";

const ICON_OPTIONS = {
  Building2,
  Landmark,
  Hotel,
  Building,
  School
};

export default function AdminAmbulances() {
  const [ambulances, setAmbulances] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isAdding, setIsAdding] = useState(false);
  const [editingId, setEditingId] = useState(null);
  
  // Form State
  const [formData, setFormData] = useState({
    name: "",
    city: "Lucknow",
    status: "available",
    eta: "10 - 15 Min",
    icon: "Building2",
    badge: "AVAILABLE",
    verified: true,
  });

  const fetchAmbulances = async () => {
    try {
      const res = await fetch("/api/ambulances");
      const data = await res.json();
      if (Array.isArray(data)) {
        setAmbulances(data);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAmbulances();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const url = editingId ? `/api/ambulances/${editingId}` : "/api/ambulances";
      const method = editingId ? "PUT" : "POST";

      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });
      if (res.ok) {
        setIsAdding(false);
        setEditingId(null);
        fetchAmbulances();
        setFormData({
          name: "",
          city: "Lucknow",
          status: "available",
          eta: "10 - 15 Min",
          icon: "Building2",
          badge: "AVAILABLE",
          verified: true,
        });
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = (loc) => {
    setEditingId(loc._id);
    setFormData({
      name: loc.name,
      city: loc.city,
      status: loc.status,
      eta: loc.eta,
      icon: loc.icon,
      badge: loc.badge,
      verified: loc.verified,
    });
    setIsAdding(true);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleDelete = async (id) => {
    if (!confirm("Are you sure you want to delete this ambulance location?")) return;
    
    try {
      const res = await fetch(`/api/ambulances/${id}`, {
        method: "DELETE",
      });
      if (res.ok) {
        fetchAmbulances();
      }
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <main className="min-h-screen bg-gray-50 pb-20">
      <Header />
      
      <div className="max-w-7xl mx-auto px-4 mt-24">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-8">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <Link href="/admin/doctors" className="text-gray-400 hover:text-primary transition">
                <ChevronLeft className="w-5 h-5" />
              </Link>
              <h1 className="text-3xl font-bold text-gray-900">Ambulance Network Admin</h1>
            </div>
            <p className="text-gray-500">Manage ambulance service locations and status</p>
          </div>
          <button 
            onClick={() => {
              if (isAdding) {
                setIsAdding(false);
                setEditingId(null);
                setFormData({
                  name: "",
                  city: "Lucknow",
                  status: "available",
                  eta: "10 - 15 Min",
                  icon: "Building2",
                  badge: "AVAILABLE",
                  verified: true,
                });
              } else {
                setIsAdding(true);
              }
            }}
            className="bg-emerald-600 text-white px-6 py-3 rounded-xl font-bold flex items-center gap-2 hover:bg-emerald-700 transition shadow-lg w-full sm:w-auto justify-center"
          >
            {isAdding ? "Cancel" : <><Plus className="w-5 h-5" /> Add New Location</>}
          </button>
        </div>

        {isAdding && (
          <div className="bg-white rounded-[32px] p-8 border border-gray-100 shadow-xl mb-12">
            <h2 className="text-xl font-bold mb-6">{editingId ? "Edit Ambulance Location" : "Add New Ambulance Location"}</h2>
            <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-4">
                <div>
                  <label className="block text-xs font-bold text-gray-400 uppercase mb-2">Location Name</label>
                  <input 
                    type="text" 
                    required
                    value={formData.name}
                    onChange={(e) => setFormData({...formData, name: e.target.value})}
                    className="w-full px-4 py-3 rounded-xl bg-gray-50 border border-gray-200 focus:ring-2 focus:ring-emerald-500 outline-none"
                    placeholder="e.g. Dubagga, Gomti Nagar"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-gray-400 uppercase mb-2">City</label>
                  <input 
                    type="text" 
                    value={formData.city}
                    onChange={(e) => setFormData({...formData, city: e.target.value})}
                    className="w-full px-4 py-3 rounded-xl bg-gray-50 border border-gray-200 focus:ring-2 focus:ring-emerald-500 outline-none"
                  />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-bold text-gray-400 uppercase mb-2">Status</label>
                    <select 
                      value={formData.status}
                      onChange={(e) => {
                        const status = e.target.value;
                        setFormData({
                          ...formData, 
                          status, 
                          badge: status === 'available' ? 'AVAILABLE' : 'COMING SOON',
                          eta: status === 'available' ? '10 - 15 Min' : 'Launching Soon'
                        });
                      }}
                      className="w-full px-4 py-3 rounded-xl bg-gray-50 border border-gray-200 focus:ring-2 focus:ring-emerald-500 outline-none"
                    >
                      <option value="available">Available</option>
                      <option value="coming_soon">Coming Soon</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-gray-400 uppercase mb-2">ETA / Info</label>
                    <input 
                      type="text" 
                      value={formData.eta}
                      onChange={(e) => setFormData({...formData, eta: e.target.value})}
                      className="w-full px-4 py-3 rounded-xl bg-gray-50 border border-gray-200 focus:ring-2 focus:ring-emerald-500 outline-none"
                    />
                  </div>
                </div>
              </div>

              <div className="space-y-6">
                <div>
                  <label className="block text-xs font-bold text-gray-400 uppercase mb-2">Select Icon Type</label>
                  <div className="grid grid-cols-5 gap-3">
                    {Object.keys(ICON_OPTIONS).map((iconName) => {
                      const IconComp = ICON_OPTIONS[iconName];
                      return (
                        <button
                          key={iconName}
                          type="button"
                          onClick={() => setFormData({...formData, icon: iconName})}
                          className={`p-4 rounded-2xl border flex flex-col items-center justify-center gap-2 transition ${
                            formData.icon === iconName 
                            ? "bg-emerald-50 border-emerald-500 text-emerald-600" 
                            : "bg-gray-50 border-gray-100 text-gray-400 hover:bg-gray-100"
                          }`}
                        >
                          <IconComp className="w-6 h-6" />
                          <span className="text-[8px] font-bold uppercase">{iconName}</span>
                        </button>
                      );
                    })}
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <input 
                    type="checkbox" 
                    id="verified"
                    checked={formData.verified}
                    onChange={(e) => setFormData({...formData, verified: e.target.checked})}
                    className="w-5 h-5 rounded border-gray-300 text-emerald-600 focus:ring-emerald-500"
                  />
                  <label htmlFor="verified" className="text-sm font-medium text-gray-700">Verified Ambulance Partner</label>
                </div>

                <div className="pt-2">
                  <button 
                    disabled={loading}
                    className="w-full bg-emerald-600 text-white py-4 rounded-2xl font-bold shadow-lg shadow-emerald-200 hover:bg-emerald-700 transition active:scale-95 flex items-center justify-center gap-2"
                  >
                    {loading ? <Loader2 className="w-5 h-5 animate-spin" /> : (editingId ? "Update Location" : "Add to Network")}
                  </button>
                </div>
              </div>
            </form>
          </div>
        )}

        {loading && ambulances.length === 0 ? (
          <div className="flex justify-center py-20">
            <Loader2 className="w-10 h-10 animate-spin text-emerald-500" />
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {ambulances.map((loc) => {
              const IconComp = ICON_OPTIONS[loc.icon] || Building2;
              const isAvailable = loc.status === "available";
              
              return (
                <div key={loc._id} className="bg-white rounded-3xl p-6 border border-gray-100 shadow-sm flex flex-col relative overflow-hidden group">
                  <div className={`absolute top-4 right-4 text-[10px] font-bold px-2 py-1 rounded tracking-wider ${
                    isAvailable ? 'bg-emerald-50 text-emerald-600' : 'bg-gray-100 text-gray-500'
                  }`}>
                    {loc.badge}
                  </div>

                  <div className={`w-14 h-14 rounded-2xl flex items-center justify-center mb-4 ${
                    isAvailable ? 'bg-emerald-50 text-emerald-500' : 'bg-gray-50 text-gray-400'
                  }`}>
                    <IconComp className="w-7 h-7" />
                  </div>

                  <h3 className="font-bold text-gray-900 text-lg mb-1">{loc.name}</h3>
                  <div className="flex items-center gap-1.5 text-gray-500 text-sm mb-4">
                    <MapPin className="w-3.5 h-3.5" /> {loc.city}
                  </div>

                  <div className="mt-auto pt-4 flex items-center justify-between border-t border-gray-50">
                    <div className="flex items-center gap-1.5 text-[11px] font-medium text-gray-600">
                      <Clock className="w-3.5 h-3.5" /> {loc.eta}
                    </div>
                    <div className="flex items-center gap-2">
                      <button 
                        onClick={() => handleEdit(loc)}
                        className="p-2 text-gray-400 hover:text-emerald-500 transition-colors"
                      >
                        <Edit className="w-4 h-4" />
                      </button>
                      <button 
                        onClick={() => handleDelete(loc._id)}
                        className="p-2 text-red-100 hover:text-red-500 transition-colors"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}

        {!loading && ambulances.length === 0 && (
          <div className="text-center py-20 bg-white rounded-[32px] border border-dashed border-gray-200">
            <Building2 className="w-12 h-12 text-gray-200 mx-auto mb-4" />
            <h3 className="text-gray-500 font-medium">No ambulance locations added yet</h3>
            <button onClick={() => setIsAdding(true)} className="text-emerald-600 text-sm font-bold mt-2">Add your first location</button>
          </div>
        )}
      </div>
    </main>
  );
}
