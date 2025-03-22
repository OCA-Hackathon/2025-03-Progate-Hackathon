"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { Menu, X } from "lucide-react";
import { useAuth } from "@/app/config/amplify/AuthProvider";
import SidebarMenu from "@/feature/header/components/navigation/SidebarMenu";

export default function Sidebar() {
  const { isLogin } = useAuth();
  const [isOpen, setIsOpen] = useState(false);
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
          <SidebarMenu setIsOpen={setIsOpen}/>
        </nav>
      </motion.div>
    </>
  );
}
