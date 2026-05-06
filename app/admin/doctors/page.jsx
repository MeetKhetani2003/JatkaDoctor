"use client";
import React, { useState, useEffect } from "react";
import {
  Plus,
  Search,
  Filter,
  MoreVertical,
  Trash2,
  Edit2,
  ExternalLink,
  Loader2,
  X,
  Check,
  Upload,
} from "lucide-react";
import Image from "next/image";

export default function AdminDoctors() {
  const [doctors, setDoctors] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editingDoctor, setEditingDoctor] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const [formData, setFormData] = useState({
    name: "",
    category: "",
    role: "",
    degree: "",
    experience: "",
    area: "",
    isVerified: true,
    image: null,
    imagePreview: "",
    description: "",
    specialization: "",
  });

  const fetchData = async () => {
    try {
      const [docsRes, catsRes] = await Promise.all([
        fetch("/api/doctors"),
        fetch("/api/categories"),
      ]);
      const docsData = await docsRes.json();
      const catsData = await catsRes.json();
      setDoctors(Array.isArray(docsData) ? docsData : []);
      setCategories(Array.isArray(catsData) ? catsData : []);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setFormData({
        ...formData,
        image: file,
        imagePreview: URL.createObjectURL(file),
      });
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      const submissionData = new FormData();
      submissionData.append("name", formData.name);
      submissionData.append("category", formData.category);
      submissionData.append("role", formData.role);
      submissionData.append("degree", formData.degree);
      submissionData.append("experience", formData.experience);
      submissionData.append("area", formData.area);
      submissionData.append("isVerified", formData.isVerified);
      submissionData.append("description", formData.description);
      
      const specArray = typeof formData.specialization === "string"
        ? formData.specialization
            .split(",")
            .map((s) => s.trim())
            .filter((s) => s)
        : formData.specialization;
      
      submissionData.append("specialization", JSON.stringify(specArray));

      if (formData.image) {
        submissionData.append("image", formData.image);
      }

      const url = editingDoctor
        ? `/api/doctors?id=${editingDoctor._id}`
        : "/api/doctors";
      const method = editingDoctor ? "PUT" : "POST";

      const res = await fetch(url, {
        method,
        body: submissionData,
      });

      if (res.ok) {
        setShowModal(false);
        setEditingDoctor(null);
        fetchData();
        setFormData({
          name: "",
          category: "",
          role: "",
          degree: "",
          experience: "",
          area: "",
          isVerified: true,
          image: null,
          imagePreview: "",
          description: "",
          specialization: "",
        });
      } else {
        const err = await res.json();
        alert(`Error: ${err.error || "Failed to save profile"}`);
      }
    } catch (e) {
      console.error(e);
      alert("Error saving profile");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleEdit = (doctor) => {
    setEditingDoctor(doctor);
    setFormData({
      name: doctor.name || "",
      category: doctor.category?._id || doctor.category || "",
      role: doctor.role || "",
      degree: doctor.degree || "",
      experience: doctor.experience || "",
      area: doctor.area || "",
      isVerified: doctor.isVerified !== false,
      image: null,
      imagePreview: doctor.imageFileId ? `/api/images/${doctor.imageFileId}` : (doctor.image || ""),
      description: doctor.description || "",
      specialization: Array.isArray(doctor.specialization)
        ? doctor.specialization.join(", ")
        : "",
    });
    setShowModal(true);
  };

  const handleDelete = async (id) => {
    if (!confirm("Are you sure you want to delete this profile?")) return;
    try {
      const res = await fetch(`/api/doctors?id=${id}`, { method: "DELETE" });
      if (res.ok) fetchData();
    } catch (e) {
      alert("Error deleting profile");
    }
  };

  return (
    <div className="space-y-6">
      {/* Header Actions */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div className="relative w-full sm:w-96">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
          <input
            type="text"
            placeholder="Search doctors..."
            className="w-full pl-10 pr-4 py-2.5 bg-white border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-primary/20"
          />
        </div>
        <button
          onClick={() => {
            setEditingDoctor(null);
            setFormData({
              name: "",
              category: "",
              role: "",
              degree: "",
              experience: "",
              area: "",
              isVerified: true,
              image: null,
              imagePreview: "",
              description: "",
              specialization: "",
            });
            setShowModal(true);
          }}
          className="bg-primary text-white px-5 py-2.5 rounded-xl text-sm font-normal flex items-center gap-2 hover:bg-primary-dark transition shadow-lg shadow-primary/20"
        >
          <Plus className="w-4 h-4" /> Add Staff Member
        </button>
      </div>

      {/* Table */}
      <div className="bg-white rounded-3xl border border-gray-100 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead className="bg-gray-50 border-b border-gray-100">
              <tr>
                <th className="px-6 py-4 text-xs font-normal text-gray-500 uppercase tracking-wider">
                  Name
                </th>
                <th className="px-6 py-4 text-xs font-normal text-gray-500 uppercase tracking-wider">
                  Role / Specialization
                </th>
                <th className="px-6 py-4 text-xs font-normal text-gray-500 uppercase tracking-wider">
                  Area
                </th>
                <th className="px-6 py-4 text-xs font-normal text-gray-500 uppercase tracking-wider">
                  Category
                </th>
                <th className="px-6 py-4 text-xs font-normal text-gray-500 uppercase tracking-wider text-right">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {loading ? (
                <tr>
                  <td colSpan="5" className="px-6 py-12 text-center">
                    <Loader2 className="w-8 h-8 animate-spin text-primary mx-auto" />
                  </td>
                </tr>
              ) : doctors.length === 0 ? (
                <tr>
                  <td
                    colSpan="5"
                    className="px-6 py-12 text-center text-gray-400 text-sm"
                  >
                    No team members found. Add your first member above.
                  </td>
                </tr>
              ) : (
                doctors.map((doctor) => (
                  <tr
                    key={doctor._id}
                    className="hover:bg-gray-50/50 transition-colors"
                  >
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-full bg-gray-100 overflow-hidden relative shrink-0">
                          <img
                            src={
                              doctor.imageFileId 
                                ? `/api/images/${doctor.imageFileId}` 
                                : (doctor.image || "https://images.unsplash.com/photo-1612349317150-e413f6a5b16d?w=400&h=400&fit=crop")
                            }
                            alt={doctor.name}
                            className="w-full h-full object-cover"
                          />
                        </div>
                        <div>
                          <p className="text-sm font-normal text-black tracking-tight">
                            {doctor.name}
                          </p>
                          <p className="text-[11px] text-gray-400">
                            {doctor.degree || doctor.experience}
                          </p>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-600">
                      {doctor.role}
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-600">
                      {doctor.area || "N/A"}
                    </td>
                    <td className="px-6 py-4">
                      <span className="text-[11px] bg-primary-light text-primary px-2.5 py-1 rounded-full font-normal">
                        {doctor.category?.name || "Uncategorized"}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-right">
                      <div className="flex items-center justify-end gap-2">
                        <button
                          onClick={() => handleEdit(doctor)}
                          className="p-2 text-gray-400 hover:text-primary hover:bg-primary-light rounded-lg transition-colors"
                        >
                          <Edit2 className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => handleDelete(doctor._id)}
                          className="p-2 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition-colors"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Add/Edit Modal */}
      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
          <div className="bg-white rounded-[32px] w-full max-w-2xl overflow-hidden shadow-2xl animate-in zoom-in-95 duration-200">
            <div className="px-8 py-6 bg-primary text-white flex justify-between items-center">
              <h3 className="text-xl font-normal tracking-tight">
                {editingDoctor ? "Edit Staff Profile" : "Add New Staff Member"}
              </h3>
              <button
                onClick={() => setShowModal(false)}
                className="p-2 hover:bg-white/20 rounded-full transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form
              onSubmit={handleSubmit}
              className="p-8 space-y-5 max-h-[70vh] overflow-y-auto"
            >
              <div className="flex flex-col items-center justify-center pb-6">
                <div className="relative w-24 h-24 rounded-full bg-gray-50 border-2 border-dashed border-gray-200 flex items-center justify-center overflow-hidden group">
                  {formData.imagePreview ? (
                    <img
                      src={formData.imagePreview}
                      alt="Preview"
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <Upload className="w-6 h-6 text-gray-300" />
                  )}
                  <div className="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                    <Upload className="w-5 h-5 text-white" />
                  </div>
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleFileChange}
                    className="absolute inset-0 opacity-0 cursor-pointer z-10"
                  />
                </div>
                <p className="mt-2 text-xs text-gray-400">Click to upload profile photo</p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                <div className="space-y-1.5">
                  <label className="text-xs font-normal text-gray-400 uppercase tracking-wider ml-1">
                    Full Name
                  </label>
                  <input
                    required
                    value={formData.name}
                    onChange={(e) =>
                      setFormData({ ...formData, name: e.target.value })
                    }
                    type="text"
                    placeholder="Name"
                    className="w-full px-4 py-3 bg-gray-50 border border-gray-100 rounded-2xl text-sm focus:outline-none focus:ring-2 focus:ring-primary/20"
                  />
                </div>
                <div className="space-y-1.5">
                  <label className="text-xs font-normal text-gray-400 uppercase tracking-wider ml-1">
                    Category
                  </label>
                  <select
                    required
                    value={formData.category}
                    onChange={(e) =>
                      setFormData({ ...formData, category: e.target.value })
                    }
                    className="w-full px-4 py-3 bg-gray-50 border border-gray-100 rounded-2xl text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 appearance-none"
                  >
                    <option value="">Select Category</option>
                    {categories.map((cat) => (
                      <option key={cat._id} value={cat._id}>
                        {cat.name}
                      </option>
                    ))}
                  </select>
                </div>
                <div className="space-y-1.5">
                  <label className="text-xs font-normal text-gray-400 uppercase tracking-wider ml-1">
                    Role / Specialization
                  </label>
                  <input
                    required
                    value={formData.role}
                    onChange={(e) =>
                      setFormData({ ...formData, role: e.target.value })
                    }
                    type="text"
                    placeholder="e.g. Nursing Staff"
                    className="w-full px-4 py-3 bg-gray-50 border border-gray-100 rounded-2xl text-sm focus:outline-none focus:ring-2 focus:ring-primary/20"
                  />
                </div>
                <div className="space-y-1.5">
                  <label className="text-xs font-normal text-gray-400 uppercase tracking-wider ml-1">
                    Experience
                  </label>
                  <input
                    required
                    value={formData.experience}
                    onChange={(e) =>
                      setFormData({ ...formData, experience: e.target.value })
                    }
                    type="text"
                    placeholder="5+ Years"
                    className="w-full px-4 py-3 bg-gray-50 border border-gray-100 rounded-2xl text-sm focus:outline-none focus:ring-2 focus:ring-primary/20"
                  />
                </div>
                <div className="space-y-1.5">
                  <label className="text-xs font-normal text-gray-400 uppercase tracking-wider ml-1">
                    Service Area
                  </label>
                  <input
                    value={formData.area}
                    onChange={(e) =>
                      setFormData({ ...formData, area: e.target.value })
                    }
                    type="text"
                    placeholder="Lucknow (All Areas)"
                    className="w-full px-4 py-3 bg-gray-50 border border-gray-100 rounded-2xl text-sm focus:outline-none focus:ring-2 focus:ring-primary/20"
                  />
                </div>
                <div className="flex items-center gap-3 pt-6">
                  <input
                    id="isVerified"
                    type="checkbox"
                    checked={formData.isVerified}
                    onChange={(e) =>
                      setFormData({ ...formData, isVerified: e.target.checked })
                    }
                    className="w-5 h-5 rounded-lg border-gray-100 text-primary focus:ring-primary/20"
                  />
                  <label
                    htmlFor="isVerified"
                    className="text-sm font-normal text-gray-600"
                  >
                    Verified by Dr. Jhatka
                  </label>
                </div>
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-normal text-gray-400 uppercase tracking-wider ml-1">
                  Degree (Optional)
                </label>
                <input
                  value={formData.degree}
                  onChange={(e) =>
                    setFormData({ ...formData, degree: e.target.value })
                  }
                  type="text"
                  placeholder="MBBS, MD (Medicine)"
                  className="w-full px-4 py-3 bg-gray-50 border border-gray-100 rounded-2xl text-sm focus:outline-none focus:ring-2 focus:ring-primary/20"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-normal text-gray-400 uppercase tracking-wider ml-1">
                  Specialization Tags (comma separated)
                </label>
                <input
                  value={formData.specialization}
                  onChange={(e) =>
                    setFormData({ ...formData, specialization: e.target.value })
                  }
                  type="text"
                  placeholder="Fever Treatment, Diabetes, BP"
                  className="w-full px-4 py-3 bg-gray-50 border border-gray-100 rounded-2xl text-sm focus:outline-none focus:ring-2 focus:ring-primary/20"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-normal text-gray-400 uppercase tracking-wider ml-1">
                  Brief Bio / Description
                </label>
                <textarea
                  value={formData.description}
                  onChange={(e) =>
                    setFormData({ ...formData, description: e.target.value })
                  }
                  rows="3"
                  className="w-full px-4 py-3 bg-gray-50 border border-gray-100 rounded-2xl text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 resize-none"
                  placeholder="Expert in medical care..."
                ></textarea>
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
                  {isSubmitting ? (
                    <Loader2 className="w-4 h-4 animate-spin" />
                  ) : (
                    <Check className="w-4 h-4" />
                  )}
                  {editingDoctor ? "Update Profile" : "Save Profile"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
