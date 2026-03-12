"use client";

import React from "react";
import { cn } from "@/lib/utils";

interface SectionHeaderProps {
  label?: string;
  title: string;
  highlight?: string;
  subtitle?: string;
  align?: "left" | "center";
  dark?: boolean;
  className?: string;
}

export default function SectionHeader({
  label,
  title,
  highlight,
  subtitle,
  align = "center",
  dark = false,
  className,
}: SectionHeaderProps) {
  // Split title to inject highlight span
  const parts = highlight ? title.split(highlight) : [title];

  return (
    <div
      className={cn(
        "mb-12",
        align === "center" ? "text-center" : "text-left",
        className
      )}
    >
      {label && (
        <p
          className={cn(
            "section-label",
            align === "left" ? "justify-start" : "justify-center"
          )}
        >
          {label}
        </p>
      )}
      <h2
        className={cn(
          "text-3xl sm:text-4xl font-bold leading-tight",
          dark ? "text-white" : "text-[#053869]"
        )}
      >
        {parts[0]}
        {highlight && (
          <span className="gradient-text">{highlight}</span>
        )}
        {parts[1]}
      </h2>
      {subtitle && (
        <p
          className={cn(
            "mt-4 text-base max-w-2xl leading-relaxed",
            align === "center" && "mx-auto",
            dark ? "text-white/60" : "text-[#909090]"
          )}
        >
          {subtitle}
        </p>
      )}
    </div>
  );
}
