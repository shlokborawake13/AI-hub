"use client";

import React, { useState } from "react";
import { CheckCircle, Users, Lightbulb, Trophy, BookOpen } from "lucide-react";
import Badge from "@/components/ui/Badge";
import SectionHeader from "@/components/ui/SectionHeader";

const perks = [
  { icon: Users, text: "Join a thriving community of 200+ AI enthusiasts" },
  { icon: Lightbulb, text: "Collaborate on real-world AI projects" },
  { icon: Trophy, text: "Participate in hackathons and competitions" },
  { icon: BookOpen, text: "Access exclusive workshops and resources" },
];

export default function JoinPage() {
  const [submitted, setSubmitted] = useState(false);
  const [form, setForm] = useState({ name: "", email: "", course: "", year: "", motivation: "", skills: "" });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitted(true);
  };

  const inputClass = "w-full px-4 py-3 rounded-xl border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-[#FFBF00]/50 focus:border-[#FFBF00] bg-white transition-all";
  const labelClass = "block text-xs font-semibold text-[#053869] mb-1.5 uppercase tracking-wide";

  return (
    <div className="">
      {/* Hero */}
      <section className="gradient-navy pt-12 pb-16 sm:pt-16 sm:pb-20 relative overflow-hidden">
        <div className="absolute inset-0 shimmer pointer-events-none" />
        <div className="container-custom relative z-10 text-center">
          <Badge variant="gold" className="mb-4">Join the Hub</Badge>
          <h1 className="text-4xl sm:text-5xl font-black text-white mb-4">
            Become Part of the <span className="gradient-text">AI Revolution</span>
          </h1>
          <p className="text-white/60 text-lg max-w-xl mx-auto">
            Apply to join Sanjivani AI Hub — collaborate, build, and grow with 200+ AI enthusiasts.
          </p>
        </div>
      </section>

      <section className="section-padding bg-[#F1F1F1]">
        <div className="container-custom">
          <div className="grid lg:grid-cols-5 gap-12 items-start">

            {/* Perks column */}
            <div className="lg:col-span-2">
              <SectionHeader label="Why Join?" title="What You'll " highlight="Get" align="left" />
              <div className="flex flex-col gap-4 mb-8">
                {perks.map(({ icon: Icon, text }) => (
                  <div key={text} className="flex items-start gap-3">
                    <div className="w-8 h-8 rounded-lg bg-[#FFBF00]/10 flex items-center justify-center shrink-0">
                      <Icon size={16} className="text-[#FFBF00]" />
                    </div>
                    <p className="text-sm text-[#909090] leading-relaxed pt-1">{text}</p>
                  </div>
                ))}
              </div>
              <div className="bg-white rounded-2xl p-5 border border-[#FFBF00]/20">
                <p className="text-xs font-semibold text-[#053869] uppercase tracking-wide mb-2">Applications Open</p>
                <p className="text-2xl font-black text-[#053869]">Batch 2026</p>
                <p className="text-xs text-[#909090] mt-1">Applications reviewed on a rolling basis</p>
              </div>
            </div>

            {/* Form */}
            <div className="lg:col-span-3">
              {submitted ? (
                <div className="bg-white rounded-3xl p-12 text-center border border-green-100 shadow-sm">
                  <div className="w-16 h-16 rounded-full bg-green-100 flex items-center justify-center mx-auto mb-4">
                    <CheckCircle size={32} className="text-green-500" />
                  </div>
                  <h2 className="text-2xl font-bold text-[#053869] mb-2">Application Submitted!</h2>
                  <p className="text-[#909090] text-sm max-w-sm mx-auto">
                    Thank you for applying! We&apos;ll review your application and get back to you at <strong className="text-[#053869]">{form.email}</strong> within 5–7 days.
                  </p>
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="bg-white rounded-3xl p-8 shadow-sm border border-gray-100">
                  <h2 className="text-xl font-bold text-[#053869] mb-6">Membership Application</h2>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-5 mb-5">
                    <div>
                      <label className={labelClass}>Full Name *</label>
                      <input required name="name" value={form.name} onChange={handleChange} placeholder="Rahul Patil" className={inputClass} />
                    </div>
                    <div>
                      <label className={labelClass}>Email Address *</label>
                      <input required type="email" name="email" value={form.email} onChange={handleChange} placeholder="you@sanjivani.edu.in" className={inputClass} />
                    </div>
                    <div>
                      <label className={labelClass}>Course / Branch *</label>
                      <input required name="course" value={form.course} onChange={handleChange} placeholder="B.Tech CSE AI/ML" className={inputClass} />
                    </div>
                    <div>
                      <label className={labelClass}>Academic Year *</label>
                      <select required name="year" value={form.year} onChange={handleChange} className={inputClass}>
                        <option value="">Select year</option>
                        {[1, 2, 3, 4].map((y) => <option key={y} value={y}>{y}st — {y + 1}nd Year</option>)}
                      </select>
                    </div>
                  </div>
                  <div className="mb-5">
                    <label className={labelClass}>Your Skills / Tech Stack</label>
                    <input name="skills" value={form.skills} onChange={handleChange} placeholder="Python, TensorFlow, Data Analysis..." className={inputClass} />
                  </div>
                  <div className="mb-6">
                    <label className={labelClass}>Why do you want to join? *</label>
                    <textarea required rows={4} name="motivation" value={form.motivation} onChange={handleChange}
                      placeholder="Tell us about your interest in AI and what you hope to contribute or learn..."
                      className={`${inputClass} resize-none`} />
                  </div>
                  <button type="submit"
                    className="w-full bg-[#FFBF00] text-[#053869] font-bold py-3.5 rounded-xl hover:bg-[#FDBD0F] transition-all duration-200 hover:shadow-lg hover:shadow-[#FFBF00]/30 text-sm">
                    Submit Application
                  </button>
                </form>
              )}
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}


