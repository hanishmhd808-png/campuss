"use client";

import { motion, AnimatePresence } from "framer-motion";
import { X, Bell } from "lucide-react";
import { useState, useEffect } from "react";
import { ProgramEvent } from "@/types";

export default function NotificationPopup({ upcomingEvents }: { upcomingEvents: ProgramEvent[] }) {
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    if (upcomingEvents.length > 0) {
      // Small delay to make it pop up after page load
      const timer = setTimeout(() => setIsOpen(true), 1000);
      return () => clearTimeout(timer);
    }
  }, [upcomingEvents]);

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0, y: 50, scale: 0.9 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, scale: 0.9, y: 20 }}
          className="fixed bottom-6 right-6 bg-white p-6 rounded-2xl shadow-2xl border border-slate-100 z-50 max-w-sm"
        >
          <button 
            onClick={() => setIsOpen(false)}
            className="absolute top-4 right-4 text-slate-400 hover:text-slate-700"
          >
            <X className="w-5 h-5" />
          </button>
          
          <div className="flex items-center gap-3 mb-3 text-indigo-600">
            <Bell className="w-6 h-6 animate-pulse" />
            <h3 className="font-bold text-lg">Upcoming Events!</h3>
          </div>
          
          <p className="text-slate-600 text-sm mb-4">
            You have events coming up very soon. Get ready!
          </p>
          
          <ul className="space-y-2">
            {upcomingEvents.map(e => (
              <li key={e.id} className="text-sm font-medium bg-slate-50 p-2 rounded-lg border border-slate-100">
                {e.title} - {new Date(e.date).toLocaleDateString()}
              </li>
            ))}
          </ul>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
