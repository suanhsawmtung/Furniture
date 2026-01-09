import { TypeForm } from "@/components/admin/type/form/type-form";
import DialogWrapper from "@/components/wrapper/dialog-wrapper";
import { useType } from "@/services/type/queries/useGetType";
import { useNavigate, useParams } from "react-router";

const AdminTypeEditDialog = () => {
  const navigate = useNavigate();
  const { slug } = useParams();

  if (!slug) {
    throw new Response("Type slug is required", { status: 400 });
  }

  const { data: type } = useType(slug);

  return (
    <DialogWrapper
      title="Edit Type"
      close={() => navigate("/admin/types")}
      onOpenChange={() => navigate("/admin/types")}
      open={true}
    >
      <TypeForm type={type} cancelUrl="/admin/types" />
    </DialogWrapper>
  );
};

export default AdminTypeEditDialog;
