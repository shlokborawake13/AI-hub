import type { Metadata } from "next";
import HeroSection from "@/components/sections/HeroSection";
import StatsSection from "@/components/sections/StatsSection";
import AboutSection from "@/components/sections/AboutSection";
import FeaturedProjectsSection from "@/components/sections/FeaturedProjectsSection";
import EventsSection from "@/components/sections/EventsSection";
import ResourcesSection from "@/components/sections/ResourcesSection";
import BlogSection from "@/components/sections/BlogSection";
import TestimonialsSection from "@/components/sections/TestimonialsSection";
import JoinCTASection from "@/components/sections/JoinCTASection";

export const metadata: Metadata = {
  title: "Sanjivani AI Hub — AI Innovation & Research Ecosystem",
  description:
    "Sanjivani AI Hub is Sanjivani University's official AI innovation and research community. Explore student AI/ML projects, research papers, workshops, and join a thriving community of innovators.",
};

export default function HomePage() {
  return (
    <>
      <HeroSection />
      <StatsSection />
      <AboutSection />
      <FeaturedProjectsSection />
      <EventsSection />
      <ResourcesSection />
      <BlogSection />
      <TestimonialsSection />
      <JoinCTASection />
    </>
  );
}


