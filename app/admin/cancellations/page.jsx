"use client";

import React, { useState, useEffect } from "react";
import { 
  XOctagon, 
  Loader2, 
  CheckCircle, 
  AlertCircle, 
  DollarSign, 
  Hash, 
  Undo2 
} from "lucide-react";

export default function AdminCancellations() {
  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [updatingId, setUpdatingId] = useState(null);
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

  const handleUpdateStatus = async (id, refundStatus) => {
    setUpdatingId(id);
    setMessage({ text: "", type: "" });

    try {
      const res = await fetch("/api/admin/cancellations", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id, refundStatus })
      });

      if (res.ok) {
        const updated = await res.json();
        setRequests(requests.map(r => r._id === id ? updated : r));
        setMessage({ text: `✓ Refund status updated to "${refundStatus}" successfully!`, type: "success" });
      } else {
        const data = await res.json();
        setMessage({ text: data.error || "Failed to update refund status.", type: "error" });
      }
    } catch (error) {
      console.error(error);
      setMessage({ text: "Network error updating refund status.", type: "error" });
    } finally {
      setUpdatingId(null);
    }
  };

  const getRefundStatusBadgeColor = (status) => {
    switch (status) {
      case "Pending":
        return "bg-amber-100 text-amber-800 border-amber-200";
      case "Approved":
        return "bg-blue-100 text-blue-800 border-blue-200";
      case "Refunded":
        return "bg-green-100 text-green-800 border-green-200";
      default:
        return "bg-gray-100 text-gray-800 border-gray-200";
    }
  };

  return (
    <div className="space-y-8">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-normal text-black tracking-tight mb-2">Cancellation & Manual Refunds</h1>
        <p className="text-gray-500 text-sm font-normal">Review cancellation claims and approve/execute manual patient refunds.</p>
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
                  <th className="px-6 py-4">Cancellation Reason</th>
                  <th className="px-6 py-4">Requested On</th>
                  <th className="px-6 py-4 text-center">Refund Status</th>
                  <th className="px-6 py-4 text-right">Refund Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {requests.map((req) => (
                  <tr key={req._id} className="hover:bg-gray-50/20">
                    <td className="px-6 py-4 font-bold text-primary flex items-center gap-1.5 mt-1">
                      <Hash className="w-3.5 h-3.5" />
                      {req.bookingId}
                    </td>
                    <td className="px-6 py-4 text-gray-900 font-medium max-w-xs truncate" title={req.reason}>
                      {req.reason}
                    </td>
                    <td className="px-6 py-4">
                      {new Date(req.createdAt).toLocaleString()}
                    </td>
                    <td className="px-6 py-4 text-center">
                      <span className={`px-2 py-0.5 rounded-full font-bold uppercase tracking-wider border ${getRefundStatusBadgeColor(req.refundStatus)}`}>
                        {req.refundStatus}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-right">
                      {req.refundStatus === "Pending" ? (
                        <button
                          onClick={() => handleUpdateStatus(req._id, "Approved")}
                          disabled={updatingId === req._id}
                          className="px-3 py-1.5 bg-blue-50 hover:bg-blue-100 border border-blue-200 text-blue-700 rounded-lg font-bold transition flex items-center gap-1 ml-auto"
                        >
                          <DollarSign className="w-3.5 h-3.5" /> Approve Refund
                        </button>
                      ) : req.refundStatus === "Approved" ? (
                        <button
                          onClick={() => handleUpdateStatus(req._id, "Refunded")}
                          disabled={updatingId === req._id}
                          className="px-3 py-1.5 bg-green-50 hover:bg-green-100 border border-green-200 text-green-700 rounded-lg font-bold transition flex items-center gap-1 ml-auto"
                        >
                          <DollarSign className="w-3.5 h-3.5" /> Complete / Pay Refund
                        </button>
                      ) : (
                        <span className="text-gray-400 font-bold pr-2 flex items-center gap-1 justify-end">
                          ✓ Refund Transferred
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
    </div>
  );
}
