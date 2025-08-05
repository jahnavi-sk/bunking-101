"use client";
import React from "react";
import { motion } from "framer-motion";

export default function BunkPage() {
  return (
    <div className="p-8 bg-black min-h-full">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="max-w-4xl mx-auto"
      >
        <h1 className="text-3xl font-bold text-white mb-8">Bunk</h1>
        <div className="bg-gray-900 border border-white/20 rounded-lg p-6">
          <p className="text-gray-300">
            Manage your bunking schedule here. Keep track of your attendance and plan wisely.
          </p>
        </div>
      </motion.div>
    </div>
  );
}
