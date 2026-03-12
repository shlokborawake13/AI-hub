"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Menu, X, Bot, ChevronRight } from "lucide-react";
import { cn } from "@/lib/utils";

const navLinks = [
  { label: "Home", href: "/" },
  { label: "About", href: "/about" },
  { label: "Projects", href: "/projects" },
  { label: "Research", href: "/research" },
  { label: "Events", href: "/events" },
  { label: "Resources", href: "/resources" },
  { label: "Blog", href: "/blog" },
  { label: "Team", href: "/team" },
];

export default function Navbar() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const pathname = usePathname();

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 20);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    setMobileOpen(false);
  }, [pathname]);

  // Prevent body scroll when mobile menu is open
  useEffect(() => {
    if (mobileOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => { document.body.style.overflow = ""; };
  }, [mobileOpen]);

  return (
    <>
      <header
        className={cn(
          "fixed top-0 left-0 right-0 z-50 transition-all duration-300",
          isScrolled || mobileOpen
            ? "bg-[#053869] shadow-xl shadow-black/20"
            : "bg-[#053869]/80 backdrop-blur-lg"
        )}
      >
        <div className="container-custom">
          <nav className="flex items-center justify-between h-[68px]">
            {/* Logo */}
            <Link href="/" className="flex items-center gap-2.5 group shrink-0">
              <div className="w-9 h-9 rounded-lg bg-gradient-to-br from-[#FFBF00] to-[#FDBD0F] flex items-center justify-center shadow-lg">
                <Bot size={20} className="text-[#053869]" strokeWidth={2.5} />
              </div>
              <div className="flex flex-col leading-none">
                <span className="font-bold text-white text-sm tracking-tight">Sanjivani</span>
                <span className="text-[#FFBF00] font-semibold text-[10px] tracking-widest uppercase">AI Hub</span>
              </div>
            </Link>

            {/* Desktop Nav */}
            <ul className="hidden lg:flex items-center gap-1">
              {navLinks.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className={cn(
                      "px-3.5 py-2.5 rounded-lg text-sm font-medium transition-all duration-200 whitespace-nowrap",
                      pathname === link.href
                        ? "text-[#FFBF00] bg-white/10"
                        : "text-white/80 hover:text-white hover:bg-white/10"
                    )}
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>

            {/* CTA + Hamburger */}
            <div className="flex items-center gap-3">
              <Link
                href="/join"
                className="hidden sm:flex items-center gap-2 bg-[#FFBF00] text-[#053869] font-bold text-sm px-5 py-2.5 rounded-xl hover:bg-[#FDBD0F] hover:shadow-lg hover:shadow-[#FFBF00]/25 transition-all duration-200 whitespace-nowrap"
              >
                Join Community
                <ChevronRight size={14} />
              </Link>

              <button
                className="lg:hidden text-white p-2 rounded-lg hover:bg-white/10 transition-colors"
                onClick={() => setMobileOpen(!mobileOpen)}
                aria-label="Toggle menu"
                aria-expanded={mobileOpen}
              >
                {mobileOpen ? <X size={20} /> : <Menu size={20} />}
              </button>
            </div>
          </nav>
        </div>
      </header>

      {/* Mobile Menu */}
      {mobileOpen && (
        <div className="fixed inset-0 z-40 lg:hidden">
          <div
            className="absolute inset-0 bg-black/50"
            onClick={() => setMobileOpen(false)}
          />
          <div className="absolute top-[68px] left-0 right-0 bg-[#053869] border-t border-white/10 shadow-2xl">
            <ul className="container-custom py-4 flex flex-col gap-1">
              {navLinks.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className={cn(
                      "flex items-center px-4 py-3 rounded-xl text-sm font-medium transition-all duration-200",
                      pathname === link.href
                        ? "text-[#FFBF00] bg-white/10"
                        : "text-white/80 hover:text-white hover:bg-white/10"
                    )}
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
              <li className="mt-2 pb-2">
                <Link
                  href="/join"
                  className="flex items-center justify-center gap-1.5 bg-[#FFBF00] text-[#053869] font-semibold text-sm px-4 py-3 rounded-xl hover:bg-[#FDBD0F] transition-all duration-200"
                >
                  Join Community
                  <ChevronRight size={14} />
                </Link>
              </li>
            </ul>
          </div>
        </div>
      )}
    </>
  );
}
