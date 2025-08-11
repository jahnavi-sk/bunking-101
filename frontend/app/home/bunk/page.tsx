"use client";
import React, { useState } from "react";
import { motion } from "framer-motion";
import { 
  IconCalendar, 
  IconClock,
  IconChevronLeft,
  IconChevronRight,
  IconAlertTriangle,
  IconCheck
} from "@tabler/icons-react";

interface SubjectAttendance {
  name: string;
  present: number;
  total: number;
  todayClasses: { time: string; room: string }[];
}

// Mock data - will be fetched from backend later
const mockSubjects: SubjectAttendance[] = [
  {
    name: "Data Structures",
    present: 40,
    total: 45,
    todayClasses: [
      { time: "9:00 AM", room: "Room 101" },
      { time: "2:00 PM", room: "Lab 201" }
    ]
  },
  {
    name: "Operating Systems",
    present: 38,
    total: 40,
    todayClasses: [
      { time: "10:00 AM", room: "Room 102" }
    ]
  },
  {
    name: "Computer Networks",
    present: 35,
    total: 38,
    todayClasses: [
      { time: "11:00 AM", room: "Lab 301" }
    ]
  },
  {
    name: "Database Management",
    present: 33,
    total: 35,
    todayClasses: [
      { time: "3:00 PM", room: "Room 103" }
    ]
  },
  {
    name: "Software Engineering",
    present: 40,
    total: 42,
    todayClasses: [
      { time: "4:00 PM", room: "Room 104" }
    ]
  }
];

const MIN_ATTENDANCE = 75; // Minimum required attendance percentage

export default function BunkPage() {
  const [desiredBunks, setDesiredBunks] = useState(1);
  const [suggestedDays, setSuggestedDays] = useState<number[]>([]);
  const [warning, setWarning] = useState("");

  // Simulate next 7 days (Mon-Sun)
  const next7Days = Array.from({ length: 7 }, (_, i) => {
    const date = new Date();
    date.setDate(date.getDate() + i);
    return date;
  });

  const calculateAttendancePercentage = (present: number, total: number) => {
    return ((present / total) * 100).toFixed(1);
  };

  const calculateProjectedAttendance = (present: number, total: number, missedClasses: number) => {
    return ((present / (total + missedClasses)) * 100).toFixed(1);
  };

  const getAttendanceColor = (percentage: number) => {
    if (percentage >= 80) return "text-green-400";
    if (percentage >= 75) return "text-yellow-400";
    return "text-red-400";
  };

  const getBunkRecommendation = (subject: SubjectAttendance) => {
    const currentPercentage = parseFloat(calculateAttendancePercentage(subject.present, subject.total));
    const afterBunkPercentage = parseFloat(calculateProjectedAttendance(subject.present, subject.total, 1));
    
    if (currentPercentage < MIN_ATTENDANCE) {
      return { safe: false, message: "Attendance already below minimum" };
    }
    
    if (afterBunkPercentage >= MIN_ATTENDANCE) {
      return { safe: true, message: "Safe to skip" };
    }
    
    return { safe: false, message: "Will go below minimum attendance" };
  };

  // Calculate which days are safe to miss
  const handleCalculate = () => {
    // For demo, assume each day has 1 class per subject
    let safeDays: number[] = [];
    for (let i = 0; i < 7; i++) {
      let allSafe = true;
      for (const subject of mockSubjects) {
        const projected = parseFloat(calculateProjectedAttendance(subject.present, subject.total, 1));
        if (projected < MIN_ATTENDANCE) {
          allSafe = false;
          break;
        }
      }
      if (allSafe) safeDays.push(i);
    }
    if (safeDays.length < desiredBunks) {
      setWarning("Not possible to safely miss that many days. Your attendance will fall below minimum threshold.");
      setSuggestedDays([]);
    } else {
      setWarning("");
      setSuggestedDays(safeDays.slice(0, desiredBunks));
    }
  };

  return (
    <div className="p-8 bg-black min-h-full">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="max-w-2xl mx-auto"
      >
        <h1 className="text-3xl font-bold text-white mb-8">Bunk Planner</h1>
        <div className="bg-gray-900 border border-white/20 rounded-lg p-6 mb-8">
          <label className="text-gray-400 text-sm block mb-2">
            How many days do you want to miss in the next 7 days?
          </label>
          <div className="flex items-end gap-4">
            <input
              type="number"
              min="1"
              max="7"
              value={desiredBunks}
              onChange={e => setDesiredBunks(Math.min(7, Math.max(1, parseInt(e.target.value) || 1)))}
              className="w-20 px-3 py-2 bg-gray-800 border border-gray-700 rounded-lg text-white"
            />
            <button
              onClick={handleCalculate}
              className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg"
            >
              Suggest Days
            </button>
          </div>
        </div>
        {warning && (
          <div className="bg-red-900 border border-red-400 rounded-lg p-4 text-red-200 mb-4">
            {warning}
          </div>
        )}
        {suggestedDays.length > 0 && (
          <div className="bg-black border border-white/20 rounded-lg p-6">
            <h2 className="text-xl font-semibold text-white mb-4">You can safely miss these days:</h2>
            <ul className="space-y-2">
              {suggestedDays.map(idx => (
                <li key={idx} className="text-white">
                  {next7Days[idx].toLocaleDateString('en-US', { weekday: 'long', month: 'short', day: 'numeric' })}
                </li>
              ))}
            </ul>
          </div>
        )}
      </motion.div>
    </div>
  );
}
