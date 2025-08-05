"use client";
import React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { motion } from "framer-motion";
import { 
  IconUser, 
  IconCalendar, 
  IconClock, 
  IconUserX 
} from "@tabler/icons-react";

const sidebarItems = [
  {
    name: "Profile",
    href: "/home/profile",
    icon: IconUser,
  },
  {
    name: "Calendar",
    href: "/home/calendar",
    icon: IconCalendar,
  },
  {
    name: "Timetable",
    href: "/home/timetable",
    icon: IconClock,
  },
  {
    name: "Bunk",
    href: "/home/bunk",
    icon: IconUserX,
  },
];

export function Sidebar() {
  const pathname = usePathname();

  return (
    <div className="w-64 h-screen bg-black border-r border-white/20 p-6">
      <div className="mb-8">
        <h1 className="text-xl font-bold text-white">Bunking 101</h1>
      </div>
      
      <nav className="space-y-2">
        {sidebarItems.map((item) => {
          const isActive = pathname === item.href;
          const Icon = item.icon;
          
          return (
            <Link key={item.name} href={item.href}>
              <motion.div
                className={`
                  flex items-center gap-3 px-4 py-3 rounded-lg transition-colors relative overflow-hidden
                  ${isActive 
                    ? "bg-white/10 text-white" 
                    : "text-gray-400 hover:text-white hover:bg-white/5"
                  }
                `}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                {isActive && (
                  <motion.div
                    className="absolute inset-0 bg-white/5 border border-white/20 rounded-lg"
                    layoutId="activeTab"
                    initial={false}
                    transition={{
                      type: "spring",
                      stiffness: 500,
                      damping: 30,
                    }}
                  />
                )}
                <Icon size={20} className="relative z-10" />
                <span className="relative z-10 font-medium">{item.name}</span>
              </motion.div>
            </Link>
          );
        })}
      </nav>
    </div>
  );
}
