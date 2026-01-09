import SecureContent from "@/components/blog/secure-content";
import { Button } from "@/components/ui/button";
import ContentWrapper from "@/components/wrapper/content-wrapper";
import { posts } from "@/data/posts";
import { ArrowLeft, Layers } from "lucide-react";
import { Link, useParams } from "react-router";

const BlogDetailPage = () => {
  const { blogId } = useParams();

  if (!blogId) {
    throw new Response("Not Found", { status: 404 });
  }

  const post = posts.find((post) => post.id === +blogId);

  if (!post) throw new Response("Not Found", { status: 404 });

  return (
    <ContentWrapper className="py-12">
      <div className="flex flex-col items-start gap-y-8">
        <Button asChild variant="outline">
          <Link to="/blogs">
            <div className="flex items-center gap-x-4">
              <ArrowLeft />
              All Posts
            </div>
          </Link>
        </Button>
        <section className="flex w-full flex-col justify-between gap-16 lg:flex-row">
          <article className="flex w-full flex-col gap-y-3 lg:w-3/4">
            <h1 className="text-3xl font-extrabold">{post.title}</h1>

            <div className="flex items-center gap-1 text-sm">
              <span>by</span>
              <span className="font-semibold">{post.author.fullName}</span>
              <span>on</span>
              <span className="font-semibold">{post.updatedAt}</span>
            </div>

            <p className="py-3 text-base font-normal">{post.content}</p>

            <img
              src={post.image}
              alt={post.title}
              className="w-full rounded-xl"
            />

            <SecureContent content={post.body} className="my-8" />

            <div className="flex items-center justify-start gap-x-4">
              {post.tags.map((tag) => (
                <Button key={tag} variant="secondary">
                  {tag}
                </Button>
              ))}
            </div>
          </article>
          <aside className="w-full space-y-6 lg:w-1/4">
            <div className="flex items-center gap-x-4 text-base font-semibold">
              <Layers />
              <h3>Other Blog Posts</h3>
            </div>
            <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-1">
              {posts.map((post) => (
                <Link key={post.id} to={`/blogs/${post.id}`}>
                  <div className="flex w-full items-center gap-x-2">
                    <img
                      src={post.image}
                      alt={post.title}
                      className="w-1/4 rounded"
                    />
                    <div className="text-muted-foreground w-3/4 text-sm font-medium">
                      <p className="line-clamp-2">{post.content}</p>
                      <i>...see more</i>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          </aside>
        </section>
      </div>
    </ContentWrapper>
  );
};

export default BlogDetailPage;
