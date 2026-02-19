"use client";

import { motion } from "framer-motion";

interface CursorProps {
  position: { x: number; y: number };
  visible: boolean;
}

export const Cursor = ({ position, visible }: CursorProps) => {
  if (!visible) return null;

  return (
    <motion.div
      className="pointer-events-none fixed z-50"
      animate={{ x: position.x, y: position.y }}
      transition={{ type: "spring", stiffness: 100, damping: 20 }}
    >
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
        <path
          d="M5.5 3.21V20.8c0 .45.54.67.85.35l4.86-4.86a.5.5 0 0 1 .35-.15h6.87c.48 0 .72-.58.38-.92L6.35 2.85a.5.5 0 0 0-.85.36Z"
          fill="#000"
          stroke="#fff"
          strokeWidth="1.5"
        />
      </svg>
    </motion.div>
  );
};
