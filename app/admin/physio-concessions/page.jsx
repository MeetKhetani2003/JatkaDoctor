"use client";
import { useState, useEffect } from "react";
import { CheckCircle, XCircle, Clock } from "lucide-react";

export default function ConcessionApprovalDashboard() {
  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(true);

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

  const handleAction = async (id, status, approvedPrice) => {
    try {
      await fetch(`/api/admin/physio-financial-assistance/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status, approvedPrice })
      });
      fetchRequests(); // Refresh list
    } catch (error) {
      console.error("Error updating request:", error);
    }
  };

  return (
    <div className="p-6 max-w-7xl mx-auto">
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-gray-900">Financial Assistance Requests</h1>
        <p className="text-gray-500">Review and approve patient concession requests for Physiotherapy.</p>
      </div>

      {loading ? (
        <div className="text-center py-20">Loading requests...</div>
      ) : (
        <div className="bg-white rounded-xl border shadow-sm overflow-hidden">
          <table className="w-full text-left">
            <thead className="bg-gray-50 border-b">
              <tr>
                <th className="p-4 font-medium text-gray-600">Patient</th>
                <th className="p-4 font-medium text-gray-600">Booking ID</th>
                <th className="p-4 font-medium text-gray-600">Original Price</th>
                <th className="p-4 font-medium text-gray-600">Requested Price</th>
                <th className="p-4 font-medium text-gray-600">Status</th>
                <th className="p-4 font-medium text-gray-600 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y">
              {requests.length === 0 ? (
                <tr><td colSpan={6} className="p-8 text-center text-gray-500">No pending requests.</td></tr>
              ) : (
                requests.map(req => (
                  <tr key={req._id} className="hover:bg-gray-50">
                    <td className="p-4">
                      <div className="font-medium text-gray-900">{req.patientId?.name}</div>
                      <div className="text-sm text-gray-500">{req.patientId?.mobile}</div>
                    </td>
                    <td className="p-4 font-mono text-sm text-blue-600">{req.bookingId?.bookingId}</td>
                    <td className="p-4 text-gray-500">₹{req.originalPrice}</td>
                    <td className="p-4 font-bold text-gray-900">₹{req.requestedPrice}</td>
                    <td className="p-4">
                      {req.status === 'Pending' && <span className="inline-flex items-center gap-1 text-yellow-600 bg-yellow-50 px-2 py-1 rounded-full text-xs font-medium"><Clock size={12}/> Pending</span>}
                      {req.status === 'Approved' && <span className="inline-flex items-center gap-1 text-green-600 bg-green-50 px-2 py-1 rounded-full text-xs font-medium"><CheckCircle size={12}/> Approved</span>}
                      {req.status === 'Rejected' && <span className="inline-flex items-center gap-1 text-red-600 bg-red-50 px-2 py-1 rounded-full text-xs font-medium"><XCircle size={12}/> Rejected</span>}
                    </td>
                    <td className="p-4 text-right">
                      {req.status === 'Pending' && (
                        <div className="flex justify-end gap-2">
                          <button 
                            onClick={() => handleAction(req._id, 'Approved', req.requestedPrice)}
                            className="px-3 py-1 bg-green-600 text-white rounded text-sm font-medium hover:bg-green-700"
                          >
                            Approve
                          </button>
                          <button 
                            onClick={() => handleAction(req._id, 'Rejected', req.originalPrice)}
                            className="px-3 py-1 bg-red-100 text-red-600 rounded text-sm font-medium hover:bg-red-200"
                          >
                            Reject
                          </button>
                        </div>
                      )}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
