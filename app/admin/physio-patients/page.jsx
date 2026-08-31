"use client";
import { useState, useEffect } from "react";
import { Search, User, Phone, ArrowRight, Activity } from "lucide-react";

export default function PhysioPatientDirectory() {
  const [patients, setPatients] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");

  const fetchPatients = async (query = "") => {
    setLoading(true);
    try {
      const res = await fetch(`/api/admin/physio-patients${query ? `?search=${query}` : ''}`);
      const data = await res.json();
      setPatients(data.data || []);
    } catch (error) {
      console.error("Error fetching patients:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPatients();
  }, []);

  const handleSearch = (e) => {
    e.preventDefault();
    fetchPatients(searchQuery);
  };

  return (
    <div className="p-6 max-w-7xl mx-auto">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Physiotherapy Patient Directory</h1>
          <p className="text-gray-500">Manage all registered physiotherapy patients</p>
        </div>
        
        <form onSubmit={handleSearch} className="flex w-full md:w-auto">
          <div className="relative flex-grow">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
            <input 
              type="text" 
              placeholder="Search ID or Mobile..." 
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border rounded-l-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <button type="submit" className="bg-blue-600 text-white px-4 py-2 rounded-r-lg hover:bg-blue-700">
            Search
          </button>
        </form>
      </div>

      {loading ? (
        <div className="text-center py-20">Loading patients...</div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {patients.length === 0 ? (
            <div className="col-span-full text-center py-12 bg-white rounded-xl border border-dashed border-gray-300 text-gray-500">
              No patients found matching your search.
            </div>
          ) : (
            patients.map(patient => (
              <div key={patient._id} className="bg-white rounded-xl border p-5 hover:shadow-md transition-shadow relative overflow-hidden">
                {!patient.isActive && (
                  <div className="absolute top-0 right-0 bg-red-100 text-red-700 text-xs px-2 py-1 rounded-bl-lg font-medium">
                    Inactive
                  </div>
                )}
                <div className="flex items-center gap-4 mb-4">
                  <div className="w-12 h-12 rounded-full bg-blue-100 flex items-center justify-center text-blue-600">
                    <User size={24} />
                  </div>
                  <div>
                    <h3 className="font-semibold text-lg">{patient.name}</h3>
                    <p className="text-sm text-gray-500 font-mono">{patient.patientId}</p>
                  </div>
                </div>
                
                <div className="space-y-2 mb-6">
                  <div className="flex items-center gap-2 text-sm text-gray-600">
                    <Phone size={16} /> {patient.mobile}
                  </div>
                  <div className="flex items-center gap-2 text-sm text-gray-600">
                    <Activity size={16} /> {patient.totalBookings} Total Bookings
                  </div>
                  {patient.pendingAmount > 0 && (
                    <div className="flex items-center gap-2 text-sm text-red-600 font-medium">
                      <span>Due: ₹{patient.pendingAmount}</span>
                    </div>
                  )}
                </div>
              </div>
            ))
          )}
        </div>
      )}
    </div>
  );
}
