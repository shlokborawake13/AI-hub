"use client";

import React from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { useInView } from "react-intersection-observer";
import { ArrowRight } from "lucide-react";
import SectionHeader from "@/components/ui/SectionHeader";
import BlogCard from "@/components/ui/BlogCard";
import { blogPosts } from "@/lib/data";

export default function BlogSection() {
  const { ref, inView } = useInView({ triggerOnce: true, threshold: 0.1 });

  return (
    <section className="section-padding bg-[#F1F1F1]" ref={ref}>
      <div className="container-custom">
        <div className="flex items-end justify-between mb-12 flex-wrap gap-4">
          <SectionHeader
            label="Latest Insights"
            title="From the "
            highlight="AI Hub Blog"
            subtitle="Technical deep-dives, project stories, event recaps, and AI news from our community writers."
            align="left"
            className="mb-0"
          />
          <Link
            href="/blog"
            className="flex items-center gap-2 text-[#3053D3] font-semibold text-sm hover:text-[#053869] transition-colors group shrink-0"
          >
            Read the Blog
            <ArrowRight size={16} className="group-hover:translate-x-1 transition-transform" />
          </Link>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {blogPosts.map((post, index) => (
            <motion.div
              key={post.id}
              initial={{ opacity: 0, y: 24 }}
              animate={inView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.5, delay: index * 0.12 }}
            >
              <BlogCard post={post} />
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
