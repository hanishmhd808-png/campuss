"use client";

import React, { createContext, useContext, useState, useEffect } from "react";
import { ProgramEvent, Registration, Group } from "@/types";
import { useAuth } from "./AuthContext";
import { db } from "../lib/firebase";
import { collection, doc, setDoc, updateDoc, onSnapshot, query } from "firebase/firestore";

interface AppContextType {
  events: ProgramEvent[];
  registrations: Registration[];
  groups: Group[];
  addEvent: (e: ProgramEvent) => Promise<void>;
  updateEvent: (id: string, updatedEvent: Partial<ProgramEvent>) => Promise<void>;
  registerForEvent: (eventId: string, groupId?: string, groupName?: string) => Promise<{ success: boolean; message: string }>;
  myRegistrations: Registration[];
}

const AppContext = createContext<AppContextType | null>(null);

export const AppProvider = ({ children }: { children: React.ReactNode }) => {
  const { user, studentProfile } = useAuth();
  const [events, setEvents] = useState<ProgramEvent[]>([]);
  const [registrations, setRegistrations] = useState<Registration[]>([]);
  const [groups, setGroups] = useState<Group[]>([]);

  useEffect(() => {
    if (!db) return;
    
    // Listen to Events
    const unsubEvents = onSnapshot(collection(db, "events"), (snapshot) => {
      setEvents(snapshot.docs.map(doc => ({ ...doc.data(), id: doc.id } as ProgramEvent)));
    });

    // Listen to Registrations
    const unsubRegs = onSnapshot(collection(db, "registrations"), (snapshot) => {
      setRegistrations(snapshot.docs.map(doc => ({ ...doc.data(), id: doc.id } as Registration)));
    });

    // Listen to Groups
    const unsubGroups = onSnapshot(collection(db, "groups"), (snapshot) => {
      setGroups(snapshot.docs.map(doc => ({ ...doc.data(), id: doc.id } as Group)));
    });

    return () => {
      unsubEvents();
      unsubRegs();
      unsubGroups();
    };
  }, []);

  const addEvent = async (e: ProgramEvent) => {
    if (!db) return;
    try {
      await setDoc(doc(db, "events", e.id), e);
    } catch (error) {
      console.error("Error adding event:", error);
    }
  };

  const updateEvent = async (id: string, updatedEvent: Partial<ProgramEvent>) => {
    if (!db) return;
    try {
      await updateDoc(doc(db, "events", id), updatedEvent);
    } catch (error) {
      console.error("Error updating event:", error);
    }
  };

  const myRegistrations = registrations.filter(r => r.studentId === user?.uid);

  const registerForEvent = async (eventId: string, groupId?: string, groupName?: string) => {
    if (!user) return { success: false, message: "Not logged in" };
    if (!studentProfile) return { success: false, message: "Please complete your profile first." };
    if (!db) return { success: false, message: "Database not connected" };
    
    const event = events.find(e => e.id === eventId);
    if (!event) return { success: false, message: "Event not found" };

    if (myRegistrations.some(r => r.eventId === eventId)) {
      return { success: false, message: "You are already registered for this event." };
    }

    if (event.type === "Individual") {
      const individualCount = myRegistrations.filter(r => {
        const ev = events.find(e => e.id === r.eventId);
        return ev?.type === "Individual";
      }).length;

      if (individualCount >= 3) {
        return { success: false, message: "You can only participate in up to 3 individual events." };
      }
    }

    let finalGroupId = groupId;
    try {
      if (event.type === "Group" && !groupId && groupName) {
        const newGroupId = `g${Date.now()}`;
        const newGroup: Group = {
          id: newGroupId,
          eventId,
          name: groupName,
          members: [user.uid]
        };
        await setDoc(doc(db, "groups", newGroupId), newGroup);
        finalGroupId = newGroupId;
      } else if (event.type === "Group" && groupId) {
        const targetGroup = groups.find(g => g.id === groupId);
        if (targetGroup) {
          await updateDoc(doc(db, "groups", groupId), {
            members: [...targetGroup.members, user.uid]
          });
        }
      }

      const newRegId = `r${Date.now()}`;
      const newReg: Registration = {
        id: newRegId,
        eventId,
        studentId: user.uid,
        studentName: studentProfile.name,
        registerNumber: studentProfile.registerNumber,
        className: studentProfile.className,
        groupId: finalGroupId
      };

      await setDoc(doc(db, "registrations", newRegId), newReg);
      return { success: true, message: "Successfully registered!" };
    } catch (error) {
      console.error("Registration error:", error);
      return { success: false, message: "Registration failed due to a database error." };
    }
  };

  return (
    <AppContext.Provider value={{ events, registrations, groups, addEvent, updateEvent, registerForEvent, myRegistrations }}>
      {children}
    </AppContext.Provider>
  );
};

export const useApp = () => {
  const ctx = useContext(AppContext);
  if (!ctx) throw new Error("useApp must be used within AppProvider");
  return ctx;
};
