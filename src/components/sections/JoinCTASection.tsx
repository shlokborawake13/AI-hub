"use client";

import React from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { useInView } from "react-intersection-observer";
import { ChevronRight, Users } from "lucide-react";

export default function JoinCTASection() {
  const { ref, inView } = useInView({ triggerOnce: true, threshold: 0.2 });

  return (
    <section className="section-padding bg-white" ref={ref}>
      <div className="container-custom">
        <motion.div
          initial={{ opacity: 0, scale: 0.97 }}
          animate={inView ? { opacity: 1, scale: 1 } : {}}
          transition={{ duration: 0.6 }}
          className="relative overflow-hidden rounded-3xl gradient-navy p-12 sm:p-16 text-center noise"
        >
          {/* Glowing orbs */}
          <div className="absolute top-0 left-1/4 w-64 h-64 bg-[#FFBF00]/10 rounded-full blur-3xl pointer-events-none" />
          <div className="absolute bottom-0 right-1/4 w-48 h-48 bg-[#3053D3]/20 rounded-full blur-3xl pointer-events-none" />

          <div className="relative z-10">
            {/* Icon */}
            <div className="w-16 h-16 rounded-2xl bg-[#FFBF00]/15 border border-[#FFBF00]/30 flex items-center justify-center mx-auto mb-6 float">
              <Users size={32} className="text-[#FFBF00]" />
            </div>

            <h2 className="text-3xl sm:text-4xl font-black text-white mb-4">
              Ready to Build the Future?
            </h2>
            <p className="text-white/65 text-lg max-w-xl mx-auto mb-10">
              Join 200+ students and researchers in Sanjivani&apos;s AI Hub community. Collaborate on projects, attend workshops, and shape the future of AI.
            </p>

            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <Link
                href="/join"
                className="group flex items-center gap-2 bg-[#FFBF00] text-[#053869] font-bold px-8 py-4 rounded-xl hover:bg-[#FDBD0F] transition-all duration-200 hover:shadow-2xl hover:shadow-[#FFBF00]/30 text-base pulse-glow"
              >
                Apply for Membership
                <ChevronRight size={18} className="group-hover:translate-x-1 transition-transform" />
              </Link>
              <Link
                href="/about"
                className="flex items-center gap-2 bg-white/10 text-white font-semibold px-8 py-4 rounded-xl border border-white/20 hover:bg-white/20 transition-all duration-200 text-base"
              >
                Learn More
              </Link>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
