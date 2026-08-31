"use client";
import { useState, useEffect } from "react";
import { Plus, Edit2, Trash2, Check, X, RefreshCw } from "lucide-react";

export default function PhysioMasterData() {
  const [activeTab, setActiveTab] = useState("departments");
  const [data, setData] = useState({
    departments: [],
    groups: [],
    conditions: [],
    packages: [],
  });
  const [loading, setLoading] = useState(true);

  // Modal State
  const [showModal, setShowModal] = useState(false);
  const [formData, setFormData] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  const fetchData = async () => {
    setLoading(true);
    try {
      const [deptRes, grpRes, condRes, pkgRes] = await Promise.all([
        fetch("/api/admin/physio-departments").then(res => res.json()),
        fetch("/api/admin/physio-problem-groups").then(res => res.json()),
        fetch("/api/admin/physio-conditions").then(res => res.json()),
        fetch("/api/admin/physio-packages").then(res => res.json()),
      ]);
      
      setData({
        departments: deptRes.data || [],
        groups: grpRes.data || [],
        conditions: condRes.data || [],
        packages: pkgRes.data || [],
      });
    } catch (error) {
      console.error("Error fetching master data:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const tabs = [
    { id: "departments", label: "Departments" },
    { id: "groups", label: "Problem Groups" },
    { id: "conditions", label: "Conditions" },
    { id: "packages", label: "Packages" },
  ];

  const handleOpenModal = () => {
    setFormData({ isActive: true }); // Reset form
    setShowModal(true);
  };

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    let endpoint = "";
    if (activeTab === 'departments') endpoint = "/api/admin/physio-departments";
    if (activeTab === 'groups') endpoint = "/api/admin/physio-problem-groups";
    if (activeTab === 'conditions') endpoint = "/api/admin/physio-conditions";
    if (activeTab === 'packages') endpoint = "/api/admin/physio-packages";

    try {
      const res = await fetch(endpoint, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData)
      });
      
      if (res.ok) {
        setShowModal(false);
        fetchData(); // Refresh data
      } else {
        const errData = await res.json();
        alert("Error: " + (errData.message || "Failed to save"));
      }
    } catch (error) {
      console.error("Submit error:", error);
      alert("Something went wrong");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDelete = async (id) => {
    if (!confirm("Are you sure you want to delete this item?")) return;
    
    let endpoint = "";
    if (activeTab === 'departments') endpoint = `/api/admin/physio-departments/${id}`;
    if (activeTab === 'groups') endpoint = `/api/admin/physio-problem-groups/${id}`;
    if (activeTab === 'conditions') endpoint = `/api/admin/physio-conditions/${id}`;
    if (activeTab === 'packages') endpoint = `/api/admin/physio-packages/${id}`;

    try {
      await fetch(endpoint, { method: "DELETE" });
      fetchData();
    } catch (error) {
      console.error("Delete error:", error);
    }
  };

  return (
    <div className="p-6 max-w-7xl mx-auto">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Physiotherapy Master Data</h1>
        <button onClick={fetchData} className="flex items-center gap-2 bg-blue-50 text-blue-600 px-4 py-2 rounded-lg hover:bg-blue-100">
          <RefreshCw size={18} /> Refresh
        </button>
      </div>

      {/* Tabs */}
      <div className="flex gap-4 border-b mb-6">
        {tabs.map(tab => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`pb-3 px-4 font-medium transition-colors ${
              activeTab === tab.id ? "border-b-2 border-blue-600 text-blue-600" : "text-gray-500 hover:text-gray-700"
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Content */}
      {loading ? (
        <div className="text-center py-20">Loading data...</div>
      ) : (
        <div className="bg-white rounded-xl shadow-sm border p-6 relative">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-xl font-semibold capitalize">{activeTab}</h2>
            <button onClick={handleOpenModal} className="flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700">
              <Plus size={18} /> Add New
            </button>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-gray-50 border-b">
                  <th className="p-3 font-medium text-gray-600">Name</th>
                  {activeTab === 'groups' && <th className="p-3 font-medium text-gray-600">Department</th>}
                  {activeTab === 'conditions' && <th className="p-3 font-medium text-gray-600">Group</th>}
                  {activeTab === 'packages' && <th className="p-3 font-medium text-gray-600">Sessions</th>}
                  {activeTab === 'packages' && <th className="p-3 font-medium text-gray-600">Price</th>}
                  <th className="p-3 font-medium text-gray-600">Status</th>
                  <th className="p-3 font-medium text-gray-600 text-right">Actions</th>
                </tr>
              </thead>
              <tbody>
                {data[activeTab].length === 0 ? (
                  <tr>
                    <td colSpan={6} className="text-center py-8 text-gray-500">No {activeTab} found.</td>
                  </tr>
                ) : (
                  data[activeTab].map(item => (
                    <tr key={item._id} className="border-b hover:bg-gray-50">
                      <td className="p-3">{item.name || item.title}</td>
                      
                      {activeTab === 'groups' && (
                        <td className="p-3 text-sm text-gray-600">{item.departmentId?.name || '-'}</td>
                      )}
                      
                      {activeTab === 'conditions' && (
                        <td className="p-3 text-sm text-gray-600">{item.groupId?.name || '-'}</td>
                      )}
                      
                      {activeTab === 'packages' && (
                        <td className="p-3 text-sm text-gray-600">{item.sessionsCount}</td>
                      )}
                      {activeTab === 'packages' && (
                        <td className="p-3 text-sm font-medium text-green-600">₹{item.basePrice}</td>
                      )}

                      <td className="p-3">
                        <span className={`px-2 py-1 text-xs rounded-full ${item.isActive ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
                          {item.isActive ? 'Active' : 'Inactive'}
                        </span>
                      </td>
                      <td className="p-3 text-right">
                        <div className="flex justify-end gap-2">
                          <button onClick={() => handleDelete(item._id)} className="p-1.5 text-gray-500 hover:text-red-600 hover:bg-red-50 rounded">
                            <Trash2 size={16} />
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
      )}

      {/* Add New Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl shadow-xl w-full max-w-lg overflow-hidden">
            <div className="flex justify-between items-center p-6 border-b">
              <h3 className="text-lg font-bold">Add New {activeTab.slice(0, -1)}</h3>
              <button onClick={() => setShowModal(false)} className="text-gray-500 hover:text-gray-800">
                <X size={20} />
              </button>
            </div>
            
            <form onSubmit={handleSubmit} className="p-6 space-y-4">
              
              {/* Common Fields */}
              {activeTab === 'packages' ? (
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Package Title</label>
                  <input type="text" name="title" required value={formData.title || ''} onChange={handleInputChange} className="w-full border p-2 rounded-lg" placeholder="e.g. 5 Sessions" />
                </div>
              ) : (
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Name</label>
                  <input type="text" name="name" required value={formData.name || ''} onChange={handleInputChange} className="w-full border p-2 rounded-lg" placeholder="Name" />
                </div>
              )}

              {/* Department Dropdown for Groups */}
              {activeTab === 'groups' && (
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Select Department</label>
                  <select name="departmentId" required value={formData.departmentId || ''} onChange={handleInputChange} className="w-full border p-2 rounded-lg">
                    <option value="">-- Select --</option>
                    {data.departments.map(d => <option key={d._id} value={d._id}>{d.name}</option>)}
                  </select>
                </div>
              )}

              {/* Group Dropdown for Conditions */}
              {activeTab === 'conditions' && (
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Select Problem Group</label>
                  <select name="groupId" required value={formData.groupId || ''} onChange={handleInputChange} className="w-full border p-2 rounded-lg">
                    <option value="">-- Select --</option>
                    {data.groups.map(g => <option key={g._id} value={g._id}>{g.name}</option>)}
                  </select>
                </div>
              )}

              {/* Package specific fields */}
              {activeTab === 'packages' && (
                <>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Sessions Count</label>
                      <input type="number" name="sessionsCount" required value={formData.sessionsCount || ''} onChange={handleInputChange} className="w-full border p-2 rounded-lg" />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Validity (Days)</label>
                      <input type="number" name="validityDays" required value={formData.validityDays || ''} onChange={handleInputChange} className="w-full border p-2 rounded-lg" />
                    </div>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Base Price (₹)</label>
                    <input type="number" name="basePrice" required value={formData.basePrice || ''} onChange={handleInputChange} className="w-full border p-2 rounded-lg" />
                  </div>
                  <label className="flex items-center gap-2">
                    <input type="checkbox" name="isRecommended" checked={formData.isRecommended || false} onChange={handleInputChange} />
                    <span>Recommended Package</span>
                  </label>
                </>
              )}

              {/* Description (Not for packages here to keep it simple, but can be added) */}
              {activeTab !== 'packages' && (
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">{activeTab === 'conditions' ? 'Short Description' : 'Description'}</label>
                  <textarea name={activeTab === 'conditions' ? 'shortDescription' : 'description'} value={formData.description || formData.shortDescription || ''} onChange={handleInputChange} className="w-full border p-2 rounded-lg" rows="2"></textarea>
                </div>
              )}

              <label className="flex items-center gap-2">
                <input type="checkbox" name="isActive" checked={formData.isActive !== false} onChange={handleInputChange} />
                <span>Active Status</span>
              </label>

              <div className="pt-4 border-t flex justify-end gap-3">
                <button type="button" onClick={() => setShowModal(false)} className="px-4 py-2 border rounded-lg text-gray-600 hover:bg-gray-50">Cancel</button>
                <button type="submit" disabled={isSubmitting} className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50">
                  {isSubmitting ? "Saving..." : "Save"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
}
