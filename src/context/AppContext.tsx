"use client";

import React, { createContext, useContext, useState } from "react";
import { ProgramEvent, Registration, Group } from "@/types";
import { initialEvents, initialRegistrations, initialGroups } from "@/lib/mockData";
import { useAuth } from "./AuthContext";

interface AppContextType {
  events: ProgramEvent[];
  registrations: Registration[];
  groups: Group[];
  addEvent: (e: ProgramEvent) => void;
  updateEvent: (id: string, updatedEvent: Partial<ProgramEvent>) => void;
  registerForEvent: (eventId: string, groupId?: string, groupName?: string) => { success: boolean; message: string };
  myRegistrations: Registration[];
}

const AppContext = createContext<AppContextType | null>(null);

export const AppProvider = ({ children }: { children: React.ReactNode }) => {
  const { user, studentProfile } = useAuth();
  const [events, setEvents] = useState<ProgramEvent[]>(initialEvents);
  const [registrations, setRegistrations] = useState<Registration[]>(initialRegistrations);
  const [groups, setGroups] = useState<Group[]>(initialGroups);

  const addEvent = (e: ProgramEvent) => setEvents([...events, e]);

  const updateEvent = (id: string, updatedEvent: Partial<ProgramEvent>) => {
    setEvents(events.map(event => event.id === id ? { ...event, ...updatedEvent } : event));
  };

  const myRegistrations = registrations.filter(r => r.studentId === user?.uid);

  const registerForEvent = (eventId: string, groupId?: string, groupName?: string) => {
    if (!user) return { success: false, message: "Not logged in" };
    if (!studentProfile) return { success: false, message: "Please complete your profile first." };
    
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
    if (event.type === "Group" && !groupId && groupName) {
      const newGroup: Group = {
        id: `g${Date.now()}`,
        eventId,
        name: groupName,
        members: [user.uid]
      };
      setGroups([...groups, newGroup]);
      finalGroupId = newGroup.id;
    } else if (event.type === "Group" && groupId) {
      setGroups(groups.map(g => g.id === groupId ? { ...g, members: [...g.members, user.uid] } : g));
    }

    const newReg: Registration = {
      id: `r${Date.now()}`,
      eventId,
      studentId: user.uid,
      studentName: studentProfile.name,
      registerNumber: studentProfile.registerNumber,
      className: studentProfile.className,
      groupId: finalGroupId
    };

    setRegistrations([...registrations, newReg]);
    return { success: true, message: "Successfully registered!" };
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
