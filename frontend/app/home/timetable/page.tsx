"use client";
import React, { useState } from "react";
import { motion } from "framer-motion";
import { IconEdit, IconCheck, IconX } from "@tabler/icons-react";

interface ClassSlot {
  subject: string;
  teacher: string;
  room: string;
}

interface TimeTableData {
  [day: string]: (ClassSlot | null)[];
}

const timeSlots = [
  "9:00 AM",
  "10:00 AM",
  "11:00 AM",
  "12:00 PM",
  "1:00 PM",
  "2:00 PM",
  "3:00 PM",
  "4:00 PM",
  "5:00 PM"
];

const days = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"];

// Mock data - will be fetched from backend later
const initialTimetable: TimeTableData = {
  Monday: Array(9).fill(null),
  Tuesday: Array(9).fill(null),
  Wednesday: Array(9).fill(null),
  Thursday: Array(9).fill(null),
  Friday: Array(9).fill(null),
};

export default function TimetablePage() {
  const [timetable, setTimetable] = useState<TimeTableData>(initialTimetable);
  const [editingCell, setEditingCell] = useState<{ day: string; slot: number } | null>(null);
  const [editValues, setEditValues] = useState<ClassSlot>({ subject: "", teacher: "", room: "" });

  const handleEdit = (day: string, slot: number, currentValues: ClassSlot | null) => {
    setEditingCell({ day, slot });
    setEditValues(currentValues || { subject: "", teacher: "", room: "" });
  };

  const handleSave = () => {
    if (!editingCell) return;

    const { day, slot } = editingCell;
    setTimetable(prev => ({
      ...prev,
      [day]: prev[day].map((cls, idx) => 
        idx === slot ? editValues : cls
      )
    }));
    setEditingCell(null);
  };

  const handleCancel = () => {
    setEditingCell(null);
  };

  return (
    <div className="p-8 bg-black min-h-full">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="max-w-7xl mx-auto"
      >
        <h1 className="text-3xl font-bold text-white mb-8">Timetable</h1>
        
        <div className="bg-black border border-white/20 rounded-lg p-6 overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr>
                <th className="p-3 border-b border-gray-700 text-gray-400">Time</th>
                {days.map(day => (
                  <th key={day} className="p-3 border-b border-gray-700 text-gray-200 font-medium">
                    {day}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {timeSlots.map((time, slotIndex) => (
                <tr key={time}>
                  <td className="p-3 border-b border-gray-800 text-gray-400 text-sm whitespace-nowrap">
                    {time}
                  </td>
                  {days.map(day => {
                    const currentClass = timetable[day][slotIndex];
                    const isEditing = editingCell?.day === day && editingCell?.slot === slotIndex;

                    return (
                      <td key={`${day}-${slotIndex}`} className="p-3 border-b border-gray-800">
                        {isEditing ? (
                          <div className="space-y-2">
                            <input
                              type="text"
                              placeholder="Subject"
                              className="w-full bg-gray-800 border border-gray-700 rounded px-2 py-1 text-white text-sm"
                              value={editValues.subject}
                              onChange={e => setEditValues(prev => ({ ...prev, subject: e.target.value }))}
                            />
                            <input
                              type="text"
                              placeholder="Teacher"
                              className="w-full bg-gray-800 border border-gray-700 rounded px-2 py-1 text-white text-sm"
                              value={editValues.teacher}
                              onChange={e => setEditValues(prev => ({ ...prev, teacher: e.target.value }))}
                            />
                            <input
                              type="text"
                              placeholder="Room"
                              className="w-full bg-gray-800 border border-gray-700 rounded px-2 py-1 text-white text-sm"
                              value={editValues.room}
                              onChange={e => setEditValues(prev => ({ ...prev, room: e.target.value }))}
                            />
                            <div className="flex gap-2">
                              <button
                                onClick={handleSave}
                                className="p-1 bg-green-600 hover:bg-green-700 rounded text-white"
                              >
                                <IconCheck size={16} />
                              </button>
                              <button
                                onClick={handleCancel}
                                className="p-1 bg-red-600 hover:bg-red-700 rounded text-white"
                              >
                                <IconX size={16} />
                              </button>
                            </div>
                          </div>
                        ) : (
                          <div 
                            className="relative group min-h-[60px] rounded hover:bg-gray-800 transition-colors"
                            onClick={() => handleEdit(day, slotIndex, currentClass)}
                          >
                            {currentClass ? (
                              <>
                                <div className="text-white font-medium">{currentClass.subject}</div>
                                <div className="text-gray-400 text-sm">{currentClass.teacher}</div>
                                <div className="text-gray-500 text-xs">{currentClass.room}</div>
                                <button className="absolute top-1 right-1 opacity-0 group-hover:opacity-100 transition-opacity p-1 bg-gray-700 hover:bg-gray-600 rounded text-gray-300 hover:text-white">
                                  <IconEdit size={14} />
                                </button>
                              </>
                            ) : (
                              <div className="flex items-center justify-center h-full text-gray-500 text-sm">
                                Click to add class
                              </div>
                            )}
                          </div>
                        )}
                      </td>
                    );
                  })}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </motion.div>
    </div>
  );
}
