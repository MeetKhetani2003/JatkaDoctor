"use client";
import React, { useState, useEffect } from "react";
import { Search, User, Phone, Edit, Archive, CheckCircle, XCircle, FileText, RotateCw } from "lucide-react";
import jsPDF from "jspdf";

export default function PhysioPatients() {
  const [patients, setPatients] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");

  // Modals
  const [showProfile, setShowProfile] = useState(false);
  const [selectedPatient, setSelectedPatient] = useState(null);
  const [patientBookings, setPatientBookings] = useState([]);

  useEffect(() => {
    const delayDebounce = setTimeout(() => {
      fetchPatients();
    }, 500);
    return () => clearTimeout(delayDebounce);
  }, [searchTerm]);

  const fetchPatients = async () => {
    setLoading(true);
    try {
      const url = searchTerm ? `/api/admin/physio-patients?search=${encodeURIComponent(searchTerm)}` : '/api/admin/physio-patients';
      const res = await fetch(url);
      const data = await res.json();
      if (data.success) {
        setPatients(data.data);
      }
    } catch (error) {
      console.error(error);
    }
    setLoading(false);
  };

  const handleViewProfile = async (patient) => {
    setSelectedPatient(patient);
    setShowProfile(true);
    
    // Fetch bookings history
    try {
      const res = await fetch(`/api/admin/physio-bookings?patientId=${patient._id}`);
      const data = await res.json();
      if (data.success) setPatientBookings(data.data);
    } catch (error) {
      console.error(error);
    }
  };

  const toggleActive = async (id, currentStatus) => {
    try {
      await fetch(`/api/admin/physio-patients/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ isActive: !currentStatus })
      });
      fetchPatients();
    } catch (e) {
      console.error(e);
    }
  };

  const archivePatient = async (id) => {
    if(!confirm("Are you sure you want to archive this patient?")) return;
    try {
      await fetch(`/api/admin/physio-patients/${id}`, { method: 'DELETE' });
      setShowProfile(false);
      fetchPatients();
    } catch (e) {
      console.error(e);
    }
  };

  const downloadHistoryPDF = () => {
    if (!selectedPatient) return;
    const doc = new jsPDF();
    doc.setFontSize(20);
    doc.text("Patient History Report", 20, 20);
    
    doc.setFontSize(12);
    doc.text(`Patient ID: ${selectedPatient.patientId}`, 20, 40);
    doc.text(`Name: ${selectedPatient.name}`, 20, 50);
    doc.text(`Mobile: ${selectedPatient.mobile}`, 20, 60);
    
    doc.text(`Total Bookings: ${patientBookings.length}`, 20, 80);
    
    let y = 100;
    patientBookings.forEach((b, i) => {
        if (y > 270) { doc.addPage(); y = 20; }
        doc.text(`${i+1}. ${b.bookingId} - ${b.preferredDate} - ${b.departmentId?.name || 'Gen'} - ${b.status}`, 20, y);
        y += 10;
    });

    doc.save(`${selectedPatient.patientId}_History.pdf`);
  };

  return (
    <div className="space-y-6">
      <div className="bg-white rounded-3xl border border-gray-100 p-6 shadow-sm">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-lg font-bold text-gray-900">Physio Patients (Database)</h2>
        </div>
        <div className="relative max-w-xl">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
          <input 
            type="text" 
            placeholder="Search by Patient ID, Name, or Mobile..." 
            value={searchTerm}
            onChange={e => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-3 bg-gray-50 border rounded-xl text-sm outline-none font-medium"
          />
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {loading ? (
           <p className="text-gray-500 col-span-3 text-center py-10">Loading patients...</p>
        ) : patients.length === 0 ? (
           <p className="text-gray-500 col-span-3 text-center py-10">No patients found.</p>
        ) : (
          patients.map(p => (
            <div key={p._id} className="bg-white rounded-2xl border border-gray-100 p-5 shadow-sm hover:shadow-md transition">
              <div className="flex justify-between items-start mb-3">
                <div>
                  <h3 className="font-bold text-lg text-gray-900">{p.name}</h3>
                  <p className="text-xs font-mono text-gray-500">{p.patientId}</p>
                </div>
                <span className={`w-3 h-3 rounded-full ${p.isActive ? 'bg-green-500' : 'bg-red-500'}`}></span>
              </div>
              
              <div className="space-y-2 text-sm text-gray-600 mb-4">
                <p><strong>Mobile:</strong> {p.mobile}</p>
                <p><strong>Age/Gender:</strong> {p.age || 'N/A'} / {p.gender || 'N/A'}</p>
                {p.latestBooking && (
                   <>
                     <p><strong>Active Case:</strong> {p.latestBooking.departmentId?.name} {p.latestBooking.conditionId ? `(${p.latestBooking.conditionId.name})` : ''}</p>
                     <p><strong>Therapist:</strong> {p.latestBooking.assignedTherapistId?.name || 'Unassigned'}</p>
                     <p><strong>Payment Status:</strong> <span className="font-bold">{p.latestBooking.paymentStatus}</span></p>
                     {p.latestPlan && (
                       <p><strong>Sessions:</strong> {p.latestPlan.completedSessions} / {p.latestPlan.totalSessions}</p>
                     )}
                   </>
                )}
              </div>

              <div className="pt-3 border-t flex gap-2">
                <button onClick={() => handleViewProfile(p)} className="flex-1 py-2 bg-blue-50 text-blue-600 rounded-lg text-sm font-medium hover:bg-blue-100">View Profile</button>
                <a href={`https://wa.me/${p.whatsappNumber || p.mobile}`} target="_blank" rel="noreferrer" className="px-3 py-2 bg-green-50 text-green-600 rounded-lg hover:bg-green-100 flex items-center justify-center">
                  <Phone className="w-4 h-4"/>
                </a>
              </div>
            </div>
          ))
        )}
      </div>

      {showProfile && selectedPatient && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl w-full max-w-4xl max-h-[90vh] flex flex-col overflow-hidden">
            <div className="p-4 border-b flex justify-between items-center bg-gray-50">
              <h3 className="font-bold text-lg">Patient Profile: {selectedPatient.name}</h3>
              <button onClick={() => setShowProfile(false)} className="p-1 hover:bg-gray-200 rounded">X</button>
            </div>
            
            <div className="p-6 overflow-y-auto flex-1 space-y-6">
              <div className="flex flex-wrap gap-3 border-b pb-4">
                <button onClick={downloadHistoryPDF} className="px-4 py-2 bg-gray-100 text-gray-700 rounded-lg text-sm font-medium flex items-center gap-2"><FileText className="w-4 h-4"/> Download PDF</button>
                <button onClick={() => toggleActive(selectedPatient._id, selectedPatient.isActive)} className={`px-4 py-2 rounded-lg text-sm font-medium flex items-center gap-2 ${selectedPatient.isActive ? 'bg-amber-50 text-amber-600' : 'bg-green-50 text-green-600'}`}>
                  {selectedPatient.isActive ? <XCircle className="w-4 h-4"/> : <CheckCircle className="w-4 h-4"/>} 
                  {selectedPatient.isActive ? 'Mark Inactive' : 'Mark Active'}
                </button>
                <button onClick={() => archivePatient(selectedPatient._id)} className="px-4 py-2 bg-red-50 text-red-600 rounded-lg text-sm font-medium flex items-center gap-2"><Archive className="w-4 h-4"/> Archive</button>
                <button className="px-4 py-2 bg-purple-50 text-purple-600 rounded-lg text-sm font-medium flex items-center gap-2 ml-auto"><RotateCw className="w-4 h-4"/> Book Again</button>
              </div>

              <div>
                <h4 className="font-bold text-gray-800 mb-3">Booking History</h4>
                <div className="bg-gray-50 rounded-xl border overflow-hidden">
                  <table className="w-full text-sm text-left">
                    <thead className="bg-gray-100 text-gray-600 border-b">
                      <tr>
                        <th className="p-3">Booking ID</th>
                        <th className="p-3">Date</th>
                        <th className="p-3">Department</th>
                        <th className="p-3">Package</th>
                        <th className="p-3">Payment</th>
                        <th className="p-3">Status</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-100">
                      {patientBookings.map(b => (
                        <tr key={b._id}>
                          <td className="p-3 font-medium">{b.bookingId}</td>
                          <td className="p-3">{b.preferredDate}</td>
                          <td className="p-3">{b.departmentId?.name || "General"}</td>
                          <td className="p-3">{b.packageId?.title || "Per Session"}</td>
                          <td className="p-3">{b.paymentStatus}</td>
                          <td className="p-3"><span className="px-2 py-1 bg-gray-200 rounded text-xs">{b.status}</span></td>
                        </tr>
                      ))}
                      {patientBookings.length === 0 && <tr><td colSpan="6" className="p-4 text-center text-gray-400">No history found.</td></tr>}
                    </tbody>
                  </table>
                </div>
              </div>

            </div>
          </div>
        </div>
      )}
    </div>
  );
}
