"use client";

import { motion } from "framer-motion";

type CartScrimProps = {
  onClick: () => void;
};

export default function CartScrim({ onClick }: CartScrimProps) {
  return (
    <motion.div
      className="shm-scrim is-open"
      onClick={onClick}
      aria-hidden="true"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.22, ease: [0.2, 0.8, 0.2, 1] }}
    />
  );
}
