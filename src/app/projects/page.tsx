"use client";

import React, { useState } from "react";
import SectionHeader from "@/components/ui/SectionHeader";
import ProjectCard from "@/components/ui/ProjectCard";
import Badge from "@/components/ui/Badge";
import { featuredProjects } from "@/lib/data";
import { Search } from "lucide-react";

const domains = ["All", "NLP", "Computer Vision", "Machine Learning", "Deep Learning", "GenAI", "Robotics"];

export default function ProjectsPage() {
  const [activeDomain, setActiveDomain] = useState("All");
  const [query, setQuery] = useState("");

  const filtered = featuredProjects.filter((p) => {
    const matchDomain = activeDomain === "All" || p.domain === activeDomain;
    const matchQuery = p.title.toLowerCase().includes(query.toLowerCase()) ||
      p.description.toLowerCase().includes(query.toLowerCase());
    return matchDomain && matchQuery;
  });

  return (
    <div className="">
      {/* Hero */}
      <section className="gradient-navy pt-12 pb-16 sm:pt-16 sm:pb-20 relative overflow-hidden">
        <div className="absolute inset-0 shimmer pointer-events-none" />
        <div className="container-custom relative z-10 text-center">
          <Badge variant="gold" className="mb-4">All Projects</Badge>
          <h1 className="text-4xl sm:text-5xl font-black text-white mb-4">
            Student AI <span className="gradient-text">Projects</span>
          </h1>
          <p className="text-white/60 text-base sm:text-lg max-w-xl mx-auto">
            Explore 50+ real-world AI and machine learning projects built by Sanjivani University students.
          </p>
        </div>
      </section>

      {/* Filters */}
      <div className="bg-white sticky top-[68px] z-30 border-b border-gray-100 shadow-sm">
        <div className="container-custom py-3">
          <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
            {/* Search */}
            <div className="relative w-full sm:w-64 shrink-0">
              <Search size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-[#909090]" />
              <input
                type="text"
                placeholder="Search projects..."
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                className="w-full pl-9 pr-4 py-2.5 rounded-xl border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-[#FFBF00]/50 focus:border-[#FFBF00] bg-[#F9F9F9]"
              />
            </div>

            {/* Domain pills — horizontally scrollable on all sizes */}
            <div className="relative flex-1 min-w-0">
              <div className="flex gap-2 overflow-x-auto pb-0.5 scrollbar-none">
                {domains.map((d) => (
                  <button
                    key={d}
                    onClick={() => setActiveDomain(d)}
                    className={`px-4 py-2 rounded-lg text-xs font-semibold transition-all duration-200 whitespace-nowrap shrink-0 ${
                      activeDomain === d
                        ? "bg-[#053869] text-white shadow-md"
                        : "bg-[#F1F1F1] text-[#555] hover:bg-[#053869]/10 hover:text-[#053869]"
                    }`}
                  >
                    {d}
                  </button>
                ))}
              </div>
              {/* fade edge hint for overflow */}
              <div className="pointer-events-none absolute right-0 top-0 bottom-0.5 w-8 bg-gradient-to-l from-white to-transparent" />
            </div>
          </div>
        </div>
      </div>


      {/* Grid */}
      <section className="section-padding bg-[#F1F1F1]">
        <div className="container-custom">
          {filtered.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {filtered.map((project) => (
                <ProjectCard key={project.id} project={project} />
              ))}
            </div>
          ) : (
            <div className="text-center py-20 text-[#909090]">
              <p className="text-lg font-semibold mb-2">No projects found</p>
              <p className="text-sm">Try adjusting your search or filter.</p>
            </div>
          )}
        </div>
      </section>
    </div>
  );
}


