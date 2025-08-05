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
    present: 34,
    total: 45,
    todayClasses: [
      { time: "9:00 AM", room: "Room 101" },
      { time: "2:00 PM", room: "Lab 201" }
    ]
  },
  {
    name: "Operating Systems",
    present: 28,
    total: 40,
    todayClasses: [
      { time: "10:00 AM", room: "Room 102" }
    ]
  },
  {
    name: "Computer Networks",
    present: 30,
    total: 38,
    todayClasses: [
      { time: "11:00 AM", room: "Lab 301" }
    ]
  },
  {
    name: "Database Management",
    present: 25,
    total: 35,
    todayClasses: [
      { time: "3:00 PM", room: "Room 103" }
    ]
  },
  {
    name: "Software Engineering",
    present: 32,
    total: 42,
    todayClasses: [
      { time: "4:00 PM", room: "Room 104" }
    ]
  }
];

const MIN_ATTENDANCE = 75; // Minimum required attendance percentage

export default function BunkPage() {
  const [view, setView] = useState<"week" | "today">("week");
  const [selectedWeek, setSelectedWeek] = useState(0); // 0 = current week
  const [desiredBunks, setDesiredBunks] = useState(1);
  const [selectedClasses, setSelectedClasses] = useState<string[]>([]);

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

  const getWeekDates = (weekOffset: number) => {
    const today = new Date();
    const monday = new Date(today);
    monday.setDate(monday.getDate() - monday.getDay() + 1 + (weekOffset * 7));
    
    return Array.from({ length: 5 }, (_, i) => {
      const date = new Date(monday);
      date.setDate(monday.getDate() + i);
      return date;
    });
  };

  return (
    <div className="p-8 bg-black min-h-full">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="max-w-6xl mx-auto"
      >
        <div className="flex items-center justify-between mb-8">
          <h1 className="text-3xl font-bold text-white">Bunk Planner</h1>
          <div className="flex gap-4">
            <button
              onClick={() => setView("week")}
              className={`px-4 py-2 rounded-lg flex items-center gap-2 transition-colors ${
                view === "week" 
                  ? "bg-blue-600 text-white" 
                  : "bg-gray-800 text-gray-300 hover:bg-gray-700"
              }`}
            >
              <IconCalendar size={20} />
              Week View
            </button>
            <button
              onClick={() => setView("today")}
              className={`px-4 py-2 rounded-lg flex items-center gap-2 transition-colors ${
                view === "today" 
                  ? "bg-blue-600 text-white" 
                  : "bg-gray-800 text-gray-300 hover:bg-gray-700"
              }`}
            >
              <IconClock size={20} />
              Today View
            </button>
          </div>
        </div>

        {view === "week" ? (
          <div className="space-y-6">
            <div className="bg-gray-900 border border-white/20 rounded-lg p-6">
              <div className="flex items-center justify-between mb-6">
                <button
                  onClick={() => setSelectedWeek(prev => prev - 1)}
                  className="p-2 text-white hover:bg-gray-800 rounded-lg transition-colors"
                  disabled={selectedWeek === 0}
                >
                  <IconChevronLeft size={20} />
                </button>
                
                <h2 className="text-xl font-bold text-white">
                  {selectedWeek === 0 ? "This Week" : 
                   selectedWeek === 1 ? "Next Week" :
                   `Week of ${getWeekDates(selectedWeek)[0].toLocaleDateString()}`}
                </h2>
                
                <button
                  onClick={() => setSelectedWeek(prev => prev + 1)}
                  className="p-2 text-white hover:bg-gray-800 rounded-lg transition-colors"
                >
                  <IconChevronRight size={20} />
                </button>
              </div>

              <div className="mb-6">
                <label className="text-gray-400 text-sm block mb-2">
                  How many days do you want to skip this week?
                </label>
                <input
                  type="number"
                  min="1"
                  max="5"
                  value={desiredBunks}
                  onChange={(e) => setDesiredBunks(Math.min(5, Math.max(1, parseInt(e.target.value) || 1)))}
                  className="w-20 px-3 py-2 bg-gray-800 border border-gray-700 rounded-lg text-white"
                />
              </div>

              <div className="grid grid-cols-5 gap-4">
                {getWeekDates(selectedWeek).map((date, index) => {
                  const isToday = date.toDateString() === new Date().toDateString();
                  const isPast = date < new Date();

                  return (
                    <div 
                      key={index}
                      className={`
                        p-4 rounded-lg border
                        ${isPast ? 'bg-gray-800 border-gray-700 opacity-50' : 'bg-gray-800 border-gray-700'}
                        ${isToday ? 'border-blue-500' : ''}
                      `}
                    >
                      <div className="text-sm text-gray-400 mb-1">
                        {date.toLocaleDateString('en-US', { weekday: 'short' })}
                      </div>
                      <div className="text-lg text-white mb-2">
                        {date.getDate()}
                      </div>
                      {!isPast && (
                        <div className="text-sm">
                          {index % 2 === 0 ? (
                            <span className="text-green-400">Good day to skip</span>
                          ) : (
                            <span className="text-red-400">Important classes</span>
                          )}
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>

            <div className="bg-gray-900 border border-white/20 rounded-lg p-6">
              <h3 className="text-xl font-bold text-white mb-4">Attendance Impact Analysis</h3>
              <div className="space-y-4">
                {mockSubjects.map((subject, index) => {
                  const currentPercentage = parseFloat(calculateAttendancePercentage(subject.present, subject.total));
                  const projectedPercentage = parseFloat(calculateProjectedAttendance(subject.present, subject.total, 2));
                  const colorClass = getAttendanceColor(currentPercentage);
                  const projectedColorClass = getAttendanceColor(projectedPercentage);

                  return (
                    <div key={index} className="bg-gray-800 p-4 rounded-lg">
                      <div className="flex justify-between items-start mb-2">
                        <div>
                          <h4 className="text-white font-medium">{subject.name}</h4>
                          <p className="text-sm text-gray-400">
                            Current: {subject.present}/{subject.total} classes
                          </p>
                        </div>
                        <div className="text-right">
                          <div className={`text-lg font-semibold ${colorClass}`}>
                            {currentPercentage}%
                          </div>
                          <div className={`text-sm ${projectedColorClass}`}>
                            After bunks: {projectedPercentage}%
                          </div>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        ) : (
          <div className="space-y-6">
            <div className="bg-gray-900 border border-white/20 rounded-lg p-6">
              <h3 className="text-xl font-bold text-white mb-4">Today's Classes</h3>
              <div className="space-y-4">
                {mockSubjects.map((subject, index) => {
                  const recommendation = getBunkRecommendation(subject);
                  
                  return subject.todayClasses.map((cls, classIndex) => {
                    const isSelected = selectedClasses.includes(`${index}-${classIndex}`);
                    
                    return (
                      <div 
                        key={`${index}-${classIndex}`}
                        className={`
                          bg-gray-800 p-4 rounded-lg border-2 transition-colors cursor-pointer
                          ${isSelected ? 'border-blue-500' : 'border-transparent'}
                          hover:border-blue-500/50
                        `}
                        onClick={() => {
                          const key = `${index}-${classIndex}`;
                          setSelectedClasses(prev => 
                            prev.includes(key) 
                              ? prev.filter(k => k !== key)
                              : [...prev, key]
                          );
                        }}
                      >
                        <div className="flex justify-between items-start">
                          <div>
                            <div className="flex items-center gap-2">
                              <h4 className="text-white font-medium">{subject.name}</h4>
                              {recommendation.safe ? (
                                <IconCheck size={16} className="text-green-400" />
                              ) : (
                                <IconAlertTriangle size={16} className="text-red-400" />
                              )}
                            </div>
                            <p className="text-sm text-gray-400">
                              {cls.time} • {cls.room}
                            </p>
                            <p className="text-sm text-gray-400">
                              Current attendance: {calculateAttendancePercentage(subject.present, subject.total)}%
                            </p>
                          </div>
                          <div className="text-sm">
                            <span className={recommendation.safe ? "text-green-400" : "text-red-400"}>
                              {recommendation.message}
                            </span>
                          </div>
                        </div>
                      </div>
                    );
                  });
                })}
              </div>
            </div>

            {selectedClasses.length > 0 && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="bg-gray-900 border border-white/20 rounded-lg p-6"
              >
                <h3 className="text-xl font-bold text-white mb-4">Selected Classes to Skip</h3>
                <div className="space-y-2">
                  {selectedClasses.map(key => {
                    const [subjectIndex, classIndex] = key.split('-').map(Number);
                    const subject = mockSubjects[subjectIndex];
                    const cls = subject.todayClasses[classIndex];

                    return (
                      <div key={key} className="flex justify-between items-center bg-gray-800 p-3 rounded-lg">
                        <div>
                          <div className="text-white">{subject.name}</div>
                          <div className="text-sm text-gray-400">{cls.time} • {cls.room}</div>
                        </div>
                        <button
                          onClick={() => setSelectedClasses(prev => prev.filter(k => k !== key))}
                          className="text-red-400 hover:text-red-300"
                        >
                          Remove
                        </button>
                      </div>
                    );
                  })}
                </div>
                <div className="mt-4 pt-4 border-t border-gray-700">
                  <div className="text-gray-400">
                    Impact on attendance if you skip these classes:
                  </div>
                  {Array.from(new Set(selectedClasses.map(key => key.split('-')[0]))).map(subjectIndex => {
                    const subject = mockSubjects[Number(subjectIndex)];
                    const skippedClasses = selectedClasses.filter(key => key.startsWith(subjectIndex)).length;
                    const currentPercentage = parseFloat(calculateAttendancePercentage(subject.present, subject.total));
                    const projectedPercentage = parseFloat(calculateProjectedAttendance(subject.present, subject.total, skippedClasses));
                    
                    return (
                      <div key={subjectIndex} className="flex justify-between items-center mt-2">
                        <span className="text-white">{subject.name}</span>
                        <div className="flex items-center gap-2">
                          <span className={getAttendanceColor(currentPercentage)}>
                            {currentPercentage}%
                          </span>
                          <span className="text-gray-400">→</span>
                          <span className={getAttendanceColor(projectedPercentage)}>
                            {projectedPercentage}%
                          </span>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </motion.div>
            )}
          </div>
        )}
      </motion.div>
    </div>
  );
}
