"use client";
import React from "react";
import { motion } from "framer-motion";

export default function TimetablePage() {
  return (
    <div className="p-8 bg-black min-h-full">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="max-w-4xl mx-auto"
      >
        <h1 className="text-3xl font-bold text-white mb-8">Timetable</h1>
        <div className="bg-gray-900 border border-white/20 rounded-lg p-6">
          <p className="text-gray-300">
            Your class timetable will be displayed here. View your schedule and plan accordingly.
          </p>
        </div>
      </motion.div>
    </div>
  );
}
