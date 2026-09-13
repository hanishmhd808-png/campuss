"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useAuth } from "@/context/AuthContext";
import { useToast } from "@/context/ToastContext";

export default function ProfileSetupModal() {
  const { user, role, studentProfile, updateStudentProfile } = useAuth();
  const { showToast } = useToast();
  
  const [name, setName] = useState(user?.displayName || "");
  const [regNo, setRegNo] = useState("");
  const [className, setClassName] = useState("");

  if (role !== "student" || studentProfile) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !regNo || !className) {
      showToast("Please fill all fields", "error");
      return;
    }
    updateStudentProfile({ name, registerNumber: regNo, className });
    showToast("Profile completed successfully!", "success");
  };

  return (
    <AnimatePresence>
      <div className="fixed inset-0 bg-slate-900/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
        <motion.div
          initial={{ scale: 0.95, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          className="bg-white rounded-3xl p-8 max-w-md w-full shadow-2xl"
        >
          <h3 className="text-2xl font-bold mb-2">Complete Your Profile</h3>
          <p className="text-slate-600 mb-6">Please provide your details before registering for events.</p>
          
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Full Name</label>
              <input 
                required 
                type="text" 
                className="w-full border border-slate-200 rounded-xl px-4 py-3 focus:ring-2 focus:ring-indigo-500 outline-none" 
                value={name} 
                onChange={e => setName(e.target.value)} 
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Register Number</label>
              <input 
                required 
                type="text" 
                className="w-full border border-slate-200 rounded-xl px-4 py-3 focus:ring-2 focus:ring-indigo-500 outline-none" 
                value={regNo} 
                onChange={e => setRegNo(e.target.value)} 
                placeholder="e.g. S123456"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Class / Department Option</label>
              <input 
                required 
                type="text" 
                className="w-full border border-slate-200 rounded-xl px-4 py-3 focus:ring-2 focus:ring-indigo-500 outline-none" 
                value={className} 
                onChange={e => setClassName(e.target.value)} 
                placeholder="e.g. BSc Computer Science"
              />
            </div>
            <button 
              type="submit" 
              className="w-full mt-6 py-3 bg-indigo-600 text-white font-semibold rounded-xl hover:bg-indigo-700"
            >
              Save Profile
            </button>
          </form>
        </motion.div>
      </div>
    </AnimatePresence>
  );
}
