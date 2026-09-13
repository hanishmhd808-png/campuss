"use client";

import React, { createContext, useContext, useState, useEffect } from "react";
import type { User } from "firebase/auth";
import { GoogleAuthProvider, signInWithPopup } from "firebase/auth";
import { auth } from "../lib/firebase"; // this is our mock/real firebase auth
import { StudentProfile } from "@/types";

export type Role = "student" | "teacher" | null;

interface AuthContextType {
  user: User | null;
  role: Role;
  studentProfile: StudentProfile | null;
  loading: boolean;
  loginAsMockStudent: () => void;
  loginAsMockTeacher: () => void;
  loginWithGoogle: () => Promise<void>;
  updateStudentProfile: (profile: Omit<StudentProfile, "uid" | "role">) => void;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType>({
  user: null,
  role: null,
  studentProfile: null,
  loading: true,
  loginAsMockStudent: () => {},
  loginAsMockTeacher: () => {},
  loginWithGoogle: async () => {},
  updateStudentProfile: () => {},
  logout: () => {},
});

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [role, setRole] = useState<Role>(null);
  const [studentProfile, setStudentProfile] = useState<StudentProfile | null>(null);
  const [loading, setLoading] = useState(false);

  const loginAsMockStudent = () => {
    setUser({ uid: "mock-student-123", email: "student@college.edu", displayName: "Mock Student" } as User);
    setRole("student");
    // Purposely leaving studentProfile null so they are forced to fill it out
  };

  const loginAsMockTeacher = () => {
    setUser({ uid: "mock-teacher-456", email: "teacher@college.edu", displayName: "Mock Teacher" } as User);
    setRole("teacher");
  };

  const loginWithGoogle = async () => {
    if (auth && process.env.NEXT_PUBLIC_FIREBASE_API_KEY) {
      const provider = new GoogleAuthProvider();
      try {
        const result = await signInWithPopup(auth, provider);
        setUser(result.user);
        setRole("student"); // Defaulting new Google logins to student for this demo
      } catch (error) {
        console.error("Google Sign-in Error:", error);
        alert("Google Sign-in failed. Please check console.");
      }
    } else {
      // Mock Google Login
      setUser({ uid: "google-mock-" + Date.now(), email: "student@gmail.com", displayName: "Google Student" } as User);
      setRole("student");
    }
  };

  const updateStudentProfile = (data: Omit<StudentProfile, "uid" | "role">) => {
    if (user) {
      setStudentProfile({
        ...data,
        uid: user.uid,
        role: "student"
      });
    }
  };

  const logout = () => {
    setUser(null);
    setRole(null);
    setStudentProfile(null);
    if (auth && process.env.NEXT_PUBLIC_FIREBASE_API_KEY) {
      auth.signOut();
    }
  };

  return (
    <AuthContext.Provider value={{ user, role, studentProfile, loading, loginAsMockStudent, loginAsMockTeacher, loginWithGoogle, updateStudentProfile, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
