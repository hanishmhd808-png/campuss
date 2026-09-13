"use client";

import { useAuth } from "@/context/AuthContext";
import { useToast } from "@/context/ToastContext";
import { motion, AnimatePresence } from "framer-motion";
import { UserCircle, ShieldCheck, Sparkles, Lock, Mail, Key } from "lucide-react";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

export default function Home() {
  const { user, role, loginAsMockStudent, loginAsMockTeacher, loginWithGoogle, loginWithEmail } = useAuth();
  const { showToast } = useToast();
  const router = useRouter();

  const [showTeacherLock, setShowTeacherLock] = useState(false);
  const [passcode, setPasscode] = useState("");

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  useEffect(() => {
    if (user && role === "student") router.push("/dashboard");
    if (user && role === "teacher") router.push("/admin");
  }, [user, role, router]);

  if (user) return <div className="min-h-[60vh] flex items-center justify-center">Redirecting...</div>;

  const handleGoogleLogin = async () => {
    await loginWithGoogle();
    showToast("Successfully logged in with Google", "success");
  };

  const handleEmailLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !password) {
      showToast("Please enter email and password", "error");
      return;
    }
    try {
      await loginWithEmail(email, password);
      showToast("Successfully logged in!", "success");
    } catch (err) {
      showToast("Login failed. Please check your credentials.", "error");
    }
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
        className="text-center max-w-4xl w-full px-4"
      >
        <div className="flex justify-center mb-6">
          <Sparkles className="w-16 h-16 text-indigo-500" />
        </div>
        <h1 className="text-5xl font-extrabold text-slate-900 mb-6 tracking-tight">
          Welcome to <span className="text-indigo-600">CampusEvent</span>
        </h1>
        <p className="text-xl text-slate-600 mb-12 max-w-2xl mx-auto">
          The all-in-one platform for monitoring and registering for Festivals, Arts, and Sports programs.
        </p>
        
        <div className="bg-white p-8 rounded-3xl shadow-sm border border-slate-200 max-w-md mx-auto mb-8">
          <h2 className="text-2xl font-bold mb-6 text-slate-800">Student Login</h2>
          
          <form onSubmit={handleEmailLogin} className="space-y-4 mb-6">
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Mail className="h-5 w-5 text-slate-400" />
              </div>
              <input
                type="email"
                required
                className="w-full pl-10 pr-4 py-3 border border-slate-200 rounded-xl focus:ring-2 focus:ring-indigo-500 outline-none"
                placeholder="Email Address"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Key className="h-5 w-5 text-slate-400" />
              </div>
              <input
                type="password"
                required
                className="w-full pl-10 pr-4 py-3 border border-slate-200 rounded-xl focus:ring-2 focus:ring-indigo-500 outline-none"
                placeholder="Password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
            </div>
            <button 
              type="submit"
              className="w-full bg-indigo-600 text-white font-bold py-3 rounded-xl hover:bg-indigo-700 transition-colors"
            >
              Sign In
            </button>
          </form>

          <div className="relative flex py-2 items-center mb-6">
            <div className="flex-grow border-t border-slate-200"></div>
            <span className="flex-shrink-0 mx-4 text-slate-400 text-sm">OR</span>
            <div className="flex-grow border-t border-slate-200"></div>
          </div>

          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={handleGoogleLogin}
            className="flex items-center justify-center gap-3 bg-white text-slate-700 border border-slate-200 px-8 py-3 w-full rounded-xl font-semibold shadow-sm hover:bg-slate-50 transition-all mb-4"
          >
            <svg className="w-5 h-5" viewBox="0 0 24 24">
              <path fill="currentColor" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
              <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
              <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" />
              <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" />
            </svg>
            Sign in with Google
          </motion.button>
        </div>

        <div className="flex justify-center gap-4">
          <button
            onClick={loginAsMockStudent}
            className="flex items-center gap-2 text-slate-500 hover:text-indigo-600 transition-colors font-medium text-sm"
          >
            <UserCircle className="w-4 h-4" /> Guest Student
          </button>
          
          <span className="text-slate-300">|</span>

          <button
            onClick={() => setShowTeacherLock(true)}
            className="flex items-center gap-2 text-slate-500 hover:text-indigo-600 transition-colors font-medium text-sm"
          >
            <ShieldCheck className="w-4 h-4" /> Teacher Access
          </button>
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
