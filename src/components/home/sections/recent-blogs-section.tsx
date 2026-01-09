import BlogCard from "@/components/blog/blog-card";
import SectionHeader from "@/components/shared/section-header";
import type { Post } from "@/types";

interface Props {
  posts: Post[];
}

const RecentBlogsSection = ({ posts }: Props) => {
  return (
    <section className="w-full space-y-8 py-8">
      <SectionHeader
        title="Recent Blogs"
        link={{
          text: "View All Posts",
          href: "/blogs",
        }}
      />

      <div className="grid grid-cols-1 gap-x-8 gap-y-10 sm:gap-y-12 md:grid-cols-2 lg:grid-cols-3">
        {posts.slice(0, 3).map((post) => (
          <BlogCard key={post.id} post={post} type="recent-section-card" />
        ))}
      </div>
    </section>
  );
};

export default RecentBlogsSection;
