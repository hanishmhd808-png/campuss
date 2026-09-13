"use client";

import Link from "next/link";
import { useAuth } from "@/context/AuthContext";
import { LogOut, GraduationCap, Calendar, Users } from "lucide-react";
import { motion } from "framer-motion";

export default function Navbar() {
  const { user, role, logout } = useAuth();

  return (
    <nav className="bg-white border-b border-slate-200 sticky top-0 z-50 shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16 items-center">
          <Link href="/" className="flex items-center gap-2">
            <motion.div
              whileHover={{ rotate: 10, scale: 1.1 }}
              transition={{ type: "spring", stiffness: 300 }}
            >
              <GraduationCap className="w-8 h-8 text-indigo-600" />
            </motion.div>
            <span className="font-bold text-xl text-slate-800 tracking-tight">CampusEvent</span>
          </Link>

          {user && (
            <div className="flex items-center gap-6">
              <div className="hidden md:flex gap-4">
                {role === "student" && (
                  <Link href="/dashboard" className="text-sm font-medium text-slate-600 hover:text-indigo-600 flex items-center gap-1 transition-colors">
                    <Calendar className="w-4 h-4" /> My Programs
                  </Link>
                )}
                {role === "teacher" && (
                  <Link href="/admin" className="text-sm font-medium text-slate-600 hover:text-indigo-600 flex items-center gap-1 transition-colors">
                    <Users className="w-4 h-4" /> Monitor
                  </Link>
                )}
              </div>
              <div className="flex items-center gap-4 border-l pl-4 border-slate-200">
                <div className="text-sm">
                  <p className="font-medium text-slate-900">{user.displayName || user.email}</p>
                  <p className="text-xs text-slate-500 capitalize">{role}</p>
                </div>
                <button
                  onClick={logout}
                  className="p-2 text-slate-400 hover:text-red-500 hover:bg-red-50 rounded-full transition-colors"
                  title="Logout"
                >
                  <LogOut className="w-5 h-5" />
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </nav>
  );
}
