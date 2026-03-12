import type { Metadata } from "next";
import SectionHeader from "@/components/ui/SectionHeader";
import BlogCard from "@/components/ui/BlogCard";
import Badge from "@/components/ui/Badge";
import { blogPosts } from "@/lib/data";

export const metadata: Metadata = {
  title: "Blog",
  description: "Technical articles, project stories, and AI news from the Sanjivani AI Hub community.",
};

const categories = ["All", "Tutorial", "Case Study", "Research", "Event Recap", "News"];

export default function BlogPage() {
  return (
    <div className="">
      {/* Hero */}
      <section className="gradient-navy pt-12 pb-16 sm:pt-16 sm:pb-20 relative overflow-hidden">
        <div className="absolute inset-0 shimmer pointer-events-none" />
        <div className="container-custom relative z-10 text-center">
          <Badge variant="gold" className="mb-4">Blog</Badge>
          <h1 className="text-4xl sm:text-5xl font-black text-white mb-4">
            AI Hub <span className="gradient-text">Insights</span>
          </h1>
          <p className="text-white/60 text-base sm:text-lg max-w-xl mx-auto">
            Technical deep-dives, project stories, event recaps, and AI news from our community writers.
          </p>
        </div>
      </section>

      {/* Category filter */}
      <div className="bg-white border-b border-gray-100 sticky top-[68px] z-30">
        <div className="container-custom py-3">
          <div className="flex gap-2 overflow-x-auto scrollbar-none pb-1">
            {categories.map((cat) => (
              <button
                key={cat}
                className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all duration-200 whitespace-nowrap shrink-0 ${
                  cat === "All"
                    ? "bg-[#053869] text-white"
                    : "bg-[#F1F1F1] text-[#909090] hover:bg-[#053869]/10 hover:text-[#053869]"
                }`}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Posts grid */}
      <section className="section-padding bg-[#F1F1F1]">
        <div className="container-custom">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {blogPosts.map((post) => (
              <BlogCard key={post.id} post={post} />
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}


