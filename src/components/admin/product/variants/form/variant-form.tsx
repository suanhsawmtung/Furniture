import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { TabButton } from "@/components/ui/tab-button";
import { baseImageUrl } from "@/config/env";
import { cn } from "@/lib/utils";
import type { ProductVariantType, VariantSource } from "@/types/product.type";
import {
  productVariantSchema,
  type ProductVariantFormValues,
} from "@/validations/product.validation";
import { zodResolver } from "@hookform/resolvers/zod";
import { Image as ImageIcon, Loader2, X } from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import { useForm } from "react-hook-form";
import { useNavigate, useNavigation, useSubmit } from "react-router";

interface ProductVariantFormProps {
  productSlug: string;
  cancelUrl?: string;
  submitButtonText?: string;
  variant?: ProductVariantType;
}

const sourceOptions: Array<{ key: VariantSource; text: string }> = [
  { key: "ORIGINAL", text: "Original" },
  { key: "DECANT", text: "Decant" },
];

const yesNoOptions = [
  { key: true, text: "Yes" },
  { key: false, text: "No" },
];

const toOptionalNumber = (value: string) =>
  value === "" ? undefined : Number(value);

export function ProductVariantForm({
  productSlug,
  cancelUrl,
  submitButtonText,
  variant,
}: ProductVariantFormProps) {
  const navigate = useNavigate();
  const submit = useSubmit();
  const navigation = useNavigation();
  const isSubmitting = navigation.state === "submitting";
  const isEditMode = !!variant;
  const [isPrimary, setIsPrimary] = useState(variant?.isPrimary || false);

  const initialImageSlots = useMemo(() => {
    if (variant?.images && variant.images.length > 0) {
      const sortedImages = [...variant.images].sort(
        (a, b) => Number(b.isPrimary) - Number(a.isPrimary),
      );
      return [
        ...sortedImages.map((img) => img.path),
        ...Array(4 - sortedImages.length).fill(null),
      ].slice(0, 4);
    }
    return Array.from({ length: 4 }, () => null);
  }, [variant]);

  const [imageSlots, setImageSlots] = useState<(File | string | null)[]>(
    initialImageSlots,
  );

  const form = useForm<ProductVariantFormValues>({
    resolver: zodResolver(productVariantSchema),
    defaultValues: {
      size: variant?.size || undefined,
      source: variant?.source || "ORIGINAL",
      price: variant?.price ? Number(variant.price) : undefined,
      discount: variant?.discount ? Number(variant.discount) : undefined,
      stock: variant?.stock !== undefined ? Number(variant.stock) : undefined,
      isPrimary: variant?.isPrimary || false,
      isActive: variant?.isActive ?? true,
      images: initialImageSlots.filter((slot): slot is string => !!slot),
    },
  });

  const previewUrls = useMemo(
    () =>
      imageSlots.map((slot) => {
        if (!slot) return null;
        if (slot instanceof File) return URL.createObjectURL(slot);
        return baseImageUrl + "product/" + slot;
      }),
    [imageSlots],
  );

  const nextEnabledIndex = useMemo(() => {
    const firstEmpty = imageSlots.findIndex((slot) => !slot);
    return firstEmpty === -1 ? imageSlots.length - 1 : firstEmpty;
  }, [imageSlots]);

  const lastSelectedIndex = useMemo(() => {
    for (let i = imageSlots.length - 1; i >= 0; i--) {
      if (imageSlots[i]) return i;
    }
    return -1;
  }, [imageSlots]);

  useEffect(() => {
    return () => {
      previewUrls.forEach((url, index) => {
        const slot = imageSlots[index];
        if (slot instanceof File && url) {
          URL.revokeObjectURL(url);
        }
      });
    };
  }, [previewUrls, imageSlots]);

  const handleImageChange =
    (index: number) => (event: React.ChangeEvent<HTMLInputElement>) => {
      const file = event.target.files?.[0];
      if (!file) {
        return;
      }
      const nextSlots = [...imageSlots];
      nextSlots[index] = file;
      setImageSlots(nextSlots);

      const nextImages = nextSlots.filter(
        (item): item is File | string => !!item,
      );
      form.setValue("images", nextImages as any, {
        shouldValidate: true,
        shouldDirty: true,
      });
    };

  const handleImageRemove = (index: number) => {
    const nextSlots = [...imageSlots];
    nextSlots[index] = null;
    setImageSlots(nextSlots);

    const nextImages = nextSlots.filter(
      (item): item is File | string => !!item,
    );
    form.setValue("images", nextImages as any, {
      shouldValidate: true,
      shouldDirty: true,
    });
  };

  const onSubmit = (values: ProductVariantFormValues) => {
    if (!imageSlots[0]) {
      form.setError("images", {
        type: "manual",
        message: "Primary image is required",
      });
      return;
    }

    const formData = new FormData();
    formData.append("size", String(values.size));
    if (values.source) {
      formData.append("source", values.source);
    }
    formData.append("price", String(values.price));
    if (typeof values.discount === "number") {
      formData.append("discount", String(values.discount));
    }
    if (typeof values.stock === "number") {
      formData.append("stock", String(values.stock));
    }
    if (typeof values.isPrimary === "boolean") {
      formData.append("isPrimary", String(values.isPrimary));
    }
    if (typeof values.isActive === "boolean") {
      formData.append("isActive", String(values.isActive));
    }

    if(values.price < (values.discount || 0)){
      form.setError("discount", {
        type: "manual",
        message: "Discount cannot be greater than price",
      });
      return;
    }

    // Only append images if there are NEW files selected
    // Note: We now send a fixed 4-slot imageLayout to allow precise updates/replacements
    // Pattern: ["existing.jpg", "__NEW__", "__EMPTY__", "__EMPTY__"]
    for (let i = 0; i < 4; i++) {
        const image = values.images[i];
        if (image instanceof File) {
            formData.append("images", image);
            formData.append("imageLayout", "__NEW__");
        } else if (typeof image === "string") {
            formData.append("imageLayout", image);
        } else {
            formData.append("imageLayout", "__EMPTY__");
        }
    }

    submit(formData, {
      method: isEditMode ? "PATCH" : "POST",
      encType: "multipart/form-data",
      action: isEditMode
        ? `/admin/products/${productSlug}/variants/${variant?.slug}/edit`
        : `/admin/products/${productSlug}/variants/create`,
    });
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        <div className="flex flex-col gap-6 lg:flex-row lg:gap-8">
          <div className="w-full lg:w-1/2">
            <FormField
              control={form.control}
              name="images"
              render={() => (
                <FormItem>
                  <FormLabel>Images</FormLabel>
                  <FormControl>
                    <div className="grid grid-cols-2 gap-3">
                      {previewUrls.map((previewUrl, index) => {
                        const inputId = `variant-image-${index}`;
                        const isDisabled = index > nextEnabledIndex;

                        return (
                          <label
                            key={inputId}
                            htmlFor={inputId}
                            className={cn(
                              "bg-muted/10 border-muted-foreground/25 relative flex aspect-square w-full flex-col items-center justify-center gap-3 rounded-lg border-2 border-dashed p-1 text-center md:p-4",
                              index === 0 ? "border-primary/60" : "",
                              isDisabled
                                ? "cursor-not-allowed opacity-50"
                                : "cursor-pointer",
                            )}
                          >
                            <input
                              id={inputId}
                              type="file"
                              accept="image/jpeg, image/png, image/jpg"
                              onChange={handleImageChange(index)}
                              className="hidden"
                              disabled={isSubmitting || isDisabled}
                            />
                            {previewUrl ? (
                              <>
                                {index === 0 && (
                                  <span className="bg-primary text-primary-foreground absolute top-3 left-3 rounded px-2 py-0.5 text-xs font-semibold">
                                    Primary
                                  </span>
                                )}

                                {lastSelectedIndex === index && index !== 0 && (
                                  <Button
                                    variant="outline"
                                    size="icon"
                                    className="absolute top-0.5 right-0.5 z-20 cursor-pointer rounded-full bg-white md:top-2 md:right-2"
                                    onClick={(e) => {
                                      e.preventDefault();
                                      handleImageRemove(index);
                                    }}
                                    disabled={isSubmitting}
                                  >
                                    <X className="size-4" />
                                  </Button>
                                )}

                                <img
                                  src={previewUrl}
                                  alt={`Variant image ${index + 1}`}
                                  className="h-full w-auto rounded-md"
                                  loading="lazy"
                                  decoding="async"
                                />
                              </>
                            ) : (
                              <>
                                {index === 0 && (
                                  <span className="bg-primary text-primary-foreground absolute top-3 left-3 rounded px-2 py-0.5 text-xs font-semibold">
                                    Primary
                                  </span>
                                )}
                                <ImageIcon className="text-muted-foreground h-6 w-6" />
                                <p className="text-muted-foreground text-xs font-normal">
                                  {index === 0
                                    ? "Add primary image"
                                    : `Add image ${index + 1}`}
                                </p>
                              </>
                            )}
                          </label>
                        );
                      })}
                    </div>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>

          <div className="flex w-full flex-col gap-6 lg:w-1/2 lg:gap-4">
            <FormField
              control={form.control}
              name="size"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Size (ml)</FormLabel>
                  <FormControl>
                    <Input
                      type="number"
                      placeholder="e.g. 100"
                      min={1}
                      onWheel={(event) => event.currentTarget.blur()}
                      value={field.value ?? ""}
                      onChange={(event) =>
                        field.onChange(toOptionalNumber(event.target.value))
                      }
                      disabled={isSubmitting}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="source"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Source</FormLabel>
                  <FormControl>
                    <div className="flex flex-wrap gap-2">
                      {sourceOptions.map((option) => (
                        <TabButton
                          key={option.key}
                          text={option.text}
                          isSelected={field.value === option.key}
                          onClick={() => field.onChange(option.key)}
                        />
                      ))}
                    </div>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="isPrimary"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Primary</FormLabel>
                  <FormControl>
                    <div className="flex flex-wrap gap-2">
                      {yesNoOptions.map((option) => (
                        <TabButton
                          key={String(option.key)}
                          text={option.text}
                          isSelected={field.value === option.key}
                          onClick={() => {
                            field.onChange(option.key);
                            if (option.key === true) {
                              setIsPrimary(true);
                              form.setValue("isActive", true, {
                                shouldValidate: true,
                                shouldDirty: true,
                              });
                            } else setIsPrimary(false);
                          }}
                        />
                      ))}
                    </div>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="isActive"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Active</FormLabel>
                  <FormControl>
                    <div className="flex flex-wrap gap-2">
                      {yesNoOptions.map((option) => (
                        <TabButton
                          key={String(option.key)}
                          text={option.text}
                          isSelected={field.value === option.key}
                          onClick={() => field.onChange(option.key)}
                          disabled={isPrimary}
                        />
                      ))}
                    </div>
                  </FormControl>
                  <FormMessage />
                  {isPrimary && (
                    <FormDescription>
                      Active status will be inherited from the primary variant.
                    </FormDescription>
                  )}
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="price"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Price</FormLabel>
                  <FormControl>
                    <Input
                      type="number"
                      placeholder="e.g. 120"
                      min={0}
                      step="0.01"
                      onWheel={(event) => event.currentTarget.blur()}
                      value={field.value ?? ""}
                      onChange={(event) => {
                        const newPrice = toOptionalNumber(event.target.value);
                        field.onChange(newPrice);
                      }}
                      disabled={isSubmitting}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="discount"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Discount</FormLabel>
                  <FormControl>
                    <Input
                      type="number"
                      placeholder="e.g. 10"
                      min={0}
                      step="0.01"
                      onWheel={(event) => event.currentTarget.blur()}
                      value={field.value ?? ""}
                      onChange={(event) =>
                        field.onChange(toOptionalNumber(event.target.value))
                      }
                      disabled={isSubmitting}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="stock"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Stock</FormLabel>
                  <FormControl>
                    <Input
                      type="number"
                      placeholder="e.g. 20"
                      min={0}
                      onWheel={(event) => event.currentTarget.blur()}
                      value={field.value ?? ""}
                      onChange={(event) =>
                        field.onChange(toOptionalNumber(event.target.value))
                      }
                      disabled={isSubmitting}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="mt-4 flex justify-end gap-2">
              <Button
                type="button"
                variant="outline"
                onClick={() =>
                  navigate(
                    cancelUrl || `/admin/products/${productSlug}/variants`,
                  )
                }
                disabled={isSubmitting}
              >
                Cancel
              </Button>
              <Button type="submit" disabled={isSubmitting}>
                {isSubmitting && (
                  <Loader2 className="mr-2 size-4 animate-spin" />
                )}
                {submitButtonText || (isEditMode ? "Update" : "Create")}
              </Button>
            </div>
          </div>
        </div>
      </form>
    </Form>
  );
}
