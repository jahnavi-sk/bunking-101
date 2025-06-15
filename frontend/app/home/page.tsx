"use client";
import React, { useState } from "react";
import { motion } from "framer-motion";

// Mock data for subjects and attendance
const initialSubjects = [
  { id: 1, name: "Mathematics", attended: 28, total: 35, requiredPercentage: 75 },
  { id: 2, name: "Physics", attended: 22, total: 30, requiredPercentage: 75 },
  { id: 3, name: "Chemistry", attended: 25, total: 32, requiredPercentage: 75 },
  { id: 4, name: "Computer Science", attended: 30, total: 33, requiredPercentage: 75 },
  { id: 5, name: "English", attended: 26, total: 31, requiredPercentage: 75 }
];

export default function AttendanceApp() {
  const [currentPage, setCurrentPage] = useState("dashboard");
  const [subjects, setSubjects] = useState(initialSubjects);
  const [open, setOpen] = useState(false);
  const [daysToSkip, setDaysToSkip] = useState(1);
  const [bestDaysResult, setBestDaysResult] = useState(null);
  const [editingSubject, setEditingSubject] = useState(null);
  const [updateForm, setUpdateForm] = useState({ attended: 0, total: 0 });

  const links = [
    {
      label: "Dashboard",
      href: "dashboard",
      icon: "📊",
    },
    {
      label: "Attendance",
      href: "attendance",
      icon: "📚",
    },
    {
      label: "Timetable",
      href: "timetable",
      icon: "📅",
    },
    {
      label: "Settings",
      href: "settings",
      icon: "⚙️",
    },
    {
      label: "Logout",
      href: "logout",
      icon: "🚪",
    },
  ];

  const calculateBestDays = () => {
    const days = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"];
    const randomDays = days.sort(() => 0.5 - Math.random()).slice(0, daysToSkip);
    setBestDaysResult(randomDays);
  };

  const handleEditAttendance = (subject) => {
    setEditingSubject(subject);
    setUpdateForm({ attended: subject.attended, total: subject.total });
  };

  const handleUpdateAttendance = () => {
    if (editingSubject) {
      setSubjects(subjects.map(subject => 
        subject.id === editingSubject.id 
          ? { ...subject, attended: updateForm.attended, total: updateForm.total }
          : subject
      ));
      setEditingSubject(null);
      setUpdateForm({ attended: 0, total: 0 });
    }
  };

  const handleQuickUpdate = (subjectId, type) => {
    setSubjects(subjects.map(subject => {
      if (subject.id === subjectId) {
        if (type === 'present') {
          return { ...subject, attended: subject.attended + 1, total: subject.total + 1 };
        } else if (type === 'absent') {
          return { ...subject, total: subject.total + 1 };
        }
      }
      return subject;
    }));
  };

  const AttendanceCard = ({ subject, showActions = false }) => {
    const percentage = Math.round((subject.attended / subject.total) * 100);
    const isLow = percentage < subject.requiredPercentage;
    
    return (
      <div className={`p-6 rounded-lg border-2 ${isLow ? 'border-red-200 bg-red-50 dark:border-red-800 dark:bg-red-900/20' : 'border-green-200 bg-green-50 dark:border-green-800 dark:bg-green-900/20'}`}>
        <div className="flex justify-between items-start mb-4">
          <h3 className="font-semibold text-xl dark:text-white">{subject.name}</h3>
          {showActions && (
            <button
              onClick={() => handleEditAttendance(subject)}
              className="px-3 py-1 bg-blue-500 hover:bg-blue-600 text-white text-sm rounded-lg transition-colors"
            >
              Edit
            </button>
          )}
        </div>
        
        <div className="space-y-3">
          <div className="flex justify-between items-center">
            <span className="text-lg dark:text-gray-300">
              <strong>{subject.attended}</strong> / {subject.total} classes
            </span>
            <span className={`font-bold text-xl ${isLow ? 'text-red-600 dark:text-red-400' : 'text-green-600 dark:text-green-400'}`}>
              {percentage}%
            </span>
          </div>
          
          <div className="w-full bg-gray-200 rounded-full h-3 dark:bg-gray-700">
            <div 
              className={`h-3 rounded-full transition-all duration-300 ${isLow ? 'bg-red-500' : 'bg-green-500'}`}
              style={{ width: `${percentage}%` }}
            ></div>
          </div>
          
          <div className="flex justify-between text-sm">
            <span className="text-gray-600 dark:text-gray-400">
              Required: {subject.requiredPercentage}%
            </span>
            <span className={`font-medium ${isLow ? 'text-red-600 dark:text-red-400' : 'text-green-600 dark:text-green-400'}`}>
              {isLow ? `Need ${Math.ceil(((subject.requiredPercentage/100) * subject.total - subject.attended) / (1 - subject.requiredPercentage/100))} more classes` : 'On track'}
            </span>
          </div>

          {showActions && (
            <div className="flex gap-2 mt-4">
              <button
                onClick={() => handleQuickUpdate(subject.id, 'present')}
                className="flex-1 px-3 py-2 bg-green-500 hover:bg-green-600 text-white text-sm rounded-lg transition-colors"
              >
                ✅ Mark Present
              </button>
              <button
                onClick={() => handleQuickUpdate(subject.id, 'absent')}
                className="flex-1 px-3 py-2 bg-red-500 hover:bg-red-600 text-white text-sm rounded-lg transition-colors"
              >
                ❌ Mark Absent
              </button>
            </div>
          )}
        </div>
      </div>
    );
  };

  const Sidebar = () => (
    <div className={`${open ? 'w-64' : 'w-16'} transition-all duration-300 bg-white dark:bg-neutral-800 border-r border-neutral-200 dark:border-neutral-700 flex flex-col`}>
      <div className="p-4 border-b border-neutral-200 dark:border-neutral-700">
        <button 
          onClick={() => setOpen(!open)}
          className="w-full flex items-center justify-center p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-neutral-700"
        >
          <span className="text-2xl">{open ? '←' : '→'}</span>
        </button>
      </div>

      <div className="p-4">
        {open ? (
          <div className="flex items-center space-x-2">
            <div className="h-8 w-8 bg-blue-600 rounded-lg flex items-center justify-center">
              <span className="text-white font-bold">A</span>
            </div>
            <span className="font-bold text-xl dark:text-white">AttendEase</span>
          </div>
        ) : (
          <div className="flex justify-center">
            <div className="h-8 w-8 bg-blue-600 rounded-lg flex items-center justify-center">
              <span className="text-white font-bold">A</span>
            </div>
          </div>
        )}
      </div>

      <div className="flex-1 p-4 space-y-2">
        {links.map((link, idx) => (
          <div 
            key={idx} 
            onClick={() => setCurrentPage(link.href)}
            className={`flex items-center space-x-3 p-3 rounded-lg cursor-pointer transition-colors ${
              currentPage === link.href 
                ? 'bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400' 
                : 'hover:bg-gray-100 dark:hover:bg-neutral-700'
            }`}
          >
            <span className="text-xl">{link.icon}</span>
            {open && <span className="dark:text-white">{link.label}</span>}
          </div>
        ))}
      </div>

      <div className="p-4 border-t border-neutral-200 dark:border-neutral-700">
        <div className="flex items-center space-x-3">
          <div className="h-10 w-10 bg-blue-500 rounded-full flex items-center justify-center">
            <span className="text-white font-bold">U</span>
          </div>
          {open && (
            <div>
              <div className="font-semibold dark:text-white">John Doe</div>
              <div className="text-sm text-gray-500 dark:text-gray-400">Student</div>
            </div>
          )}
        </div>
      </div>
    </div>
  );

  const DashboardPage = () => (
    <div className="max-w-7xl mx-auto">
      <h1 className="text-3xl font-bold mb-8 dark:text-white">Dashboard</h1>
      
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
        <div className="bg-white dark:bg-neutral-800 p-6 rounded-lg shadow-lg">
          <h3 className="text-lg font-semibold mb-2 dark:text-white">Total Subjects</h3>
          <p className="text-3xl font-bold text-blue-600">{subjects.length}</p>
        </div>
        <div className="bg-white dark:bg-neutral-800 p-6 rounded-lg shadow-lg">
          <h3 className="text-lg font-semibold mb-2 dark:text-white">Overall Attendance</h3>
          <p className="text-3xl font-bold text-green-600">
            {Math.round(subjects.reduce((acc, subj) => acc + (subj.attended / subj.total), 0) / subjects.length * 100)}%
          </p>
        </div>
        <div className="bg-white dark:bg-neutral-800 p-6 rounded-lg shadow-lg">
          <h3 className="text-lg font-semibold mb-2 dark:text-white">Low Attendance</h3>
          <p className="text-3xl font-bold text-red-600">
            {subjects.filter(subj => (subj.attended / subj.total * 100) < subj.requiredPercentage).length}
          </p>
        </div>
        <div className="bg-white dark:bg-neutral-800 p-6 rounded-lg shadow-lg">
          <h3 className="text-lg font-semibold mb-2 dark:text-white">Classes This Week</h3>
          <p className="text-3xl font-bold text-purple-600">25</p>
        </div>
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-2 gap-8">
        <div className="space-y-6">
          <div className="bg-white dark:bg-neutral-800 p-6 rounded-lg shadow-lg">
            <h2 className="text-2xl font-bold mb-6 dark:text-white">Subject Attendance</h2>
            <div className="space-y-4">
              {subjects.map((subject, idx) => (
                <AttendanceCard key={idx} subject={subject} />
              ))}
            </div>
          </div>
        </div>

        <div className="space-y-6">
          <div className="bg-white dark:bg-neutral-800 p-6 rounded-lg shadow-lg">
            <h2 className="text-2xl font-bold mb-6 dark:text-white">Skip Days Calculator</h2>
            <p className="text-gray-600 dark:text-gray-400 mb-4">
              Calculate the best days to skip based on your timetable and attendance requirements.
            </p>
            
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-2 dark:text-white">
                  How many days do you want to skip this week?
                </label>
                <input
                  type="number"
                  min="1"
                  max="5"
                  value={daysToSkip}
                  onChange={(e) => setDaysToSkip(parseInt(e.target.value) || 1)}
                  className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-neutral-700 dark:border-neutral-600 dark:text-white"
                />
              </div>
              
              <button
                onClick={calculateBestDays}
                className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 px-6 rounded-lg transition-colors"
              >
                Calculate Best Days to Skip
              </button>
              
              {bestDaysResult && (
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="mt-4 p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg border border-blue-200 dark:border-blue-800"
                >
                  <h3 className="font-semibold text-blue-800 dark:text-blue-300 mb-2">
                    Recommended Days to Skip:
                  </h3>
                  <div className="flex flex-wrap gap-2">
                    {bestDaysResult.map((day, idx) => (
                      <span key={idx} className="px-3 py-1 bg-blue-600 text-white rounded-full text-sm">
                        {day}
                      </span>
                    ))}
                  </div>
                  <p className="text-sm text-blue-700 dark:text-blue-400 mt-2">
                    These days have the least impact on your overall attendance.
                  </p>
                </motion.div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );

  const AttendancePage = () => (
    <div className="max-w-7xl mx-auto">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold dark:text-white">Attendance Management</h1>
        <div className="text-lg dark:text-white">
          Overall: <span className="font-bold text-green-600">
            {Math.round(subjects.reduce((acc, subj) => acc + (subj.attended / subj.total), 0) / subjects.length * 100)}%
          </span>
        </div>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <div className="bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 p-6 rounded-lg">
          <h3 className="text-lg font-semibold mb-2 text-green-800 dark:text-green-300">Good Attendance</h3>
          <p className="text-3xl font-bold text-green-600">
            {subjects.filter(subj => (subj.attended / subj.total * 100) >= subj.requiredPercentage).length}
          </p>
          <p className="text-sm text-green-700 dark:text-green-400">subjects on track</p>
        </div>
        <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 p-6 rounded-lg">
          <h3 className="text-lg font-semibold mb-2 text-red-800 dark:text-red-300">Low Attendance</h3>
          <p className="text-3xl font-bold text-red-600">
            {subjects.filter(subj => (subj.attended / subj.total * 100) < subj.requiredPercentage).length}
          </p>
          <p className="text-sm text-red-700 dark:text-red-400">subjects need attention</p>
        </div>
        <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 p-6 rounded-lg">
          <h3 className="text-lg font-semibold mb-2 text-blue-800 dark:text-blue-300">Total Classes</h3>
          <p className="text-3xl font-bold text-blue-600">
            {subjects.reduce((acc, subj) => acc + subj.total, 0)}
          </p>
          <p className="text-sm text-blue-700 dark:text-blue-400">across all subjects</p>
        </div>
      </div>

      {/* Attendance Cards */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {subjects.map((subject, idx) => (
          <AttendanceCard key={idx} subject={subject} showActions={true} />
        ))}
      </div>

      {/* Edit Modal */}
      {editingSubject && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-white dark:bg-neutral-800 p-6 rounded-lg shadow-xl max-w-md w-full mx-4"
          >
            <h3 className="text-xl font-bold mb-4 dark:text-white">
              Update {editingSubject.name} Attendance
            </h3>
            
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-2 dark:text-white">
                  Classes Attended
                </label>
                <input
                  type="number"
                  min="0"
                  value={updateForm.attended}
                  onChange={(e) => setUpdateForm({...updateForm, attended: parseInt(e.target.value) || 0})}
                  className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-neutral-700 dark:border-neutral-600 dark:text-white"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium mb-2 dark:text-white">
                  Total Classes
                </label>
                <input
                  type="number"
                  min="0"
                  value={updateForm.total}
                  onChange={(e) => setUpdateForm({...updateForm, total: parseInt(e.target.value) || 0})}
                  className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-neutral-700 dark:border-neutral-600 dark:text-white"
                />
              </div>

              <div className="text-sm text-gray-600 dark:text-gray-400">
                New percentage: {updateForm.total > 0 ? Math.round((updateForm.attended / updateForm.total) * 100) : 0}%
              </div>
            </div>
            
            <div className="flex gap-3 mt-6">
              <button
                onClick={() => setEditingSubject(null)}
                className="flex-1 px-4 py-2 bg-gray-500 hover:bg-gray-600 text-white rounded-lg transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={handleUpdateAttendance}
                className="flex-1 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors"
              >
                Update
              </button>
            </div>
          </motion.div>
        </div>
      )}
    </div>
  );

  const renderCurrentPage = () => {
    switch(currentPage) {
      case 'dashboard':
        return <DashboardPage />;
      case 'attendance':
        return <AttendancePage />;
      case 'timetable':
        return (
          <div className="max-w-7xl mx-auto">
            <h1 className="text-3xl font-bold mb-8 dark:text-white">Timetable</h1>
            <div className="bg-white dark:bg-neutral-800 p-8 rounded-lg shadow-lg text-center">
              <p className="text-gray-500 dark:text-gray-400">Timetable page coming soon...</p>
            </div>
          </div>
        );
      case 'settings':
        return (
          <div className="max-w-7xl mx-auto">
            <h1 className="text-3xl font-bold mb-8 dark:text-white">Settings</h1>
            <div className="bg-white dark:bg-neutral-800 p-8 rounded-lg shadow-lg text-center">
              <p className="text-gray-500 dark:text-gray-400">Settings page coming soon...</p>
            </div>
          </div>
        );
      default:
        return <DashboardPage />;
    }
  };

  return (
    <div className="flex h-screen w-full bg-gray-100 dark:bg-neutral-900">
      <Sidebar />
      <div className="flex-1 p-6 overflow-auto">
        {renderCurrentPage()}
      </div>
    </div>
  );
}