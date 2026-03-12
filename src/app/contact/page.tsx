"use client";

import React, { useState } from "react";
import { Mail, MapPin, Phone, Send, CheckCircle } from "lucide-react";
import Badge from "@/components/ui/Badge";

const contactInfo = [
  { icon: MapPin, label: "Address", value: "Sanjivani University, Kopargaon, Ahmednagar – 423603, MH" },
  { icon: Mail, label: "Email", value: "aihub@sanjivani.edu.in", href: "mailto:aihub@sanjivani.edu.in" },
  { icon: Phone, label: "Phone", value: "+91 2423 222 100" },
];

export default function ContactPage() {
  const [submitted, setSubmitted] = useState(false);
  const [form, setForm] = useState({ name: "", email: "", subject: "", message: "" });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) =>
    setForm({ ...form, [e.target.name]: e.target.value });

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
          <Badge variant="gold" className="mb-4">Contact Us</Badge>
          <h1 className="text-4xl sm:text-5xl font-black text-white mb-4">
            Get in <span className="gradient-text">Touch</span>
          </h1>
          <p className="text-white/60 text-lg max-w-xl mx-auto">
            Collaboration inquiry, media, or just want to say hello — we&apos;d love to hear from you.
          </p>
        </div>
      </section>

      <section className="section-padding bg-[#F1F1F1]">
        <div className="container-custom">
          <div className="grid lg:grid-cols-5 gap-12">

            {/* Contact info */}
            <div className="lg:col-span-2 flex flex-col gap-5">
              <h2 className="text-xl font-bold text-[#053869]">Contact Information</h2>
              {contactInfo.map(({ icon: Icon, label, value, href }) => (
                <div key={label} className="flex items-start gap-4 bg-white rounded-2xl p-5 border border-gray-100">
                  <div className="w-10 h-10 rounded-xl bg-[#FFBF00]/10 flex items-center justify-center shrink-0">
                    <Icon size={18} className="text-[#FFBF00]" />
                  </div>
                  <div>
                    <p className="text-xs font-semibold text-[#909090] uppercase tracking-wide mb-0.5">{label}</p>
                    {href ? (
                      <a href={href} className="text-sm font-medium text-[#053869] hover:text-[#3053D3] transition-colors">{value}</a>
                    ) : (
                      <p className="text-sm font-medium text-[#053869]">{value}</p>
                    )}
                  </div>
                </div>
              ))}

              {/* Google Maps embed placeholder */}
              <div className="rounded-2xl overflow-hidden h-48 bg-[#053869]/10 flex items-center justify-center border border-gray-100">
                <p className="text-sm text-[#909090]">📍 Kopargaon, Maharashtra</p>
              </div>
            </div>

            {/* Contact form */}
            <div className="lg:col-span-3">
              {submitted ? (
                <div className="bg-white rounded-3xl p-12 text-center border border-green-100 h-full flex flex-col items-center justify-center">
                  <div className="w-16 h-16 rounded-full bg-green-100 flex items-center justify-center mb-4">
                    <CheckCircle size={32} className="text-green-500" />
                  </div>
                  <h2 className="text-2xl font-bold text-[#053869] mb-2">Message Sent!</h2>
                  <p className="text-[#909090] text-sm max-w-xs mx-auto">We&apos;ll get back to you at <strong className="text-[#053869]">{form.email}</strong> within 48 hours.</p>
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="bg-white rounded-3xl p-8 shadow-sm border border-gray-100">
                  <h2 className="text-xl font-bold text-[#053869] mb-6">Send a Message</h2>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-5 mb-5">
                    <div>
                      <label className={labelClass}>Your Name *</label>
                      <input required name="name" value={form.name} onChange={handleChange} placeholder="Priya Sharma" className={inputClass} />
                    </div>
                    <div>
                      <label className={labelClass}>Email Address *</label>
                      <input required type="email" name="email" value={form.email} onChange={handleChange} placeholder="priya@example.com" className={inputClass} />
                    </div>
                  </div>
                  <div className="mb-5">
                    <label className={labelClass}>Subject *</label>
                    <input required name="subject" value={form.subject} onChange={handleChange} placeholder="Collaboration / Inquiry / Hiring" className={inputClass} />
                  </div>
                  <div className="mb-6">
                    <label className={labelClass}>Message *</label>
                    <textarea required rows={5} name="message" value={form.message} onChange={handleChange} placeholder="Write your message here..." className={`${inputClass} resize-none`} />
                  </div>
                  <button type="submit"
                    className="w-full flex items-center justify-center gap-2 bg-[#FFBF00] text-[#053869] font-bold py-3.5 rounded-xl hover:bg-[#FDBD0F] transition-all duration-200 hover:shadow-lg hover:shadow-[#FFBF00]/30 text-sm">
                    <Send size={16} /> Send Message
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


