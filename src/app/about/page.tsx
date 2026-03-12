import type { Metadata } from "next";
import { Award, Target, Zap, Globe } from "lucide-react";
import Image from "next/image";
import SectionHeader from "@/components/ui/SectionHeader";
import Badge from "@/components/ui/Badge";
import { teamMembers } from "@/lib/data";

export const metadata: Metadata = {
  title: "About Us",
  description: "Learn about Sanjivani AI Hub — our mission, vision, history, and the team behind it.",
};

const goals = [
  { icon: Target, title: "Mission", text: "Nurture AI talent, inspire research, and build a generation of innovation-ready problem solvers from Sanjivani University." },
  { icon: Zap, title: "Vision", text: "To become the premier university-based AI innovation center in India, bridging academic learning and industry application." },
  { icon: Award, title: "Excellence", text: "Host national hackathons, publish peer-reviewed research, and partner with top AI companies for internships and projects." },
  { icon: Globe, title: "Impact", text: "Solve real-world challenges in agriculture, healthcare, and education using cutting-edge AI and machine learning." },
];

const facultyAdvisors = teamMembers.filter((m) => m.category === "faculty");

export default function AboutPage() {
  return (
    <div className="">
      {/* Hero */}
      <section className="gradient-navy pt-12 pb-16 sm:pt-16 sm:pb-20 relative overflow-hidden">
        <div className="absolute inset-0 shimmer pointer-events-none" />
        <div className="container-custom relative z-10 text-center">
          <Badge variant="gold" className="mb-4">About Sanjivani AI Hub</Badge>
          <h1 className="text-4xl sm:text-5xl font-black text-white mb-4 max-w-3xl mx-auto">
            Where AI Innovation <span className="gradient-text">Begins</span>
          </h1>
          <p className="text-white/60 text-lg max-w-2xl mx-auto">
            The official Artificial Intelligence innovation and research ecosystem of Sanjivani University — building the AI leaders of tomorrow.
          </p>
        </div>
      </section>

      {/* Goals Grid */}
      <section className="section-padding bg-[#F1F1F1]">
        <div className="container-custom">
          <SectionHeader label="Purpose & Goals" title="Why We " highlight="Exist" />
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
            {goals.map(({ icon: Icon, title, text }) => (
              <div key={title} className="bg-white rounded-2xl p-6 border border-gray-100 card-glow">
                <div className="w-10 h-10 rounded-xl bg-[#FFBF00]/10 flex items-center justify-center mb-4">
                  <Icon size={20} className="text-[#FFBF00]" />
                </div>
                <h3 className="font-bold text-[#053869] mb-2">{title}</h3>
                <p className="text-sm text-[#909090] leading-relaxed">{text}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* History */}
      <section className="section-padding bg-white">
        <div className="container-custom">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div>
              <SectionHeader label="Our Story" title="From Idea to " highlight="Innovation" align="left" />
              <p className="text-[#909090] text-sm leading-relaxed mb-4">
                Sanjivani AI Hub was established with a simple but powerful idea: that the best place to learn AI is by doing AI. What started as a small study group of passionate students has grown into a thriving community of 200+ members, faculty advisors, industry mentors, and alumni.
              </p>
              <p className="text-[#909090] text-sm leading-relaxed mb-4">
                We have hosted 30+ workshops and hackathons, published 10+ research papers, and built 50+ projects — many of which have gone on to win awards and attract industry attention.
              </p>
              <p className="text-[#909090] text-sm leading-relaxed">
                Today, Sanjivani AI Hub stands as one of the most active student-led AI communities in Maharashtra, and we are just getting started.
              </p>
            </div>
            <div className="relative h-72 rounded-3xl overflow-hidden">
              <Image
                src="https://images.unsplash.com/photo-1522071820081-009f0129c71c?w=800&q=80"
                alt="AI Hub Team"
                fill
                className="object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-[#053869]/60 to-transparent" />
            </div>
          </div>
        </div>
      </section>

      {/* Faculty Advisors */}
      <section className="section-padding bg-[#F1F1F1]">
        <div className="container-custom">
          <SectionHeader label="Leadership" title="Faculty " highlight="Advisors" />
          <div className="flex flex-wrap justify-center gap-6">
            {facultyAdvisors.map((member) => (
              <div key={member.id} className="bg-white rounded-2xl p-6 text-center border border-gray-100 card-glow w-48">
                <div className="relative w-20 h-20 rounded-full overflow-hidden mx-auto mb-3 border-2 border-[#FFBF00]/30">
                  <Image src={member.avatar_url} alt={member.name} fill className="object-cover" />
                </div>
                <h3 className="font-bold text-[#053869] text-sm">{member.name}</h3>
                <p className="text-xs text-[#909090] mt-1">{member.role}</p>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}


