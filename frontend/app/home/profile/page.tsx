"use client";
import React, { useState } from "react";
import { motion } from "framer-motion";
import { 
  IconUser, 
  IconEdit, 
  IconUpload,
  IconLock
} from "@tabler/icons-react";

interface SubjectAttendance {
  name: string;
  present: number;
  total: number;
}

// Mock user data - will be fetched from backend later
const mockUserData = {
  username: "Emmily Smith",
  email: "emmily.smith@example.com",
  semester: 5,
  section: "B",
  profilePic: null, // URL will go here
  subjects: [
    { name: "Data Structures", present: 34, total: 45 },
    { name: "Operating Systems", present: 28, total: 40 },
    { name: "Computer Networks", present: 30, total: 38 },
    { name: "Database Management", present: 25, total: 35 },
    { name: "Software Engineering", present: 32, total: 42 }
  ] as SubjectAttendance[]
};

export default function ProfilePage() {
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [showPasswordModal, setShowPasswordModal] = useState(false);

  const handleImageChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      setImageFile(file);
      const url = URL.createObjectURL(file);
      setPreviewUrl(url);
      // Here you would typically upload the image to your backend
    }
  };

  const calculateAttendancePercentage = (present: number, total: number) => {
    return ((present / total) * 100).toFixed(1);
  };

  const getAttendanceColor = (percentage: number) => {
    if (percentage >= 75) return "text-green-400";
    if (percentage >= 65) return "text-yellow-400";
    return "text-red-400";
  };

  return (
    <div className="p-8 bg-black min-h-full">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="max-w-6xl mx-auto"
      >
        <div className="bg-black border border-white/20 rounded-lg p-8">
          <div className="flex flex-col md:flex-row gap-8">
            {/* Profile Picture Section */}
            <div className="flex flex-col items-center space-y-4">
              <div className="relative">
                <div className={`
                  ${previewUrl || mockUserData.profilePic ? 'w-36 h-36' : 'w-28 h-28'} 
                  rounded-full bg-gray-800 border-2 border-white/20 overflow-hidden 
                  flex items-center justify-center transition-all duration-200
                `}>
                  {previewUrl || mockUserData.profilePic ? (
                    <img 
                      src={previewUrl || mockUserData.profilePic!} 
                      alt="Profile" 
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <IconUser size={48} className="text-gray-400" />
                  )}
                </div>
                <label 
                  htmlFor="profile-upload" 
                  className="absolute bottom-1 right-1 p-1.5 bg-blue-600 hover:bg-blue-700 rounded-full cursor-pointer transition-colors"
                >
                  <IconUpload size={16} className="text-white" />
                </label>
                <input 
                  type="file" 
                  id="profile-upload" 
                  className="hidden" 
                  accept="image/*"
                  onChange={handleImageChange}
                />
              </div>
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="px-4 py-2 bg-gray-800 hover:bg-gray-700 text-white rounded-lg flex items-center gap-2 transition-colors"
                onClick={() => setShowPasswordModal(true)}
              >
                <IconLock size={16} />
                Change Password
              </motion.button>
            </div>

            {/* User Info Section */}
            <div className="flex-1">
              <div className="space-y-6">
                <div>
                  <h2 className="text-3xl font-bold text-white mb-1">{mockUserData.username}</h2>
                  <p className="text-gray-400">{mockUserData.email}</p>
                </div>
                
                <div className="flex gap-4">
                  <div className="bg-black px-4 py-2 rounded-lg">
                    <p className="text-sm text-gray-400">Semester</p>
                    <p className="text-xl text-white">{mockUserData.semester}th</p>
                  </div>
                  <div className="bg-black px-4 py-2 rounded-lg">
                    <p className="text-sm text-gray-400">Section</p>
                    <p className="text-xl text-white">{mockUserData.section}</p>
                  </div>
                </div>

                {/* Subjects and Attendance */}
                <div className="mt-8">
                  <h3 className="text-xl font-semibold text-white mb-4">Subject Attendance</h3>
                  <div className="space-y-4">
                    {mockUserData.subjects.map((subject, index) => {
                      const percentage = calculateAttendancePercentage(subject.present, subject.total);
                      const colorClass = getAttendanceColor(parseFloat(percentage));
                      
                      return (
                        <div 
                          key={index}
                          className="bg-gray-800 p-4 rounded-lg flex justify-between items-center"
                        >
                          <div>
                            <h4 className="text-white font-medium">{subject.name}</h4>
                            <p className="text-sm text-gray-400">
                              {subject.present}/{subject.total} classes attended
                            </p>
                          </div>
                          <div className={`text-xl font-semibold ${colorClass}`}>
                            {percentage}%
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </motion.div>

      {/* Password Change Modal */}
      {showPasswordModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className="bg-gray-900 border border-white/20 rounded-lg p-6 w-full max-w-md"
          >
            <h3 className="text-xl font-bold text-white mb-4">Change Password</h3>
            <div className="space-y-4">
              <div>
                <label className="text-sm text-gray-400">Current Password</label>
                <input 
                  type="password"
                  className="w-full mt-1 p-2 bg-gray-800 border border-gray-700 rounded-lg text-white"
                />
              </div>
              <div>
                <label className="text-sm text-gray-400">New Password</label>
                <input 
                  type="password"
                  className="w-full mt-1 p-2 bg-gray-800 border border-gray-700 rounded-lg text-white"
                />
              </div>
              <div>
                <label className="text-sm text-gray-400">Confirm New Password</label>
                <input 
                  type="password"
                  className="w-full mt-1 p-2 bg-gray-800 border border-gray-700 rounded-lg text-white"
                />
              </div>
              <div className="flex gap-3 mt-6">
                <button 
                  className="flex-1 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors"
                  onClick={() => setShowPasswordModal(false)}
                >
                  Update Password
                </button>
                <button 
                  className="px-4 py-2 bg-gray-800 hover:bg-gray-700 text-white rounded-lg transition-colors"
                  onClick={() => setShowPasswordModal(false)}
                >
                  Cancel
                </button>
              </div>
            </div>
          </motion.div>
        </div>
      )}
    </div>
  );
}
