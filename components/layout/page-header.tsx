"use client";
import { motion } from "framer-motion";

export default function PageHeader({ heading }: { heading: string }) {
  return (
    <motion.div
      initial={{ opacity: 0.5, x: 25 }}
      whileInView={{ opacity: 1, x: 0 }}
      viewport={{ once: true }}
      transition={{
        delay: 0.1,
        duration: 0.4,
        ease: "easeInOut",
      }}
    >
      <h1 className="text-5xl font-neuemedium leading-relaxed text-stone-700 dark:text-white">
        {heading}
      </h1>
      <div className="mt-6 mb-12 w-36 border border-t-stone-500/10 dark:border-darkborder/30"></div>
    </motion.div>
  );
}
