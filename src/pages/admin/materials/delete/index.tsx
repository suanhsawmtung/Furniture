import { DeleteMaterialDialog } from "@/components/admin/material/actions/delete-material-dialog";
import DialogWrapper from "@/components/wrapper/dialog-wrapper";
import { useMaterial } from "@/services/material/queries/useGetMaterial";
import { useNavigate, useParams } from "react-router";

const AdminMaterialDeleteDialog = () => {
  const navigate = useNavigate();
  const { slug } = useParams();

  if (!slug) {
    throw new Response("Material slug is required", { status: 400 });
  }

  const { data: material } = useMaterial(slug);

  return (
    <DialogWrapper
      title="Delete Material"
      close={() => navigate("/admin/materials")}
      onOpenChange={() => navigate("/admin/materials")}
      open={true}
    >
      <DeleteMaterialDialog material={material} cancelUrl="/admin/materials" />
    </DialogWrapper>
  );
};

export default AdminMaterialDeleteDialog;
