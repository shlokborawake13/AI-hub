"use client";

import React, { useCallback } from "react";
import Link from "next/link";
import { ChevronRight, ArrowDown, Sparkles } from "lucide-react";
import { motion } from "framer-motion";
import Particles from "@tsparticles/react";
import { loadSlim } from "@tsparticles/slim";

export default function HeroSection() {
  const particlesLoaded = useCallback(async () => {}, []);

  // loadSlim must be called to register the engine
  const particlesInit = useCallback(async (engine: Parameters<typeof loadSlim>[0]) => {
    await loadSlim(engine);
  }, []);

  return (
    <section className="relative min-h-screen flex items-center overflow-hidden bg-[#053869]">
      {/* Particles background */}
      <Particles
        id="hero-particles"
        className="absolute inset-0 z-0"
        options={{
          fullScreen: { enable: false },
          background: { color: { value: "transparent" } },
          particles: {
            number: { value: 55, density: { enable: true } },
            color: { value: ["#FFBF00", "#00D4FF", "#3053D3", "#ffffff"] },
            opacity: { value: { min: 0.08, max: 0.35 } },
            size: { value: { min: 1, max: 2.5 } },
            links: {
              enable: true,
              color: "#FFFFFF",
              opacity: 0.06,
              distance: 140,
            },
            move: {
              enable: true,
              speed: 0.7,
              outModes: { default: "bounce" },
            },
          },
          interactivity: {
            events: { onHover: { enable: true, mode: "grab" } },
            modes: { grab: { distance: 180, links: { opacity: 0.25 } } },
          },
        }}
      />

      {/* Gradient overlay */}
      <div className="absolute inset-0 z-0 bg-gradient-to-br from-[#053869] via-[#00155e] to-[#1E0A3C] opacity-92" />

      {/* Glow orbs */}
      <div className="absolute top-24 right-8 w-72 h-72 rounded-full bg-[#FFBF00]/5 blur-3xl pointer-events-none" />
      <div className="absolute bottom-32 left-8 w-56 h-56 rounded-full bg-[#3053D3]/10 blur-3xl pointer-events-none" />

      {/* Content */}
      <div className="container-custom relative z-10 pt-28 pb-20 sm:pt-32 sm:pb-24">
        <div className="max-w-4xl mx-auto text-center">

          {/* Eyebrow badge */}
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="inline-flex items-center gap-2 bg-white/10 backdrop-blur-sm border border-white/20 rounded-full px-4 py-1.5 mb-7"
          >
            <Sparkles size={13} className="text-[#FFBF00]" />
            <span className="text-white/80 text-xs sm:text-sm font-medium">
              Sanjivani University — AI Innovation Hub
            </span>
            <span className="w-1.5 h-1.5 rounded-full bg-[#FFBF00] pulse-glow shrink-0" />
          </motion.div>

          {/* Headline */}
          <motion.h1
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.2 }}
            className="text-4xl sm:text-5xl lg:text-6xl xl:text-7xl font-black text-white leading-[1.1] mb-5"
          >
            Building the{" "}
            <span className="gradient-text">Future</span>
            <br className="hidden sm:block" />
            {" "}with{" "}
            <span className="gradient-text">Artificial Intelligence</span>
          </motion.h1>

          {/* Sub-headline */}
          <motion.p
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.35 }}
            className="text-base sm:text-lg text-white/65 max-w-2xl mx-auto mb-9 leading-relaxed px-4 sm:px-0"
          >
            A community of students, researchers, and innovators shaping
            tomorrow&apos;s AI landscape — collaborating, innovating, and making
            impact from Sanjivani University.
          </motion.p>

          {/* CTA Buttons */}
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.5 }}
            className="flex flex-col sm:flex-row items-center justify-center gap-3 mb-14"
          >
            <Link
              href="/projects"
              className="group inline-flex items-center gap-2 bg-[#FFBF00] text-[#053869] font-bold px-7 py-3.5 rounded-xl hover:bg-[#FDBD0F] transition-all duration-200 hover:shadow-xl hover:shadow-[#FFBF00]/25 text-sm sm:text-base w-full sm:w-auto justify-center"
            >
              Explore Projects
              <ChevronRight size={17} className="group-hover:translate-x-1 transition-transform" />
            </Link>
            <Link
              href="/join"
              className="inline-flex items-center gap-2 text-white font-semibold px-7 py-3.5 rounded-xl border-2 border-white/30 hover:bg-white/10 hover:border-white/60 transition-all duration-200 text-sm sm:text-base w-full sm:w-auto justify-center"
            >
              Join the Community
            </Link>
          </motion.div>

          {/* Stats strip */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.8, delay: 0.7 }}
            className="grid grid-cols-4 gap-4 max-w-lg mx-auto"
          >
            {[
              { val: "50+", label: "Projects" },
              { val: "200+", label: "Members" },
              { val: "30+", label: "Events" },
              { val: "10+", label: "Papers" },
            ].map(({ val, label }) => (
              <div key={label} className="text-center">
                <div className="text-xl sm:text-2xl font-black text-[#FFBF00]">{val}</div>
                <div className="text-[10px] sm:text-xs text-white/50 font-medium uppercase tracking-wider mt-0.5">
                  {label}
                </div>
              </div>
            ))}
          </motion.div>
        </div>
      </div>

      {/* Scroll cue */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.4, duration: 0.6 }}
        className="absolute bottom-7 left-1/2 -translate-x-1/2 z-20 flex flex-col items-center gap-1 text-white/30"
      >
        <span className="text-[9px] uppercase tracking-widest font-medium">Scroll</span>
        <motion.div
          animate={{ y: [0, 5, 0] }}
          transition={{ repeat: Infinity, duration: 1.6, ease: "easeInOut" }}
        >
          <ArrowDown size={14} />
        </motion.div>
      </motion.div>
    </section>
  );
}
