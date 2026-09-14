"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useAuth } from "@/context/AuthContext";
import { useToast } from "@/context/ToastContext";
import { ArrowLeft } from "lucide-react";

export default function TeacherSetupModal() {
  const { user, role, teacherProfile, updateTeacherProfile, logout } = useAuth();
  const { showToast } = useToast();
  
  const [name, setName] = useState(user?.displayName || "");

  if (role !== "teacher" || teacherProfile) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name) {
      showToast("Please enter your name", "error");
      return;
    }
    updateTeacherProfile(name);
    showToast("Profile saved successfully!", "success");
  };

  return (
    <AnimatePresence>
      <div className="fixed inset-0 bg-slate-900/50 dark:bg-slate-950/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
        <motion.div
          initial={{ scale: 0.95, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          className="bg-white dark:bg-slate-900 rounded-3xl p-8 max-w-md w-full shadow-2xl relative"
        >
          <button 
            onClick={logout}
            className="absolute top-6 right-6 text-slate-400 dark:text-slate-500 hover:text-slate-700 dark:text-slate-200 flex items-center gap-1 text-sm font-medium"
          >
            <ArrowLeft className="w-4 h-4" /> Back
          </button>

          <h3 className="text-2xl font-bold mb-2 pr-12">Teacher Profile</h3>
          <p className="text-slate-600 dark:text-slate-300 mb-6">Please enter your name to access the dashboard.</p>
          
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-slate-700 dark:text-slate-200 mb-1">Full Name</label>
              <input 
                required 
                type="text" 
                className="w-full border border-slate-200 dark:border-slate-800 rounded-xl px-4 py-3 bg-white dark:bg-slate-800 dark:text-white focus:ring-2 focus:ring-indigo-500 outline-none" 
                value={name} 
                onChange={e => setName(e.target.value)} 
                placeholder="e.g. Prof. John Doe"
              />
            </div>
            
            <button 
              type="submit" 
              className="w-full mt-6 py-3 bg-indigo-600 text-white font-semibold rounded-xl hover:bg-indigo-700"
            >
              Continue to Dashboard
            </button>
          </form>
        </motion.div>
      </div>
    </AnimatePresence>
  );
}
