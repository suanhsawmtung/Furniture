import { PostForm } from "@/components/admin/post/form/post-form";
import AdminHeaderSection from "@/components/admin/shared/admin-header-section";
import { BackButton } from "@/components/admin/shared/back-button";
import { Card, CardContent } from "@/components/ui/card";
import { useGetPost } from "@/services/post/queries/useGetPost";
import { useParams } from "react-router";

const AdminPostEditPage = () => {
  const { slug } = useParams();

  if (!slug) {
    throw new Response("Post slug is required", { status: 400 });
  }

  const { data: post } = useGetPost(slug);

  return (
    <section className="w-full">
      <AdminHeaderSection title="Edit Post" />

      <div className="space-y-5">
        <BackButton to="/admin/posts" />
        <Card className="w-full">
          <CardContent className="flex flex-col gap-6 py-2">
            <PostForm post={post} />
          </CardContent>
        </Card>
      </div>
    </section>
  );
};

export default AdminPostEditPage;
