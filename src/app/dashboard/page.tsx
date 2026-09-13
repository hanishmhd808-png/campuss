"use client";

import { useAuth } from "@/context/AuthContext";
import { useApp } from "@/context/AppContext";
import { useToast } from "@/context/ToastContext";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { ProgramEvent, Group } from "@/types";
import { motion, AnimatePresence } from "framer-motion";
import NotificationPopup from "@/components/NotificationPopup";
import ProfileSetupModal from "@/components/ProfileSetupModal";
import { Calendar, Trophy, Paintbrush, CheckCircle2, ArrowLeft } from "lucide-react";

export default function StudentDashboard() {
  const { user, role, loading, studentProfile, logout } = useAuth();
  const { events, myRegistrations, registerForEvent, groups } = useApp();
  const { showToast } = useToast();
  const router = useRouter();

  const [selectedEvent, setSelectedEvent] = useState<ProgramEvent | null>(null);
  const [groupName, setGroupName] = useState("");
  const [selectedGroupId, setSelectedGroupId] = useState("");

  useEffect(() => {
    if (!loading && (!user || role !== "student")) {
      router.push("/");
    }
  }, [user, role, loading, router]);

  if (loading || !user) return <div className="text-center mt-20">Loading...</div>;

  const getIcon = (category: string) => {
    switch (category) {
      case "Arts": return <Paintbrush className="w-5 h-5" />;
      case "Sports": return <Trophy className="w-5 h-5" />;
      default: return <Calendar className="w-5 h-5" />;
    }
  };

  const upcomingEvents = myRegistrations
    .map(r => events.find(e => e.id === r.eventId))
    .filter(e => {
      if (!e) return false;
      const daysUntil = (new Date(e.date).getTime() - new Date().getTime()) / (1000 * 3600 * 24);
      return daysUntil >= 0 && daysUntil <= 3;
    }) as ProgramEvent[];

  const handleRegister = (eventId: string, isGroup: boolean) => {
    if (isGroup && !groupName && !selectedGroupId) {
      showToast("Please provide a group name or select an existing group", "error");
      return;
    }
    
    const result = registerForEvent(eventId, selectedGroupId || undefined, groupName || undefined);
    showToast(result.message, result.success ? "success" : "error");
    if (result.success) {
      setSelectedEvent(null);
      setGroupName("");
      setSelectedGroupId("");
    }
  };

  const individualCount = myRegistrations.filter(r => {
    const ev = events.find(e => e.id === r.eventId);
    return ev?.type === "Individual";
  }).length;

  return (
    <div className="space-y-6 relative">
      <ProfileSetupModal />
      <NotificationPopup upcomingEvents={upcomingEvents} />

      <button 
        onClick={logout}
        className="flex items-center gap-2 text-slate-500 hover:text-slate-800 transition-colors font-medium w-fit"
      >
        <ArrowLeft className="w-4 h-4" /> Go Back
      </button>

      <header className="flex justify-between items-end border-b border-slate-200 pb-4">
        <div>
          <h1 className="text-3xl font-bold text-slate-900">Student Dashboard</h1>
          {studentProfile ? (
            <p className="text-slate-500 mt-1">
              Welcome, {studentProfile.name} • Reg: {studentProfile.registerNumber} • Class: {studentProfile.className}
            </p>
          ) : (
            <p className="text-slate-500 mt-1">Discover and register for campus events.</p>
          )}
        </div>
        <div className="text-right">
          <p className="text-sm text-slate-500">Individual Events limits</p>
          <div className="text-2xl font-bold text-indigo-600">
            {individualCount} <span className="text-slate-400 text-lg font-normal">/ 3</span>
          </div>
        </div>
      </header>

      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
        {events.map((event) => {
          const isRegistered = myRegistrations.some(r => r.eventId === event.id);
          
          return (
            <motion.div
              key={event.id}
              whileHover={{ y: -5 }}
              className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100 flex flex-col h-full"
            >
              <div className="flex justify-between items-start mb-4">
                <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-slate-100 text-xs font-semibold text-slate-600">
                  {getIcon(event.category)} {event.category}
                </span>
                <span className={`text-xs font-bold px-2 py-1 rounded ${event.type === "Group" ? "bg-purple-100 text-purple-700" : "bg-blue-100 text-blue-700"}`}>
                  {event.type}
                </span>
              </div>
              
              <h3 className="text-xl font-bold text-slate-900 mb-2">{event.title}</h3>
              <p className="text-sm text-slate-600 mb-4 flex-grow">{event.description}</p>
              
              <div className="mt-auto">
                <p className="text-sm font-medium text-slate-500 mb-4 flex items-center gap-2">
                  <Calendar className="w-4 h-4" /> {new Date(event.date).toLocaleDateString()}
                </p>
                
                {isRegistered ? (
                  <button disabled className="w-full py-2.5 bg-green-50 text-green-700 font-semibold rounded-xl flex items-center justify-center gap-2">
                    <CheckCircle2 className="w-5 h-5" /> Registered
                  </button>
                ) : (
                  <button 
                    onClick={() => {
                      if (!studentProfile) showToast("Please complete your profile first!", "error");
                      else setSelectedEvent(event);
                    }}
                    className="w-full py-2.5 bg-indigo-50 text-indigo-700 hover:bg-indigo-600 hover:text-white transition-colors font-semibold rounded-xl"
                  >
                    Register Now
                  </button>
                )}
              </div>
            </motion.div>
          );
        })}
      </div>

      <AnimatePresence>
        {selectedEvent && (
          <div className="fixed inset-0 bg-slate-900/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              className="bg-white rounded-3xl p-8 max-w-md w-full shadow-2xl"
            >
              <h3 className="text-2xl font-bold mb-2">Register for {selectedEvent.title}</h3>
              <p className="text-slate-600 mb-6">Confirm your participation below.</p>
              
              {selectedEvent.type === "Group" && (
                <div className="mb-6 space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-1">Create a new group</label>
                    <input 
                      type="text" 
                      placeholder="Enter group name" 
                      className="w-full border border-slate-200 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                      value={groupName}
                      onChange={(e) => { setGroupName(e.target.value); setSelectedGroupId(""); }}
                    />
                  </div>
                  <div className="text-center text-sm text-slate-400 font-medium">OR</div>
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-1">Join existing group</label>
                    <select
                      className="w-full border border-slate-200 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                      value={selectedGroupId}
                      onChange={(e) => { setSelectedGroupId(e.target.value); setGroupName(""); }}
                    >
                      <option value="">Select a group...</option>
                      {groups.filter(g => g.eventId === selectedEvent.id).map(g => (
                        <option key={g.id} value={g.id}>{g.name} ({g.members.length} members)</option>
                      ))}
                    </select>
                  </div>
                </div>
              )}

              <div className="flex gap-3 mt-8">
                <button 
                  onClick={() => { setSelectedEvent(null); setGroupName(""); setSelectedGroupId(""); }}
                  className="flex-1 py-3 bg-slate-100 text-slate-700 font-semibold rounded-xl hover:bg-slate-200"
                >
                  Cancel
                </button>
                <button 
                  onClick={() => handleRegister(selectedEvent.id, selectedEvent.type === "Group")}
                  className="flex-1 py-3 bg-indigo-600 text-white font-semibold rounded-xl hover:bg-indigo-700"
                >
                  Confirm
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
