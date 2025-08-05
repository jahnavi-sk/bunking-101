"use client";
import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { 
  IconChevronLeft, 
  IconChevronRight, 
  IconX,
  IconMaximize
} from "@tabler/icons-react";

interface AttendanceStatus {
  [key: string]: "present" | "absent" | "holiday" | null;
}

interface TimetableEntry {
  time: string;
  subject: string;
  teacher: string;
  room: string;
}

// Mock timetable data - this will be fetched from backend later
const mockTimetable: { [key: string]: TimetableEntry[] } = {
  Monday: [
    { time: "9:00 AM", subject: "Mathematics", teacher: "Dr. Smith", room: "Room 101" },
    { time: "10:30 AM", subject: "Physics", teacher: "Prof. Johnson", room: "Lab 201" },
    { time: "2:00 PM", subject: "Chemistry", teacher: "Dr. Brown", room: "Lab 301" }
  ],
  Tuesday: [
    { time: "9:00 AM", subject: "English", teacher: "Ms. Davis", room: "Room 102" },
    { time: "11:00 AM", subject: "History", teacher: "Mr. Wilson", room: "Room 103" }
  ],
  Wednesday: [
    { time: "10:00 AM", subject: "Computer Science", teacher: "Dr. Taylor", room: "Lab 401" },
    { time: "2:30 PM", subject: "Biology", teacher: "Prof. Anderson", room: "Lab 501" }
  ],
  Thursday: [
    { time: "9:30 AM", subject: "Mathematics", teacher: "Dr. Smith", room: "Room 101" },
    { time: "1:00 PM", subject: "Physics", teacher: "Prof. Johnson", room: "Lab 201" }
  ],
  Friday: [
    { time: "10:00 AM", subject: "Chemistry", teacher: "Dr. Brown", room: "Lab 301" },
    { time: "2:00 PM", subject: "English", teacher: "Ms. Davis", room: "Room 102" }
  ]
};

export default function CalendarPage() {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);
  const [attendance, setAttendance] = useState<AttendanceStatus>({});
  const [showTimetable, setShowTimetable] = useState(false);
  const [hoveredDay, setHoveredDay] = useState<number | null>(null);

  const today = new Date();

  // Initialize attendance for weekdays until today
  useEffect(() => {
    const initializeAttendance = () => {
      const initialAttendance: AttendanceStatus = {};
      const currentYear = today.getFullYear();
      const currentMonth = today.getMonth();
      const currentDay = today.getDate();

      // Go through all months from January to current month
      for (let month = 0; month <= currentMonth; month++) {
        const daysInMonth = new Date(currentYear, month + 1, 0).getDate();
        const endDay = month === currentMonth ? currentDay : daysInMonth;

        for (let day = 1; day <= endDay; day++) {
          const date = new Date(currentYear, month, day);
          const dayOfWeek = date.getDay();
          
          // If it's a weekday (Monday = 1, Friday = 5)
          if (dayOfWeek >= 1 && dayOfWeek <= 5) {
            const dateKey = formatDateKey(date);
            initialAttendance[dateKey] = "present";
          }
        }
      }

      setAttendance(initialAttendance);
    };

    initializeAttendance();
  }, []);
  
  const monthNames = [
    "January", "February", "March", "April", "May", "June",
    "July", "August", "September", "October", "November", "December"
  ];
  
  const daysOfWeek = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

  const getDaysInMonth = (date: Date) => {
    return new Date(date.getFullYear(), date.getMonth() + 1, 0).getDate();
  };

  const getFirstDayOfMonth = (date: Date) => {
    return new Date(date.getFullYear(), date.getMonth(), 1).getDay();
  };

  const formatDateKey = (date: Date) => {
    return `${date.getFullYear()}-${date.getMonth()}-${date.getDate()}`;
  };

  const getDayName = (date: Date) => {
    const days = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
    return days[date.getDay()];
  };

  const navigateMonth = (direction: number) => {
    setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() + direction, 1));
  };

  const handleDateClick = (day: number) => {
    const clickedDate = new Date(currentDate.getFullYear(), currentDate.getMonth(), day);
    const dateKey = formatDateKey(clickedDate);
    toggleAttendance(dateKey);
  };

  const handleExpandClick = (day: number, e: React.MouseEvent) => {
    e.stopPropagation(); // Prevent the date click event
    const clickedDate = new Date(currentDate.getFullYear(), currentDate.getMonth(), day);
    setSelectedDate(clickedDate);
    setShowTimetable(true);
  };

  const toggleAttendance = (dateKey: string) => {
    setAttendance(prev => {
      const current = prev[dateKey];
      let next: "present" | "absent" | "holiday" | null;
      
      if (current === null || current === undefined) {
        next = "present";
      } else if (current === "present") {
        next = "absent";
      } else if (current === "absent") {
        next = "holiday";
      } else {
        next = null;
      }
      
      return { ...prev, [dateKey]: next };
    });
  };

  const getAttendanceDot = (status: "present" | "absent" | "holiday" | null) => {
    if (!status) return null;
    
    const colors = {
      present: "bg-green-500",
      absent: "bg-red-500", 
      holiday: "bg-yellow-500"
    };
    
    return (
      <div className={`w-2 h-2 rounded-full ${colors[status]} absolute bottom-1 right-1`} />
    );
  };

  const renderCalendar = () => {
    const daysInMonth = getDaysInMonth(currentDate);
    const firstDay = getFirstDayOfMonth(currentDate);
    const days = [];

    // Empty cells for days before the first day of the month
    for (let i = 0; i < firstDay; i++) {
      days.push(<div key={`empty-${i}`} className="h-12" />);
    }

    // Days of the month
    for (let day = 1; day <= daysInMonth; day++) {
      const date = new Date(currentDate.getFullYear(), currentDate.getMonth(), day);
      const dateKey = formatDateKey(date);
      const isToday = date.toDateString() === today.toDateString();
      const attendanceStatus = attendance[dateKey];

      days.push(
        <motion.div
          key={day}
          className={`
            h-12 border border-gray-700 flex items-center justify-center cursor-pointer relative
            hover:bg-gray-800 transition-colors
            ${isToday ? "bg-blue-900 border-blue-500" : ""}
          `}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={() => handleDateClick(day)}
          onMouseEnter={() => setHoveredDay(day)}
          onMouseLeave={() => setHoveredDay(null)}
        >
          <span className="text-white text-sm">{day}</span>
          {getAttendanceDot(attendanceStatus)}
          
          {/* Expand icon on hover */}
          {hoveredDay === day && (
            <motion.button
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.8 }}
              className="absolute top-1 left-1 p-0.5 bg-gray-700 hover:bg-gray-600 rounded text-gray-300 hover:text-white transition-colors"
              onClick={(e) => handleExpandClick(day, e)}
            >
              <IconMaximize size={10} />
            </motion.button>
          )}
        </motion.div>
      );
    }

    return days;
  };

  const selectedDayName = selectedDate ? getDayName(selectedDate) : "";
  const selectedTimetable = selectedDayName ? mockTimetable[selectedDayName] || [] : [];

  return (
    <div className="p-8 bg-black min-h-full">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="max-w-6xl mx-auto"
      >
        <h1 className="text-3xl font-bold text-white mb-8">Calendar</h1>
        
        <div className="bg-black border border-white/30 rounded-lg p-6">
          {/* Calendar Header */}
          <div className="flex items-center justify-between mb-6">
            <button
              onClick={() => navigateMonth(-1)}
              className="p-2 text-white hover:bg-gray-800 rounded-lg transition-colors"
            >
              <IconChevronLeft size={20} />
            </button>
            
            <h2 className="text-xl font-bold text-white">
              {monthNames[currentDate.getMonth()]} {currentDate.getFullYear()}
            </h2>
            
            <button
              onClick={() => navigateMonth(1)}
              className="p-2 text-white hover:bg-gray-800 rounded-lg transition-colors"
            >
              <IconChevronRight size={20} />
            </button>
          </div>

          {/* Days of week header */}
          <div className="grid grid-cols-7 gap-1 mb-2">
            {daysOfWeek.map(day => (
              <div key={day} className="h-10 flex items-center justify-center text-gray-400 font-medium">
                {day}
              </div>
            ))}
          </div>

          {/* Calendar Grid */}
          <div className="grid grid-cols-7 gap-1">
            {renderCalendar()}
          </div>

          {/* Legend */}
          <div className="mt-6 flex items-center gap-6 text-sm text-gray-400">
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 bg-green-500 rounded-full"></div>
              <span>Present</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 bg-red-500 rounded-full"></div>
              <span>Absent</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 bg-yellow-500 rounded-full"></div>
              <span>Holiday</span>
            </div>
            <div className="text-xs text-gray-500 ml-4">
              Click day to toggle attendance • Hover and click expand icon to view timetable
            </div>
          </div>
        </div>

        {/* Timetable Modal */}
        <AnimatePresence>
          {showTimetable && selectedDate && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black/50 flex items-center justify-center z-50"
              onClick={() => setShowTimetable(false)}
            >
              <motion.div
                initial={{ scale: 0.8, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0.8, opacity: 0 }}
                className="bg-gray-900 border border-white/20 rounded-lg p-6 max-w-md w-full mx-4"
                onClick={(e) => e.stopPropagation()}
              >
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-xl font-bold text-white">
                    {selectedDayName}, {selectedDate.getDate()} {monthNames[selectedDate.getMonth()]}
                  </h3>
                  <button
                    onClick={() => setShowTimetable(false)}
                    className="p-1 text-gray-400 hover:text-white transition-colors"
                  >
                    <IconX size={20} />
                  </button>
                </div>

                {selectedTimetable.length > 0 ? (
                  <div className="space-y-3">
                    {selectedTimetable.map((entry, index) => (
                      <div key={index} className="bg-gray-800 rounded-lg p-3 border border-gray-700">
                        <div className="flex items-center justify-between mb-1">
                          <span className="text-blue-400 font-medium">{entry.time}</span>
                          <span className="text-gray-400 text-sm">{entry.room}</span>
                        </div>
                        <div className="text-white font-medium">{entry.subject}</div>
                        <div className="text-gray-300 text-sm">{entry.teacher}</div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-8 text-gray-400">
                    No classes scheduled for {selectedDayName}
                  </div>
                )}

                {/* Attendance Controls */}
                <div className="mt-6 border-t border-gray-700 pt-4">
                  <p className="text-gray-400 text-sm mb-3">Mark attendance for this day:</p>
                  <div className="flex gap-2">
                    <button
                      onClick={() => setAttendance(prev => ({ ...prev, [formatDateKey(selectedDate)]: "present" }))}
                      className="px-3 py-2 bg-green-600 hover:bg-green-700 text-white rounded-lg text-sm transition-colors"
                    >
                      Present
                    </button>
                    <button
                      onClick={() => setAttendance(prev => ({ ...prev, [formatDateKey(selectedDate)]: "absent" }))}
                      className="px-3 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg text-sm transition-colors"
                    >
                      Absent
                    </button>
                    <button
                      onClick={() => setAttendance(prev => ({ ...prev, [formatDateKey(selectedDate)]: "holiday" }))}
                      className="px-3 py-2 bg-yellow-600 hover:bg-yellow-700 text-white rounded-lg text-sm transition-colors"
                    >
                      Holiday
                    </button>
                    <button
                      onClick={() => setAttendance(prev => ({ ...prev, [formatDateKey(selectedDate)]: null }))}
                      className="px-3 py-2 bg-gray-600 hover:bg-gray-700 text-white rounded-lg text-sm transition-colors"
                    >
                      Clear
                    </button>
                  </div>
                </div>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>
    </div>
  );
}
