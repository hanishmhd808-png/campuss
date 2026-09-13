import { ProgramEvent, Registration, Group } from "@/types";

// Generate a date 2 days from now for the reminder notification demo
const dateInTwoDays = new Date();
dateInTwoDays.setDate(dateInTwoDays.getDate() + 2);

export const initialEvents: ProgramEvent[] = [
  {
    id: "e1",
    title: "100m Dash",
    category: "Sports",
    type: "Individual",
    date: dateInTwoDays.toISOString().split("T")[0],
    description: "The classic 100 meter sprint.",
  },
  {
    id: "e2",
    title: "Tug of War",
    category: "Onam",
    type: "Group",
    date: "2026-09-20",
    description: "Traditional Vadamvali contest.",
  },
  {
    id: "e3",
    title: "Classical Dance",
    category: "Arts",
    type: "Individual",
    date: "2026-10-05",
    description: "Bharatanatyam and Mohiniyattam.",
  },
  {
    id: "e4",
    title: "Painting",
    category: "Arts",
    type: "Individual",
    date: "2026-10-06",
    description: "Watercolor and oil painting competition.",
  },
  {
    id: "e5",
    title: "Football Tournament",
    category: "Sports",
    type: "Group",
    date: "2026-10-10",
    description: "7-a-side football matches.",
  }
];

export const initialRegistrations: Registration[] = [];
export const initialGroups: Group[] = [];
