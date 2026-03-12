"use client";

import React from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { useInView } from "react-intersection-observer";
import { BookOpen, Database, Youtube, Wrench, ArrowRight } from "lucide-react";
import SectionHeader from "@/components/ui/SectionHeader";

const resourceCategories = [
  {
    icon: BookOpen,
    title: "Learning Roadmaps",
    description: "Step-by-step paths from Python basics to advanced AI systems — curated by our mentors.",
    color: "text-[#FFBF00]",
    bg: "from-[#FFBF00]/10 to-[#FFBF00]/5",
    href: "/resources",
  },
  {
    icon: Database,
    title: "Datasets Library",
    description: "Curated collection of open datasets across agriculture, health, finance, and social media.",
    color: "text-[#3053D3]",
    bg: "from-[#3053D3]/10 to-[#3053D3]/5",
    href: "/resources",
  },
  {
    icon: Youtube,
    title: "Video Tutorials",
    description: "Hand-picked YouTube playlists and recorded workshop sessions from AI Hub events.",
    color: "text-[#EF4444]",
    bg: "from-red-500/10 to-red-500/5",
    href: "/resources",
  },
  {
    icon: Wrench,
    title: "AI Tools & Frameworks",
    description: "From TensorFlow to LangChain — the essential toolkit every AI practitioner should know.",
    color: "text-[#00D4FF]",
    bg: "from-[#00D4FF]/10 to-[#00D4FF]/5",
    href: "/resources",
  },
];

export default function ResourcesSection() {
  const { ref, inView } = useInView({ triggerOnce: true, threshold: 0.15 });

  return (
    <section className="section-padding bg-white" ref={ref}>
      <div className="container-custom">
        <SectionHeader
          label="AI Resources"
          title="Everything You Need to "
          highlight="Learn AI"
          subtitle="Access curated learning materials, datasets, tools, and tutorials — all in one place, free for the community."
        />

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
          {resourceCategories.map(({ icon: Icon, title, description, color, bg, href }, index) => (
            <motion.div
              key={title}
              initial={{ opacity: 0, y: 24 }}
              animate={inView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.5, delay: index * 0.1 }}
            >
              <Link
                href={href}
                className={`group block h-full bg-gradient-to-br ${bg} rounded-2xl p-6 border border-gray-100 hover:border-[#FFBF00]/30 card-glow transition-all duration-300`}
              >
                <div className={`w-12 h-12 rounded-xl bg-white shadow-sm flex items-center justify-center mb-4 group-hover:scale-110 transition-transform`}>
                  <Icon size={24} className={color} />
                </div>
                <h3 className="font-bold text-[#053869] text-base mb-2">{title}</h3>
                <p className="text-sm text-[#909090] leading-relaxed mb-4">{description}</p>
                <div className={`flex items-center gap-1 text-sm font-semibold ${color}`}>
                  Explore <ArrowRight size={14} className="group-hover:translate-x-1 transition-transform" />
                </div>
              </Link>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
