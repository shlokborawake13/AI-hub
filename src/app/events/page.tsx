import type { Metadata } from "next";
import SectionHeader from "@/components/ui/SectionHeader";
import EventCard from "@/components/ui/EventCard";
import Badge from "@/components/ui/Badge";
import { upcomingEvents } from "@/lib/data";

export const metadata: Metadata = {
  title: "Events",
  description: "Explore workshops, hackathons, and seminars hosted by Sanjivani AI Hub.",
};

export default function EventsPage() {
  return (
    <div className="">
      {/* Hero */}
      <section className="gradient-navy pt-12 pb-16 sm:pt-16 sm:pb-20 relative overflow-hidden">
        <div className="absolute inset-0 shimmer pointer-events-none" />
        <div className="container-custom relative z-10 text-center">
          <Badge variant="gold" className="mb-4">Events</Badge>
          <h1 className="text-4xl sm:text-5xl font-black text-white mb-4">
            Workshops, Hackathons &amp; <span className="gradient-text">Seminars</span>
          </h1>
          <p className="text-white/60 text-lg max-w-xl mx-auto">
            Stay ahead with our curated AI events — compete, learn, and connect with the community.
          </p>
        </div>
      </section>

      {/* Upcoming */}
      <section className="section-padding bg-white">
        <div className="container-custom">
          <SectionHeader label="Upcoming" title="What&#39;s " highlight="Coming Up" align="left" />
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {upcomingEvents.map((event) => (
              <EventCard key={event.id} event={event} />
            ))}
          </div>
        </div>
      </section>

      {/* Past Events placeholder */}
      <section className="section-padding bg-[#F1F1F1]">
        <div className="container-custom">
          <SectionHeader label="Archive" title="Past " highlight="Events" />
          <div className="text-center py-12 text-[#909090]">
            <p className="text-sm">Past events will be displayed here. Connect your backend to load historical events.</p>
          </div>
        </div>
      </section>
    </div>
  );
}


