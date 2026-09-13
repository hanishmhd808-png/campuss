"use client";

import { useAuth } from "@/context/AuthContext";
import { useApp } from "@/context/AppContext";
import { useToast } from "@/context/ToastContext";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { ProgramEvent, Category, EventType } from "@/types";
import { motion, AnimatePresence } from "framer-motion";
import { Plus, Users, LayoutList, UserCircle2, ArrowLeft, Edit2 } from "lucide-react";
import TeacherSetupModal from "@/components/TeacherSetupModal";

export default function AdminDashboard() {
  const { user, role, loading, teacherProfile, logout } = useAuth();
  const { events, addEvent, updateEvent, registrations, groups } = useApp();
  const { showToast } = useToast();
  const router = useRouter();

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingEventId, setEditingEventId] = useState<string | null>(null);
  const [formData, setFormData] = useState<Partial<ProgramEvent>>({
    category: "Arts",
    type: "Individual",
    date: new Date().toISOString().split("T")[0]
  });

  useEffect(() => {
    if (!loading && (!user || role !== "teacher")) {
      router.push("/");
    }
  }, [user, role, loading, router]);

  if (loading || !user) return <div className="text-center mt-20">Loading...</div>;

  const openCreateModal = () => {
    setEditingEventId(null);
    setFormData({
      category: "Arts",
      type: "Individual",
      date: new Date().toISOString().split("T")[0],
      title: "",
      description: ""
    });
    setIsModalOpen(true);
  };

  const openEditModal = (event: ProgramEvent) => {
    setEditingEventId(event.id);
    setFormData({ ...event });
    setIsModalOpen(true);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.title || !formData.description || !formData.date) return;
    
    if (editingEventId) {
      updateEvent(editingEventId, formData);
      showToast("Program updated successfully!", "success");
    } else {
      addEvent({
        id: `e${Date.now()}`,
        title: formData.title,
        category: formData.category as Category,
        type: formData.type as EventType,
        date: formData.date,
        description: formData.description
      });
      showToast("Program created successfully!", "success");
    }
    
    setIsModalOpen(false);
  };

  return (
    <div className="space-y-6 relative">
      <TeacherSetupModal />

      <button 
        onClick={logout}
        className="flex items-center gap-2 text-slate-500 hover:text-slate-800 transition-colors font-medium w-fit"
      >
        <ArrowLeft className="w-4 h-4" /> Go Back
      </button>

      <header className="flex justify-between items-end border-b border-slate-200 pb-4">
        <div>
          <h1 className="text-3xl font-bold text-slate-900">Teacher Dashboard</h1>
          {teacherProfile ? (
            <p className="text-slate-500 mt-1">Welcome, <span className="font-semibold text-slate-700">{teacherProfile.name}</span></p>
          ) : (
            <p className="text-slate-500 mt-1">Secure monitoring view for student participation.</p>
          )}
        </div>
        <button 
          onClick={() => {
            if (!teacherProfile) showToast("Please complete your profile first!", "error");
            else openCreateModal();
          }}
          className="flex items-center gap-2 bg-indigo-600 text-white px-5 py-2.5 rounded-xl font-semibold hover:bg-indigo-700 transition-colors"
        >
          <Plus className="w-5 h-5" /> Add Event
        </button>
      </header>

      {/* Events List */}
      <div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden">
        <div className="p-6 border-b border-slate-100 flex items-center gap-3">
          <LayoutList className="w-5 h-5 text-indigo-600" />
          <h2 className="text-lg font-bold">All Events & Registrations</h2>
        </div>
        <div className="divide-y divide-slate-100">
          {events.map((event) => {
            const eventRegs = registrations.filter(r => r.eventId === event.id);
            const eventGroups = groups.filter(g => g.eventId === event.id);
            
            return (
              <div key={event.id} className="p-6 hover:bg-slate-50 transition-colors">
                <div className="flex justify-between items-start mb-4">
                  <div>
                    <div className="flex items-center gap-3">
                      <h3 className="text-xl font-bold text-slate-900">{event.title}</h3>
                      <button 
                        onClick={() => {
                          if (!teacherProfile) showToast("Please complete your profile first!", "error");
                          else openEditModal(event);
                        }}
                        className="p-1.5 text-slate-400 hover:text-indigo-600 hover:bg-indigo-50 rounded-md transition-colors"
                        title="Edit Program"
                      >
                        <Edit2 className="w-4 h-4" />
                      </button>
                    </div>
                    <p className="text-sm text-slate-500 mt-1">{event.category} • {event.type} • {new Date(event.date).toLocaleDateString()}</p>
                    <p className="text-sm text-slate-600 mt-2">{event.description}</p>
                  </div>
                  <div className="bg-indigo-50 text-indigo-700 px-3 py-1 rounded-lg text-sm font-semibold flex items-center gap-2">
                    <Users className="w-4 h-4" /> 
                    {eventRegs.length} Total Students
                  </div>
                </div>
                
                {/* Display students directly */}
                {eventRegs.length > 0 && event.type === "Individual" && (
                  <div className="bg-slate-100/50 p-4 rounded-xl text-sm mt-4 border border-slate-100">
                    <span className="font-semibold text-slate-700 block mb-3">Registered Students:</span>
                    <ul className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
                      {eventRegs.map(r => (
                        <li key={r.id} className="bg-white p-3 rounded-lg border border-slate-200 shadow-sm flex items-center gap-3">
                          <UserCircle2 className="w-8 h-8 text-indigo-300" />
                          <div>
                            <span className="font-bold text-slate-800 block">{r.studentName || "Guest Student"}</span>
                            <span className="text-xs text-slate-500 block">Reg: <span className="font-medium text-slate-700">{r.registerNumber || 'N/A'}</span></span>
                            <span className="text-xs text-slate-500 block">Class: <span className="font-medium text-slate-700">{r.className || 'N/A'}</span></span>
                          </div>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}

                {/* Display groups and their members */}
                {eventGroups.length > 0 && event.type === "Group" && (
                  <div className="space-y-4 mt-5">
                    <span className="font-semibold text-slate-700 block">Registered Groups:</span>
                    {eventGroups.map(g => {
                        const groupRegs = eventRegs.filter(r => r.groupId === g.id);
                        return (
                          <div key={g.id} className="bg-slate-50 border border-slate-200 p-4 rounded-xl">
                            <div className="flex justify-between items-center mb-3">
                              <span className="font-bold text-slate-800 text-base">{g.name}</span>
                              <span className="bg-white px-3 py-1 rounded-full text-xs text-slate-600 font-bold border border-slate-200 shadow-sm">
                                {groupRegs.length} Members
                              </span>
                            </div>
                            <ul className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2">
                              {groupRegs.map(r => (
                                <li key={r.id} className="bg-white p-2 rounded-md border border-slate-100 flex items-center gap-2">
                                  <div className="w-6 h-6 rounded-full bg-indigo-100 flex items-center justify-center text-indigo-600 text-xs font-bold">
                                    {(r.studentName || "G")[0].toUpperCase()}
                                  </div>
                                  <div className="text-xs">
                                    <span className="font-bold block truncate max-w-[120px]">{r.studentName || "Guest Student"}</span>
                                    <span className="text-slate-500">{r.registerNumber || 'N/A'} • {r.className || 'N/A'}</span>
                                  </div>
                                </li>
                              ))}
                            </ul>
                          </div>
                        );
                    })}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>

      {/* Create / Edit Event Modal */}
      <AnimatePresence>
        {isModalOpen && (
          <div className="fixed inset-0 bg-slate-900/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              className="bg-white rounded-3xl p-8 max-w-lg w-full shadow-2xl max-h-[90vh] overflow-y-auto"
            >
              <h3 className="text-2xl font-bold mb-6">{editingEventId ? "Edit Program" : "Create New Program"}</h3>
              
              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">Title</label>
                  <input required type="text" className="w-full border border-slate-200 rounded-xl px-4 py-3 focus:ring-2 focus:ring-indigo-500 outline-none" value={formData.title || ""} onChange={e => setFormData({...formData, title: e.target.value})} />
                </div>
                
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-1">Category</label>
                    <select className="w-full border border-slate-200 rounded-xl px-4 py-3 focus:ring-2 focus:ring-indigo-500 outline-none" value={formData.category} onChange={e => setFormData({...formData, category: e.target.value as Category})}>
                      <option value="Arts">Arts</option>
                      <option value="Sports">Sports</option>
                      <option value="Festivals">Festivals</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-1">Type</label>
                    <select className="w-full border border-slate-200 rounded-xl px-4 py-3 focus:ring-2 focus:ring-indigo-500 outline-none" value={formData.type} onChange={e => setFormData({...formData, type: e.target.value as EventType})}>
                      <option value="Individual">Individual</option>
                      <option value="Group">Group</option>
                    </select>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">Date</label>
                  <input required type="date" className="w-full border border-slate-200 rounded-xl px-4 py-3 focus:ring-2 focus:ring-indigo-500 outline-none" value={formData.date} onChange={e => setFormData({...formData, date: e.target.value})} />
                </div>

                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">Description</label>
                  <textarea required className="w-full border border-slate-200 rounded-xl px-4 py-3 h-24 focus:ring-2 focus:ring-indigo-500 outline-none" value={formData.description || ""} onChange={e => setFormData({...formData, description: e.target.value})}></textarea>
                </div>

                <div className="flex gap-3 mt-8 pt-4">
                  <button type="button" onClick={() => setIsModalOpen(false)} className="flex-1 py-3 bg-slate-100 text-slate-700 font-semibold rounded-xl hover:bg-slate-200">Cancel</button>
                  <button type="submit" className="flex-1 py-3 bg-indigo-600 text-white font-semibold rounded-xl hover:bg-indigo-700">{editingEventId ? "Save Changes" : "Create Event"}</button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
