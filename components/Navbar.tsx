"use client";

import { motion } from "framer-motion";
import Image from "next/image";

export default function Navbar() {
  return (
    <motion.nav
      initial={{ y: -20, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.4, ease: "easeOut" }}
      className="
        fixed top-[16px] left-[50%] -translate-x-[50%]
        w-[92%] max-w-[1024px]
        px-[20px]
        py-[10px]
        flex items-center justify-between
        rounded-[20px]
        backdrop-blur-[20px]
        bg-[rgba(255,255,255,0.5)]
        border border-[rgba(255,255,255,0.4)]
        shadow-[0_8px_30px_rgba(0,0,0,0.12)]
        z-[50]
      "
      style={{
        background:
          "linear-gradient(135deg, rgba(255,255,255,0.55), rgba(240,240,255,0.45))",
      }}
    >
      {/* Logo */}
      <div className="flex px-[5px] py-[2px] bg-[#fff] rounded-[10px] items-center">
        <Image
          src="/logo-samsara.png"
          alt="Logo"
          width={40}
          height={40}
          className="rounded-[10px]"
        />
        <span className="text-[13px] font-[Stack Sans Notch] font-[700] text-[rgb(30,41,59)] tracking-[0.02em]">
          SAMSARA
        </span>
      </div>

      {/* Create Account Button */}
      <motion.button
        whileTap={{ scale: 0.92 }}
        className="
          h-[42px]
          px-[8px]
          flex items-center
          rounded-[50px]
          bg-[rgba(255,255,255,0.65)]
          border-[3px] border-[#c9a238]
          shadow-[0_4px_14px_rgba(0,0,0,0.12)]
          text-[14px] font-[500]
          text-[#1e293bff]
        "
      >
        {/* User Plus SVG */}
        <svg
          xmlns="http://www.w3.org/2000/svg"
          height="24px"
          viewBox="0 -960 960 960"
          fill="rgb(30,41,59)"
          className="w-[20px] h-[20px]"
        >
          <path d="M720-400v-120H600v-80h120v-120h80v120h120v80H800v120h-80Zm-360-80q-66 0-113-47t-47-113q0-66 47-113t113-47q66 0 113 47t47 113q0 66-47 113t-113 47ZM40-160v-112q0-34 17.5-62.5T104-378q62-31 126-46.5T360-440q66 0 130 15.5T616-378q29 15 46.5 43.5T680-272v112H40Zm80-80h480v-32q0-11-5.5-20T580-306q-54-27-109-40.5T360-360q-56 0-111 13.5T140-306q-9 5-14.5 14t-5.5 20v32Zm240-320q33 0 56.5-23.5T440-640q0-33-23.5-56.5T360-720q-33 0-56.5 23.5T280-640q0 33 23.5 56.5T360-560Zm0-80Zm0 400Z" />
        </svg>
      </motion.button>
    </motion.nav>
  );
}
