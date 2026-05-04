"use client";
import React, { useState, useEffect } from 'react';
import { Plus, Trash2, Edit2, Loader2, UserCog, X, Check } from 'lucide-react';
import Image from 'next/image';

export default function AdminStaff() {
  const [staff, setStaff] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [formData, setFormData] = useState({ name: '', role: '', image: 'https://images.unsplash.com/photo-1576765608596-5883596c0d6b?w=400&h=400&fit=crop', description: '' });

  const fetchData = async () => {
    try {
      const res = await fetch('/api/staff');
      const data = await res.json();
      setStaff(Array.isArray(data) ? data : []);
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
      const res = await fetch('/api/staff', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      });
      if (res.ok) {
        setShowModal(false);
        fetchData();
        setFormData({ name: '', role: '', image: 'https://images.unsplash.com/photo-1576765608596-5883596c0d6b?w=400&h=400&fit=crop', description: '' });
      }
    } catch (e) {
      alert("Error adding staff");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h3 className="text-sm font-normal text-gray-500 uppercase tracking-widest flex items-center gap-2">
          <UserCog className="w-4 h-4" /> Medical Support Staff
        </h3>
        <button 
          onClick={() => setShowModal(true)}
          className="bg-primary text-white px-5 py-2.5 rounded-xl text-sm font-normal flex items-center gap-2 hover:bg-primary-dark transition shadow-lg shadow-primary/20"
        >
          <Plus className="w-4 h-4" /> Add Staff Member
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {loading ? (
          <div className="col-span-full flex justify-center py-20">
            <Loader2 className="w-10 h-10 animate-spin text-primary" />
          </div>
        ) : staff.length === 0 ? (
          <div className="col-span-full bg-white rounded-3xl p-20 text-center border border-gray-100">
            <p className="text-gray-400 text-sm font-normal">No staff members listed.</p>
          </div>
        ) : (
          staff.map((s) => (
            <div key={s._id} className="bg-white rounded-3xl border border-gray-100 p-5 shadow-sm flex flex-col items-center text-center group hover:shadow-md transition-all">
              <div className="relative w-20 h-20 rounded-2xl overflow-hidden mb-4 shadow-sm">
                <Image src={s.image} alt={s.name} fill className="object-cover" />
              </div>
              <h4 className="text-base font-normal text-black tracking-tight">{s.name}</h4>
              <p className="text-primary text-[11px] font-normal mt-1">{s.role}</p>
              
              <div className="mt-6 flex justify-center gap-2 border-t border-gray-50 pt-4 w-full opacity-0 group-hover:opacity-100 transition-opacity">
                <button className="p-2 text-gray-400 hover:text-primary hover:bg-primary-light rounded-lg">
                  <Edit2 className="w-4 h-4" />
                </button>
                <button className="p-2 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-lg">
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
              <h3 className="text-xl font-normal tracking-tight">Add Staff Member</h3>
              <button onClick={() => setShowModal(false)} className="p-2 hover:bg-white/20 rounded-full transition-colors">
                <X className="w-5 h-5" />
              </button>
            </div>
            <form onSubmit={handleSubmit} className="p-8 space-y-5">
              <div className="space-y-1.5">
                <label className="text-xs font-normal text-gray-400 uppercase tracking-wider ml-1">Full Name</label>
                <input 
                  required
                  value={formData.name}
                  onChange={(e) => setFormData({...formData, name: e.target.value})}
                  type="text" 
                  placeholder="Nurse Sunita Singh"
                  className="w-full px-4 py-3 bg-gray-50 border border-gray-100 rounded-2xl text-sm focus:outline-none focus:ring-2 focus:ring-primary/20"
                />
              </div>
              <div className="space-y-1.5">
                <label className="text-xs font-normal text-gray-400 uppercase tracking-wider ml-1">Role / Designation</label>
                <input 
                  required
                  value={formData.role}
                  onChange={(e) => setFormData({...formData, role: e.target.value})}
                  type="text" 
                  placeholder="ICU Trained Nurse"
                  className="w-full px-4 py-3 bg-gray-50 border border-gray-100 rounded-2xl text-sm focus:outline-none focus:ring-2 focus:ring-primary/20"
                />
              </div>
              <div className="space-y-1.5">
                <label className="text-xs font-normal text-gray-400 uppercase tracking-wider ml-1">Staff Image URL</label>
                <input 
                  value={formData.image}
                  onChange={(e) => setFormData({...formData, image: e.target.value})}
                  type="text" 
                  placeholder="https://..."
                  className="w-full px-4 py-3 bg-gray-50 border border-gray-100 rounded-2xl text-sm focus:outline-none focus:ring-2 focus:ring-primary/20"
                />
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
                  Add Staff
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
