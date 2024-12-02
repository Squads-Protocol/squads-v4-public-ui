"use client";
import { motion } from "framer-motion";
import { usePathname } from "next/navigation";

interface SectionHeaderProps {
  title: string;
  description: string;
}

export default function SectionHeader({
  title,
  description,
}: SectionHeaderProps) {
  const pathname = usePathname();
  const image = routeToBg(pathname);

  return (
    <div className="bg-white flex flex-col gap-2 flex-1 w-full h-full">
      <div className="p-2 md:p-10 w-full h-full bg-no-repeat bg-center bg-cover"
        style={{ backgroundImage: image ? image : "/assets/sqds-cover.png" }}
      >
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

const routeToBg = (path: string) => {
  switch (true) {
    case path == "/":
      return "url(/assets/sqds-cover.png)"

    case path.includes("/transactions"):
      return "url(/assets/sqds-swish-2.png)"

    case path == "/developers":
      return "url(/assets/sqds-resources.png)"

    case path == "/settings":
      return "url(/assets/sqds-cover.png)"

    case path == "/config":
      return "url(/assets/sqds-grid.png)"
  }
}
