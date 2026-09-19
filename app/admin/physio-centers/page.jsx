"use client";
import React, { useState, useEffect } from "react";
import { Plus, Trash2, MapPin, Image as ImageIcon, Check, X, MoveVertical, Globe, Settings, Users, Clock, Camera, Edit2 } from "lucide-react";

export default function AdminPhysioCenters() {
  const [centers, setCenters] = useState([]);
  const [loading, setLoading] = useState(true);
  
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [activeTab, setActiveTab] = useState("basic"); // basic, media, services, settings, seo
  
  // Master Data
  const [departmentsList, setDepartmentsList] = useState([]);
  const [therapistsList, setTherapistsList] = useState([]);

  // Form State
  const initialForm = {
    name: "", subtitle: "", location: "", googleMapPin: "", mobileNumber: "", whatsappNumber: "",
    openTime: "", closeTime: "", closedDays: [],
    departments: [], treatments: [], assignedTherapists: [], equipment: [],
    homeVisitAvailable: false, serviceRadius: 5, homeVisitCharges: 0,
    sessionDuration: 45, dailyBookingLimit: 20, approvalRequired: false,
    rating: 5.0, isActive: true, displayOrder: 0,
    metaTitle: "", metaDescription: "", slug: ""
  };
  const [form, setForm] = useState(initialForm);

  const [newTreatment, setNewTreatment] = useState("");
  const [newEquipment, setNewEquipment] = useState("");
  const [newDay, setNewDay] = useState("");

  useEffect(() => {
    fetchMasterData();
    fetchCenters();
  }, []);

  const fetchMasterData = async () => {
    try {
      const [depRes, staffRes] = await Promise.all([
        fetch("/api/admin/physio-departments").then(res => res.json()),
        fetch("/api/admin/staff").then(res => res.json())
      ]);
      if (depRes.success) setDepartmentsList(depRes.data);
      if (staffRes) setTherapistsList(staffRes);
    } catch (e) {
      console.error(e);
    }
  };

  const fetchCenters = async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/admin/physio-centers");
      const data = await res.json();
      if(data.success) setCenters(data.data);
    } catch (err) {
      console.error(err);
    }
    setLoading(false);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const url = editingId ? `/api/admin/physio-centers/${editingId}` : "/api/admin/physio-centers";
      const method = editingId ? "PUT" : "POST";
      
      const res = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      });
      if (res.ok) {
        setIsFormOpen(false);
        setEditingId(null);
        setForm(initialForm);
        fetchCenters();
      }
    } catch (err) {
      console.error(err);
    }
    setLoading(false);
  };

  const handleEdit = (center) => {
    setEditingId(center._id);
    setForm({
      name: center.name || "",
      subtitle: center.subtitle || "",
      location: center.location || "",
      googleMapPin: center.googleMapPin || "",
      mobileNumber: center.mobileNumber || "",
      whatsappNumber: center.whatsappNumber || "",
      openTime: center.openTime || "",
      closeTime: center.closeTime || "",
      closedDays: center.closedDays || [],
      departments: center.departments?.map(d => d._id) || [],
      treatments: center.treatments || [],
      assignedTherapists: center.assignedTherapists?.map(t => t._id) || [],
      equipment: center.equipment || [],
      homeVisitAvailable: center.homeVisitAvailable || false,
      serviceRadius: center.serviceRadius || 5,
      homeVisitCharges: center.homeVisitCharges || 0,
      sessionDuration: center.sessionDuration || 45,
      dailyBookingLimit: center.dailyBookingLimit || 20,
      approvalRequired: center.approvalRequired || false,
      rating: center.rating || 5.0,
      isActive: center.isActive !== undefined ? center.isActive : true,
      displayOrder: center.displayOrder || 0,
      metaTitle: center.metaTitle || "",
      metaDescription: center.metaDescription || "",
      slug: center.slug || ""
    });
    setIsFormOpen(true);
  };

  const handleArchive = async (id) => {
    if (!confirm("Are you sure you want to archive this center? It will be hidden but preserved in the database.")) return;
    try {
      await fetch(`/api/admin/physio-centers/${id}`, { method: 'DELETE' });
      fetchCenters();
    } catch (e) {
      console.error("Error archiving center", e);
    }
  };

  const toggleArrayItem = (key, val) => {
    if (form[key].includes(val)) {
        setForm({...form, [key]: form[key].filter(i => i !== val)});
    } else {
        setForm({...form, [key]: [...form[key], val]});
    }
  };

  const addToArray = (key, val, resetter) => {
    if (val && !form[key].includes(val)) {
        setForm({...form, [key]: [...form[key], val]});
        resetter("");
    }
  };

  return (
    <div className="space-y-6 max-w-7xl mx-auto px-4">
      <div className="bg-white rounded-3xl border border-gray-100 p-6 shadow-sm flex justify-between items-center">
        <div>
            <h1 className="text-2xl font-bold text-gray-900">Physio Centers (Hospital-Grade)</h1>
            <p className="text-sm text-gray-500">Manage permanent clinic locations and metadata.</p>
        </div>
        <button 
          onClick={() => {
            setIsFormOpen(!isFormOpen);
            setEditingId(null);
            setForm(initialForm);
          }}
          className="bg-blue-600 text-white px-5 py-2.5 rounded-xl font-bold flex items-center gap-2 hover:bg-blue-700"
        >
          {isFormOpen ? "Cancel" : <><Plus className="w-5 h-5" /> New Center</>}
        </button>
      </div>

      {isFormOpen && (
        <div className="bg-white rounded-[24px] border border-gray-100 shadow-lg overflow-hidden">
          {/* Tabs */}
          <div className="flex border-b bg-gray-50 overflow-x-auto">
             {[
                 {id: 'basic', icon: Globe, label: 'Basic Info'},
                 {id: 'media', icon: Camera, label: 'Media & Timings'},
                 {id: 'services', icon: Users, label: 'Services & Therapists'},
                 {id: 'settings', icon: Settings, label: 'Settings & SEO'}
             ].map(tab => (
                 <button 
                    key={tab.id}
                    type="button"
                    onClick={() => setActiveTab(tab.id)}
                    className={`px-6 py-4 font-bold text-sm flex items-center gap-2 border-b-2 whitespace-nowrap ${activeTab === tab.id ? 'border-blue-600 text-blue-600 bg-white' : 'border-transparent text-gray-500 hover:bg-gray-100'}`}
                 >
                     <tab.icon className="w-4 h-4"/> {tab.label}
                 </button>
             ))}
          </div>

          <form onSubmit={handleSubmit} className="p-8">
            
            {/* BASIC INFO TAB */}
            {activeTab === 'basic' && (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                        <label className="block text-sm font-bold text-gray-700 mb-2">Clinic Name *</label>
                        <input required type="text" value={form.name} onChange={e=>setForm({...form, name: e.target.value})} className="w-full p-3 border rounded-xl" placeholder="E.g. Dr Jhatka Medicare Main Branch" />
                    </div>
                    <div>
                        <label className="block text-sm font-bold text-gray-700 mb-2">Subtitle / Area</label>
                        <input type="text" value={form.subtitle} onChange={e=>setForm({...form, subtitle: e.target.value})} className="w-full p-3 border rounded-xl" placeholder="E.g. @ Gurudwara Road" />
                    </div>
                    <div className="md:col-span-2">
                        <label className="block text-sm font-bold text-gray-700 mb-2">Full Address *</label>
                        <textarea required value={form.location} onChange={e=>setForm({...form, location: e.target.value})} className="w-full p-3 border rounded-xl h-24" placeholder="Complete address..." />
                    </div>
                    <div>
                        <label className="block text-sm font-bold text-gray-700 mb-2">Google Maps Embed/Pin URL</label>
                        <input type="text" value={form.googleMapPin} onChange={e=>setForm({...form, googleMapPin: e.target.value})} className="w-full p-3 border rounded-xl" />
                    </div>
                    <div>
                        <label className="block text-sm font-bold text-gray-700 mb-2">Contact Numbers</label>
                        <div className="grid grid-cols-2 gap-2">
                            <input type="text" placeholder="Mobile" value={form.mobileNumber} onChange={e=>setForm({...form, mobileNumber: e.target.value})} className="w-full p-3 border rounded-xl" />
                            <input type="text" placeholder="WhatsApp" value={form.whatsappNumber} onChange={e=>setForm({...form, whatsappNumber: e.target.value})} className="w-full p-3 border rounded-xl" />
                        </div>
                    </div>
                </div>
            )}

            {/* MEDIA & TIMINGS TAB */}
            {activeTab === 'media' && (
                <div className="space-y-6">
                    <div className="grid grid-cols-2 gap-6">
                        <div>
                            <label className="block text-sm font-bold text-gray-700 mb-2">Opening Time</label>
                            <input type="time" value={form.openTime} onChange={e=>setForm({...form, openTime: e.target.value})} className="w-full p-3 border rounded-xl" />
                        </div>
                        <div>
                            <label className="block text-sm font-bold text-gray-700 mb-2">Closing Time</label>
                            <input type="time" value={form.closeTime} onChange={e=>setForm({...form, closeTime: e.target.value})} className="w-full p-3 border rounded-xl" />
                        </div>
                    </div>
                    <div>
                        <label className="block text-sm font-bold text-gray-700 mb-2">Closed Days</label>
                        <div className="flex gap-2">
                            {['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'].map(day => (
                                <button type="button" key={day} onClick={() => toggleArrayItem('closedDays', day)} className={`px-4 py-2 rounded-xl text-sm font-bold border ${form.closedDays.includes(day) ? 'bg-red-50 border-red-200 text-red-600' : 'bg-gray-50'}`}>
                                    {day}
                                </button>
                            ))}
                        </div>
                    </div>
                    <div className="pt-4 border-t">
                        <p className="text-xs text-gray-500 mb-4">* Image uploads will be integrated in Phase 3. For now, placeholders will be used on the website.</p>
                        <div className="grid grid-cols-3 gap-4">
                            <div className="h-32 bg-gray-100 rounded-xl flex items-center justify-center border-2 border-dashed">Cover Banner Placeholder</div>
                            <div className="h-32 bg-gray-100 rounded-xl flex items-center justify-center border-2 border-dashed">Logo Placeholder</div>
                            <div className="h-32 bg-gray-100 rounded-xl flex items-center justify-center border-2 border-dashed">Gallery Placeholder</div>
                        </div>
                    </div>
                </div>
            )}

            {/* SERVICES & THERAPISTS TAB */}
            {activeTab === 'services' && (
                <div className="space-y-8">
                    <div>
                        <label className="block text-sm font-bold text-gray-700 mb-2">Departments (Multi-Select)</label>
                        <div className="flex flex-wrap gap-2">
                            {departmentsList.map(dep => (
                                <button type="button" key={dep._id} onClick={() => toggleArrayItem('departments', dep._id)} className={`px-4 py-2 rounded-xl text-sm font-bold border ${form.departments.includes(dep._id) ? 'bg-blue-50 border-blue-200 text-blue-700' : 'bg-white'}`}>
                                    {dep.name}
                                </button>
                            ))}
                        </div>
                    </div>

                    <div>
                        <label className="block text-sm font-bold text-gray-700 mb-2">Assigned Therapists</label>
                        <div className="flex flex-wrap gap-2">
                            {therapistsList.map(staff => staff.role === 'Doctor' && (
                                <button type="button" key={staff._id} onClick={() => toggleArrayItem('assignedTherapists', staff._id)} className={`px-4 py-2 rounded-xl text-sm font-bold border ${form.assignedTherapists.includes(staff._id) ? 'bg-purple-50 border-purple-200 text-purple-700' : 'bg-white'}`}>
                                    {staff.name}
                                </button>
                            ))}
                        </div>
                    </div>

                    <div className="grid grid-cols-2 gap-6">
                        <div>
                            <label className="block text-sm font-bold text-gray-700 mb-2">Treatments Available</label>
                            <div className="flex gap-2 mb-2">
                                <input type="text" value={newTreatment} onChange={e=>setNewTreatment(e.target.value)} className="flex-1 p-2 border rounded-lg" placeholder="e.g. Knee Pain Rehab" />
                                <button type="button" onClick={() => addToArray('treatments', newTreatment, setNewTreatment)} className="bg-gray-800 text-white px-3 rounded-lg">+</button>
                            </div>
                            <div className="flex flex-wrap gap-1">
                                {form.treatments.map((t, i) => (
                                    <span key={i} className="bg-gray-100 text-xs px-2 py-1 rounded flex items-center gap-1">{t} <X className="w-3 h-3 cursor-pointer text-red-500" onClick={()=>toggleArrayItem('treatments', t)}/></span>
                                ))}
                            </div>
                        </div>
                        <div>
                            <label className="block text-sm font-bold text-gray-700 mb-2">Equipment List</label>
                            <div className="flex gap-2 mb-2">
                                <input type="text" value={newEquipment} onChange={e=>setNewEquipment(e.target.value)} className="flex-1 p-2 border rounded-lg" placeholder="e.g. Laser Therapy Machine" />
                                <button type="button" onClick={() => addToArray('equipment', newEquipment, setNewEquipment)} className="bg-gray-800 text-white px-3 rounded-lg">+</button>
                            </div>
                            <div className="flex flex-wrap gap-1">
                                {form.equipment.map((t, i) => (
                                    <span key={i} className="bg-gray-100 text-xs px-2 py-1 rounded flex items-center gap-1">{t} <X className="w-3 h-3 cursor-pointer text-red-500" onClick={()=>toggleArrayItem('equipment', t)}/></span>
                                ))}
                            </div>
                        </div>
                    </div>
                </div>
            )}

            {/* SETTINGS & SEO TAB */}
            {activeTab === 'settings' && (
                <div className="space-y-6">
                    <div className="grid grid-cols-3 gap-6">
                        <div className="bg-blue-50 p-4 rounded-xl border border-blue-100">
                            <label className="flex items-center gap-2 font-bold text-blue-900 mb-3 cursor-pointer">
                                <input type="checkbox" checked={form.homeVisitAvailable} onChange={e=>setForm({...form, homeVisitAvailable: e.target.checked})} className="w-4 h-4"/>
                                Home Visits Available
                            </label>
                            {form.homeVisitAvailable && (
                                <div className="space-y-3">
                                    <div><label className="text-xs font-bold text-blue-800">Radius (km)</label><input type="number" value={form.serviceRadius} onChange={e=>setForm({...form, serviceRadius: Number(e.target.value)})} className="w-full p-2 border rounded mt-1"/></div>
                                    <div><label className="text-xs font-bold text-blue-800">Charges (₹)</label><input type="number" value={form.homeVisitCharges} onChange={e=>setForm({...form, homeVisitCharges: Number(e.target.value)})} className="w-full p-2 border rounded mt-1"/></div>
                                </div>
                            )}
                        </div>
                        
                        <div className="col-span-2 bg-gray-50 p-4 rounded-xl border space-y-4">
                            <h4 className="font-bold text-gray-700">Booking Rules</h4>
                            <div className="grid grid-cols-2 gap-4">
                                <div><label className="text-xs font-bold text-gray-500">Session Duration (mins)</label>
                                <select value={form.sessionDuration} onChange={e=>setForm({...form, sessionDuration: Number(e.target.value)})} className="w-full p-2 border rounded mt-1">
                                    <option value={30}>30 mins</option>
                                    <option value={45}>45 mins</option>
                                    <option value={60}>60 mins</option>
                                </select></div>
                                <div><label className="text-xs font-bold text-gray-500">Daily Booking Limit</label><input type="number" value={form.dailyBookingLimit} onChange={e=>setForm({...form, dailyBookingLimit: Number(e.target.value)})} className="w-full p-2 border rounded mt-1"/></div>
                                <div className="col-span-2">
                                    <label className="flex items-center gap-2 font-bold text-gray-700 cursor-pointer">
                                        <input type="checkbox" checked={form.approvalRequired} onChange={e=>setForm({...form, approvalRequired: e.target.checked})} className="w-4 h-4"/>
                                        Require Admin Approval for Bookings (Disable for Instant Book)
                                    </label>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="pt-4 border-t grid grid-cols-2 gap-4">
                        <div className="col-span-2"><h4 className="font-bold text-gray-700">SEO Settings</h4></div>
                        <div><label className="text-xs font-bold text-gray-500">Meta Title</label><input type="text" value={form.metaTitle} onChange={e=>setForm({...form, metaTitle: e.target.value})} className="w-full p-2 border rounded mt-1" /></div>
                        <div><label className="text-xs font-bold text-gray-500">URL Slug</label><input type="text" value={form.slug} onChange={e=>setForm({...form, slug: e.target.value})} className="w-full p-2 border rounded mt-1" /></div>
                        <div className="col-span-2"><label className="text-xs font-bold text-gray-500">Meta Description</label><textarea value={form.metaDescription} onChange={e=>setForm({...form, metaDescription: e.target.value})} className="w-full p-2 border rounded mt-1" /></div>
                    </div>
                </div>
            )}

            <div className="mt-8 pt-6 border-t flex justify-end gap-4 bg-gray-50 -mx-8 -mb-8 p-6">
                {editingId && (
                    <label className="flex items-center gap-2 mr-auto cursor-pointer">
                        <span className="font-bold text-gray-600">Active Status</span>
                        <div className={`w-12 h-6 rounded-full relative transition-colors ${form.isActive ? 'bg-green-500' : 'bg-gray-300'}`}>
                            <input type="checkbox" className="opacity-0 absolute inset-0 cursor-pointer" checked={form.isActive} onChange={e=>setForm({...form, isActive: e.target.checked})} />
                            <div className={`absolute top-1 w-4 h-4 rounded-full bg-white transition-all ${form.isActive ? 'left-7' : 'left-1'}`}></div>
                        </div>
                    </label>
                )}
                <button type="button" onClick={() => setIsFormOpen(false)} className="px-6 py-3 border font-bold text-gray-600 rounded-xl hover:bg-gray-100">Cancel</button>
                <button type="submit" disabled={loading} className="px-6 py-3 bg-blue-600 font-bold text-white rounded-xl hover:bg-blue-700">
                    {loading ? "Saving..." : (editingId ? "Update Center" : "Create Center")}
                </button>
            </div>
          </form>
        </div>
      )}

      {/* Grid of Centers */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mt-6">
        {loading && !isFormOpen ? <p>Loading centers...</p> : centers.map(center => (
            <div key={center._id} className={`bg-white rounded-2xl border p-5 shadow-sm flex flex-col ${!center.isActive ? 'opacity-60 grayscale' : ''}`}>
                <div className="flex justify-between items-start mb-3">
                    <div>
                        <h3 className="font-bold text-lg text-gray-900">{center.name}</h3>
                        <p className="text-sm text-blue-600">{center.subtitle}</p>
                    </div>
                    <div className="flex gap-2">
                        <button onClick={() => handleEdit(center)} className="p-2 bg-gray-100 hover:bg-gray-200 rounded text-gray-600"><Edit2 className="w-4 h-4"/></button>
                        <button onClick={() => handleArchive(center._id)} className="p-2 bg-red-50 hover:bg-red-100 rounded text-red-600"><Trash2 className="w-4 h-4"/></button>
                    </div>
                </div>
                
                <div className="text-sm text-gray-600 space-y-1 mb-4 flex-1">
                    <p className="flex items-center gap-2"><MapPin className="w-4 h-4 text-gray-400"/> {center.location}</p>
                    <p className="flex items-center gap-2"><Clock className="w-4 h-4 text-gray-400"/> {center.openTime} - {center.closeTime}</p>
                </div>

                <div className="flex flex-wrap gap-1 mb-4">
                    {center.departments?.map(d => <span key={d._id} className="text-[10px] bg-blue-50 text-blue-700 px-2 py-1 rounded font-bold">{d.name}</span>)}
                    {center.homeVisitAvailable && <span className="text-[10px] bg-purple-50 text-purple-700 px-2 py-1 rounded font-bold">Home Visits</span>}
                </div>
            </div>
        ))}
      </div>
    </div>
  );
}
