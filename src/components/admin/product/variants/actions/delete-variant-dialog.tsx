import { Button } from "@/components/ui/button";
import DialogWrapper from "@/components/wrapper/dialog-wrapper";
import { useDeleteVariantMutation } from "@/services/product/queries/useDeleteVariant";
import type { ProductVariantSummaryType } from "@/types/product.type";
import { Loader2 } from "lucide-react";
import { useEffect, useState } from "react";
import { useParams } from "react-router";

interface DeleteVariantDialogProps {
  variant: ProductVariantSummaryType;
  children: React.ReactNode;
  totalVariantCount: number;
}

export function DeleteVariantDialog({
  variant,
  children,
  totalVariantCount,
}: DeleteVariantDialogProps) {
  const deleteVariantMutation = useDeleteVariantMutation();
  const [open, setOpen] = useState(false);

  const { slug } = useParams();

  if (!slug) {
    throw new Response("Product slug is required", { status: 400 });
  }

  useEffect(() => {
    if (deleteVariantMutation.isSuccess) {
      setOpen(false);
    }
  }, [deleteVariantMutation.isSuccess]);

  const handleDelete = () => {
    deleteVariantMutation.mutate({
      productSlug: slug,
      variantSlug: variant.slug,
    });
  };

  return (
    <DialogWrapper
      title="Delete Variant"
      close={() => setOpen(false)}
      onOpenChange={setOpen}
      open={open}
      triggerContent={children}
    >
      <div className="space-y-6">
        {(variant.isPrimary && totalVariantCount > 1) ? (
          <p className="text-muted-foreground text-sm">
            Primary variant cannot be deleted. Please select another variant as
            primary before deleting this variant.
          </p>
        ) : (
          <p className="text-muted-foreground text-sm">
            Are you sure you want to delete the variant of product{" "}
          </p>
        )}

        <div className="flex justify-end gap-2">
          <Button
            type="button"
            variant="outline"
            onClick={() => setOpen(false)}
            disabled={deleteVariantMutation.isPending}
          >
            {variant.isPrimary ? "Close" : "Cancel"}
          </Button>
          {(!variant.isPrimary || totalVariantCount === 1) && (
            <Button
              type="button"
              variant="destructive"
              onClick={handleDelete}
              disabled={deleteVariantMutation.isPending}
            >
              {deleteVariantMutation.isPending && (
                <Loader2 className="mr-2 size-4 animate-spin" />
              )}
              Delete
            </Button>
          )}
        </div>
      </div>
    </DialogWrapper>
  );
}
