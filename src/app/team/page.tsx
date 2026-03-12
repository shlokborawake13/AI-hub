import type { Metadata } from "next";
import Image from "next/image";
import { Linkedin } from "lucide-react";
import SectionHeader from "@/components/ui/SectionHeader";
import Badge from "@/components/ui/Badge";
import { teamMembers } from "@/lib/data";

export const metadata: Metadata = {
  title: "Team",
  description: "Meet the core team, faculty advisors, and alumni who power Sanjivani AI Hub.",
};

export default function TeamPage() {
  const core = teamMembers.filter((m) => m.category === "core");
  const faculty = teamMembers.filter((m) => m.category === "faculty");
  const alumni = teamMembers.filter((m) => m.category === "alumni");

  const MemberCard = ({ member }: { member: (typeof teamMembers)[0] }) => (
    <div className="bg-white rounded-2xl p-6 text-center border border-gray-100 card-glow group">
      <div className="relative w-20 h-20 rounded-full overflow-hidden mx-auto mb-4 ring-2 ring-[#FFBF00]/30 group-hover:ring-[#FFBF00] transition-all">
        <Image src={member.avatar_url} alt={member.name} fill className="object-cover" />
      </div>
      <h3 className="font-bold text-[#053869] text-sm mb-1">{member.name}</h3>
      <p className="text-xs text-[#909090] mb-3">{member.role}</p>
      {member.linkedin_url && (
        <a href={member.linkedin_url} target="_blank" rel="noopener noreferrer"
          className="inline-flex items-center gap-1 text-xs text-[#3053D3] hover:text-[#053869] transition-colors font-medium">
          <Linkedin size={12} /> LinkedIn
        </a>
      )}
    </div>
  );

  return (
    <div className="">
      {/* Hero */}
      <section className="gradient-navy pt-12 pb-16 sm:pt-16 sm:pb-20 relative overflow-hidden">
        <div className="absolute inset-0 shimmer pointer-events-none" />
        <div className="container-custom relative z-10 text-center">
          <Badge variant="gold" className="mb-4">Our People</Badge>
          <h1 className="text-4xl sm:text-5xl font-black text-white mb-4">
            Meet the <span className="gradient-text">Team</span>
          </h1>
          <p className="text-white/60 text-lg max-w-xl mx-auto">
            The passionate people behind Sanjivani AI Hub — building, researching, and inspiring every day.
          </p>
        </div>
      </section>

      {/* Faculty */}
      <section className="section-padding bg-white">
        <div className="container-custom">
          <SectionHeader label="Leadership" title="Faculty " highlight="Advisors" />
          <div className="flex flex-wrap justify-center gap-5">
            {faculty.map((m) => <MemberCard key={m.id} member={m} />)}
          </div>
        </div>
      </section>

      {/* Core Team */}
      <section className="section-padding bg-[#F1F1F1]">
        <div className="container-custom">
          <SectionHeader label="The Hub" title="Core " highlight="Team" />
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-5">
            {core.map((m) => <MemberCard key={m.id} member={m} />)}
          </div>
        </div>
      </section>

      {/* Alumni */}
      <section className="section-padding bg-white">
        <div className="container-custom">
          <SectionHeader label="Alumni" title="Where They Are " highlight="Now" />
          <div className="flex flex-wrap justify-center gap-5">
            {alumni.map((m) => <MemberCard key={m.id} member={m} />)}
          </div>
        </div>
      </section>
    </div>
  );
}


