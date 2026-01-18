import AdminHeaderSection from "@/components/admin/shared/admin-header-section";
import { BackButton } from "@/components/admin/shared/back-button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { baseImageUrl } from "@/config/env";
import { getPostStatusVariant } from "@/lib/utils";
import { useGetPost } from "@/services/post/queries/useGetPost";
import type { PostStatus } from "@/types/post.type";
import { useParams } from "react-router";

// Format author name from firstName and lastName
const formatAuthorName = (author: {
  firstName: string | null;
  lastName: string | null;
  email: string;
}): string => {
  const firstName = author.firstName || "";
  const lastName = author.lastName || "";
  if (firstName && lastName) {
    return `${firstName} ${lastName}`;
  }
  if (firstName) {
    return firstName;
  }
  if (lastName) {
    return lastName;
  }
  return author.email;
};

const AdminPostDetailPage = () => {
  const { slug } = useParams();

  if (!slug) {
    throw new Response("Post slug is required", { status: 400 });
  }

  const { data: post } = useGetPost(slug);
  const authorName = formatAuthorName(post.author);

  return (
    <section className="w-full">
      <AdminHeaderSection title="Post Detail" />

      <div className="space-y-5">
        <BackButton to="/admin/posts" />
        <Card className="w-full">
          <CardContent className="flex flex-col gap-6 py-2">
            {/* First div: Image and Data sections */}
            <div className="flex flex-col gap-6 lg:flex-row lg:gap-8">
              {/* Image section */}
              <div className="w-full lg:w-1/2">
                <img
                  src={baseImageUrl + "post/" + post.image}
                  alt={post.title}
                  className="h-auto w-full rounded-lg object-cover"
                  loading="lazy"
                  decoding="async"
                />
              </div>

              {/* Data section */}
              <div className="flex w-full flex-col gap-4 lg:w-1/2">
                <div>
                  <h1 className="text-2xl font-bold lg:text-3xl">
                    {post.title}
                  </h1>
                </div>

                <div className="flex flex-col gap-2 text-sm">
                  <div className="flex items-center gap-x-4">
                    <div className="flex min-w-20 items-center justify-between">
                      <span className="font-semibold">Author</span>
                      <span className="font-semibold">-</span>
                    </div>
                    <span>{authorName}</span>
                  </div>

                  <div className="flex items-center gap-x-4">
                    <div className="flex min-w-20 items-center justify-between">
                      <span className="font-semibold">Category</span>
                      <span className="font-semibold">-</span>
                    </div>
                    <span>{post.category.name}</span>
                  </div>

                  <div className="flex items-center gap-x-4">
                    <div className="flex min-w-20 items-center justify-between">
                      <span className="font-semibold">Status</span>
                      <span className="font-semibold">-</span>
                    </div>
                    <Badge
                      variant={getPostStatusVariant(post.status as PostStatus)}
                    >
                      {post.status}
                    </Badge>
                  </div>
                </div>

                <div>
                  <p className="text-base leading-relaxed">{post.excerpt}</p>
                </div>
              </div>
            </div>

            {/* Second div: Post body */}
            <div className="w-full">
              <div
                className="prose prose-sm dark:prose-invert lg:prose-base max-w-none"
                dangerouslySetInnerHTML={{ __html: post.content }}
              />
            </div>
          </CardContent>
        </Card>
      </div>
    </section>
  );
};

export default AdminPostDetailPage;
