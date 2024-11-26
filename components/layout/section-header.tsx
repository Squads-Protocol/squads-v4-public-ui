"use client";
import { motion } from "framer-motion";

interface SectionHeaderProps {
  title: string;
  description: string;
}

export default function SectionHeader({
  title,
  description,
}: SectionHeaderProps) {
  return (
    <div className="bg-white flex flex-col gap-2 flex-1 w-full h-full">
      <div className="p-2 md:p-10 w-full h-full bg-[url('/sqds-cover.png')] bg-no-repeat bg-center bg-cover">
        <motion.h1
          initial={{ opacity: 0.5, x: 50 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true }}
          transition={{
            delay: 0.3,
            duration: 0.8,
            ease: "easeInOut",
          }}
          className="pl-1 text-5xl font-neuemedium text-transparent bg-clip-text bg-gradient-to-br from-neutral-600 to-neutral-400 leading-relaxed"
        >
          {title}
        </motion.h1>
        <motion.p
          initial={{ opacity: 0.5, x: 50 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true }}
          transition={{
            delay: 0.3,
            duration: 0.8,
            ease: "easeInOut",
          }}
          className="pl-1 font-neue text-neutral-500"
        >
          {description}
        </motion.p>
      </div>
    </div>
  );
}
