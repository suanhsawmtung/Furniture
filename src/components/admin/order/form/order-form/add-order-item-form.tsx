import { SearchableSelect } from "@/components/shared/searchable-select";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { formatPrice } from "@/lib/utils";
import { fetchProductVariants } from "@/services/product/api";
import { useListProducts } from "@/services/product/queries/useGetProducts";
import type { ProductVariantsSummaryType } from "@/types/product.type";
import { Plus } from "lucide-react";
import { useEffect, useState } from "react";

interface AddOrderItemFormProps {
  onAdd: (
    item: {
      itemId: number;
      itemType: "PRODUCT_VARIANT";
      quantity: number;
      price: number
    },
    metadata: {
      sku: string;
      size: number;
      productName: string;
      brandName: string;
      stock: number;
      originalPrice: number;
    }
  ) => void;
}

export const AddOrderItemForm = ({ onAdd }: AddOrderItemFormProps) => {
  const searchParams = new URLSearchParams(location.search);
  const productSearch = searchParams.get("product") || "";

  const [isAdding, setIsAdding] = useState(false);
  const [selectedProductSlug, setSelectedProductSlug] = useState<string | null>(null);
  const [selectedVariantId, setSelectedVariantId] = useState<string | null>(null);
  const [quantity, setQuantity] = useState(1);
  const [variantsData, setVariantsData] = useState<ProductVariantsSummaryType | null>(null);
  const [isLoadingVariants, setIsLoadingVariants] = useState(false);

  // Use standard useQuery for better UX (avoid suspending whole form)
  const { data: productsData, isLoading: isLoadingProducts } = useListProducts({
    offset: 0,
    limit: 30,
    search: productSearch,
  });

  useEffect(() => {
    const getVariants = async () => {
      if (!selectedProductSlug) {
        setVariantsData(null);
        return;
      }

      try {
        setIsLoadingVariants(true);
        const data = await fetchProductVariants(selectedProductSlug);
        setVariantsData(data);
      } catch (error) {
        console.error("Failed to fetch variants:", error);
        setVariantsData(null);
      } finally {
        setIsLoadingVariants(false);
      }
    };

    getVariants();
  }, [selectedProductSlug]);

  const selectedVariant = variantsData?.variants.find(v => String(v.id) === selectedVariantId);
  const price = selectedVariant?.discount && Number(selectedVariant.discount) > 0 
    ? Number(selectedVariant.discount) 
    : selectedVariant?.price || 0;
  const maxQuantity = (selectedVariant?.stock || 0) - (selectedVariant?.reserved || 0);
  const itemTotal = price * quantity;

  const reset = () => {
    setIsAdding(false);
    setSelectedProductSlug(null);
    setSelectedVariantId(null);
    setQuantity(1);
  };

  const handleAdd = () => {
    if (!selectedVariantId || !selectedVariant || !variantsData) return;
    
    onAdd({
      itemId: selectedVariant.id,
      itemType: "PRODUCT_VARIANT",
      quantity,
      price: Number(price),
    }, {
      sku: selectedVariant.sku,
      size: selectedVariant.size,
      productName: variantsData.name,
      brandName: variantsData.brand.name,
      stock: maxQuantity,
      originalPrice: selectedVariant.price,
    });

    // Reset
    reset();
  };

  if (!isAdding) {
    return (
      <Button 
        type="button" 
        variant="outline" 
        className="w-full border-dashed py-8 text-muted-foreground hover:text-foreground"
        onClick={() => setIsAdding(true)}
      >
        <Plus className="mr-2 h-4 w-4" />
        Add Product
      </Button>
    );
  }

  return (
    <div className="rounded-lg border bg-muted/30 p-4 space-y-4">
      <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-12 items-end">
        {/* Product Selection */}
        <div className="lg:col-span-4 space-y-2">
          <label className="text-sm font-medium">Product</label>
          <SearchableSelect
            items={productsData?.products.map(p => ({
              value: p.slug,
              label: `${p.name} (${p.brand.name})`
            })) || []}
            paramKey="product"
            placeholder="Select product..."
            emptyMessage="No products found"
            selectedValue={selectedProductSlug}
            itemToStringValue={(item: { value: string; label: string }) => item.label}
            onValueChange={(val: { value: string; label: string } | null) => {
              setSelectedProductSlug(val?.value || null);
              setSelectedVariantId(null);
            }}
            disabled={isLoadingProducts}
          />
        </div>

        {/* Variant Selection */}
        <div className="lg:col-span-4 space-y-2">
          <label className="text-sm font-medium">Variant</label>
          <SearchableSelect 
            items={variantsData?.variants.map(v => ({
              value: String(v.id),
              label: `${v.size}ml ${v.source === "DECANT" ? "(Decant)" : ""}`
            })) || []}
            paramKey="variant"
            placeholder="Select variant..."
            emptyMessage="No variants found"
            selectedValue={selectedVariantId}
            itemToStringValue={(item: { value: string; label: string }) => item.label}
            onValueChange={(val: { value: string; label: string } | null) => {
              setSelectedVariantId(val?.value || null);
            }}
            disabled={!selectedProductSlug || isLoadingVariants}
          />
        </div>

        {/* Quantity */}
        <div className="lg:col-span-2 space-y-2 h-full">
          <label className="text-sm font-medium">
            Quantity {selectedVariantId && `(${maxQuantity} left)`}
          </label>
          <Input 
            type="number" 
            min={1} 
            max={maxQuantity}
            value={quantity} 
            onChange={(e) => setQuantity(Math.min(maxQuantity, Math.max(1, parseInt(e.target.value) || 1)))} 
            disabled={!selectedVariantId || !selectedProductSlug || isLoadingVariants}
          />
        </div>

        {/* Price & Total */}
        <div className="lg:col-span-2 flex flex-col justify-end pb-3 text-right">
            <div className="text-xs text-muted-foreground">Total: {formatPrice(itemTotal)}</div>
            <div className="font-bold">
              {selectedVariant?.discount && Number(selectedVariant.discount) > 0 ? (
                <span className="space-x-1">
                  <span className="text-muted-foreground line-through text-xs">
                    {formatPrice(selectedVariant.price)}
                  </span>
                  <span>{formatPrice(Number(selectedVariant.discount))}</span>
                </span>
              ): (
                formatPrice(price)
              )}
              / unit
            </div>
        </div>
      </div>

      <div className="flex justify-end gap-2">
        <Button size="sm" variant="ghost" type="button" onClick={reset}>
          Cancel
        </Button>
        <Button size="sm" type="button" onClick={handleAdd} disabled={!selectedVariantId}>
          Confirm Add
        </Button>
      </div>
    </div>
  );
}