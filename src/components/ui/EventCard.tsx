import React from "react";
import Image from "next/image";
import Link from "next/link";
import { Calendar, MapPin, Wifi, ExternalLink, ChevronRight } from "lucide-react";
import Badge from "@/components/ui/Badge";
import { Event } from "@/types";
import { cn } from "@/lib/utils";

interface EventCardProps {
  event: Event;
  className?: string;
}

const modeConfig = {
  online: { label: "Online", icon: Wifi, variant: "cyan" as const },
  offline: { label: "Offline", icon: MapPin, variant: "gold" as const },
  hybrid: { label: "Hybrid", icon: ExternalLink, variant: "blue" as const },
};

export default function EventCard({ event, className }: EventCardProps) {
  const { label, icon: ModeIcon, variant } = modeConfig[event.mode];

  const startDate = new Date(event.start_datetime);
  const formattedDate = startDate.toLocaleDateString("en-IN", {
    day: "numeric",
    month: "short",
    year: "numeric",
  });
  const formattedTime = startDate.toLocaleTimeString("en-IN", {
    hour: "2-digit",
    minute: "2-digit",
  });

  return (
    <div
      className={cn(
        "group bg-white rounded-2xl overflow-hidden border border-gray-100 card-glow flex flex-col",
        className
      )}
    >
      {/* Banner */}
      <div className="relative h-44 overflow-hidden bg-gradient-to-br from-[#053869] to-[#3053D3]">
        <Image
          src={event.banner_url || "/placeholder-event.jpg"}
          alt={event.title}
          fill
          className="object-cover group-hover:scale-105 transition-transform duration-500 opacity-70"
        />
        {/* Date badge */}
        <div className="absolute top-3 left-3 bg-white rounded-xl overflow-hidden shadow-lg text-center w-12">
          <div className="bg-[#053869] px-2 py-0.5">
            <span className="text-[#FFBF00] text-[10px] font-bold uppercase tracking-wider">
              {startDate.toLocaleDateString("en-IN", { month: "short" })}
            </span>
          </div>
          <div className="px-2 py-1">
            <span className="text-[#053869] text-lg font-bold leading-none">
              {startDate.getDate()}
            </span>
          </div>
        </div>

        {/* Mode badge */}
        <div className="absolute top-3 right-3">
          <Badge variant={variant}>
            <ModeIcon size={10} />
            {label}
          </Badge>
        </div>
      </div>

      {/* Content */}
      <div className="p-5 flex flex-col flex-1">
        <h3 className="font-bold text-[#053869] text-base mb-2 group-hover:text-[#3053D3] transition-colors line-clamp-2">
          {event.title}
        </h3>
        <p className="text-sm text-[#909090] line-clamp-2 mb-4 flex-1">
          {event.description}
        </p>

        <div className="flex items-center gap-3 text-xs text-[#909090] mb-4">
          <div className="flex items-center gap-1">
            <Calendar size={13} className="text-[#FFBF00]" />
            <span>{formattedDate}</span>
          </div>
          <span>·</span>
          <span>{formattedTime}</span>
          {event.location && (
            <>
              <span>·</span>
              <div className="flex items-center gap-1">
                <MapPin size={13} className="text-[#FFBF00]" />
                <span className="line-clamp-1">{event.location}</span>
              </div>
            </>
          )}
        </div>

        <Link
          href={`/events/${event.id}`}
          className="mt-auto flex items-center justify-center gap-2 bg-[#053869] text-white text-sm font-bold py-3 px-5 rounded-xl hover:bg-[#FFBF00] hover:text-[#053869] transition-all duration-200 group/btn"
        >
          Register Now
          <ChevronRight size={14} className="group-hover/btn:translate-x-0.5 transition-transform" />
        </Link>
      </div>
    </div>
  );
}
