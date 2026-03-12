import React from "react";
import Link from "next/link";
import { Bot, Mail, MapPin, Phone, Github, Linkedin, Youtube, Instagram, ArrowUpRight } from "lucide-react";

const footerLinks = {
  "Quick Links": [
    { label: "Home", href: "/" },
    { label: "About AI Hub", href: "/about" },
    { label: "Projects", href: "/projects" },
    { label: "Research", href: "/research" },
    { label: "Events", href: "/events" },
    { label: "Blog", href: "/blog" },
  ],
  "Resources": [
    { label: "Learning Roadmaps", href: "/resources" },
    { label: "Datasets Library", href: "/resources" },
    { label: "AI Tools & Frameworks", href: "/resources" },
    { label: "Research Papers", href: "/research" },
    { label: "Join Community", href: "/join" },
  ],
};

const socialLinks = [
  { icon: Github, href: "https://github.com", label: "GitHub" },
  { icon: Linkedin, href: "https://linkedin.com", label: "LinkedIn" },
  { icon: Youtube, href: "https://youtube.com", label: "YouTube" },
  { icon: Instagram, href: "https://instagram.com", label: "Instagram" },
];

export default function Footer() {
  return (
    <footer className="relative bg-[#053869] text-white overflow-hidden">
      {/* Top gradient line */}
      <div className="h-px bg-gradient-to-r from-transparent via-[#FFBF00] to-transparent" />

      {/* Decorative glow */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-96 h-40 bg-[#FFBF00]/5 blur-3xl pointer-events-none" />

      <div className="container-custom relative z-10">
        {/* Main footer grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10 py-16">

          {/* Brand column */}
          <div className="lg:col-span-1">
            <Link href="/" className="flex items-center gap-2.5 mb-4">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-[#FFBF00] to-[#FDBD0F] flex items-center justify-center">
                <Bot size={22} className="text-[#053869]" strokeWidth={2.5} />
              </div>
              <div className="flex flex-col leading-none">
                <span className="font-bold text-white text-lg">Sanjivani</span>
                <span className="text-[#FFBF00] font-semibold text-xs tracking-widest uppercase">AI Hub</span>
              </div>
            </Link>
            <p className="text-white/60 text-sm leading-relaxed mb-6">
              Nurturing AI talent, inspiring research, and building a generation of innovation-ready problem solvers at Sanjivani University.
            </p>
            {/* Social links */}
            <div className="flex items-center gap-2">
              {socialLinks.map(({ icon: Icon, href, label }) => (
                <a
                  key={label}
                  href={href}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={label}
                  className="w-9 h-9 rounded-lg bg-white/10 flex items-center justify-center text-white/70 hover:bg-[#FFBF00] hover:text-[#053869] transition-all duration-200"
                >
                  <Icon size={16} />
                </a>
              ))}
            </div>
          </div>

          {/* Links columns */}
          {Object.entries(footerLinks).map(([title, links]) => (
            <div key={title}>
              <h4 className="font-semibold text-sm uppercase tracking-widest text-[#FFBF00] mb-5">
                {title}
              </h4>
              <ul className="flex flex-col gap-2.5">
                {links.map((link) => (
                  <li key={link.label}>
                    <Link
                      href={link.href}
                      className="text-sm text-white/60 hover:text-white transition-colors duration-200 flex items-center gap-1 group"
                    >
                      {link.label}
                      <ArrowUpRight
                        size={12}
                        className="opacity-0 group-hover:opacity-100 transition-opacity"
                      />
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}

          {/* Contact column */}
          <div>
            <h4 className="font-semibold text-sm uppercase tracking-widest text-[#FFBF00] mb-5">
              Contact
            </h4>
            <ul className="flex flex-col gap-3">
              <li className="flex items-start gap-3 text-sm text-white/60">
                <MapPin size={16} className="text-[#FFBF00] mt-0.5 shrink-0" />
                <span>Sanjivani University, Kopargaon, Ahmednagar – 423603, Maharashtra</span>
              </li>
              <li className="flex items-center gap-3 text-sm text-white/60">
                <Mail size={16} className="text-[#FFBF00] shrink-0" />
                <a href="mailto:aihub@sanjivani.edu.in" className="hover:text-white transition-colors">
                  aihub@sanjivani.edu.in
                </a>
              </li>
              <li className="flex items-center gap-3 text-sm text-white/60">
                <Phone size={16} className="text-[#FFBF00] shrink-0" />
                <span>+91 2423 222 100</span>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom bar */}
        <div className="border-t border-white/10 py-5 flex flex-col sm:flex-row items-center justify-between gap-3 text-sm text-white/40">
          <span>© 2026 Sanjivani AI Hub, Sanjivani University. All Rights Reserved.</span>
          <div className="flex items-center gap-4">
            <Link href="/privacy" className="hover:text-white/70 transition-colors">Privacy Policy</Link>
            <Link href="/terms" className="hover:text-white/70 transition-colors">Terms of Use</Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
