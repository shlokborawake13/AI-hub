"use client";

import React from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { useInView } from "react-intersection-observer";
import { ArrowRight } from "lucide-react";
import SectionHeader from "@/components/ui/SectionHeader";
import ProjectCard from "@/components/ui/ProjectCard";
import { featuredProjects } from "@/lib/data";

export default function FeaturedProjectsSection() {
  const { ref, inView } = useInView({ triggerOnce: true, threshold: 0.1 });

  return (
    <section className="section-padding bg-white" ref={ref}>
      <div className="container-custom">
        <div className="flex items-end justify-between mb-12 flex-wrap gap-4">
          <SectionHeader
            label="Featured Projects"
            title="AI Solutions Built by "
            highlight="Our Students"
            subtitle="From crop disease detection to conversational AI — see the real-world impact our members are creating."
            align="left"
            className="mb-0"
          />
          <Link
            href="/projects"
            className="flex items-center gap-2 text-[#3053D3] font-semibold text-sm hover:text-[#053869] transition-colors group shrink-0"
          >
            See All Projects
            <ArrowRight size={16} className="group-hover:translate-x-1 transition-transform" />
          </Link>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {featuredProjects.map((project, index) => (
            <motion.div
              key={project.id}
              initial={{ opacity: 0, y: 24 }}
              animate={inView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.5, delay: index * 0.1 }}
            >
              <ProjectCard project={project} />
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
