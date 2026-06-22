"use client";

import React, { useState, useEffect } from "react";
import { 
  XOctagon, 
  Loader2, 
  CheckCircle, 
  AlertCircle, 
  DollarSign, 
  Hash, 
  Undo2,
  Image as ImageIcon,
  UploadCloud,
  FileText
} from "lucide-react";

export default function AdminCancellations() {
  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(true);
  
  // Modals state
  const [approveModalReq, setApproveModalReq] = useState(null);
  const [rejectModalReq, setRejectModalReq] = useState(null);
  const [adminProof, setAdminProof] = useState(null);
  const [rejectionReason, setRejectionReason] = useState("");
  
  const [actionLoading, setActionLoading] = useState(false);
  const [message, setMessage] = useState({ text: "", type: "" });

  const fetchRequests = async () => {
    try {
      const res = await fetch("/api/admin/cancellations");
      const data = await res.json();
      setRequests(Array.isArray(data) ? data : []);
    } catch (e) {
      console.error(e);
      setMessage({ text: "Failed to load cancellation requests.", type: "error" });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchRequests();
  }, []);

  const handleApprove = async (e) => {
    e.preventDefault();
    if (!adminProof) {
      alert("Please upload a refund proof screenshot.");
      return;
    }
    
    setActionLoading(true);
    setMessage({ text: "", type: "" });

    try {
      const formData = new FormData();
      formData.append("id", approveModalReq._id);
      formData.append("action", "approve");
      formData.append("adminProof", adminProof);

      const res = await fetch("/api/admin/cancellations", {
        method: "PATCH",
        body: formData
      });

      if (res.ok) {
        const data = await res.json();
        setRequests(requests.map(r => r._id === approveModalReq._id ? data.request : r));
        setMessage({ text: `✓ Refund Approved & Proof Uploaded!`, type: "success" });
        setApproveModalReq(null);
        setAdminProof(null);
      } else {
        const data = await res.json();
        setMessage({ text: data.error || "Failed to approve refund.", type: "error" });
      }
    } catch (error) {
      console.error(error);
      setMessage({ text: "Network error approving refund.", type: "error" });
    } finally {
      setActionLoading(false);
    }
  };

  const handleReject = async (e) => {
    e.preventDefault();
    if (!rejectionReason.trim()) {
      alert("Reason is required.");
      return;
    }
    
    setActionLoading(true);
    setMessage({ text: "", type: "" });

    try {
      const formData = new FormData();
      formData.append("id", rejectModalReq._id);
      formData.append("action", "reject");
      formData.append("rejectionReason", rejectionReason);

      const res = await fetch("/api/admin/cancellations", {
        method: "PATCH",
        body: formData
      });

      if (res.ok) {
        const data = await res.json();
        setRequests(requests.map(r => r._id === rejectModalReq._id ? data.request : r));
        setMessage({ text: `✓ Request Rejected successfully.`, type: "success" });
        setRejectModalReq(null);
        setRejectionReason("");
      } else {
        const data = await res.json();
        setMessage({ text: data.error || "Failed to reject request.", type: "error" });
      }
    } catch (error) {
      console.error(error);
      setMessage({ text: "Network error rejecting request.", type: "error" });
    } finally {
      setActionLoading(false);
    }
  };

  const getRefundStatusBadgeColor = (status) => {
    switch (status) {
      case "Pending": return "bg-amber-100 text-amber-800 border-amber-200";
      case "Approved": return "bg-blue-100 text-blue-800 border-blue-200";
      case "Refunded": return "bg-green-100 text-green-800 border-green-200";
      case "Rejected": return "bg-red-100 text-red-800 border-red-200";
      default: return "bg-gray-100 text-gray-800 border-gray-200";
    }
  };

  const renderRefundDetails = (req) => {
    if (!req.refundDetails) return <span className="text-gray-400">N/A</span>;
    
    if (req.refundMethod === "UPI") {
      return (
        <div>
          <span className="font-bold text-gray-900 bg-gray-100 px-2 py-0.5 rounded text-[10px] uppercase">UPI</span>
          <p className="mt-1 font-mono">{req.refundDetails.upiId}</p>
        </div>
      );
    }
    
    return (
      <div className="space-y-0.5">
        <span className="font-bold text-gray-900 bg-gray-100 px-2 py-0.5 rounded text-[10px] uppercase">Bank Transfer</span>
        <p><strong>A/C:</strong> {req.refundDetails.accountNumber}</p>
        <p><strong>IFSC:</strong> {req.refundDetails.ifsc}</p>
        <p><strong>Name:</strong> {req.refundDetails.accountName}</p>
      </div>
    );
  };

  return (
    <div className="space-y-8">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-normal text-black tracking-tight mb-2">Cancellation & Manual Refunds</h1>
        <p className="text-gray-500 text-sm font-normal">Review cancellation claims, verify payment proofs, and approve manual patient refunds.</p>
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

      {/* Requests table */}
      <div className="bg-white rounded-3xl border border-gray-100 shadow-sm overflow-hidden">
        <div className="px-6 py-4 border-b border-gray-100 flex items-center justify-between">
          <h3 className="font-bold text-gray-900 flex items-center gap-2">
            <XOctagon className="w-5 h-5 text-red-500" />
            Active Cancellation Requests
          </h3>
          <span className="text-xs font-bold text-gray-400 bg-gray-100 px-2.5 py-1 rounded-full">{requests.length} total</span>
        </div>

        {loading ? (
          <div className="p-20 text-center">
            <Loader2 className="w-8 h-8 animate-spin text-primary mx-auto mb-2" />
            <p className="text-sm text-gray-500">Loading cancellation records...</p>
          </div>
        ) : requests.length === 0 ? (
          <div className="p-20 text-center text-gray-400 space-y-2">
            <Undo2 className="w-12 h-12 mx-auto text-gray-200" />
            <p className="font-bold">No cancellation requests found</p>
            <p className="text-xs max-w-xs mx-auto">Cancelled bookings and refund processes will list here.</p>
          </div>
        ) : (
          <div className="overflow-x-auto text-xs text-left">
            <table className="w-full text-gray-500">
              <thead className="text-[10px] text-gray-400 uppercase bg-gray-50/50">
                <tr>
                  <th className="px-6 py-4">Booking ID</th>
                  <th className="px-6 py-4">Reason</th>
                  <th className="px-6 py-4">Destination Details</th>
                  <th className="px-6 py-4">Attachments</th>
                  <th className="px-6 py-4 text-center">Status</th>
                  <th className="px-6 py-4 text-right">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {requests.map((req) => (
                  <tr key={req._id} className="hover:bg-gray-50/20">
                    <td className="px-6 py-4 font-bold text-primary flex items-center gap-1.5 mt-1">
                      <Hash className="w-3.5 h-3.5" />
                      {req.bookingId}
                    </td>
                    <td className="px-6 py-4 text-gray-900 font-medium max-w-xs" title={req.reason}>
                      {req.reason}
                    </td>
                    <td className="px-6 py-4 text-gray-700">
                      {renderRefundDetails(req)}
                    </td>
                    <td className="px-6 py-4">
                      {req.userScreenshotId && req.refundStatus === "Pending" ? (
                        <a href={`/api/images/${req.userScreenshotId}`} target="_blank" rel="noopener noreferrer" className="flex items-center gap-1 text-blue-600 hover:underline font-bold">
                          <ImageIcon className="w-3.5 h-3.5" /> View Payment
                        </a>
                      ) : req.adminRefundProofId ? (
                        <a href={`/api/images/${req.adminRefundProofId}`} target="_blank" rel="noopener noreferrer" className="flex items-center gap-1 text-green-600 hover:underline font-bold">
                          <CheckCircle className="w-3.5 h-3.5" /> View Refund Proof
                        </a>
                      ) : (
                        <span className="text-gray-400 italic">None</span>
                      )}
                    </td>
                    <td className="px-6 py-4 text-center">
                      <span className={`px-2 py-0.5 rounded-full font-bold uppercase tracking-wider border ${getRefundStatusBadgeColor(req.refundStatus)}`}>
                        {req.refundStatus}
                      </span>
                      {req.refundStatus === "Rejected" && req.rejectionReason && (
                        <div className="mt-1 text-[9px] text-red-500 font-bold truncate max-w-[100px] mx-auto" title={req.rejectionReason}>
                          {req.rejectionReason}
                        </div>
                      )}
                    </td>
                    <td className="px-6 py-4 text-right space-y-2">
                      {req.refundStatus === "Pending" ? (
                        <div className="flex flex-col gap-2 items-end">
                          <button
                            onClick={() => setApproveModalReq(req)}
                            className="px-4 py-2 bg-green-50 hover:bg-green-100 border border-green-200 text-green-700 rounded-lg font-bold transition flex items-center justify-center gap-1 w-28"
                          >
                            Approve
                          </button>
                          <button
                            onClick={() => setRejectModalReq(req)}
                            className="px-4 py-2 bg-red-50 hover:bg-red-100 border border-red-200 text-red-700 rounded-lg font-bold transition flex items-center justify-center gap-1 w-28"
                          >
                            Reject
                          </button>
                        </div>
                      ) : req.refundStatus === "Refunded" ? (
                        <span className="text-green-600 font-bold pr-2 flex items-center gap-1 justify-end">
                          ✓ Settled
                        </span>
                      ) : (
                        <span className="text-gray-400 font-bold pr-2">
                          Closed
                        </span>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* APPROVE MODAL */}
      {approveModalReq && (
        <div className="fixed inset-0 bg-black/60 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl p-8 max-w-md w-full shadow-2xl relative animate-fade-in">
            <h3 className="text-xl font-bold text-gray-900 mb-2">Approve Refund</h3>
            <p className="text-sm text-gray-500 mb-6">You must attach a screenshot proof showing the successful transfer.</p>

            {/* Readonly details for admin to copy */}
            <div className="bg-gray-50 p-4 rounded-xl border border-gray-200 mb-6 text-xs text-gray-800 space-y-1">
              <p className="font-bold text-gray-400 uppercase text-[10px] tracking-wider mb-2">Transfer To</p>
              {approveModalReq.refundMethod === "UPI" ? (
                <p><strong>UPI ID:</strong> <span className="font-mono">{approveModalReq.refundDetails?.upiId}</span></p>
              ) : (
                <>
                  <p><strong>A/C:</strong> <span className="font-mono">{approveModalReq.refundDetails?.accountNumber}</span></p>
                  <p><strong>IFSC:</strong> {approveModalReq.refundDetails?.ifsc}</p>
                  <p><strong>Name:</strong> {approveModalReq.refundDetails?.accountName}</p>
                  <p><strong>Bank:</strong> {approveModalReq.refundDetails?.bankName} ({approveModalReq.refundDetails?.branchName})</p>
                </>
              )}
            </div>

            <form onSubmit={handleApprove} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-gray-700 mb-2">Attach Refund Proof *</label>
                <div className="relative border-2 border-dashed border-gray-300 rounded-2xl p-6 text-center hover:bg-gray-50 transition cursor-pointer">
                  <input 
                    type="file" 
                    accept="image/*" 
                    required 
                    onChange={e => setAdminProof(e.target.files[0])}
                    className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                  />
                  <UploadCloud className="w-8 h-8 text-green-500 mx-auto mb-2" />
                  <p className="text-sm font-bold text-gray-700">{adminProof ? adminProof.name : "Upload screenshot"}</p>
                </div>
              </div>

              <div className="flex gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => { setApproveModalReq(null); setAdminProof(null); }}
                  disabled={actionLoading}
                  className="flex-1 py-3 bg-gray-100 text-gray-900 font-bold rounded-xl active:scale-95 transition"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={actionLoading || !adminProof}
                  className="flex-1 py-3 bg-green-500 text-white font-bold rounded-xl active:scale-95 transition flex items-center justify-center gap-2 disabled:opacity-50"
                >
                  {actionLoading ? <Loader2 className="w-4 h-4 animate-spin" /> : "Confirm Approval"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* REJECT MODAL */}
      {rejectModalReq && (
        <div className="fixed inset-0 bg-black/60 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl p-8 max-w-md w-full shadow-2xl relative animate-fade-in">
            <h3 className="text-xl font-bold text-red-600 mb-2">Reject Request</h3>
            <p className="text-sm text-gray-500 mb-6">Please provide a reason. The payment status will be reverted to Paid.</p>

            <form onSubmit={handleReject} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-gray-700 mb-2">Reason for Rejection *</label>
                <textarea
                  required
                  value={rejectionReason}
                  onChange={e => setRejectionReason(e.target.value)}
                  placeholder="E.g. Invalid payment proof..."
                  className="w-full px-4 py-3 bg-white border border-gray-200 rounded-xl outline-none focus:border-red-500 text-sm resize-none"
                  rows={3}
                />
              </div>

              <div className="flex gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => { setRejectModalReq(null); setRejectionReason(""); }}
                  disabled={actionLoading}
                  className="flex-1 py-3 bg-gray-100 text-gray-900 font-bold rounded-xl active:scale-95 transition"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={actionLoading || !rejectionReason.trim()}
                  className="flex-1 py-3 bg-red-500 text-white font-bold rounded-xl active:scale-95 transition flex items-center justify-center gap-2 disabled:opacity-50"
                >
                  {actionLoading ? <Loader2 className="w-4 h-4 animate-spin" /> : "Confirm Rejection"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
