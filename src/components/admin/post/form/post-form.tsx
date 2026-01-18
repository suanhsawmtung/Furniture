import RichTextEditor from "@/components/shared/rich-text-editor";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { TabButton } from "@/components/ui/tab-button";
import { Textarea } from "@/components/ui/textarea";
import { baseImageUrl } from "@/config/env";
import { POST_STATUSES } from "@/constants/post.constant";
import { cn } from "@/lib/utils";
import { useGetAllCategories } from "@/services/category/queries/useGetAllCategories";
import { useAuthStore } from "@/stores/auth.store";
import type { PostFormValues, PostType } from "@/types/post.type";
import { postSchema } from "@/validations/post.validation";
import { zodResolver } from "@hookform/resolvers/zod";
import { Image as ImageIcon, Loader2 } from "lucide-react";
import { useCallback, useEffect, useMemo, useRef } from "react";
import { useForm } from "react-hook-form";
import { useNavigate, useNavigation, useSubmit } from "react-router";

interface PostFormProps {
  post?: PostType;
  cancelUrl?: string;
  submitButtonText?: string;
}

export function PostForm({
  post,
  cancelUrl = "/admin/posts",
  submitButtonText,
}: PostFormProps) {
  const navigate = useNavigate();
  const submit = useSubmit();
  const navigation = useNavigation();
  const isSubmitting = navigation.state === "submitting";
  const isEditMode = !!post;

  const authUser = useAuthStore((state) => state.authUser);
  const { data: categories, isLoading: isLoadingCategories } =
    useGetAllCategories();

  // Filter statuses based on user role - AUTHOR can only select DRAFT and PUBLISHED
  const statuses =
    authUser?.role === "ADMIN" ? POST_STATUSES : POST_STATUSES.slice(0, 2);

  const form = useForm<PostFormValues>({
    resolver: zodResolver(postSchema),
    defaultValues: {
      title: post?.title || "",
      categoryId: post?.categoryId ? String(post.categoryId) : "",
      excerpt: post?.excerpt || "",
      content: post?.content || "",
      image: undefined,
      status: post?.status || "DRAFT",
    },
  });

  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleImageClick = useCallback(() => {
    fileInputRef.current?.click();
  }, []);

  const handleImageChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const file = e.target.files?.[0];
      if (file) {
        // Store the File object directly
        form.setValue("image", file, { shouldValidate: true });
      }
    },
    [form],
  );

  const imageFile = form.watch("image");
  const imageUrl = useMemo(() => {
    // If a new file is selected, show preview from file
    if (imageFile) {
      return URL.createObjectURL(imageFile);
    }
    // If in edit mode and no new file, show existing post image
    if (isEditMode && post?.image) {
      return baseImageUrl + "post/" + post.image;
    }
    return null;
  }, [imageFile, isEditMode, post?.image]);

  // Cleanup object URL to prevent memory leaks
  useEffect(() => {
    return () => {
      if (imageUrl) {
        URL.revokeObjectURL(imageUrl);
      }
    };
  }, [imageUrl]);

  const onSubmit = (values: PostFormValues) => {
    const formData = new FormData();
    formData.append("title", values.title);
    formData.append("categoryId", values.categoryId);
    formData.append("excerpt", values.excerpt);
    formData.append("content", values.content);
    // Append status (DRAFT as default for create, or current status for update)
    // Status is hidden in create mode but always defaults to DRAFT
    formData.append("status", values.status || "DRAFT");
    // Append the File object directly (only if new file is selected)
    if (values.image) {
      formData.append("image", values.image);
    }

    submit(formData, {
      method: isEditMode ? "PATCH" : "POST",
      encType: "multipart/form-data",
    });
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        {/* First div: Image placeholder and Data sections */}
        <div className="flex flex-col gap-6 lg:flex-row lg:gap-8">
          {/* Image placeholder section */}
          <div className="w-full lg:w-1/2">
            <FormField
              control={form.control}
              name="image"
              render={() => (
                <FormItem>
                  <FormLabel className="hidden lg:block">Image</FormLabel>
                  <FormControl>
                    <div
                      onClick={handleImageClick}
                      className={cn(
                        "bg-muted/10 flex h-auto w-full flex-col items-center justify-center gap-3 rounded-lg",
                        imageUrl
                          ? "cursor-pointer"
                          : "border-muted-foreground/25 cursor-pointer border-2 border-dashed p-8",
                      )}
                    >
                      <input
                        ref={fileInputRef}
                        type="file"
                        accept="image/jpeg, image/png, image/jpg"
                        onChange={handleImageChange}
                        className="hidden"
                        disabled={isSubmitting}
                      />
                      {imageUrl ? (
                        <div className="relative w-full overflow-hidden rounded-lg">
                          <img
                            src={imageUrl}
                            alt="Preview"
                            className="h-auto w-full rounded-lg object-cover"
                          />
                        </div>
                      ) : (
                        <div className="flex min-h-[182px] flex-col items-center justify-center gap-3">
                          <ImageIcon className="text-muted-foreground h-6 w-6" />
                          <p className="text-muted-foreground text-xs font-normal">
                            Choose an Image
                          </p>
                        </div>
                      )}
                    </div>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>

          {/* Data section */}
          <div className="flex w-full flex-col gap-6 lg:w-1/2 lg:gap-4">
            {/* Title Input */}
            <FormField
              control={form.control}
              name="title"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Title</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="Enter post title"
                      {...field}
                      disabled={isSubmitting}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Category Select */}
            <FormField
              control={form.control}
              name="categoryId"
              render={({ field }) => {
                const selectValue = field.value || undefined;

                return (
                  <FormItem>
                    <FormLabel>Category</FormLabel>
                    <Select
                      onValueChange={(value) => {
                        field.onChange(value);
                      }}
                      value={selectValue}
                      disabled={isLoadingCategories || isSubmitting}
                    >
                      <FormControl>
                        <SelectTrigger className="w-full">
                          <SelectValue placeholder="Select a category" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {categories?.map((category) => (
                          <SelectItem
                            key={category.id}
                            value={String(category.id)}
                          >
                            {category.name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                );
              }}
            />

            {/* Status Field - Only shown in edit mode */}
            {isEditMode && (
              <FormField
                control={form.control}
                name="status"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Status</FormLabel>
                    <FormControl>
                      <div className="flex flex-wrap gap-2">
                        {statuses.map((stat) => (
                          <TabButton
                            key={stat.key}
                            text={stat.text}
                            isSelected={field.value === stat.key}
                            onClick={() => {
                              field.onChange(stat.key);
                            }}
                          />
                        ))}
                      </div>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            )}

            {/* Excerpt Textarea */}
            <FormField
              control={form.control}
              name="excerpt"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Excerpt</FormLabel>
                  <FormControl>
                    <Textarea
                      placeholder="Enter post excerpt"
                      {...field}
                      disabled={isSubmitting}
                      className="min-h-[100px] leading-relaxed"
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
        </div>

        {/* Second div: Content RichTextEditor */}
        <div className="w-full">
          <FormField
            control={form.control}
            name="content"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Content</FormLabel>
                <FormControl>
                  <RichTextEditor
                    value={field.value}
                    onChange={field.onChange}
                    placeholder="Enter post content"
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        {/* Action Buttons */}
        <div className="flex justify-end gap-2">
          <Button
            type="button"
            variant="outline"
            onClick={() => navigate(cancelUrl)}
            disabled={isSubmitting}
          >
            Cancel
          </Button>
          <Button type="submit" disabled={isSubmitting}>
            {isSubmitting && <Loader2 className="mr-2 size-4 animate-spin" />}
            {submitButtonText || (isEditMode ? "Update" : "Create")}
          </Button>
        </div>
      </form>
    </Form>
  );
}
