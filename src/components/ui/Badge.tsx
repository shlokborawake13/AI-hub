import React from "react";
import { cn } from "@/lib/utils";

interface BadgeProps {
  children: React.ReactNode;
  variant?: "gold" | "blue" | "cyan" | "dark" | "success" | "outline";
  className?: string;
}

const variantClasses = {
  gold: "bg-[#FFBF00]/15 text-[#FFBF00] border border-[#FFBF00]/30",
  blue: "bg-[#3053D3]/15 text-[#3053D3] border border-[#3053D3]/30",
  cyan: "bg-[#00D4FF]/10 text-[#00D4FF] border border-[#00D4FF]/30",
  dark: "bg-[#053869] text-white border border-white/10",
  success: "bg-emerald-500/15 text-emerald-400 border border-emerald-500/30",
  outline: "bg-transparent text-white/70 border border-white/20",
};

export default function Badge({ children, variant = "gold", className }: BadgeProps) {
  return (
    <span
      className={cn(
        "badge text-[11px] font-semibold tracking-wider",
        variantClasses[variant],
        className
      )}
    >
      {children}
    </span>
  );
}
