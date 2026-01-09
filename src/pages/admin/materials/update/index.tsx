import { MaterialForm } from "@/components/admin/material/form/material-form";
import DialogWrapper from "@/components/wrapper/dialog-wrapper";
import { useMaterial } from "@/services/material/queries/useGetMaterial";
import { useNavigate, useParams } from "react-router";

const AdminMaterialEditDialog = () => {
  const navigate = useNavigate();
  const { slug } = useParams();

  if (!slug) {
    throw new Response("Material slug is required", { status: 400 });
  }

  const { data: material } = useMaterial(slug);

  return (
    <DialogWrapper
      title="Edit Material"
      close={() => navigate("/admin/materials")}
      onOpenChange={() => navigate("/admin/materials")}
      open={true}
    >
      <MaterialForm material={material} cancelUrl="/admin/materials" />
    </DialogWrapper>
  );
};

export default AdminMaterialEditDialog;
