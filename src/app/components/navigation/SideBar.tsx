"use client";
import { useState, useEffect, useRef } from "react";
import { useRouter, usePathname } from "next/navigation";
import { Home, Shield, Settings, Menu } from "lucide-react";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";

const menuItems = [
  { name: "Home", icon: Home, path: "/home" },
  { name: "Security", icon: Shield, path: "/security" },
  { name: "Settings", icon: Settings, path: "/settings" },
];

export default function SideBar() {
  const pathname = usePathname();
  const excludedPaths = ["/", "/login", "/register"];
  if (excludedPaths.includes(pathname
  )) {
    return null;
  };
  const [expanded, setExpanded] = useState(true);
  const sidebarRef = useRef<HTMLDivElement>(null);
  const router = useRouter();

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (sidebarRef.current && !sidebarRef.current.contains(event.target as Node)) {
        setExpanded(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  return (
    <motion.div
      ref={sidebarRef}
      animate={{ width: expanded ? 250 : 80 }}
      className="h-screen bg-primary text-white p-4 flex flex-col shadow-xl items-start"
    >
      <button
        onClick={() => setExpanded(!expanded)}
        className="mb-4 flex items-center space-x-4 text-gray-300 hover:text-white w-full p-3 rounded-lg transition hover:bg-gray-700"
      >
        <Menu size={24} />
        {expanded && <span className="text-lg">Menu</span>}
      </button>
      <nav className="space-y-2 w-full">
        {menuItems.map(({ name, icon: Icon, path }) => (
          <motion.div
            key={name}
            whileHover={{ scale: 1.05 }}
            className={cn(
              "flex items-center space-x-4 p-3 rounded-lg transition w-full cursor-pointer",
              "hover:bg-gray-700"
            )}
            onClick={() => router.push(path)}
          >
            <Icon size={24} />
            {expanded && <span className="text-lg">{name}</span>}
          </motion.div>
        ))}
      </nav>
    </motion.div>
  );
}
