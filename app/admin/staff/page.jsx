"use client";

import React, { useState, useEffect } from "react";
import { 
  UserPlus, 
  Trash2, 
  Loader2, 
  CheckCircle, 
  AlertCircle, 
  ShieldAlert, 
  UserCheck,
  Edit2,
  X,
  Upload
} from "lucide-react";

export default function AdminStaffManagement() {
  const [staff, setStaff] = useState([]);
  const [loading, setLoading] = useState(true);
  const [adding, setAdding] = useState(false);
  const [message, setMessage] = useState({ text: "", type: "" });

  // Form Fields
  const [name, setName] = useState("");
  const [role, setRole] = useState("Nurse");
  const [description, setDescription] = useState("");
  const [mobile, setMobile] = useState("");
  const [whatsapp, setWhatsapp] = useState("");
  const [zone, setZone] = useState("Gomti Nagar Zone");
  const [experience, setExperience] = useState("");
  const [qualification, setQualification] = useState("");
  const [status, setStatus] = useState("Active");
  const [rating, setRating] = useState("4.9");
  const [filterZone, setFilterZone] = useState("");

  // Photo states
  const [imageFile, setImageFile] = useState(null);
  const [imagePreview, setImagePreview] = useState("");

  // Editing state
  const [editingId, setEditingId] = useState(null);

  const LUCKNOW_ZONES = [
    "Central Lucknow Zone",
    "Gomti Nagar Zone",
    "Indira Nagar Zone",
    "Alambagh / Airport Zone",
    "North / Outer Lucknow Zone"
  ];

  const fetchStaff = async () => {
    try {
      let url = "/api/admin/staff";
      if (filterZone) {
        url += `?zone=${encodeURIComponent(filterZone)}`;
      }
      const res = await fetch(url);
      const data = await res.json();
      setStaff(Array.isArray(data) ? data : []);
    } catch (e) {
      console.error(e);
      setMessage({ text: "Failed to load staff list", type: "error" });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    setLoading(true);
    fetchStaff();
  }, [filterZone]);

  const handleSubmitStaff = async (e) => {
    e.preventDefault();
    setAdding(true);
    setMessage({ text: "", type: "" });

    try {
      const formData = new FormData();
      formData.append("name", name);
      formData.append("role", role);
      formData.append("description", description);
      formData.append("mobile", mobile);
      formData.append("whatsapp", whatsapp);
      formData.append("zone", zone);
      formData.append("experience", experience);
      formData.append("qualification", qualification);
      formData.append("status", status);
      formData.append("rating", rating);

      if (imageFile) {
        formData.append("image", imageFile);
      }

      let res;
      if (editingId) {
        res = await fetch(`/api/admin/staff/${editingId}`, {
          method: "PATCH",
          body: formData
        });
      } else {
        res = await fetch("/api/admin/staff", {
          method: "POST",
          body: formData
        });
      }

      const data = await res.json();
      if (res.ok) {
        if (editingId) {
          setStaff(staff.map(s => s._id === editingId ? data : s));
          setMessage({ text: `✓ Staff member ${name} updated successfully!`, type: "success" });
          handleCancelEdit();
        } else {
          setStaff([data, ...staff]);
          handleClearForm();
          setMessage({ text: `✓ Staff member ${name} added successfully!`, type: "success" });
        }
      } else {
        setMessage({ text: data.error || "Failed to save staff member.", type: "error" });
      }
    } catch (error) {
      console.error(error);
      setMessage({ text: "Network error saving staff.", type: "error" });
    } finally {
      setAdding(false);
    }
  };

  const handleStartEdit = (member) => {
    setEditingId(member._id);
    setName(member.name || "");
    setRole(member.role || "Nurse");
    setDescription(member.description || "");
    setMobile(member.mobile || "");
    setWhatsapp(member.whatsapp || "");
    setZone(member.zone || "Gomti Nagar Zone");
    setExperience(member.experience || "");
    setQualification(member.qualification || "");
    setStatus(member.status || "Active");
    setRating(member.rating || "4.9");
    setImageFile(null);
    setImagePreview(member.image || "");
  };

  const handleCancelEdit = () => {
    setEditingId(null);
    handleClearForm();
  };

  const handleClearForm = () => {
    setName("");
    setRole("Nurse");
    setDescription("");
    setMobile("");
    setWhatsapp("");
    setZone("Gomti Nagar Zone");
    setExperience("");
    setQualification("");
    setStatus("Active");
    setRating("4.9");
    setImageFile(null);
    setImagePreview("");
  };

  const handleDeleteStaff = async (id, staffName) => {
    if (!confirm(`Are you sure you want to delete staff member "${staffName}"?`)) return;

    try {
      const res = await fetch(`/api/admin/staff/${id}`, {
        method: "DELETE"
      });

      if (res.ok) {
        setStaff(staff.filter(s => s._id !== id));
        setMessage({ text: `✓ Staff member ${staffName} deleted successfully.`, type: "success" });
        if (editingId === id) {
          handleCancelEdit();
        }
      } else {
        const data = await res.json();
        setMessage({ text: data.error || "Failed to delete staff member.", type: "error" });
      }
    } catch (error) {
      console.error(error);
      setMessage({ text: "Network error deleting staff.", type: "error" });
    }
  };

  return (
    <div className="space-y-8">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-normal text-black tracking-tight mb-2">Staff Directory Management</h1>
        <p className="text-gray-500 text-sm font-normal">Add, edit and manage medical, nursing, physiotherapy, and ambulance staff.</p>
      </div>

      {message.text && (
        <div className={`p-4 rounded-2xl flex items-center gap-3 text-sm border ${
          message.type === "success" 
            ? "bg-green-50 border-green-200 text-green-800" 
            : "bg-red-50 border-red-200 text-red-800"
        }`}>
          {message.type === "success" ? <CheckCircle className="w-5 h-5 shrink-0" /> : <AlertCircle className="w-5 h-5 shrink-0" />}
          <span>{message.text}</span>
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Left Column: Form */}
        <div className="lg:col-span-4">
          <div className="bg-white rounded-3xl border border-gray-100 p-6 shadow-sm space-y-4">
            <h3 className="text-lg font-bold text-gray-900 flex items-center gap-2">
              <UserPlus className="w-5 h-5 text-primary" />
              {editingId ? "Edit Staff Details" : "Add Staff Member"}
            </h3>

            <form onSubmit={handleSubmitStaff} className="space-y-4">
              <div className="space-y-1">
                <label className="text-xs font-bold text-gray-600 block">Full Name</label>
                <input
                  type="text"
                  required
                  placeholder="e.g., Dr. Ajay Sharma"
                  value={name}
                  onChange={e => setName(e.target.value)}
                  className="w-full px-4 py-3 rounded-xl bg-gray-50 border border-gray-200 text-sm outline-none focus:ring-2 focus:ring-primary/20"
                />
              </div>

              {/* Photo Upload */}
              <div className="space-y-1">
                <label className="text-xs font-bold text-gray-600 block">Profile Photo</label>
                <div className="flex items-center gap-4 p-3 bg-gray-50 rounded-2xl border border-gray-200/50">
                  {imagePreview ? (
                    <div className="relative w-14 h-14 rounded-xl overflow-hidden border border-gray-200 shrink-0 bg-white">
                      <img src={imagePreview} alt="Preview" className="w-full h-full object-cover" />
                      <button
                        type="button"
                        onClick={() => {
                          setImageFile(null);
                          setImagePreview("");
                        }}
                        className="absolute inset-0 bg-black/60 text-white flex items-center justify-center opacity-0 hover:opacity-100 transition-opacity"
                        title="Remove Photo"
                      >
                        <X className="w-4 h-4" />
                      </button>
                    </div>
                  ) : (
                    <div className="w-14 h-14 rounded-xl border border-dashed border-gray-300 flex items-center justify-center text-gray-400 shrink-0 bg-white">
                      <Upload className="w-4 h-4" />
                    </div>
                  )}
                  <label className="flex-1 cursor-pointer">
                    <div className="px-3 py-2 rounded-xl border border-gray-200 text-center text-xs font-bold text-gray-700 bg-white hover:bg-gray-50 transition active:scale-95">
                      Choose Photo
                    </div>
                    <input
                      type="file"
                      accept="image/*"
                      className="hidden"
                      onChange={e => {
                        const file = e.target.files[0];
                        if (file) {
                          setImageFile(file);
                          setImagePreview(URL.createObjectURL(file));
                        }
                      }}
                    />
                  </label>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="text-xs font-bold text-gray-600 block">Role</label>
                  <select
                    required
                    value={role}
                    onChange={e => setRole(e.target.value)}
                    className="w-full px-4 py-3.5 rounded-xl bg-gray-50 border border-gray-200 text-sm text-gray-700 outline-none focus:ring-2 focus:ring-primary/20"
                  >
                    <option value="Doctor">Doctor</option>
                    <option value="Physiotherapist">Physiotherapist</option>
                    <option value="Nurse">Nurse</option>
                    <option value="Ambulance Staff">Ambulance Staff</option>
                  </select>
                </div>

                <div className="space-y-1">
                  <label className="text-xs font-bold text-gray-600 block">Status</label>
                  <select
                    required
                    value={status}
                    onChange={e => setStatus(e.target.value)}
                    className="w-full px-4 py-3.5 rounded-xl bg-gray-50 border border-gray-200 text-sm text-gray-700 outline-none focus:ring-2 focus:ring-primary/20"
                  >
                    <option value="Active">Active</option>
                    <option value="Busy">Busy</option>
                    <option value="Offline">Offline</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="text-xs font-bold text-gray-600 block">Mobile No</label>
                  <input
                    type="tel"
                    required
                    placeholder="e.g. 9876543210"
                    value={mobile}
                    onChange={e => setMobile(e.target.value)}
                    className="w-full px-4 py-3 rounded-xl bg-gray-50 border border-gray-200 text-sm outline-none focus:ring-2 focus:ring-primary/20"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-xs font-bold text-gray-600 block">WhatsApp No</label>
                  <input
                    type="tel"
                    required
                    placeholder="e.g. 9876543210"
                    value={whatsapp}
                    onChange={e => setWhatsapp(e.target.value)}
                    className="w-full px-4 py-3 rounded-xl bg-gray-50 border border-gray-200 text-sm outline-none focus:ring-2 focus:ring-primary/20"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="text-xs font-bold text-gray-600 block">Experience</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. 5 Years"
                    value={experience}
                    onChange={e => setExperience(e.target.value)}
                    className="w-full px-4 py-3 rounded-xl bg-gray-50 border border-gray-200 text-sm outline-none focus:ring-2 focus:ring-primary/20"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-xs font-bold text-gray-600 block">Rating</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. 4.9"
                    value={rating}
                    onChange={e => setRating(e.target.value)}
                    className="w-full px-4 py-3 rounded-xl bg-gray-50 border border-gray-200 text-sm outline-none focus:ring-2 focus:ring-primary/20"
                  />
                </div>
              </div>

              <div className="space-y-1">
                <label className="text-xs font-bold text-gray-600 block">Qualification</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. MBBS, MD / GNM"
                  value={qualification}
                  onChange={e => setQualification(e.target.value)}
                  className="w-full px-4 py-3 rounded-xl bg-gray-50 border border-gray-200 text-sm outline-none focus:ring-2 focus:ring-primary/20"
                />
              </div>

              <div className="space-y-1">
                <label className="text-xs font-bold text-gray-600 block">Operational Zone (Lucknow)</label>
                <select
                  required
                  value={zone}
                  onChange={e => setZone(e.target.value)}
                  className="w-full px-4 py-3.5 rounded-xl bg-gray-50 border border-gray-200 text-sm text-gray-700 outline-none focus:ring-2 focus:ring-primary/20"
                >
                  {LUCKNOW_ZONES.map(z => (
                    <option key={z} value={z}>{z}</option>
                  ))}
                </select>
              </div>

              <div className="space-y-1">
                <label className="text-xs font-bold text-gray-600 block">Bio / Notes</label>
                <textarea
                  placeholder="Details about experience, availability, or contact..."
                  rows={3}
                  value={description}
                  onChange={e => setDescription(e.target.value)}
                  className="w-full px-4 py-3 rounded-xl bg-gray-50 border border-gray-200 text-sm outline-none focus:ring-2 focus:ring-primary/20 resize-none"
                />
              </div>

              <div className="flex gap-2">
                {editingId && (
                  <button
                    type="button"
                    onClick={handleCancelEdit}
                    className="flex-1 py-3 bg-gray-100 hover:bg-gray-200 text-gray-800 font-bold rounded-xl transition active:scale-95 flex items-center justify-center gap-2"
                  >
                    Cancel
                  </button>
                )}
                <button
                  type="submit"
                  disabled={adding}
                  className="flex-2 w-full py-3 bg-primary text-white font-bold rounded-xl hover:bg-primary-dark transition active:scale-95 flex items-center justify-center gap-2 disabled:opacity-50"
                >
                  {adding ? <Loader2 className="w-4 h-4 animate-spin" /> : <UserPlus className="w-4 h-4" />}
                  {editingId ? "Save Changes" : "Register Staff"}
                </button>
              </div>
            </form>
          </div>
        </div>

        {/* Right Column: List */}
        <div className="lg:col-span-8">
          <div className="bg-white rounded-3xl border border-gray-100 shadow-sm overflow-hidden">
            <div className="px-6 py-4 border-b border-gray-100 flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-4">
              <div>
                <h3 className="font-bold text-gray-900">Active Staff Directory</h3>
                <span className="text-[10px] font-bold text-gray-400 bg-gray-100 px-2 py-0.5 rounded-full">{staff.length} registered</span>
              </div>
              
              {/* Zone Filter */}
              <div className="relative w-full sm:w-60">
                <select
                  value={filterZone}
                  onChange={e => setFilterZone(e.target.value)}
                  className="w-full pl-3 pr-8 py-2 bg-gray-50 border border-gray-200 rounded-xl text-xs text-gray-700 outline-none focus:ring-2 focus:ring-primary/20 appearance-none"
                >
                  <option value="">All Zones</option>
                  {LUCKNOW_ZONES.map(z => (
                    <option key={z} value={z}>{z}</option>
                  ))}
                </select>
                <div className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none text-gray-400 text-xs">▼</div>
              </div>
            </div>

            {loading ? (
              <div className="p-20 text-center">
                <Loader2 className="w-8 h-8 animate-spin text-primary mx-auto mb-2" />
                <p className="text-sm text-gray-500">Loading staff records...</p>
              </div>
            ) : staff.length === 0 ? (
              <div className="p-20 text-center text-gray-400 space-y-2">
                <ShieldAlert className="w-12 h-12 mx-auto text-gray-200" />
                <p className="font-bold">No staff registered yet</p>
                <p className="text-xs max-w-xs mx-auto">Use the registry form on the left to add your doctors, nurses, and ambulance staff.</p>
              </div>
            ) : (
              <div className="divide-y divide-gray-100">
                {staff.map((member) => (
                  <div key={member._id} className="p-6 flex justify-between items-start group hover:bg-gray-50/50 transition-colors">
                    <div className="flex gap-4 w-full">
                      {member.image || member.imageFileId ? (
                        <div className="w-12 h-12 rounded-2xl overflow-hidden shrink-0 self-start border border-gray-100 shadow-sm bg-gray-50">
                          <img
                            src={member.imageFileId ? `/api/images/${member.imageFileId}` : member.image}
                            alt={member.name}
                            className="w-full h-full object-cover"
                          />
                        </div>
                      ) : (
                        <div className="w-12 h-12 bg-primary/10 rounded-2xl flex items-center justify-center text-primary shrink-0 self-start">
                          <UserCheck className="w-6 h-6" />
                        </div>
                      )}
                      <div className="space-y-1 flex-1 min-w-0">
                        <div className="flex items-center gap-3 flex-wrap">
                          <h4 className="font-bold text-gray-900 text-sm">{member.name}</h4>
                          <span className="px-2 py-0.5 rounded-full text-[9px] font-black uppercase tracking-wider bg-primary-light text-primary border border-primary/20">
                            {member.role}
                          </span>
                          
                          {/* Rating Badge */}
                          <span className="px-2 py-0.5 rounded-full text-[9px] font-bold bg-amber-50 text-amber-700 border border-amber-200 flex items-center gap-0.5">
                            ★ {member.rating || '4.9'}
                          </span>

                          {/* Status Badge */}
                          <span className={`px-2 py-0.5 rounded-full text-[9px] font-bold ${
                            member.status === 'Active' 
                              ? 'bg-green-50 text-green-700 border border-green-200' 
                              : member.status === 'Busy'
                                ? 'bg-amber-50 text-amber-700 border border-amber-200'
                                : 'bg-gray-100 text-gray-600 border border-gray-200'
                          }`}>
                            ● {member.status || 'Active'}
                          </span>
                        </div>

                        {/* Professional Info Grid */}
                        <div className="grid grid-cols-1 sm:grid-cols-3 gap-y-1.5 gap-x-4 text-[11px] text-gray-500 py-2">
                          <div>📍 Zone: <span className="text-gray-800 font-semibold">{member.zone || "N/A"}</span></div>
                          <div>📞 Mob: <span className="text-gray-800 font-semibold">{member.mobile || "N/A"}</span></div>
                          <div>💬 WA: <span className="text-gray-800 font-semibold">{member.whatsapp || "N/A"}</span></div>
                          <div>🎓 Qual: <span className="text-gray-800 font-semibold">{member.qualification || "N/A"}</span></div>
                          <div>⏳ Exp: <span className="text-gray-800 font-semibold">{member.experience || "N/A"}</span></div>
                        </div>

                        {member.description && (
                          <p className="text-xs text-gray-500 max-w-lg leading-relaxed pt-1 border-t border-gray-100 mt-1">{member.description}</p>
                        )}
                      </div>
                    </div>

                    <div className="flex items-center gap-2 shrink-0">
                      <button
                        onClick={() => handleStartEdit(member)}
                        className="p-2 bg-blue-50 hover:bg-blue-100 text-blue-600 rounded-xl transition border border-blue-200"
                        title="Edit Staff Member"
                      >
                        <Edit2 className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => handleDeleteStaff(member._id, member.name)}
                        className="p-2 bg-red-50 hover:bg-red-100 text-red-600 rounded-xl transition border border-red-200"
                        title="Delete Staff Member"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
