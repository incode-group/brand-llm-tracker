"use client";

import { motion } from "framer-motion";
import { ReactNode } from "react";

interface FadeSectionProps {
  children: ReactNode;
  className?: string;
  delay?: number;
}

export default function FadeSection({
  children,
  className = "",
  delay = 0,
}: FadeSectionProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 30, filter: "blur(10px)" }}
      whileInView={{ opacity: 1, y: 0, filter: "blur(0px)" }}
      viewport={{ once: true, margin: "-100px" }}
      transition={{
        duration: 0.8,
        delay: delay,
        ease: [0.4, 0, 0.2, 1],
      }}
      className={className}
    >
      {children}
    </motion.div>
  );
}
