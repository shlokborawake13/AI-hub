"use client";

import React, { useState, useEffect, useCallback } from "react";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";
import { useInView } from "react-intersection-observer";
import { Quote, ChevronLeft, ChevronRight } from "lucide-react";
import SectionHeader from "@/components/ui/SectionHeader";
import { testimonials } from "@/lib/data";

export default function TestimonialsSection() {
  const [current, setCurrent] = useState(0);
  const [autoplay, setAutoplay] = useState(true);
  const { ref, inView } = useInView({ triggerOnce: true, threshold: 0.1 });

  const next = useCallback(() => {
    setCurrent((c) => (c + 1) % testimonials.length);
  }, []);

  const prev = () => setCurrent((c) => (c - 1 + testimonials.length) % testimonials.length);

  useEffect(() => {
    if (!autoplay) return;
    const interval = setInterval(next, 5000);
    return () => clearInterval(interval);
  }, [autoplay, next]);

  return (
    <section className="section-padding bg-[#053869] relative overflow-hidden" ref={ref}>
      {/* Background decorations */}
      <div className="absolute top-0 right-0 w-96 h-96 bg-[#FFBF00]/5 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-0 left-0 w-64 h-64 bg-[#3053D3]/10 rounded-full blur-3xl pointer-events-none" />

      <div className="container-custom relative z-10">
        <SectionHeader
          label="Testimonials"
          title="Voices from Our "
          highlight="Community"
          subtitle="Hear from the students, alumni, and researchers who've been part of the AI Hub journey."
          dark
        />

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.7 }}
          className="max-w-3xl mx-auto"
          onMouseEnter={() => setAutoplay(false)}
          onMouseLeave={() => setAutoplay(true)}
        >
          {/* Quote card */}
          <AnimatePresence mode="wait">
            <motion.div
              key={current}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.4 }}
              className="glass rounded-3xl p-8 sm:p-12 text-center mb-8"
            >
              <Quote size={36} className="text-[#FFBF00]/50 mx-auto mb-6" />
              <p className="text-white/85 text-lg sm:text-xl leading-relaxed italic mb-8">
                &ldquo;{testimonials[current].quote}&rdquo;
              </p>
              <div className="flex items-center justify-center gap-3">
                <div className="relative w-12 h-12 rounded-full overflow-hidden border-2 border-[#FFBF00]/50">
                  <Image
                    src={testimonials[current].avatar_url}
                    alt={testimonials[current].name}
                    fill
                    className="object-cover"
                  />
                </div>
                <div className="text-left">
                  <div className="font-bold text-white text-sm">{testimonials[current].name}</div>
                  <div className="text-white/50 text-xs">{testimonials[current].role}</div>
                </div>
              </div>
            </motion.div>
          </AnimatePresence>

          {/* Controls */}
          <div className="flex items-center justify-center gap-4">
            <button
              onClick={prev}
              className="w-10 h-10 rounded-full bg-white/10 hover:bg-[#FFBF00] hover:text-[#053869] text-white flex items-center justify-center transition-all duration-200"
              aria-label="Previous"
            >
              <ChevronLeft size={18} />
            </button>
            <div className="flex gap-1.5">
              {testimonials.map((_, i) => (
                <button
                  key={i}
                  onClick={() => setCurrent(i)}
                  className={`h-1.5 rounded-full transition-all duration-300 ${
                    i === current ? "w-6 bg-[#FFBF00]" : "w-1.5 bg-white/30"
                  }`}
                  aria-label={`Testimonial ${i + 1}`}
                />
              ))}
            </div>
            <button
              onClick={next}
              className="w-10 h-10 rounded-full bg-white/10 hover:bg-[#FFBF00] hover:text-[#053869] text-white flex items-center justify-center transition-all duration-200"
              aria-label="Next"
            >
              <ChevronRight size={18} />
            </button>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
