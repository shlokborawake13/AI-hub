"use client";

import React from "react";
import { useInView } from "react-intersection-observer";
import CountUp from "react-countup";
import { motion } from "framer-motion";
import { stats } from "@/lib/data";

export default function StatsSection() {
  const { ref, inView } = useInView({ triggerOnce: true, threshold: 0.2 });

  return (
    <section ref={ref} className="py-16 bg-[#053869] relative overflow-hidden">
      {/* Shimmer overlay */}
      <div className="absolute inset-0 shimmer pointer-events-none" />

      <div className="container-custom relative z-10">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
          {stats.map(({ value, label, suffix }, index) => (
            <motion.div
              key={label}
              initial={{ opacity: 0, y: 20 }}
              animate={inView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              className="text-center"
            >
              <div className="text-4xl sm:text-5xl font-black text-[#FFBF00] mb-2">
                {inView ? (
                  <CountUp end={value} duration={2.5} suffix={suffix} />
                ) : (
                  `0${suffix}`
                )}
              </div>
              <p className="text-sm font-medium text-white/60 uppercase tracking-wider">
                {label}
              </p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
