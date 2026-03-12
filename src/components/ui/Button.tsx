import React from "react";
import { cn } from "@/lib/utils";

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "primary" | "secondary" | "ghost" | "dark" | "danger";
  size?: "sm" | "md" | "lg";
  as?: "button" | "a";
  href?: string;
  children: React.ReactNode;
}

const variantClasses = {
  primary:
    "bg-[#FFBF00] text-[#053869] hover:bg-[#FDBD0F] hover:shadow-lg hover:shadow-[#FFBF00]/30 font-semibold",
  secondary:
    "bg-transparent text-[#FFBF00] border-2 border-[#FFBF00] hover:bg-[#FFBF00] hover:text-[#053869] font-semibold",
  ghost:
    "bg-transparent text-white border border-white/20 hover:border-white/60 hover:bg-white/10 font-medium",
  dark:
    "bg-[#053869] text-white hover:bg-[#00155e] hover:shadow-lg font-semibold",
  danger:
    "bg-[#EF4444] text-white hover:bg-red-600 hover:shadow-lg hover:shadow-red-500/30 font-semibold",
};

const sizeClasses = {
  sm: "px-4 py-2 text-xs rounded-lg",
  md: "px-6 py-3 text-sm rounded-xl",
  lg: "px-8 py-4 text-base rounded-xl",
};

export default function Button({
  variant = "primary",
  size = "md",
  className,
  children,
  ...props
}: ButtonProps) {
  return (
    <button
      className={cn(
        "inline-flex items-center justify-center gap-2 transition-all duration-200 cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#FFBF00] focus-visible:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed",
        variantClasses[variant],
        sizeClasses[size],
        className
      )}
      {...props}
    >
      {children}
    </button>
  );
}
