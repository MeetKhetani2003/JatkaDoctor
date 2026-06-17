"use client";

import React, { useState, useEffect } from "react";
import { 
  UserPlus, 
  Trash2, 
  Loader2, 
  CheckCircle, 
  AlertCircle, 
  ShieldAlert, 
  UserCheck 
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

  const fetchStaff = async () => {
    try {
      const res = await fetch("/api/admin/staff");
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
    fetchStaff();
  }, []);

  const handleAddStaff = async (e) => {
    e.preventDefault();
    setAdding(true);
    setMessage({ text: "", type: "" });

    try {
      const res = await fetch("/api/admin/staff", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, role, description })
      });

      const data = await res.json();
      if (res.ok) {
        setStaff([data, ...staff]);
        setName("");
        setDescription("");
        setMessage({ text: `✓ Staff member ${name} added successfully!`, type: "success" });
      } else {
        setMessage({ text: data.error || "Failed to add staff member.", type: "error" });
      }
    } catch (error) {
      console.error(error);
      setMessage({ text: "Network error adding staff.", type: "error" });
    } finally {
      setAdding(false);
    }
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
        <p className="text-gray-500 text-sm font-normal">Add and manage medical, nursing, physiotherapy, and ambulance staff.</p>
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
              Add Staff Member
            </h3>

            <form onSubmit={handleAddStaff} className="space-y-4">
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
                <label className="text-xs font-bold text-gray-600 block">Bio / Notes</label>
                <textarea
                  placeholder="Details about experience, availability, or contact..."
                  rows={4}
                  value={description}
                  onChange={e => setDescription(e.target.value)}
                  className="w-full px-4 py-3 rounded-xl bg-gray-50 border border-gray-200 text-sm outline-none focus:ring-2 focus:ring-primary/20 resize-none"
                />
              </div>

              <button
                type="submit"
                disabled={adding}
                className="w-full py-3 bg-primary text-white font-bold rounded-xl hover:bg-primary-dark transition active:scale-95 flex items-center justify-center gap-2 disabled:opacity-50"
              >
                {adding ? <Loader2 className="w-4 h-4 animate-spin" /> : <UserPlus className="w-4 h-4" />}
                Register Staff
              </button>
            </form>
          </div>
        </div>

        {/* Right Column: List */}
        <div className="lg:col-span-8">
          <div className="bg-white rounded-3xl border border-gray-100 shadow-sm overflow-hidden">
            <div className="px-6 py-4 border-b border-gray-100 flex items-center justify-between">
              <h3 className="font-bold text-gray-900">Active Staff Directory</h3>
              <span className="text-xs font-bold text-gray-400 bg-gray-100 px-2.5 py-1 rounded-full">{staff.length} registered</span>
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
                    <div className="flex gap-4">
                      <div className="w-12 h-12 bg-primary/10 rounded-2xl flex items-center justify-center text-primary shrink-0">
                        <UserCheck className="w-6 h-6" />
                      </div>
                      <div className="space-y-1">
                        <h4 className="font-bold text-gray-900">{member.name}</h4>
                        <div className="flex items-center gap-2">
                          <span className="px-2 py-0.5 rounded-full text-[10px] font-black uppercase tracking-wider bg-primary-light text-primary border border-primary/20">
                            {member.role}
                          </span>
                        </div>
                        {member.description && (
                          <p className="text-xs text-gray-500 max-w-lg leading-relaxed pt-1">{member.description}</p>
                        )}
                      </div>
                    </div>

                    <button
                      onClick={() => handleDeleteStaff(member._id, member.name)}
                      className="p-2 bg-red-50 hover:bg-red-100 text-red-600 rounded-xl transition border border-red-200"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
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
