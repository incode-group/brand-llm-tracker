"use client";

import { motion } from "framer-motion";
import { ReactNode } from "react";

interface LuxuryButtonProps {
  children: ReactNode;
  onClick?: () => void;
  className?: string;
}

export default function LuxuryButton({
  children,
  onClick,
  className = "",
}: LuxuryButtonProps) {
  return (
    <motion.button
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.95 }}
      onClick={onClick}
      className={`relative px-8 py-3 bg-white/5 backdrop-blur-md border border-white/10 rounded-full text-white font-medium tracking-wide transition-all duration-300 hover:bg-violet-glow/20 hover:border-violet-glow/50 hover:shadow-[0_0_20px_-5px_var(--violet-glow)] ${className}`}
    >
      <span className="relative z-10">{children}</span>
    </motion.button>
  );
}
