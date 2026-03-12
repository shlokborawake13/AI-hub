import React from "react";
import Image from "next/image";
import Link from "next/link";
import { Github, ExternalLink, Users } from "lucide-react";
import Badge from "@/components/ui/Badge";
import { Project } from "@/types";
import { cn } from "@/lib/utils";

interface ProjectCardProps {
  project: Project;
  className?: string;
}

const domainColors: Record<string, "gold" | "blue" | "cyan" | "success"> = {
  NLP: "gold",
  "Computer Vision": "blue",
  "Reinforcement Learning": "cyan",
  "Machine Learning": "gold",
  "Deep Learning": "blue",
  Robotics: "success",
  GenAI: "cyan",
};

export default function ProjectCard({ project, className }: ProjectCardProps) {
  return (
    <div
      className={cn(
        "group relative bg-white rounded-2xl overflow-hidden border border-gray-100 card-glow flex flex-col",
        className
      )}
    >
      {/* Thumbnail */}
      <div className="relative h-48 overflow-hidden bg-gradient-to-br from-[#053869] to-[#00155e]">
        <Image
          src={project.thumbnail_url || "/placeholder-project.jpg"}
          alt={project.title}
          fill
          className="object-cover group-hover:scale-105 transition-transform duration-500 opacity-80"
        />
        {/* Domain badge */}
        <div className="absolute top-3 left-3">
          <Badge variant={domainColors[project.domain] || "gold"}>
            {project.domain}
          </Badge>
        </div>
        {/* Year badge */}
        <div className="absolute top-3 right-3">
          <span className="text-[11px] font-semibold text-white/70 bg-black/30 backdrop-blur-sm px-2 py-1 rounded-lg">
            {project.year}
          </span>
        </div>
        {/* Gradient overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-[#053869]/80 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
      </div>

      {/* Content */}
      <div className="flex flex-col flex-1 p-5">
        <h3 className="font-bold text-[#053869] text-base mb-2 group-hover:text-[#3053D3] transition-colors line-clamp-2">
          {project.title}
        </h3>
        <p className="text-sm text-[#909090] leading-relaxed line-clamp-2 mb-4 flex-1">
          {project.description}
        </p>

        {/* Tech Stack */}
        <div className="flex flex-wrap gap-1.5 mb-4">
          {project.tech_stack.slice(0, 4).map((tech) => (
            <span
              key={tech}
              className="text-[11px] font-medium px-2.5 py-1 rounded-lg bg-[#F1F1F1] text-[#053869]"
            >
              {tech}
            </span>
          ))}
          {project.tech_stack.length > 4 && (
            <span className="text-[11px] font-medium px-2.5 py-1 rounded-lg bg-[#F1F1F1] text-[#909090]">
              +{project.tech_stack.length - 4}
            </span>
          )}
        </div>

        {/* Footer row */}
        <div className="flex items-center justify-between pt-4 border-t border-gray-100">
          <Link
            href={`/projects/${project.id}`}
            className="text-sm font-semibold text-[#3053D3] hover:text-[#053869] transition-colors"
          >
            View Project →
          </Link>
          <div className="flex items-center gap-2">
            {project.github_url && (
              <a
                href={project.github_url}
                target="_blank"
                rel="noopener noreferrer"
                className="text-gray-400 hover:text-[#053869] transition-colors"
                aria-label="GitHub"
              >
                <Github size={16} />
              </a>
            )}
            {project.demo_url && (
              <a
                href={project.demo_url}
                target="_blank"
                rel="noopener noreferrer"
                className="text-gray-400 hover:text-[#053869] transition-colors"
                aria-label="Live Demo"
              >
                <ExternalLink size={16} />
              </a>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
