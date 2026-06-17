"use client";

import React, { useState, useEffect } from "react";
import { 
  PhoneCall, 
  Loader2, 
  CheckCircle, 
  AlertCircle, 
  Send, 
  Plus, 
  ListTodo, 
  CheckSquare, 
  Clock 
} from "lucide-react";

export default function AdminFollowups() {
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [triggeringId, setTriggeringId] = useState(null);
  const [message, setMessage] = useState({ text: "", type: "" });

  // Creation Form Fields
  const [showAddForm, setShowAddForm] = useState(false);
  const [bookingId, setBookingId] = useState("");
  const [patientName, setPatientName] = useState("");
  const [phone, setPhone] = useState("");
  const [type, setType] = useState("Manual Followup");
  const [scheduledDate, setScheduledDate] = useState("");
  const [remarks, setRemarks] = useState("");
  const [submitting, setSubmitting] = useState(false);

  const fetchTasks = async () => {
    try {
      const res = await fetch("/api/admin/followups");
      const data = await res.json();
      setTasks(Array.isArray(data) ? data : []);
    } catch (e) {
      console.error(e);
      setMessage({ text: "Failed to load follow-up checklist.", type: "error" });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTasks();
  }, []);

  const handleCreateTask = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    setMessage({ text: "", type: "" });

    try {
      const res = await fetch("/api/admin/followups", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ bookingId, patientName, phone, type, scheduledDate, remarks })
      });

      if (res.ok) {
        const data = await res.json();
        setTasks([data, ...tasks]);
        setBookingId("");
        setPatientName("");
        setPhone("");
        setRemarks("");
        setScheduledDate("");
        setShowAddForm(false);
        setMessage({ text: `✓ Followup task for ${patientName} scheduled successfully!`, type: "success" });
      } else {
        const data = await res.json();
        setMessage({ text: data.error || "Failed to schedule followup.", type: "error" });
      }
    } catch (err) {
      console.error(err);
      setMessage({ text: "Network error scheduling task.", type: "error" });
    } finally {
      setSubmitting(false);
    }
  };

  const handleTriggerTask = async (id, patientName) => {
    setTriggeringId(id);
    setMessage({ text: "", type: "" });

    try {
      const res = await fetch("/api/admin/followups", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id, status: "Completed" })
      });

      if (res.ok) {
        const updated = await res.json();
        setTasks(tasks.map(t => t._id === id ? updated : t));
        setMessage({ text: `✓ Followup notification sent successfully to ${patientName}!`, type: "success" });
      } else {
        const data = await res.json();
        setMessage({ text: data.error || "Failed to trigger followup.", type: "error" });
      }
    } catch (err) {
      console.error(err);
      setMessage({ text: "Network error triggering followup.", type: "error" });
    } finally {
      setTriggeringId(null);
    }
  };

  const handleUpdateRemarks = async (id, updatedRemarks) => {
    try {
      await fetch("/api/admin/followups", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id, remarks: updatedRemarks })
      });
      setTasks(tasks.map(t => t._id === id ? { ...t, remarks: updatedRemarks } : t));
    } catch (err) {
      console.error("Failed to update remarks:", err);
    }
  };

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex justify-between items-start md:items-center flex-col md:flex-row gap-4">
        <div>
          <h1 className="text-2xl font-normal text-black tracking-tight mb-2">Patient Follow-up Planner</h1>
          <p className="text-gray-500 text-sm font-normal">Review automated scheduling for feedback, Google reviews, and custom healthcare checkups.</p>
        </div>
        <button
          onClick={() => setShowAddForm(!showAddForm)}
          className="px-5 py-3 bg-primary text-white font-bold rounded-2xl hover:bg-primary-dark transition active:scale-95 flex items-center gap-2 text-xs"
        >
          <Plus className="w-4 h-4" />
          Schedule Manual Follow-up
        </button>
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

      {/* manual addition form */}
      {showAddForm && (
        <div className="bg-white rounded-3xl border border-gray-100 p-6 shadow-sm max-w-2xl">
          <h3 className="text-lg font-bold text-gray-900 mb-4 flex items-center gap-2">
            <PhoneCall className="w-5 h-5 text-primary" />
            Schedule Patient Followup Task
          </h3>
          <form onSubmit={handleCreateTask} className="grid grid-cols-1 md:grid-cols-2 gap-4">
            
            <div className="space-y-1">
              <label className="text-xs font-bold text-gray-600 block">Booking ID</label>
              <input
                type="text"
                required
                placeholder="e.g. DJM-0021"
                value={bookingId}
                onChange={e => setBookingId(e.target.value)}
                className="w-full px-4 py-3 rounded-xl bg-gray-50 border border-gray-200 text-sm outline-none focus:ring-2 focus:ring-primary/20"
              />
            </div>

            <div className="space-y-1">
              <label className="text-xs font-bold text-gray-600 block">Patient Name</label>
              <input
                type="text"
                required
                placeholder="e.g. Rahul Kumar"
                value={patientName}
                onChange={e => setPatientName(e.target.value)}
                className="w-full px-4 py-3 rounded-xl bg-gray-50 border border-gray-200 text-sm outline-none focus:ring-2 focus:ring-primary/20"
              />
            </div>

            <div className="space-y-1">
              <label className="text-xs font-bold text-gray-600 block">Phone Number</label>
              <input
                type="text"
                required
                placeholder="e.g. 8874744756"
                value={phone}
                onChange={e => setPhone(e.target.value)}
                className="w-full px-4 py-3 rounded-xl bg-gray-50 border border-gray-200 text-sm outline-none focus:ring-2 focus:ring-primary/20"
              />
            </div>

            <div className="space-y-1">
              <label className="text-xs font-bold text-gray-600 block">Followup Type</label>
              <select
                value={type}
                onChange={e => setType(e.target.value)}
                className="w-full px-4 py-3.5 rounded-xl bg-gray-50 border border-gray-200 text-sm text-gray-700 outline-none focus:ring-2 focus:ring-primary/20"
              >
                <option value="Feedback Request">Feedback Request</option>
                <option value="Google Review Request">Google Review Request</option>
                <option value="Manual Followup">Manual Followup</option>
              </select>
            </div>

            <div className="space-y-1">
              <label className="text-xs font-bold text-gray-600 block">Scheduled Date</label>
              <input
                type="date"
                required
                min={new Date().toISOString().split("T")[0]}
                value={scheduledDate}
                onChange={e => setScheduledDate(e.target.value)}
                className="w-full px-4 py-3.5 rounded-xl bg-gray-50 border border-gray-200 text-sm text-gray-700 outline-none"
              />
            </div>

            <div className="space-y-1 md:col-span-2">
              <label className="text-xs font-bold text-gray-600 block">Internal Notes / Instructions</label>
              <textarea
                placeholder="Details of what to ask or say during manual call..."
                rows={3}
                value={remarks}
                onChange={e => setRemarks(e.target.value)}
                className="w-full px-4 py-3 rounded-xl bg-gray-50 border border-gray-200 text-sm outline-none focus:ring-2 focus:ring-primary/20 resize-none"
              />
            </div>

            <div className="md:col-span-2 flex gap-3 justify-end pt-2">
              <button
                type="button"
                onClick={() => setShowAddForm(false)}
                className="px-5 py-2.5 bg-gray-100 text-gray-700 font-bold rounded-xl active:scale-95 text-xs"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={submitting}
                className="px-5 py-2.5 bg-primary text-white font-bold rounded-xl hover:bg-primary-dark transition active:scale-95 flex items-center gap-1 text-xs"
              >
                {submitting ? <Loader2 className="w-4 h-4 animate-spin" /> : <Plus className="w-4 h-4" />}
                Add Task
              </button>
            </div>

          </form>
        </div>
      )}

      {/* Checklist list */}
      <div className="bg-white rounded-3xl border border-gray-100 shadow-sm overflow-hidden">
        <div className="px-6 py-4 border-b border-gray-100 flex items-center justify-between">
          <h3 className="font-bold text-gray-900 flex items-center gap-2">
            <ListTodo className="w-5 h-5 text-primary" />
            Follow-up Queue & Schedule
          </h3>
          <span className="text-xs font-bold text-gray-400 bg-gray-100 px-2.5 py-1 rounded-full">
            {tasks.filter(t => t.status === "Pending").length} pending
          </span>
        </div>

        {loading ? (
          <div className="p-20 text-center">
            <Loader2 className="w-8 h-8 animate-spin text-primary mx-auto mb-2" />
            <p className="text-sm text-gray-500">Loading followups queue...</p>
          </div>
        ) : tasks.length === 0 ? (
          <div className="p-20 text-center text-gray-400 space-y-2">
            <CheckSquare className="w-12 h-12 mx-auto text-gray-200" />
            <p className="font-bold">Follow-up schedule is empty</p>
            <p className="text-xs max-w-xs mx-auto">Tasks will be auto-generated 5 days after a patient's booking is completed.</p>
          </div>
        ) : (
          <div className="divide-y divide-gray-100 text-xs">
            {tasks.map((task) => {
              const isCompleted = task.status === "Completed";
              const isPast = new Date(task.scheduledDate) < new Date() && !isCompleted;
              return (
                <div key={task._id} className="p-6 flex flex-col md:flex-row justify-between items-start md:items-center gap-4 hover:bg-gray-50/50 transition">
                  <div className="flex gap-4">
                    <div className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 ${
                      isCompleted 
                        ? "bg-green-100 text-green-700" 
                        : isPast 
                          ? "bg-red-100 text-red-700" 
                          : "bg-amber-100 text-amber-700"
                    }`}>
                      <Clock className="w-5 h-5" />
                    </div>
                    
                    <div className="space-y-1 max-w-md">
                      <div className="flex items-center gap-2 flex-wrap">
                        <span className="font-bold text-gray-900">{task.patientName}</span>
                        <span className="text-[10px] text-gray-400 font-bold bg-gray-100 px-2 py-0.5 rounded-full">{task.bookingId}</span>
                        <span className="text-[10px] text-gray-500">{task.phone}</span>
                      </div>

                      <div className="flex items-center gap-2 pt-0.5">
                        <span className="px-2 py-0.5 rounded-full text-[9px] font-black uppercase bg-primary-light text-primary border border-primary/20">
                          {task.type}
                        </span>
                        <span className={`text-[10px] font-bold ${isPast ? "text-red-600 font-black" : "text-gray-400"}`}>
                          Scheduled: {new Date(task.scheduledDate).toLocaleDateString()}
                        </span>
                      </div>

                      {/* Inline Remarks Input */}
                      <div className="pt-2">
                        <input
                          type="text"
                          placeholder="Click to add remarks..."
                          value={task.remarks || ""}
                          onChange={e => handleUpdateRemarks(task._id, e.target.value)}
                          className="w-full bg-transparent border-b border-transparent hover:border-gray-200 focus:border-primary py-0.5 outline-none text-[11px] text-gray-500 font-medium"
                        />
                      </div>

                    </div>
                  </div>

                  <div className="text-right shrink-0">
                    {isCompleted ? (
                      <span className="text-green-600 font-bold text-xs flex items-center gap-1 justify-end pr-2">
                        ✓ Contacted
                      </span>
                    ) : (
                      <button
                        onClick={() => handleTriggerTask(task._id, task.patientName)}
                        disabled={triggeringId === task._id}
                        className="px-4 py-2 bg-primary text-white font-bold rounded-xl hover:bg-primary-dark transition active:scale-95 flex items-center gap-1.5"
                      >
                        {triggeringId === task._id ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <Send className="w-3.5 h-3.5" />}
                        Trigger Action
                      </button>
                    )}
                  </div>

                </div>
              );
            })}
          </div>
        )}
      </div>

    </div>
  );
}
