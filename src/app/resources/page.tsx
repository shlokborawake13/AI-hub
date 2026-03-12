import type { Metadata } from "next";
import Link from "next/link";
import { BookOpen, Database, Youtube, Wrench, ExternalLink } from "lucide-react";
import SectionHeader from "@/components/ui/SectionHeader";
import Badge from "@/components/ui/Badge";
import { resources } from "@/lib/data";

export const metadata: Metadata = {
  title: "Resources",
  description: "Curated AI learning resources, datasets, tools, and tutorials for Sanjivani AI Hub members.",
};

const categoryIcons: Record<string, React.ElementType> = {
  Roadmap: BookOpen,
  Dataset: Database,
  Course: Youtube,
  Tool: Wrench,
};

export default function ResourcesPage() {
  return (
    <div className="">
      {/* Hero */}
      <section className="gradient-navy pt-12 pb-16 sm:pt-16 sm:pb-20 relative overflow-hidden">
        <div className="absolute inset-0 shimmer pointer-events-none" />
        <div className="container-custom relative z-10 text-center">
          <Badge variant="gold" className="mb-4">Resources</Badge>
          <h1 className="text-4xl sm:text-5xl font-black text-white mb-4">
            Your AI <span className="gradient-text">Toolkit</span>
          </h1>
          <p className="text-white/60 text-lg max-w-xl mx-auto">
            Curated roadmaps, datasets, tools, and tutorials to accelerate your AI journey.
          </p>
        </div>
      </section>

      {/* Resource list */}
      <section className="section-padding bg-[#F1F1F1]">
        <div className="container-custom">
          <SectionHeader label="Curated Library" title="AI Learning " highlight="Resources" />
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-2 gap-5">
            {resources.map((r) => {
              const Icon = categoryIcons[r.category] || BookOpen;
              return (
                <a
                  key={r.id}
                  href={r.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="group flex items-start gap-4 bg-white rounded-2xl p-6 border border-gray-100 card-glow transition-all"
                >
                  <div className="w-12 h-12 rounded-xl bg-[#FFBF00]/10 flex items-center justify-center shrink-0">
                    <Icon size={22} className="text-[#FFBF00]" />
                  </div>
                  <div className="flex-1">
                    <div className="flex items-start justify-between gap-2">
                      <div>
                        <Badge variant="gold" className="mb-2">{r.category}</Badge>
                        <h3 className="font-bold text-[#053869] text-sm mb-1 group-hover:text-[#3053D3] transition-colors">
                          {r.title}
                        </h3>
                        <p className="text-xs text-[#909090] leading-relaxed">{r.description}</p>
                      </div>
                      <ExternalLink size={16} className="text-[#909090] group-hover:text-[#3053D3] transition-colors shrink-0 mt-1" />
                    </div>
                  </div>
                </a>
              );
            })}
          </div>
        </div>
      </section>
    </div>
  );
}


