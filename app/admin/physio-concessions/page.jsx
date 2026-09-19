"use client";
import React, { useState, useEffect } from "react";
import { CheckCircle, XCircle, Clock, Eye, Edit2, X } from "lucide-react";

export default function ConcessionApprovalDashboard() {
  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(true);

  // Modal State
  const [showModal, setShowModal] = useState(false);
  const [selectedReq, setSelectedReq] = useState(null);
  
  // Edit State
  const [isEditing, setIsEditing] = useState(false);
  const [editType, setEditType] = useState('Flat');
  const [editValue, setEditValue] = useState(0);

  const fetchRequests = async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/admin/physio-financial-assistance");
      const data = await res.json();
      setRequests(data.data || []);
    } catch (error) {
      console.error("Error fetching requests:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchRequests();
  }, []);

  const calculateFinalPrice = (original, type, value) => {
    if (type === 'Percentage') {
        const discount = original * (value / 100);
        return Math.max(0, original - discount);
    }
    return Math.max(0, original - value);
  };

  const handleAction = async (id, status, overrideFinalPrice = null) => {
    if(!confirm(`Are you sure you want to ${status} this request?`)) return;
    
    let finalPrice = selectedReq ? selectedReq.finalPrice : 0;
    if (overrideFinalPrice !== null) finalPrice = overrideFinalPrice;
    
    try {
      await fetch(`/api/admin/physio-financial-assistance/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
            status, 
            finalPrice,
            ...(status === 'Approved' && isEditing ? { concessionType: editType, concessionValue: editValue } : {})
        })
      });
      setShowModal(false);
      setIsEditing(false);
      fetchRequests();
    } catch (error) {
      console.error("Error updating request:", error);
    }
  };

  const openRequest = (req) => {
    setSelectedReq(req);
    setEditType(req.concessionType || 'Flat');
    setEditValue(req.concessionValue || 0);
    setIsEditing(false);
    setShowModal(true);
  };

  return (
    <div className="space-y-6">
      <div className="bg-white rounded-3xl border border-gray-100 p-6 shadow-sm">
        <h2 className="text-lg font-bold text-gray-900 mb-1">Physio Concessions</h2>
        <p className="text-sm text-gray-500">Manage financial assistance and discounts</p>
      </div>

      <div className="bg-white rounded-3xl border border-gray-100 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead className="bg-gray-50 text-gray-500 font-medium border-b border-gray-100">
              <tr>
                <th className="p-4">Requested Date</th>
                <th className="p-4">Patient</th>
                <th className="p-4">Booking Info</th>
                <th className="p-4 text-right">Original</th>
                <th className="p-4 text-center">Concession</th>
                <th className="p-4 text-right">Final Price</th>
                <th className="p-4 text-center">Status</th>
                <th className="p-4 text-center">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {loading ? (
                <tr><td colSpan="8" className="p-8 text-center text-gray-400">Loading requests...</td></tr>
              ) : requests.length === 0 ? (
                <tr><td colSpan="8" className="p-8 text-center text-gray-400">No concession requests found.</td></tr>
              ) : (
                requests.map(req => (
                  <tr key={req._id} className="hover:bg-gray-50">
                    <td className="p-4 text-gray-500">{new Date(req.createdAt).toLocaleDateString()}</td>
                    <td className="p-4">
                      <div className="font-bold text-gray-900">{req.patientId?.name}</div>
                      <div className="text-xs text-gray-500">{req.patientId?.mobile}</div>
                    </td>
                    <td className="p-4">
                      <div className="font-bold text-blue-600 font-mono text-xs">{req.bookingId?.bookingId}</div>
                    </td>
                    <td className="p-4 text-right font-medium">₹{req.originalPrice}</td>
                    <td className="p-4 text-center">
                        <span className="px-2 py-1 bg-purple-50 text-purple-700 rounded text-xs font-bold">
                            {req.concessionType === 'Percentage' ? `${req.concessionValue}%` : `₹${req.concessionValue}`}
                        </span>
                    </td>
                    <td className="p-4 text-right font-bold text-green-700">₹{req.finalPrice}</td>
                    <td className="p-4 text-center">
                      {req.status === 'Pending' && <span className="inline-flex items-center gap-1 text-yellow-600 bg-yellow-50 px-2 py-1 rounded-full text-xs font-bold"><Clock size={12}/> Pending</span>}
                      {req.status === 'Approved' && <span className="inline-flex items-center gap-1 text-green-600 bg-green-50 px-2 py-1 rounded-full text-xs font-bold"><CheckCircle size={12}/> Approved</span>}
                      {req.status === 'Rejected' && <span className="inline-flex items-center gap-1 text-red-600 bg-red-50 px-2 py-1 rounded-full text-xs font-bold"><XCircle size={12}/> Rejected</span>}
                    </td>
                    <td className="p-4 text-center">
                       <button onClick={() => openRequest(req)} className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg">
                           <Eye className="w-5 h-5"/>
                       </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* View Request Modal */}
      {showModal && selectedReq && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl w-full max-w-2xl overflow-hidden flex flex-col">
            <div className="p-4 border-b flex justify-between items-center bg-gray-50">
              <h3 className="font-bold text-lg">Concession Request Details</h3>
              <button onClick={() => setShowModal(false)} className="p-1 hover:bg-gray-200 rounded"><X className="w-5 h-5"/></button>
            </div>
            
            <div className="p-6 space-y-6">
                <div className="grid grid-cols-2 gap-4">
                    <div className="p-4 bg-gray-50 rounded-xl border">
                        <p className="text-xs font-bold text-gray-500 uppercase mb-1">Patient Info</p>
                        <p className="font-bold text-gray-900">{selectedReq.patientId?.name}</p>
                        <p className="text-sm text-gray-600">{selectedReq.patientId?.mobile}</p>
                    </div>
                    <div className="p-4 bg-gray-50 rounded-xl border">
                        <p className="text-xs font-bold text-gray-500 uppercase mb-1">Booking Info</p>
                        <p className="font-bold text-blue-600 font-mono text-sm">{selectedReq.bookingId?.bookingId}</p>
                        <p className="text-sm text-gray-600">Total: ₹{selectedReq.bookingId?.totalAmount}</p>
                    </div>
                </div>

                <div>
                    <p className="text-xs font-bold text-gray-500 uppercase mb-2">Reason for Concession</p>
                    <p className="text-sm text-gray-800 bg-amber-50 p-3 rounded-lg border border-amber-100">{selectedReq.reason || "No reason provided."}</p>
                </div>

                <div className="p-4 border rounded-xl">
                    <div className="flex justify-between items-center mb-4">
                        <p className="font-bold">Financial Calculation</p>
                        {selectedReq.status === 'Pending' && !isEditing && (
                            <button onClick={() => setIsEditing(true)} className="text-xs flex items-center gap-1 text-blue-600 hover:underline"><Edit2 className="w-3 h-3"/> Edit Concession</button>
                        )}
                    </div>
                    
                    <div className="flex justify-between items-center py-2 border-b">
                        <span className="text-sm text-gray-600">Original Price</span>
                        <span className="font-bold">₹{selectedReq.originalPrice}</span>
                    </div>

                    {isEditing ? (
                        <div className="py-4 border-b space-y-3">
                            <p className="text-xs font-bold text-gray-500 uppercase">Edit Concession Values</p>
                            <div className="flex gap-4">
                                <select 
                                    className="p-2 border rounded text-sm w-32"
                                    value={editType}
                                    onChange={e => setEditType(e.target.value)}
                                >
                                    <option value="Flat">Flat (₹)</option>
                                    <option value="Percentage">Percentage (%)</option>
                                </select>
                                <input 
                                    type="number" 
                                    className="p-2 border rounded text-sm flex-1"
                                    value={editValue}
                                    onChange={e => setEditValue(Number(e.target.value))}
                                />
                            </div>
                            <div className="flex justify-between items-center bg-green-50 p-2 rounded">
                                <span className="text-sm font-bold text-green-800">New Final Price:</span>
                                <span className="font-bold text-green-800 text-lg">₹{calculateFinalPrice(selectedReq.originalPrice, editType, editValue)}</span>
                            </div>
                        </div>
                    ) : (
                        <div className="flex justify-between items-center py-2 border-b">
                            <span className="text-sm text-gray-600">Concession ({selectedReq.concessionType})</span>
                            <span className="font-bold text-purple-600">- {selectedReq.concessionType === 'Percentage' ? `${selectedReq.concessionValue}%` : `₹${selectedReq.concessionValue}`}</span>
                        </div>
                    )}
                    
                    {!isEditing && (
                        <div className="flex justify-between items-center py-2 mt-2">
                            <span className="text-sm font-bold">Final Payable Amount</span>
                            <span className="font-bold text-lg text-green-700">₹{selectedReq.finalPrice}</span>
                        </div>
                    )}
                </div>

                {selectedReq.status === 'Pending' && (
                    <div className="flex justify-end gap-3 pt-4 border-t">
                        <button onClick={() => handleAction(selectedReq._id, 'Rejected', selectedReq.originalPrice)} className="px-6 py-2 bg-red-50 text-red-600 font-bold rounded-xl hover:bg-red-100">Reject</button>
                        <button 
                            onClick={() => handleAction(selectedReq._id, 'Approved', isEditing ? calculateFinalPrice(selectedReq.originalPrice, editType, editValue) : selectedReq.finalPrice)} 
                            className="px-6 py-2 bg-green-600 text-white font-bold rounded-xl hover:bg-green-700"
                        >
                            Approve Concession
                        </button>
                    </div>
                )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
