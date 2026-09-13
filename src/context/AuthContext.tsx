"use client";

import React, { createContext, useContext, useState, useEffect } from "react";
import type { User } from "firebase/auth";
import { GoogleAuthProvider, signInWithPopup, signInWithEmailAndPassword, createUserWithEmailAndPassword } from "firebase/auth";
import { auth } from "../lib/firebase"; 
import { StudentProfile, TeacherProfile } from "@/types";

export type Role = "student" | "teacher" | null;

interface AuthContextType {
  user: User | null;
  role: Role;
  studentProfile: StudentProfile | null;
  teacherProfile: TeacherProfile | null;
  loading: boolean;
  loginAsMockStudent: () => void;
  loginAsMockTeacher: () => void;
  loginWithGoogle: () => Promise<void>;
  loginWithEmail: (email: string, pass: string) => Promise<void>;
  updateStudentProfile: (profile: Omit<StudentProfile, "uid" | "role">) => void;
  updateTeacherProfile: (name: string) => void;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType>({
  user: null,
  role: null,
  studentProfile: null,
  teacherProfile: null,
  loading: true,
  loginAsMockStudent: () => {},
  loginAsMockTeacher: () => {},
  loginWithGoogle: async () => {},
  loginWithEmail: async () => {},
  updateStudentProfile: () => {},
  updateTeacherProfile: () => {},
  logout: () => {},
});

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [role, setRole] = useState<Role>(null);
  const [studentProfile, setStudentProfile] = useState<StudentProfile | null>(null);
  const [teacherProfile, setTeacherProfile] = useState<TeacherProfile | null>(null);
  const [loading, setLoading] = useState(false);

  const loginAsMockStudent = () => {
    setUser({ uid: "mock-student-123", email: "student@college.edu", displayName: "" } as User);
    setRole("student");
  };

  const loginAsMockTeacher = () => {
    setUser({ uid: "mock-teacher-456", email: "teacher@college.edu", displayName: "" } as User);
    setRole("teacher");
  };

  const loginWithGoogle = async () => {
    if (auth && process.env.NEXT_PUBLIC_FIREBASE_API_KEY) {
      const provider = new GoogleAuthProvider();
      try {
        const result = await signInWithPopup(auth, provider);
        setUser(result.user);
        setRole("student"); 
      } catch (error) {
        console.error("Google Sign-in Error:", error);
        alert("Google Sign-in failed. Please check your Firebase configuration.");
      }
    } else {
      // Mock Google Login
      setUser({ uid: "google-mock-" + Date.now(), email: "student@gmail.com", displayName: "" } as User);
      setRole("student");
    }
  };

  const loginWithEmail = async (email: string, pass: string) => {
    if (auth && process.env.NEXT_PUBLIC_FIREBASE_API_KEY) {
      try {
        const result = await signInWithEmailAndPassword(auth, email, pass);
        setUser(result.user);
        setRole("student");
      } catch (error: any) {
        if (error.code === 'auth/user-not-found' || error.code === 'auth/invalid-credential') {
            try {
                const newRes = await createUserWithEmailAndPassword(auth, email, pass);
                setUser(newRes.user);
                setRole("student");
            } catch (createErr) {
                console.error("Email auth error:", createErr);
                throw createErr;
            }
        } else {
            console.error("Email auth error:", error);
            throw error;
        }
      }
    } else {
      setUser({ uid: "email-mock-" + Date.now(), email, displayName: "" } as User);
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

  const updateTeacherProfile = (name: string) => {
    if (user) {
      setTeacherProfile({
        uid: user.uid,
        name,
        role: "teacher"
      });
    }
  };

  const logout = () => {
    setUser(null);
    setRole(null);
    setStudentProfile(null);
    setTeacherProfile(null);
    if (auth && process.env.NEXT_PUBLIC_FIREBASE_API_KEY) {
      auth.signOut();
    }
  };

  return (
    <AuthContext.Provider value={{ user, role, studentProfile, teacherProfile, loading, loginAsMockStudent, loginAsMockTeacher, loginWithGoogle, loginWithEmail, updateStudentProfile, updateTeacherProfile, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
