import BlogCard from "@/components/blog/blog-card";
import ContentWrapper from "@/components/wrapper/content-wrapper";
import { posts } from "@/data/posts";

const BlogPage = () => {
  return (
    <ContentWrapper className="h-full w-full py-12">
      <section className="w-full space-y-8">
        <h1 className="text-center text-2xl font-bold sm:text-left">
          Latest Blog Posts
        </h1>
        <div className="grid grid-cols-1 gap-x-10 gap-y-12 sm:gap-y-16 md:grid-cols-2 lg:grid-cols-3 lg:gap-x-16">
          {posts.map((post) => (
            <BlogCard key={post.id} post={post} />
          ))}
        </div>
      </section>
    </ContentWrapper>
  );
};

export default BlogPage;
