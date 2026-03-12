import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "404 — Page Not Found",
  description: "The page you are looking for does not exist.",
};

export default function NotFound() {
  return (
    <div
      className="gradient-navy relative overflow-hidden"
      style={{ minHeight: "calc(100vh - var(--navbar-height))" }}
    >
      {/* Shimmer overlay */}
      <div className="absolute inset-0 shimmer pointer-events-none" />

      {/* Glow orbs */}
      <div className="absolute top-1/4 right-1/4 w-96 h-96 rounded-full bg-[#FFBF00]/5 blur-3xl pointer-events-none" />
      <div className="absolute bottom-1/4 left-1/4 w-72 h-72 rounded-full bg-[#3053D3]/10 blur-3xl pointer-events-none" />

      {/* Content */}
      <div className="relative z-10 flex flex-col items-center justify-center text-center px-6 py-24 h-full min-h-[inherit]">
        {/* 404 number */}
        <p className="text-[120px] sm:text-[180px] font-black leading-none gradient-text select-none">
          404
        </p>

        {/* Heading */}
        <h1 className="text-2xl sm:text-4xl font-black text-white mt-2 mb-4">
          Page Not Found
        </h1>

        {/* Description */}
        <p className="text-white/60 text-base sm:text-lg max-w-md mx-auto mb-10 leading-relaxed">
          Oops! The page you&apos;re looking for doesn&apos;t exist or has been
          moved. Let&apos;s get you back on track.
        </p>

        {/* CTA */}
        <Link
          href="/"
          className="inline-flex items-center gap-2 bg-[#FFBF00] text-[#053869] font-bold px-8 py-3.5 rounded-xl hover:bg-[#FDBD0F] transition-all duration-200 hover:shadow-xl hover:shadow-[#FFBF00]/25 text-sm sm:text-base"
        >
          ← Back to Home
        </Link>
      </div>
    </div>
  );
}
