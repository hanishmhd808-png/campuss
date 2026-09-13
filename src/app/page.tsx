"use client";

import { useAuth } from "@/context/AuthContext";
import { useToast } from "@/context/ToastContext";
import { motion, AnimatePresence } from "framer-motion";
import { UserCircle, ShieldCheck, Sparkles, Lock } from "lucide-react";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

export default function Home() {
  const { user, role, loginAsMockStudent, loginAsMockTeacher, loginWithGoogle } = useAuth();
  const { showToast } = useToast();
  const router = useRouter();

  const [showTeacherLock, setShowTeacherLock] = useState(false);
  const [passcode, setPasscode] = useState("");

  useEffect(() => {
    if (user && role === "student") router.push("/dashboard");
    if (user && role === "teacher") router.push("/admin");
  }, [user, role, router]);

  if (user) return <div className="min-h-[60vh] flex items-center justify-center">Redirecting...</div>;

  const handleGoogleLogin = async () => {
    await loginWithGoogle();
    showToast("Successfully logged in with Google", "success");
  };

  const handleTeacherLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (passcode === "1234") {
      loginAsMockTeacher();
      showToast("Teacher access granted", "success");
    } else {
      showToast("Invalid passcode. Access denied.", "error");
      setPasscode("");
    }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-[80vh] relative">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="text-center max-w-3xl"
      >
        <div className="flex justify-center mb-6">
          <Sparkles className="w-16 h-16 text-indigo-500" />
        </div>
        <h1 className="text-5xl font-extrabold text-slate-900 mb-6 tracking-tight">
          Welcome to <span className="text-indigo-600">CampusEvent</span>
        </h1>
        <p className="text-xl text-slate-600 mb-12 max-w-2xl mx-auto">
          The all-in-one platform for monitoring and registering for Onam, Arts, and Sports programs.
        </p>
        
        <div className="flex flex-col sm:flex-row gap-4 justify-center items-center flex-wrap">
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={handleGoogleLogin}
            className="flex items-center justify-center gap-3 bg-white text-slate-700 border border-slate-200 px-8 py-4 rounded-2xl font-semibold shadow-sm hover:bg-slate-50 transition-all w-full sm:w-auto"
          >
            <svg className="w-6 h-6" viewBox="0 0 24 24">
              <path fill="currentColor" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
              <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
              <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" />
              <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" />
            </svg>
            Sign in with Google
          </motion.button>

          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={loginAsMockStudent}
            className="flex items-center justify-center gap-3 bg-indigo-600 text-white px-8 py-4 rounded-2xl font-semibold shadow-lg hover:bg-indigo-700 hover:shadow-indigo-500/25 transition-all w-full sm:w-auto"
          >
            <UserCircle className="w-6 h-6" />
            Guest Student
          </motion.button>
          
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => setShowTeacherLock(true)}
            className="flex items-center justify-center gap-3 bg-slate-900 text-white px-8 py-4 rounded-2xl font-semibold shadow-sm hover:bg-slate-800 transition-all w-full sm:w-auto"
          >
            <ShieldCheck className="w-6 h-6" />
            Teacher Access
          </motion.button>
        </div>
      </motion.div>

      {/* Teacher Lock Modal */}
      <AnimatePresence>
        {showTeacherLock && (
          <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-md z-50 flex items-center justify-center p-4">
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="bg-white rounded-3xl p-8 max-w-md w-full shadow-2xl"
            >
              <div className="flex justify-center mb-4">
                <div className="bg-indigo-100 p-4 rounded-full">
                  <Lock className="w-8 h-8 text-indigo-600" />
                </div>
              </div>
              <h3 className="text-2xl font-bold text-center mb-2">Teacher Login</h3>
              <p className="text-slate-500 text-center mb-6">Enter the administrative passcode to access the monitoring dashboard.</p>
              
              <form onSubmit={handleTeacherLogin} className="space-y-4">
                <div>
                  <input 
                    type="password" 
                    placeholder="Enter passcode" 
                    className="w-full border-2 border-slate-200 rounded-xl px-4 py-3 text-center text-lg tracking-widest focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200 outline-none transition-all" 
                    value={passcode} 
                    onChange={e => setPasscode(e.target.value)}
                    autoFocus
                  />
                </div>
                
                <div className="flex gap-3 mt-6">
                  <button 
                    type="button" 
                    onClick={() => { setShowTeacherLock(false); setPasscode(""); }}
                    className="flex-1 py-3 bg-slate-100 text-slate-700 font-semibold rounded-xl hover:bg-slate-200 transition-colors"
                  >
                    Cancel
                  </button>
                  <button 
                    type="submit" 
                    className="flex-1 py-3 bg-indigo-600 text-white font-semibold rounded-xl hover:bg-indigo-700 transition-colors flex justify-center items-center gap-2"
                  >
                    Unlock <Lock className="w-4 h-4" />
                  </button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
