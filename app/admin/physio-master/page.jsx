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
  const [editId, setEditId] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isUploading, setIsUploading] = useState(false);

  const handleImageUpload = (e, fieldName, targetWidth, targetHeight) => {
    const file = e.target.files[0];
    if (!file) return;

    if (!file.type.startsWith('image/')) {
        alert("Please select an image file.");
        return;
    }

    setIsUploading(true);
    const img = document.createElement('img');
    const objectUrl = URL.createObjectURL(file);
    
    img.onload = async () => {
      URL.revokeObjectURL(objectUrl);
      const canvas = document.createElement('canvas');
      canvas.width = targetWidth;
      canvas.height = targetHeight;
      const ctx = canvas.getContext('2d');

      const scale = Math.max(targetWidth / img.width, targetHeight / img.height);
      const x = (targetWidth / 2) - (img.width / 2) * scale;
      const y = (targetHeight / 2) - (img.height / 2) * scale;
      
      ctx.drawImage(img, x, y, img.width * scale, img.height * scale);

      canvas.toBlob(async (blob) => {
        if (!blob) {
            setIsUploading(false);
            return;
        }
        
        const uploadData = new FormData();
        uploadData.append('file', blob, file.name.replace(/\.[^/.]+$/, "") + ".webp");
        
        try {
          const res = await fetch('/api/admin/upload', { method: 'POST', body: uploadData });
          const data = await res.json();
          if (data.url) {
            setFormData(prev => ({ ...prev, [fieldName]: data.url }));
          } else {
            alert('Upload failed: ' + data.error);
          }
        } catch (error) {
          console.error("Upload error:", error);
          alert('Upload failed');
        } finally {
          setIsUploading(false);
        }
      }, 'image/webp', 0.85);
    };
    img.src = objectUrl;
  };

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

  const handleOpenModal = (item = null) => {
    if (item) {
      // For relatedConditions, extract just the IDs if they are objects, or keep them if they are strings
      const formState = { ...item };
      if (activeTab === 'conditions' && formState.relatedConditions) {
        formState.relatedConditions = formState.relatedConditions.map(c => c._id || c);
      }
      setFormData(formState);
      setEditId(item._id);
    } else {
      setFormData({ isActive: true, order: 0 }); 
      setEditId(null);
    }
    setShowModal(true);
  };

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    
    if (type === 'select-multiple') {
      const options = e.target.options;
      const selectedValues = [];
      for (let i = 0; i < options.length; i++) {
        if (options[i].selected) {
          selectedValues.push(options[i].value);
        }
      }
      setFormData(prev => ({ ...prev, [name]: selectedValues }));
    } else {
      setFormData(prev => ({
        ...prev,
        [name]: type === 'checkbox' ? checked : value
      }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    let baseEndpoint = "";
    if (activeTab === 'departments') baseEndpoint = "/api/admin/physio-departments";
    if (activeTab === 'groups') baseEndpoint = "/api/admin/physio-problem-groups";
    if (activeTab === 'conditions') baseEndpoint = "/api/admin/physio-conditions";
    if (activeTab === 'packages') baseEndpoint = "/api/admin/physio-packages";

    const endpoint = editId ? `${baseEndpoint}/${editId}` : baseEndpoint;
    const method = editId ? "PUT" : "POST";

    try {
      const res = await fetch(endpoint, {
        method: method,
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
            <button onClick={() => handleOpenModal()} className="flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700">
              <Plus size={18} /> Add New
            </button>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-gray-50 border-b">
                  <th className="p-3 font-medium text-gray-600 w-12">Order</th>
                  {activeTab !== 'packages' && <th className="p-3 font-medium text-gray-600 w-16">Icon</th>}
                  <th className="p-3 font-medium text-gray-600">Name</th>
                  {activeTab === 'groups' && <th className="p-3 font-medium text-gray-600">Department</th>}
                  {activeTab === 'conditions' && <th className="p-3 font-medium text-gray-600">Group</th>}
                  {activeTab === 'packages' && <th className="p-3 font-medium text-gray-600">Sessions</th>}
                  {activeTab === 'packages' && <th className="p-3 font-medium text-gray-600">Base Price</th>}
                  {activeTab === 'packages' && <th className="p-3 font-medium text-gray-600">Per Session</th>}
                  <th className="p-3 font-medium text-gray-600">Status</th>
                  <th className="p-3 font-medium text-gray-600 text-right">Actions</th>
                </tr>
              </thead>
              <tbody>
                {data[activeTab].length === 0 ? (
                  <tr>
                    <td colSpan={10} className="text-center py-8 text-gray-500">No {activeTab} found.</td>
                  </tr>
                ) : (
                  data[activeTab].sort((a,b) => (a.order || 0) - (b.order || 0)).map(item => (
                    <tr key={item._id} className="border-b hover:bg-gray-50">
                      <td className="p-3 text-sm text-gray-500">{item.order || 0}</td>
                      
                      {activeTab !== 'packages' && (
                        <td className="p-3">
                          {item.icon || item.image ? (
                            <img src={item.icon || item.image} alt="icon" className="w-12 h-12 rounded object-cover border" onError={(e) => e.target.style.display='none'} />
                          ) : (
                            <div className="w-12 h-12 bg-gray-100 rounded border flex items-center justify-center text-xs text-gray-400">No Image</div>
                          )}
                        </td>
                      )}
                      
                      <td className="p-3">
                        <div className="font-medium text-gray-900">{item.name || item.title}</div>
                        {(item.shortDescription) && <div className="text-xs text-gray-500 truncate max-w-[200px]">{item.shortDescription}</div>}
                      </td>
                      
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
                        <td className="p-3 text-sm font-medium text-gray-900">
                          ₹{item.basePrice}
                          {item.offerPrice && <span className="ml-2 text-xs text-green-600 font-semibold">(Offer: ₹{item.offerPrice})</span>}
                        </td>
                      )}
                      {activeTab === 'packages' && (
                        <td className="p-3 text-sm font-medium text-blue-600">
                          {item.perSessionPrice ? `₹${item.perSessionPrice}` : '-'}
                        </td>
                      )}

                      <td className="p-3">
                        <span className={`px-2 py-1 text-xs rounded-full ${item.isActive ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
                          {item.isActive ? 'Active' : 'Inactive'}
                        </span>
                      </td>
                      <td className="p-3 text-right">
                        <div className="flex justify-end gap-2">
                          <button onClick={() => handleOpenModal(item)} className="p-1.5 text-gray-500 hover:text-blue-600 hover:bg-blue-50 rounded">
                            <Edit2 size={16} />
                          </button>
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

      {/* Add/Edit Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl shadow-xl w-full max-w-2xl max-h-[90vh] overflow-y-auto">
            <div className="flex justify-between items-center p-6 border-b sticky top-0 bg-white z-10">
              <h3 className="text-lg font-bold">{editId ? 'Edit' : 'Add New'} {activeTab.slice(0, -1)}</h3>
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
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Name</label>
                    <input type="text" name="name" required value={formData.name || ''} onChange={handleInputChange} className="w-full border p-2 rounded-lg" placeholder="Name" />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Upload Icon/Image</label>
                    <div className="flex items-center gap-3">
                      {(formData.icon || formData.image) && (
                        <img src={formData.icon || formData.image} alt="Preview" className="w-12 h-12 rounded border object-cover" />
                      )}
                      <input 
                        type="file" 
                        accept="image/*" 
                        onChange={(e) => {
                          const size = activeTab === 'conditions' ? 800 : 512;
                          handleImageUpload(e, activeTab === 'conditions' ? 'image' : 'icon', size, size);
                        }} 
                        className="flex-1 border p-1.5 rounded-lg text-sm" 
                        disabled={isUploading}
                      />
                    </div>
                    {isUploading && <p className="text-xs text-blue-600 mt-1">Compressing & Uploading...</p>}
                    <p className="text-xs text-gray-500 mt-1">
                      {activeTab === 'conditions' ? "Recommended: 800x800px (Square)" : "Recommended: 512x512px (Square)"}
                    </p>
                  </div>
                </div>
              )}

              {/* Department Dropdown for Groups */}
              {activeTab === 'groups' && (
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Select Department</label>
                  <select name="departmentId" required value={formData.departmentId?._id || formData.departmentId || ''} onChange={handleInputChange} className="w-full border p-2 rounded-lg">
                    <option value="">-- Select --</option>
                    {data.departments.map(d => <option key={d._id} value={d._id}>{d.name}</option>)}
                  </select>
                </div>
              )}

              {/* Group Dropdown for Conditions */}
              {activeTab === 'conditions' && (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Select Problem Group</label>
                    <select name="groupId" required value={formData.groupId?._id || formData.groupId || ''} onChange={handleInputChange} className="w-full border p-2 rounded-lg">
                      <option value="">-- Select --</option>
                      {data.groups.map(g => <option key={g._id} value={g._id}>{g.name}</option>)}
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Recommended Package</label>
                    <select name="recommendedPackageId" value={formData.recommendedPackageId || ''} onChange={handleInputChange} className="w-full border p-2 rounded-lg">
                      <option value="">-- None --</option>
                      {data.packages.map(p => <option key={p._id} value={p._id}>{p.title}</option>)}
                    </select>
                  </div>
                </div>
              )}

              {/* Related Conditions for Conditions */}
              {activeTab === 'conditions' && (
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Related Problems / Conditions</label>
                  <select multiple name="relatedConditions" value={formData.relatedConditions || []} onChange={handleInputChange} className="w-full border p-2 rounded-lg h-32">
                    {data.conditions.filter(c => c._id !== editId).map(c => (
                      <option key={c._id} value={c._id}>{c.name}</option>
                    ))}
                  </select>
                  <p className="text-xs text-gray-500 mt-1">Hold Ctrl (Windows) or Cmd (Mac) to select multiple</p>
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
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Base Price (₹)</label>
                      <input type="number" name="basePrice" required value={formData.basePrice || ''} onChange={handleInputChange} className="w-full border p-2 rounded-lg" />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Offer / Discount Price (₹)</label>
                      <input type="number" name="offerPrice" value={formData.offerPrice || ''} onChange={handleInputChange} className="w-full border p-2 rounded-lg" />
                    </div>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Upload Package Icon</label>
                    <div className="flex items-center gap-3">
                      {formData.icon && (
                        <img src={formData.icon} alt="Preview" className="w-12 h-12 rounded border object-cover" />
                      )}
                      <input 
                        type="file" 
                        accept="image/*" 
                        onChange={(e) => handleImageUpload(e, 'icon', 256, 256)} 
                        className="flex-1 border p-1.5 rounded-lg text-sm" 
                        disabled={isUploading}
                      />
                    </div>
                    {isUploading && <p className="text-xs text-blue-600 mt-1">Compressing & Uploading...</p>}
                    <p className="text-xs text-gray-500 mt-1">Recommended: 256x256px</p>
                  </div>
                  <label className="flex items-center gap-2">
                    <input type="checkbox" name="isRecommended" checked={formData.isRecommended || false} onChange={handleInputChange} />
                    <span>Recommended Package</span>
                  </label>
                </>
              )}

              {/* Descriptions */}
              {activeTab !== 'packages' ? (
                <>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Short Description {activeTab === 'conditions' && <span className="text-red-500">*</span>}</label>
                    <textarea name="shortDescription" required={activeTab === 'conditions'} value={formData.shortDescription || ''} onChange={handleInputChange} className="w-full border p-2 rounded-lg" rows="2"></textarea>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Detailed Description (Optional)</label>
                    <textarea name="description" value={formData.description || ''} onChange={handleInputChange} className="w-full border p-2 rounded-lg" rows="3"></textarea>
                  </div>
                </>
              ) : (
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Package Description</label>
                  <textarea name="description" value={formData.description || ''} onChange={handleInputChange} className="w-full border p-2 rounded-lg" rows="3"></textarea>
                </div>
              )}

              <div className="flex items-center gap-6 pt-2">
                <div className="flex-1">
                  <label className="block text-sm font-medium text-gray-700 mb-1">Display Order</label>
                  <input type="number" name="order" value={formData.order !== undefined ? formData.order : 0} onChange={handleInputChange} className="w-24 border p-2 rounded-lg" />
                </div>
                <label className="flex items-center gap-2 mt-4">
                  <input type="checkbox" name="isActive" checked={formData.isActive !== false} onChange={handleInputChange} className="w-4 h-4" />
                  <span className="font-medium">Active Status</span>
                </label>
              </div>

              <div className="pt-6 mt-4 border-t flex justify-end gap-3 sticky bottom-0 bg-white">
                <button type="button" onClick={() => setShowModal(false)} className="px-4 py-2 border rounded-lg text-gray-600 hover:bg-gray-50">Cancel</button>
                <button type="submit" disabled={isSubmitting || isUploading} className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50">
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
