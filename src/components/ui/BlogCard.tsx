import React from "react";
import Image from "next/image";
import Link from "next/link";
import { Calendar, User, Clock } from "lucide-react";
import Badge from "@/components/ui/Badge";
import { BlogPost } from "@/types";
import { cn } from "@/lib/utils";

interface BlogCardProps {
  post: BlogPost;
  className?: string;
}

export default function BlogCard({ post, className }: BlogCardProps) {
  const publishedDate = new Date(post.published_at).toLocaleDateString("en-IN", {
    day: "numeric",
    month: "short",
    year: "numeric",
  });

  return (
    <div
      className={cn(
        "group bg-white rounded-2xl overflow-hidden border border-gray-100 card-glow flex flex-col",
        className
      )}
    >
      {/* Cover */}
      <div className="relative h-48 overflow-hidden bg-gradient-to-br from-[#053869] to-[#3053D3]">
        <Image
          src={post.cover_image_url || "/placeholder-blog.jpg"}
          alt={post.title}
          fill
          className="object-cover group-hover:scale-105 transition-transform duration-500 opacity-80"
        />
        <div className="absolute top-3 left-3">
          <Badge variant="gold">{post.category}</Badge>
        </div>
      </div>

      {/* Content */}
      <div className="p-5 flex flex-col flex-1">
        <Link href={`/blog/${post.slug}`}>
          <h3 className="font-bold text-[#053869] text-base mb-2 group-hover:text-[#3053D3] transition-colors line-clamp-2 cursor-pointer">
            {post.title}
          </h3>
        </Link>
        <p className="text-sm text-[#909090] line-clamp-3 mb-4 flex-1">{post.excerpt}</p>

        {/* Meta */}
        <div className="flex items-center gap-4 text-xs text-[#909090] pt-4 border-t border-gray-100">
          <div className="flex items-center gap-1">
            <Calendar size={12} className="text-[#FFBF00]" />
            <span>{publishedDate}</span>
          </div>
          <div className="flex items-center gap-1">
            <Clock size={12} className="text-[#FFBF00]" />
            <span>5 min read</span>
          </div>
        </div>
      </div>
    </div>
  );
}
