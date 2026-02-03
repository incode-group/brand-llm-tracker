"use client";

import { motion } from "framer-motion";
import { ReactNode } from "react";

interface GlassCardProps {
  children: ReactNode;
  className?: string;
}

export default function GlassCard({ children, className = "" }: GlassCardProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.6, ease: [0.4, 0, 0.2, 1] }}
      whileHover={{ y: -5, boxShadow: "0 10px 40px -10px rgba(139, 92, 246, 0.15)" }}
      className={`relative bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl p-6 transition-colors duration-300 hover:border-white/20 hover:bg-white/[0.07] ${className}`}
    >
      {children}
    </motion.div>
  );
}
