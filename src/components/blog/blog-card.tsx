import { cn } from "@/lib/utils";
import type { Post } from "@/types";
import { Link } from "react-router";

interface Props {
  post: Post;
  type?: "recent-section-card" | "blogs-page-card";
}

const BlogCard = ({ post, type = "blogs-page-card" }: Props) => {
  return (
    <Link to={`/blogs/${post.id}`} className="group">
      <div className="flex flex-col gap-y-4">
        <img
          src={post.image}
          className={cn(
            "w-full",
            type === "blogs-page-card" ? "rounded-xl" : "rounded-2xl",
          )}
          alt={post.title}
        />
        <div
          className={cn(
            "flex flex-col gap-y-2",
            type === "blogs-page-card" ? "" : "px-4",
          )}
        >
          <h3
            className={cn(
              "line-clamp-1",
              type === "blogs-page-card"
                ? "text-xl font-extrabold"
                : "font-semibold",
            )}
          >
            {post.title}
          </h3>

          {type === "blogs-page-card" && (
            <h5 className={"line-clamp-3 text-base font-normal"}>
              {post.content}
            </h5>
          )}

          <div className="flex items-center gap-1 text-sm">
            <span>by</span>
            <span className="font-semibold">{post.author.fullName}</span>
            <span>on</span>
            <span className="font-semibold">{post.updatedAt}</span>
          </div>
        </div>
      </div>
    </Link>
  );
};

export default BlogCard;
