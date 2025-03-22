"use client";
import { useState } from "react";
import { motion } from "framer-motion";
import { Menu, X, Home, Settings, Trophy, Crosshair, Flag } from "lucide-react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/app/config/amplify/AuthProvider";


const menuItems = [
  { name: "Home", icon: Home, path: "/home" },
  { name: "Problems", icon: Crosshair, path: "/problems" },
  { name: "Contests", icon: Flag, path: "/contests" },
  { name: "Ranking", icon: Trophy, path: "/ranking" },
  { name: "Settings", icon: Settings, path: "/settings" },
];

export default function Sidebar() {
  const { isLogin } = useAuth();
  const [isOpen, setIsOpen] = useState(false);
  const router = useRouter();
  if (!isLogin) return null;
  return (
    <>
      {/* Menuボタン */}
      <button
        onClick={() => setIsOpen(true)}
        className="rounded-lg transition hover:cursor-pointer"
      >
        <Menu size={24} />
      </button>

      <motion.div
        initial={{ x: "-100%" }}
        animate={{ x: isOpen ? "0%" : "-100%" }}
        transition={{ type: "tween", duration: 0.3 }}
        className="fixed top-0 left-0 w-72 h-full bg-[#252525] text-white shadow-lg p-6 flex flex-col z-1"
      >
        {/* 閉じるボタン */}
        <button onClick={() => setIsOpen(false)} className="absolute top-4 right-6 text-gray-400 hover:text-white">
          <X size={24} />
        </button>

        {/* <h2 className="text-xl font-bold mb-6">メニュー</h2> */}

        {/* メニューリスト */}
        <nav className="space-y-4 bt-6">
          {/* <button className="flex items-center space-x-3 w-full p-3 rounded-lg hover:bg-primary transition">
          <span className="font-bold bg-gradient-to-r from-purple-400 to-blue-500 bg-clip-text text-transparent">{username}</span>
          </button> */}
          {menuItems.map(({ name, icon: Icon, path }) => (
            <button
              key={name}
              onClick={() => {
                router.push(path);
                setIsOpen(false);
              }}
              className="group flex items-center space-x-3 w-5/6 p-3 hover:bg-primary rounded-lg  transition"
            >
            <Icon size={24} />

              <span className="transition-all bg-gradient-to-r bg-clip-text from-white to-white text-transparent group-hover:from-purple-400 group-hover:to-blue-500">{name}</span>
              {/* <span>{name}</span> */}
            </button>
          ))}
        </nav>
      </motion.div>
    </>
  );
}
