import { PostForm } from "@/components/admin/post/form/post-form";
import AdminHeaderSection from "@/components/admin/shared/admin-header-section";
import { BackButton } from "@/components/admin/shared/back-button";
import { Card, CardContent } from "@/components/ui/card";

const AdminPostCreatePage = () => {
  return (
    <section className="w-full">
      <AdminHeaderSection title="Create Post" />

      <div className="space-y-5">
        <BackButton to="/admin/posts" />
        <Card className="w-full">
          <CardContent className="flex flex-col gap-6 py-2">
            <PostForm />
          </CardContent>
        </Card>
      </div>
    </section>
  );
};

export default AdminPostCreatePage;
