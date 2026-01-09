import AdminHeaderSection from "@/components/admin/shared/admin-header-section";
import { BackButton } from "@/components/admin/shared/back-button";
import { Card, CardContent } from "@/components/ui/card";
import { baseImageUrl } from "@/config/env";
import { usePost } from "@/services/post/queries/useGetPost";
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

  const { data: post } = usePost(slug);
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
                  src={baseImageUrl + post.image}
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
                  <div>
                    <span className="font-semibold">Author: </span>
                    <span>{authorName}</span>
                  </div>

                  <div>
                    <span className="font-semibold">Category: </span>
                    <span>{post.category.name}</span>
                  </div>
                </div>

                <div>
                  <p className="text-base leading-relaxed">{post.content}</p>
                </div>
              </div>
            </div>

            {/* Second div: Post body */}
            <div className="w-full">
              <div
                className="prose prose-sm dark:prose-invert lg:prose-base max-w-none"
                dangerouslySetInnerHTML={{ __html: post.body }}
              />
            </div>
          </CardContent>
        </Card>
      </div>
    </section>
  );
};

export default AdminPostDetailPage;
