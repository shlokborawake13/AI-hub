"use client";

import React from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { useInView } from "react-intersection-observer";
import { Lightbulb, Users, BookOpen, ArrowRight } from "lucide-react";
import SectionHeader from "@/components/ui/SectionHeader";

const pillars = [
  {
    icon: Lightbulb,
    title: "Innovate",
    description: "Tackle real-world problems with AI. From idea to prototype, we support you every step of the way.",
    color: "text-[#FFBF00]",
    bg: "bg-[#FFBF00]/10",
  },
  {
    icon: Users,
    title: "Collaborate",
    description: "Work alongside talented peers, faculty advisors, and industry mentors on high-impact projects.",
    color: "text-[#3053D3]",
    bg: "bg-[#3053D3]/10",
  },
  {
    icon: BookOpen,
    title: "Research",
    description: "Contribute to cutting-edge AI research, publish papers, and represent Sanjivani on the global stage.",
    color: "text-[#00D4FF]",
    bg: "bg-[#00D4FF]/10",
  },
];

export default function AboutSection() {
  const { ref, inView } = useInView({ triggerOnce: true, threshold: 0.15 });

  return (
    <section className="section-padding bg-[#F1F1F1]" ref={ref}>
      <div className="container-custom">
        <div className="grid lg:grid-cols-2 gap-16 items-center">
          {/* Left: Text */}
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            animate={inView ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 0.7 }}
          >
            <SectionHeader
              label="About AI Hub"
              title="Where AI Innovation "
              highlight="Begins"
              subtitle="Sanjivani AI Hub is the official AI innovation and research ecosystem of Sanjivani University — a space where ideas become intelligent solutions."
              align="left"
            />
            <p className="text-[#909090] text-sm leading-relaxed mb-8">
              Founded to bridge the gap between academic learning and real-world AI application, our hub brings together students, researchers, and faculty to build AI solutions that matter. From award-winning projects to published research, we are shaping the next generation of AI leaders.
            </p>
            <Link
              href="/about"
              className="inline-flex items-center gap-2 text-[#053869] font-semibold text-sm hover:text-[#3053D3] transition-colors group"
            >
              Learn More About Us
              <ArrowRight size={16} className="group-hover:translate-x-1 transition-transform" />
            </Link>
          </motion.div>

          {/* Right: Pillar cards */}
          <div className="flex flex-col gap-4">
            {pillars.map(({ icon: Icon, title, description, color, bg }, index) => (
              <motion.div
                key={title}
                initial={{ opacity: 0, x: 30 }}
                animate={inView ? { opacity: 1, x: 0 } : {}}
                transition={{ duration: 0.5, delay: index * 0.12 }}
                className="flex items-start gap-4 bg-white rounded-2xl p-5 shadow-sm hover:shadow-md transition-shadow border border-gray-100"
              >
                <div className={`w-11 h-11 rounded-xl ${bg} flex items-center justify-center shrink-0`}>
                  <Icon size={22} className={color} />
                </div>
                <div>
                  <h3 className="font-bold text-[#053869] text-base mb-1">{title}</h3>
                  <p className="text-sm text-[#909090] leading-relaxed">{description}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
