"use client";
import { useState, useEffect } from "react";
import { 
  Plus, Edit2, Trash2, Check, X, RefreshCw, Upload, Search, 
  Star, Eye, EyeOff, Sparkles, Tag, Clock, MapPin, IndianRupee,
  Layers, ShieldCheck, HeartHandshake, HelpCircle, FileText
} from "lucide-react";

export default function HomeCareServiceManager({ 
  category = "home-care", 
  title = "Home Care Service Management",
  subtitle = "Manage home care services, pricing, availability and display settings"
}) {
  const [services, setServices] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("All");

  // Modal State
  const [showModal, setShowModal] = useState(false);
  const [activeModalTab, setActiveModalTab] = useState("basic");
  const [formData, setFormData] = useState({});
  const [editId, setEditId] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isUploading, setIsUploading] = useState(false);

  // New FAQ inputs
  const [newFaqQ, setNewFaqQ] = useState("");
  const [newFaqA, setNewFaqA] = useState("");
  const [newIncludedItem, setNewIncludedItem] = useState("");
  const [newTargetPatient, setNewTargetPatient] = useState("");

  const defaultIncludedServices = category === "nursing-care" ? [
    "Vital Monitoring (BP, SpO2, Temperature)",
    "Medication Assistance",
    "Injection Assistance (IV/IM)",
    "Wound / Dressing Care",
    "Catheter Care",
    "Feeding Assistance",
    "Personal Care & Hygiene",
    "Mobility Assistance",
    "Doctor Coordination",
    "Physiotherapy Support",
  ] : [
    "Personal Care & Hygiene",
    "Mobility Assistance",
    "Feeding Assistance",
    "Medication Reminders",
    "Doctor Visit Coordination",
    "Physiotherapy Support",
    "Vital Signs Checking",
    "Companionship",
  ];

  const fetchServices = async () => {
    setLoading(true);
    try {
      const res = await fetch(`/api/admin/home-care-services?category=${category}`);
      const data = await res.json();
      if (data.success) {
        setServices(data.data || []);
      }
    } catch (err) {
      console.error("Error fetching services:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchServices();
  }, [category]);

  const handleOpenModal = (service = null) => {
    if (service) {
      setFormData({
        ...service,
        includedServices: service.includedServices || [],
        targetPatients: service.targetPatients || [],
        faqs: service.faqs || [],
        availabilityDays: service.availabilityDays || ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"],
      });
      setEditId(service._id);
    } else {
      setFormData({
        name: "",
        category: category,
        shortDescription: "",
        fullDescription: "",
        mainImage: "",
        icon: category === "nursing-care" ? "HeartPulse" : "UserCheck",
        duration: category === "nursing-care" ? "1-2 Hours" : "Day Care (8 Hours)",
        requiredStaffType: category === "nursing-care" ? "Nurse" : "Caregiver / Attendant",
        pricingType: "Starting From",
        price: category === "nursing-care" ? 499 : 399,
        priceUnit: category === "nursing-care" ? "visit" : "day",
        hasOffer: false,
        discountType: "Percentage",
        discountValue: 10,
        offerStartDate: "",
        offerEndDate: "",
        includedServices: defaultIncludedServices.slice(0, 4),
        targetPatients: category === "nursing-care" 
          ? ["Post-Surgery Patients", "Bedridden Patients", "Chronic Condition Patients"] 
          : ["Elderly Patients", "Bedridden Patients", "Recovery Support"],
        faqs: [],
        serviceAreaType: "all",
        selectedAreas: [],
        availabilityDays: ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"],
        workingHours: "9:00 AM - 8:00 PM",
        minNoticeTime: "1 Hour",
        is24x7: false,
        isSameDayBooking: true,
        displayOrder: services.length + 1,
        status: "Active",
        showOnWebsite: true,
        isPopular: false,
        badge: "",
      });
      setEditId(null);
    }
    setActiveModalTab("basic");
    setShowModal(true);
  };

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const toggleDay = (day) => {
    setFormData((prev) => {
      const current = prev.availabilityDays || [];
      const updated = current.includes(day)
        ? current.filter((d) => d !== day)
        : [...current, day];
      return { ...prev, availabilityDays: updated };
    });
  };

  const toggleIncludedService = (serviceItem) => {
    setFormData((prev) => {
      const current = prev.includedServices || [];
      const updated = current.includes(serviceItem)
        ? current.filter((s) => s !== serviceItem)
        : [...current, serviceItem];
      return { ...prev, includedServices: updated };
    });
  };

  const addCustomIncluded = () => {
    if (!newIncludedItem.trim()) return;
    setFormData((prev) => ({
      ...prev,
      includedServices: [...(prev.includedServices || []), newIncludedItem.trim()],
    }));
    setNewIncludedItem("");
  };

  const addTargetPatient = () => {
    if (!newTargetPatient.trim()) return;
    setFormData((prev) => ({
      ...prev,
      targetPatients: [...(prev.targetPatients || []), newTargetPatient.trim()],
    }));
    setNewTargetPatient("");
  };

  const removeTargetPatient = (index) => {
    setFormData((prev) => ({
      ...prev,
      targetPatients: prev.targetPatients.filter((_, i) => i !== index),
    }));
  };

  const addFaq = () => {
    if (!newFaqQ.trim() || !newFaqA.trim()) return;
    setFormData((prev) => ({
      ...prev,
      faqs: [...(prev.faqs || []), { question: newFaqQ.trim(), answer: newFaqA.trim() }],
    }));
    setNewFaqQ("");
    setNewFaqA("");
  };

  const removeFaq = (index) => {
    setFormData((prev) => ({
      ...prev,
      faqs: prev.faqs.filter((_, i) => i !== index),
    }));
  };

  // Quick toggle Popular or Status directly from table
  const handleTogglePopular = async (svc) => {
    try {
      const res = await fetch(`/api/admin/home-care-services/${svc._id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ isPopular: !svc.isPopular }),
      });
      if (res.ok) {
        setServices((prev) =>
          prev.map((s) => (s._id === svc._id ? { ...s, isPopular: !s.isPopular } : s))
        );
      }
    } catch (err) {
      console.error("Toggle popular error:", err);
    }
  };

  const handleToggleStatus = async (svc) => {
    const nextStatus = svc.status === "Active" ? "Inactive" : "Active";
    try {
      const res = await fetch(`/api/admin/home-care-services/${svc._id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status: nextStatus }),
      });
      if (res.ok) {
        setServices((prev) =>
          prev.map((s) => (s._id === svc._id ? { ...s, status: nextStatus } : s))
        );
      }
    } catch (err) {
      console.error("Toggle status error:", err);
    }
  };

  const handleDelete = async (id) => {
    if (!confirm("Are you sure you want to delete or archive this service?")) return;
    try {
      const res = await fetch(`/api/admin/home-care-services/${id}`, { method: "DELETE" });
      const data = await res.json();
      if (data.success) {
        alert(data.message || "Service deleted");
        fetchServices();
      } else {
        alert("Error: " + data.error);
      }
    } catch (err) {
      console.error("Delete error:", err);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    const endpoint = editId
      ? `/api/admin/home-care-services/${editId}`
      : `/api/admin/home-care-services`;
    const method = editId ? "PUT" : "POST";

    try {
      const res = await fetch(endpoint, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });
      const resData = await res.json();
      if (resData.success) {
        setShowModal(false);
        fetchServices();
      } else {
        alert("Error: " + (resData.error || "Save failed"));
      }
    } catch (err) {
      console.error("Save error:", err);
      alert("Failed to save service");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    setIsUploading(true);

    const uploadData = new FormData();
    uploadData.append("file", file);

    fetch("/api/admin/upload", { method: "POST", body: uploadData })
      .then((res) => res.json())
      .then((data) => {
        if (data.url) {
          setFormData((prev) => ({ ...prev, mainImage: data.url }));
        } else {
          alert("Upload failed: " + (data.error || "Unknown"));
        }
      })
      .catch((err) => {
        console.error("Upload error:", err);
        alert("Upload error");
      })
      .finally(() => setIsUploading(false));
  };

  const filteredServices = services.filter((s) => {
    const matchesSearch =
      s.name?.toLowerCase().includes(search.toLowerCase()) ||
      s.shortDescription?.toLowerCase().includes(search.toLowerCase());
    const matchesStatus = statusFilter === "All" || s.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  return (
    <div className="p-6 max-w-7xl mx-auto space-y-6">
      {/* Top Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-white p-6 rounded-2xl border border-gray-100 shadow-sm">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 tracking-tight flex items-center gap-3">
            {category === "nursing-care" ? <HeartHandshake className="w-7 h-7 text-emerald-600" /> : <Layers className="w-7 h-7 text-emerald-600" />}
            {title}
          </h1>
          <p className="text-sm text-gray-500 mt-1">{subtitle}</p>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={fetchServices}
            className="p-2.5 text-gray-500 hover:text-emerald-600 hover:bg-emerald-50 rounded-xl transition"
            title="Refresh List"
          >
            <RefreshCw className={`w-5 h-5 ${loading ? "animate-spin" : ""}`} />
          </button>
          <button
            onClick={() => handleOpenModal()}
            className="flex items-center gap-2 px-5 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white font-medium text-sm rounded-xl shadow-sm transition"
          >
            <Plus className="w-4 h-4" />
            Add New Service
          </button>
        </div>
      </div>

      {/* Filter & Search Bar */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-4 bg-white p-4 rounded-xl border border-gray-100 shadow-sm">
        <div className="relative w-full sm:w-80">
          <Search className="w-4 h-4 text-gray-400 absolute left-3 top-3.5" />
          <input
            type="text"
            placeholder="Search services..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-9 pr-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500"
          />
        </div>

        <div className="flex items-center gap-2 w-full sm:w-auto">
          {["All", "Active", "Inactive", "Archived"].map((st) => (
            <button
              key={st}
              onClick={() => setStatusFilter(st)}
              className={`px-3.5 py-1.5 rounded-lg text-xs font-semibold transition ${
                statusFilter === st
                  ? "bg-emerald-600 text-white"
                  : "bg-gray-100 text-gray-600 hover:bg-gray-200"
              }`}
            >
              {st}
            </button>
          ))}
        </div>
      </div>

      {/* Services Table */}
      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm text-gray-600">
            <thead className="bg-gray-50/80 text-gray-500 font-semibold text-xs uppercase border-b border-gray-100">
              <tr>
                <th className="py-4 px-4 w-12">#</th>
                <th className="py-4 px-4">Service Name</th>
                <th className="py-4 px-4">Category</th>
                <th className="py-4 px-4">Duration</th>
                <th className="py-4 px-4">Starting Price</th>
                <th className="py-4 px-4 text-center">Status</th>
                <th className="py-4 px-4 text-center">Popular</th>
                <th className="py-4 px-4 text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {loading ? (
                <tr>
                  <td colSpan={8} className="py-12 text-center text-gray-400">
                    <RefreshCw className="w-6 h-6 animate-spin mx-auto mb-2 text-emerald-600" />
                    Loading services...
                  </td>
                </tr>
              ) : filteredServices.length === 0 ? (
                <tr>
                  <td colSpan={8} className="py-12 text-center text-gray-400">
                    No services found. Click "Add New Service" to create one.
                  </td>
                </tr>
              ) : (
                filteredServices.map((svc, index) => (
                  <tr key={svc._id} className="hover:bg-gray-50/70 transition">
                    <td className="py-4 px-4 font-mono text-xs text-gray-400">{index + 1}</td>
                    <td className="py-4 px-4">
                      <div className="flex items-center gap-3">
                        <img
                          src={svc.mainImage || "https://images.unsplash.com/photo-1576765608535-5f04d1e3f289?auto=format&fit=crop&w=150&q=80"}
                          alt={svc.name}
                          className="w-11 h-11 rounded-lg object-cover border border-gray-100"
                        />
                        <div>
                          <p className="font-semibold text-gray-900">{svc.name}</p>
                          <p className="text-xs text-gray-500 line-clamp-1 max-w-xs">
                            {svc.shortDescription}
                          </p>
                        </div>
                      </div>
                    </td>
                    <td className="py-4 px-4">
                      <span className="px-2.5 py-1 bg-emerald-50 text-emerald-700 rounded-md text-xs font-medium capitalize">
                        {svc.category.replace("-", " ")}
                      </span>
                    </td>
                    <td className="py-4 px-4 text-xs text-gray-600">
                      {svc.duration || "Flexible"}
                    </td>
                    <td className="py-4 px-4 font-semibold text-gray-900">
                      {svc.pricingType === "Custom Quote" ? (
                        <span className="text-xs text-purple-700 bg-purple-50 px-2 py-0.5 rounded">
                          Custom Quote
                        </span>
                      ) : (
                        <span>
                          ₹{svc.price}
                          <span className="text-xs text-gray-400 font-normal">
                            /{svc.priceUnit || "day"}
                          </span>
                        </span>
                      )}
                    </td>
                    <td className="py-4 px-4 text-center">
                      <button
                        onClick={() => handleToggleStatus(svc)}
                        className={`px-3 py-1 rounded-full text-xs font-semibold cursor-pointer transition ${
                          svc.status === "Active"
                            ? "bg-emerald-100 text-emerald-800 hover:bg-emerald-200"
                            : svc.status === "Inactive"
                            ? "bg-amber-100 text-amber-800 hover:bg-amber-200"
                            : "bg-gray-100 text-gray-600"
                        }`}
                      >
                        {svc.status}
                      </button>
                    </td>
                    <td className="py-4 px-4 text-center">
                      <button
                        onClick={() => handleTogglePopular(svc)}
                        className={`p-1.5 rounded-lg transition ${
                          svc.isPopular
                            ? "text-amber-500 bg-amber-50 hover:bg-amber-100"
                            : "text-gray-300 hover:text-gray-500"
                        }`}
                        title={svc.isPopular ? "Popular Service ON" : "Turn Popular ON"}
                      >
                        <Star className={`w-5 h-5 ${svc.isPopular ? "fill-amber-400" : ""}`} />
                      </button>
                    </td>
                    <td className="py-4 px-4 text-right">
                      <div className="flex items-center justify-end gap-2">
                        <button
                          onClick={() => handleOpenModal(svc)}
                          className="p-1.5 text-gray-500 hover:text-emerald-600 hover:bg-emerald-50 rounded-lg transition"
                          title="Edit Service"
                        >
                          <Edit2 className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => handleDelete(svc._id)}
                          className="p-1.5 text-gray-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition"
                          title="Delete / Archive"
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

      {/* Modal - Add / Edit Home Care Service (Matching Wireframe Tabs) */}
      {showModal && (
        <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-white rounded-2xl w-full max-w-4xl shadow-2xl border border-gray-100 overflow-hidden flex flex-col max-h-[92vh]">
            {/* Modal Header */}
            <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100 bg-gray-50/50">
              <div>
                <h2 className="text-lg font-bold text-gray-900">
                  {editId ? `Edit ${formData.name || "Service"}` : "Add New Service"}
                </h2>
                <p className="text-xs text-gray-500">
                  {category === "nursing-care" ? "Nursing Care" : "Home Care"} Service Configuration
                </p>
              </div>
              <button
                onClick={() => setShowModal(false)}
                className="p-1.5 text-gray-400 hover:text-gray-600 rounded-lg hover:bg-gray-100 transition"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Modal Body with Left Tabs */}
            <div className="flex flex-1 overflow-hidden">
              {/* Left Tabs Nav */}
              <div className="w-56 bg-gray-50/80 border-r border-gray-100 p-3 space-y-1 overflow-y-auto">
                {[
                  { id: "basic", label: "Basic Information", icon: FileText },
                  { id: "description", label: "Description", icon: Layers },
                  { id: "pricing", label: "Pricing & Availability", icon: IndianRupee },
                  { id: "included", label: "Included Services & Area", icon: ShieldCheck },
                  { id: "patients", label: "Target Patients", icon: HeartHandshake },
                  { id: "faq", label: "FAQ", icon: HelpCircle },
                  { id: "display", label: "Display Settings", icon: Sparkles },
                ].map((tab) => {
                  const Icon = tab.icon;
                  const isActive = activeModalTab === tab.id;
                  return (
                    <button
                      key={tab.id}
                      type="button"
                      onClick={() => setActiveModalTab(tab.id)}
                      className={`w-full flex items-center gap-2.5 px-3 py-2.5 rounded-xl text-xs font-semibold text-left transition ${
                        isActive
                          ? "bg-white text-emerald-700 shadow-sm border border-emerald-100 font-bold"
                          : "text-gray-600 hover:bg-gray-100/70"
                      }`}
                    >
                      <Icon className={`w-4 h-4 ${isActive ? "text-emerald-600" : "text-gray-400"}`} />
                      <span>{tab.label}</span>
                    </button>
                  );
                })}
              </div>

              {/* Tab Form Content */}
              <div className="flex-1 p-6 overflow-y-auto space-y-5">
                {/* 1. BASIC INFORMATION */}
                {activeModalTab === "basic" && (
                  <div className="space-y-4">
                    <div>
                      <label className="block text-xs font-bold text-gray-700 mb-1">
                        Service Name *
                      </label>
                      <input
                        type="text"
                        name="name"
                        value={formData.name || ""}
                        onChange={handleInputChange}
                        required
                        placeholder="e.g. Patient Attendant / Caregiver"
                        className="w-full px-3.5 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-bold text-gray-700 mb-1">
                        Short Description *
                      </label>
                      <input
                        type="text"
                        name="shortDescription"
                        value={formData.shortDescription || ""}
                        onChange={handleInputChange}
                        required
                        placeholder="Daily living support and personal care at home."
                        className="w-full px-3.5 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500"
                      />
                    </div>

                    {/* Image Upload */}
                    <div>
                      <label className="block text-xs font-bold text-gray-700 mb-1">
                        Service Image URL
                      </label>
                      <div className="flex items-center gap-3">
                        <input
                          type="text"
                          name="mainImage"
                          value={formData.mainImage || ""}
                          onChange={handleInputChange}
                          placeholder="https://images.unsplash.com/..."
                          className="flex-1 px-3.5 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-sm"
                        />
                        <label className="px-4 py-2.5 bg-emerald-50 text-emerald-700 hover:bg-emerald-100 rounded-xl text-xs font-semibold cursor-pointer border border-emerald-200 flex items-center gap-1.5">
                          <Upload className="w-3.5 h-3.5" />
                          {isUploading ? "Uploading..." : "Upload Image"}
                          <input
                            type="file"
                            accept="image/*"
                            onChange={handleImageUpload}
                            className="hidden"
                          />
                        </label>
                      </div>
                      {formData.mainImage && (
                        <div className="mt-2">
                          <img
                            src={formData.mainImage}
                            alt="Preview"
                            className="w-32 h-20 object-cover rounded-lg border border-gray-200"
                          />
                        </div>
                      )}
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="block text-xs font-bold text-gray-700 mb-1">
                          Required Staff Type
                        </label>
                        <select
                          name="requiredStaffType"
                          value={formData.requiredStaffType || "Caregiver / Attendant"}
                          onChange={handleInputChange}
                          className="w-full px-3.5 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-sm"
                        >
                          <option value="Caregiver / Attendant">Caregiver / Attendant</option>
                          <option value="Nurse">Nurse (Registered GNM/BSc)</option>
                          <option value="Doctor">Doctor</option>
                          <option value="Physiotherapist">Physiotherapist</option>
                        </select>
                      </div>

                      <div>
                        <label className="block text-xs font-bold text-gray-700 mb-1">
                          Status
                        </label>
                        <select
                          name="status"
                          value={formData.status || "Active"}
                          onChange={handleInputChange}
                          className="w-full px-3.5 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-sm"
                        >
                          <option value="Active">Active</option>
                          <option value="Inactive">Inactive</option>
                          <option value="Archived">Archived</option>
                        </select>
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="block text-xs font-bold text-gray-700 mb-1">
                          Display Order
                        </label>
                        <input
                          type="number"
                          name="displayOrder"
                          value={formData.displayOrder ?? 0}
                          onChange={handleInputChange}
                          className="w-full px-3.5 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-sm"
                        />
                      </div>

                      <div>
                        <label className="block text-xs font-bold text-gray-700 mb-1">
                          Duration Label
                        </label>
                        <input
                          type="text"
                          name="duration"
                          value={formData.duration || ""}
                          onChange={handleInputChange}
                          placeholder="e.g. 1-2 Hours, 8 Hours, 24 Hours, Daily"
                          className="w-full px-3.5 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-sm"
                        />
                      </div>
                    </div>

                    <div className="flex items-center gap-6 pt-2">
                      <label className="flex items-center gap-2 cursor-pointer text-xs font-semibold text-gray-700">
                        <input
                          type="checkbox"
                          name="showOnWebsite"
                          checked={formData.showOnWebsite ?? true}
                          onChange={handleInputChange}
                          className="w-4 h-4 text-emerald-600 rounded focus:ring-emerald-500"
                        />
                        Show on Website
                      </label>

                      <label className="flex items-center gap-2 cursor-pointer text-xs font-semibold text-gray-700">
                        <input
                          type="checkbox"
                          name="isPopular"
                          checked={formData.isPopular ?? false}
                          onChange={handleInputChange}
                          className="w-4 h-4 text-emerald-600 rounded focus:ring-emerald-500"
                        />
                        Show as Popular Service
                      </label>
                    </div>
                  </div>
                )}

                {/* 2. DESCRIPTION */}
                {activeModalTab === "description" && (
                  <div className="space-y-4">
                    <div>
                      <label className="block text-xs font-bold text-gray-700 mb-1">
                        Full Detailed Description
                      </label>
                      <textarea
                        rows={6}
                        name="fullDescription"
                        value={formData.fullDescription || ""}
                        onChange={handleInputChange}
                        placeholder="Comprehensive explanation of what this clinical or home care service entails, protocols followed, caregiver qualifications, and expected patient benefits..."
                        className="w-full px-3.5 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500"
                      />
                    </div>
                  </div>
                )}

                {/* 3. PRICING & AVAILABILITY */}
                {activeModalTab === "pricing" && (
                  <div className="space-y-6">
                    <div className="bg-gray-50/70 p-4 rounded-xl border border-gray-100 space-y-4">
                      <h3 className="text-xs font-bold text-gray-800 uppercase tracking-wider">
                        Pricing Configuration
                      </h3>
                      <div className="grid grid-cols-3 gap-3">
                        <div>
                          <label className="block text-xs font-bold text-gray-700 mb-1">
                            Pricing Type
                          </label>
                          <select
                            name="pricingType"
                            value={formData.pricingType || "Starting From"}
                            onChange={handleInputChange}
                            className="w-full px-3 py-2 bg-white border border-gray-200 rounded-xl text-xs font-medium"
                          >
                            <option value="Starting From">Starting From</option>
                            <option value="Fixed Price">Fixed Price</option>
                            <option value="Per Visit">Per Visit</option>
                            <option value="Hourly">Hourly</option>
                            <option value="Daily">Daily</option>
                            <option value="Custom Quote">Custom Quote</option>
                            <option value="Assessment Required">Assessment Required</option>
                          </select>
                        </div>

                        <div>
                          <label className="block text-xs font-bold text-gray-700 mb-1">
                            Base Price (₹)
                          </label>
                          <input
                            type="number"
                            name="price"
                            value={formData.price ?? 0}
                            onChange={handleInputChange}
                            className="w-full px-3 py-2 bg-white border border-gray-200 rounded-xl text-xs font-medium"
                          />
                        </div>

                        <div>
                          <label className="block text-xs font-bold text-gray-700 mb-1">
                            Price Unit
                          </label>
                          <select
                            name="priceUnit"
                            value={formData.priceUnit || "day"}
                            onChange={handleInputChange}
                            className="w-full px-3 py-2 bg-white border border-gray-200 rounded-xl text-xs font-medium"
                          >
                            <option value="day">per day</option>
                            <option value="visit">per visit</option>
                            <option value="hour">per hour</option>
                            <option value="month">per month</option>
                            <option value="session">per session</option>
                          </select>
                        </div>
                      </div>
                    </div>

                    {/* Offer / Discount */}
                    <div className="bg-gray-50/70 p-4 rounded-xl border border-gray-100 space-y-4">
                      <div className="flex items-center justify-between">
                        <h3 className="text-xs font-bold text-gray-800 uppercase tracking-wider">
                          Offer / Discount (Optional)
                        </h3>
                        <label className="flex items-center gap-2 cursor-pointer text-xs font-semibold text-emerald-700">
                          <input
                            type="checkbox"
                            name="hasOffer"
                            checked={formData.hasOffer ?? false}
                            onChange={handleInputChange}
                            className="w-4 h-4 text-emerald-600 rounded"
                          />
                          Enable Offer
                        </label>
                      </div>

                      {formData.hasOffer && (
                        <div className="grid grid-cols-3 gap-3 pt-2">
                          <div>
                            <label className="block text-xs font-bold text-gray-700 mb-1">
                              Discount Type
                            </label>
                            <select
                              name="discountType"
                              value={formData.discountType || "Percentage"}
                              onChange={handleInputChange}
                              className="w-full px-3 py-2 bg-white border border-gray-200 rounded-xl text-xs font-medium"
                            >
                              <option value="Percentage">Percentage (%)</option>
                              <option value="Fixed">Fixed Amount (₹)</option>
                            </select>
                          </div>

                          <div>
                            <label className="block text-xs font-bold text-gray-700 mb-1">
                              Discount Value
                            </label>
                            <input
                              type="number"
                              name="discountValue"
                              value={formData.discountValue ?? 0}
                              onChange={handleInputChange}
                              className="w-full px-3 py-2 bg-white border border-gray-200 rounded-xl text-xs font-medium"
                            />
                          </div>

                          <div>
                            <label className="block text-xs font-bold text-gray-700 mb-1">
                              Valid Till
                            </label>
                            <input
                              type="date"
                              name="offerEndDate"
                              value={formData.offerEndDate || ""}
                              onChange={handleInputChange}
                              className="w-full px-3 py-2 bg-white border border-gray-200 rounded-xl text-xs font-medium"
                            />
                          </div>
                        </div>
                      )}
                    </div>

                    {/* Availability */}
                    <div className="bg-gray-50/70 p-4 rounded-xl border border-gray-100 space-y-3">
                      <h3 className="text-xs font-bold text-gray-800 uppercase tracking-wider">
                        Availability Days & Hours
                      </h3>
                      <div>
                        <label className="block text-xs font-semibold text-gray-600 mb-1.5">
                          Available Days
                        </label>
                        <div className="flex flex-wrap gap-2">
                          {["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"].map((day) => {
                            const isSelected = (formData.availabilityDays || []).includes(day);
                            return (
                              <button
                                key={day}
                                type="button"
                                onClick={() => toggleDay(day)}
                                className={`px-3 py-1.5 rounded-lg text-xs font-bold transition ${
                                  isSelected
                                    ? "bg-emerald-600 text-white"
                                    : "bg-white text-gray-600 border border-gray-200"
                                }`}
                              >
                                {day}
                              </button>
                            );
                          })}
                        </div>
                      </div>

                      <div className="grid grid-cols-2 gap-4 pt-2">
                        <div>
                          <label className="block text-xs font-bold text-gray-700 mb-1">
                            Working Hours
                          </label>
                          <input
                            type="text"
                            name="workingHours"
                            value={formData.workingHours || "9:00 AM - 8:00 PM"}
                            onChange={handleInputChange}
                            className="w-full px-3 py-2 bg-white border border-gray-200 rounded-xl text-xs"
                          />
                        </div>

                        <div>
                          <label className="block text-xs font-bold text-gray-700 mb-1">
                            Minimum Notice Time
                          </label>
                          <input
                            type="text"
                            name="minNoticeTime"
                            value={formData.minNoticeTime || "1 Hour"}
                            onChange={handleInputChange}
                            className="w-full px-3 py-2 bg-white border border-gray-200 rounded-xl text-xs"
                          />
                        </div>
                      </div>

                      <div className="flex items-center gap-6 pt-2">
                        <label className="flex items-center gap-2 cursor-pointer text-xs font-semibold text-gray-700">
                          <input
                            type="checkbox"
                            name="isSameDayBooking"
                            checked={formData.isSameDayBooking ?? true}
                            onChange={handleInputChange}
                            className="w-4 h-4 text-emerald-600 rounded"
                          />
                          Same Day Booking
                        </label>
                        <label className="flex items-center gap-2 cursor-pointer text-xs font-semibold text-gray-700">
                          <input
                            type="checkbox"
                            name="is24x7"
                            checked={formData.is24x7 ?? false}
                            onChange={handleInputChange}
                            className="w-4 h-4 text-emerald-600 rounded"
                          />
                          24×7 Available
                        </label>
                      </div>
                    </div>
                  </div>
                )}

                {/* 4. INCLUDED SERVICES & AREA */}
                {activeModalTab === "included" && (
                  <div className="space-y-6">
                    {/* Included Services Checkboxes */}
                    <div className="bg-gray-50/70 p-4 rounded-xl border border-gray-100 space-y-3">
                      <h3 className="text-xs font-bold text-gray-800 uppercase tracking-wider">
                        Included Services
                      </h3>
                      <div className="grid grid-cols-2 gap-2">
                        {defaultIncludedServices.map((svcItem) => {
                          const isChecked = (formData.includedServices || []).includes(svcItem);
                          return (
                            <label
                              key={svcItem}
                              className={`flex items-center gap-2 p-2 rounded-lg text-xs cursor-pointer border transition ${
                                isChecked
                                  ? "bg-emerald-50 border-emerald-200 text-emerald-900 font-medium"
                                  : "bg-white border-gray-200 text-gray-600 hover:bg-gray-50"
                              }`}
                            >
                              <input
                                type="checkbox"
                                checked={isChecked}
                                onChange={() => toggleIncludedService(svcItem)}
                                className="w-4 h-4 text-emerald-600 rounded"
                              />
                              <span>{svcItem}</span>
                            </label>
                          );
                        })}
                      </div>

                      <div className="flex items-center gap-2 pt-2">
                        <input
                          type="text"
                          placeholder="Add custom included service..."
                          value={newIncludedItem}
                          onChange={(e) => setNewIncludedItem(e.target.value)}
                          className="flex-1 px-3 py-2 bg-white border border-gray-200 rounded-xl text-xs"
                        />
                        <button
                          type="button"
                          onClick={addCustomIncluded}
                          className="px-3.5 py-2 bg-emerald-600 text-white text-xs font-semibold rounded-xl hover:bg-emerald-700"
                        >
                          Add
                        </button>
                      </div>
                    </div>

                    {/* Service Area */}
                    <div className="bg-gray-50/70 p-4 rounded-xl border border-gray-100 space-y-3">
                      <h3 className="text-xs font-bold text-gray-800 uppercase tracking-wider">
                        Service Area (Lucknow)
                      </h3>
                      <div className="space-y-2">
                        {[
                          { val: "all", label: "All Areas (Lucknow)" },
                          { val: "zones", label: "Selected Zones" },
                          { val: "areas", label: "Selected Areas" },
                          { val: "unavailable", label: "Temporarily Unavailable" },
                        ].map((opt) => (
                          <label
                            key={opt.val}
                            className="flex items-center gap-2.5 cursor-pointer text-xs font-medium text-gray-700"
                          >
                            <input
                              type="radio"
                              name="serviceAreaType"
                              value={opt.val}
                              checked={(formData.serviceAreaType || "all") === opt.val}
                              onChange={handleInputChange}
                              className="text-emerald-600 focus:ring-emerald-500"
                            />
                            <span>{opt.label}</span>
                          </label>
                        ))}
                      </div>
                    </div>
                  </div>
                )}

                {/* 5. TARGET PATIENTS */}
                {activeModalTab === "patients" && (
                  <div className="space-y-4">
                    <div>
                      <label className="block text-xs font-bold text-gray-700 mb-1">
                        Who Is This For? (Target Patients)
                      </label>
                      <div className="flex items-center gap-2 mb-3">
                        <input
                          type="text"
                          placeholder="e.g. Elderly Individuals, Post-Surgery Patients..."
                          value={newTargetPatient}
                          onChange={(e) => setNewTargetPatient(e.target.value)}
                          className="flex-1 px-3.5 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-sm"
                        />
                        <button
                          type="button"
                          onClick={addTargetPatient}
                          className="px-4 py-2.5 bg-emerald-600 text-white text-xs font-semibold rounded-xl hover:bg-emerald-700"
                        >
                          Add
                        </button>
                      </div>

                      <div className="flex flex-wrap gap-2">
                        {(formData.targetPatients || []).map((tp, idx) => (
                          <span
                            key={idx}
                            className="inline-flex items-center gap-1.5 px-3 py-1 bg-emerald-50 text-emerald-800 border border-emerald-200 rounded-full text-xs font-medium"
                          >
                            {tp}
                            <button
                              type="button"
                              onClick={() => removeTargetPatient(idx)}
                              className="text-emerald-500 hover:text-emerald-800"
                            >
                              <X className="w-3 h-3" />
                            </button>
                          </span>
                        ))}
                      </div>
                    </div>
                  </div>
                )}

                {/* 6. FAQ */}
                {activeModalTab === "faq" && (
                  <div className="space-y-4">
                    <div className="bg-gray-50/70 p-4 rounded-xl border border-gray-100 space-y-3">
                      <h3 className="text-xs font-bold text-gray-800 uppercase tracking-wider">
                        Add Frequently Asked Question
                      </h3>
                      <input
                        type="text"
                        placeholder="Question: e.g. What duties does a caregiver perform?"
                        value={newFaqQ}
                        onChange={(e) => setNewFaqQ(e.target.value)}
                        className="w-full px-3 py-2 bg-white border border-gray-200 rounded-xl text-xs"
                      />
                      <textarea
                        rows={2}
                        placeholder="Answer: e.g. Caregivers assist with bathing, dressing, feeding..."
                        value={newFaqA}
                        onChange={(e) => setNewFaqA(e.target.value)}
                        className="w-full px-3 py-2 bg-white border border-gray-200 rounded-xl text-xs"
                      />
                      <button
                        type="button"
                        onClick={addFaq}
                        className="px-4 py-2 bg-emerald-600 text-white text-xs font-semibold rounded-xl hover:bg-emerald-700"
                      >
                        + Add FAQ
                      </button>
                    </div>

                    <div className="space-y-2">
                      {(formData.faqs || []).map((f, i) => (
                        <div
                          key={i}
                          className="p-3 bg-white border border-gray-200 rounded-xl relative group"
                        >
                          <button
                            type="button"
                            onClick={() => removeFaq(i)}
                            className="absolute top-2 right-2 text-gray-400 hover:text-rose-600"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                          <p className="font-semibold text-xs text-gray-900">{f.question}</p>
                          <p className="text-xs text-gray-600 mt-1">{f.answer}</p>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* 7. DISPLAY SETTINGS */}
                {activeModalTab === "display" && (
                  <div className="space-y-4">
                    <div>
                      <label className="block text-xs font-bold text-gray-700 mb-1">
                        Service Badge
                      </label>
                      <input
                        type="text"
                        name="badge"
                        value={formData.badge || ""}
                        onChange={handleInputChange}
                        placeholder="e.g. Most Booked, Popular, Quick & Reliable, 24x7 Available"
                        className="w-full px-3.5 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-sm"
                      />
                    </div>

                    <div className="grid grid-cols-3 gap-3">
                      <div>
                        <label className="block text-xs font-bold text-gray-700 mb-1">
                          Calculated Rating
                        </label>
                        <input
                          type="number"
                          step="0.1"
                          name="rating"
                          value={formData.rating ?? 4.8}
                          onChange={handleInputChange}
                          className="w-full px-3 py-2 bg-gray-50 border border-gray-200 rounded-xl text-xs font-medium"
                        />
                      </div>
                      <div>
                        <label className="block text-xs font-bold text-gray-700 mb-1">
                          Review Count
                        </label>
                        <input
                          type="number"
                          name="reviewCount"
                          value={formData.reviewCount ?? 18}
                          onChange={handleInputChange}
                          className="w-full px-3 py-2 bg-gray-50 border border-gray-200 rounded-xl text-xs font-medium"
                        />
                      </div>
                      <div>
                        <label className="block text-xs font-bold text-gray-700 mb-1">
                          Verified Bookings Count
                        </label>
                        <input
                          type="number"
                          name="verifiedBookingsCount"
                          value={formData.verifiedBookingsCount ?? 120}
                          onChange={handleInputChange}
                          className="w-full px-3 py-2 bg-gray-50 border border-gray-200 rounded-xl text-xs font-medium"
                        />
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* Modal Footer */}
            <div className="flex items-center justify-between px-6 py-4 border-t border-gray-100 bg-gray-50/50">
              <button
                type="button"
                onClick={() => setShowModal(false)}
                className="px-4 py-2 border border-gray-300 rounded-xl text-xs font-semibold text-gray-700 hover:bg-gray-100 transition"
              >
                Cancel
              </button>

              <button
                type="button"
                onClick={handleSubmit}
                disabled={isSubmitting}
                className="px-6 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-bold shadow-sm transition disabled:opacity-50"
              >
                {isSubmitting ? "Saving..." : editId ? "Save Changes" : "Create Service"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
