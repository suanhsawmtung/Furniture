import AuthLayout from "@/components/layouts/auth-layout";
import { RootLayout } from "@/components/layouts/root-layout";
import AboutPage from "@/pages/about";
import ConfirmPasswordPage from "@/pages/auth/confirm-password";
import ForgotPasswordPage from "@/pages/auth/forgot-password";
import ResetPasswordPage from "@/pages/auth/reset-passsword";
import SignInPage from "@/pages/auth/sign-in";
import SignUpPage from "@/pages/auth/sign-up";
import VerifyOtpPage from "@/pages/auth/verify-otp";
import BlogPage from "@/pages/blogs";
import BlogDetailPage from "@/pages/blogs/detail";
import ErrorPage from "@/pages/error";
import HomePage from "@/pages/home";
import ProductPage from "@/pages/products";
import ProductDetailPage from "@/pages/products/detail";
import ServicePage from "@/pages/services";
import { createBrowserRouter } from "react-router";
// Import loaders and actions
import AdminLayout from "@/components/layouts/admin-layout";
import AdminCategoriesPage from "@/pages/admin/categories";
import { loader as adminLoader } from "@/pages/admin/loader";
import AdminOrdersPage from "@/pages/admin/orders";
import { loader as adminOrdersLoader } from "@/pages/admin/orders/loader";
import AdminPostsPage from "@/pages/admin/posts";
import AdminPostCreatePage from "@/pages/admin/posts/create";
import { action as adminCreatePostAction } from "@/pages/admin/posts/create/action";
import AdminPostDetailPage from "@/pages/admin/posts/detail";
import { loader as adminPostDetailLoader } from "@/pages/admin/posts/detail/loader";
import { loader as adminPostsLoader } from "@/pages/admin/posts/loader";
import AdminPostEditPage from "@/pages/admin/posts/update";
import { action as adminUpdatePostAction } from "@/pages/admin/posts/update/action";
import { loader as adminEditPostLoader } from "@/pages/admin/posts/update/loader";
import AdminProductsPage from "@/pages/admin/products";
import AdminProductCreatePage from "@/pages/admin/products/create";
import { action as adminCreateProductAction } from "@/pages/admin/products/create/action";
import AdminProductDetailPage from "@/pages/admin/products/detail";
import { loader as adminProductDetailLoader } from "@/pages/admin/products/detail/loader";
import { loader as adminProductsLoader } from "@/pages/admin/products/loader";
import AdminProductEditPage from "@/pages/admin/products/update";
import { action as adminUpdateProductAction } from "@/pages/admin/products/update/action";
import { loader as adminEditProductLoader } from "@/pages/admin/products/update/loader";
import AdminProductVariantsPage from "@/pages/admin/products/variants";
import AdminProductVariantCreatePage from "@/pages/admin/products/variants/create";
import { action as adminCreateProductVariantAction } from "@/pages/admin/products/variants/create/action";
import AdminProductVariantDetailPage from "@/pages/admin/products/variants/detail";
import { loader as adminProductVariantDetailLoader } from "@/pages/admin/products/variants/detail/loader";
import { loader as adminProductVariantsLoader } from "@/pages/admin/products/variants/loader";
import AdminProductVariantEditPage from "@/pages/admin/products/variants/update";
import { action as adminUpdateProductVariantAction } from "@/pages/admin/products/variants/update/action";
import { loader as adminEditProductVariantLoader } from "@/pages/admin/products/variants/update/loader";
import AdminSettingsPage from "@/pages/admin/settings";
import AdminUsersPage from "@/pages/admin/users";
import AdminUserCreateDialog from "@/pages/admin/users/create";
import { action as adminCreateUserAction } from "@/pages/admin/users/create/action";
import AdminUserDeleteDialog from "@/pages/admin/users/delete";
import { action as adminDeleteUserAction } from "@/pages/admin/users/delete/action";
import { loader as adminDeleteUserLoader } from "@/pages/admin/users/delete/loader";
import { loader as adminUsersLoader } from "@/pages/admin/users/loader";
import AdminUserEditDialog from "@/pages/admin/users/update";
import { action as adminUpdateUserAction } from "@/pages/admin/users/update/action";
import { loader as adminEditUserLoader } from "@/pages/admin/users/update/loader";
import { action as confirmPasswordAction } from "@/pages/auth/confirm-password/action";
import { loader as confirmPasswordLoader } from "@/pages/auth/confirm-password/loader";
import { action as forgotPasswordAction } from "@/pages/auth/forgot-password/action";
import { loader as forgotPasswordLoader } from "@/pages/auth/forgot-password/loader";
import { loader as authLoader } from "@/pages/auth/loader";
import { action as logoutAction } from "@/pages/auth/logout/action";
import { action as resetPasswordAction } from "@/pages/auth/reset-passsword/action";
import { loader as resetPasswordLoader } from "@/pages/auth/reset-passsword/loader";
import { action as signInAction } from "@/pages/auth/sign-in/action";
import { loader as signInLoader } from "@/pages/auth/sign-in/loader";
import { action as signUpAction } from "@/pages/auth/sign-up/action";
import { loader as signUpLoader } from "@/pages/auth/sign-up/loader";
import { action as verifyOtpAction } from "@/pages/auth/verify-otp/action";
import { loader as verifyOtpLoader } from "@/pages/auth/verify-otp/loader";
import { action as resendOtpAction } from "@/pages/auth/verify-otp/resend-action";
import { loader as homeLoader } from "@/pages/home/loader";
import { action as productAction } from "@/pages/products/detail/action";
import { loader as productLoader } from "@/pages/products/detail/loader";
import { loader as productsLoader } from "@/pages/products/loader";
import { loader as rootLoader } from "@/pages/root/loader";

import AdminBrandsPage from "@/pages/admin/brands";
import AdminBrandCreateDialog from "@/pages/admin/brands/create";
import { action as adminCreateBrandAction } from "@/pages/admin/brands/create/action";
import AdminBrandDeleteDialog from "@/pages/admin/brands/delete";
import { action as adminDeleteBrandAction } from "@/pages/admin/brands/delete/action";
import { loader as adminDeleteBrandLoader } from "@/pages/admin/brands/delete/loader";
import { loader as adminBrandsLoader } from "@/pages/admin/brands/loader";
import AdminBrandEditDialog from "@/pages/admin/brands/update";
import { action as adminUpdateBrandAction } from "@/pages/admin/brands/update/action";
import { loader as adminEditBrandLoader } from "@/pages/admin/brands/update/loader";
import AdminCategoryCreateDialog from "@/pages/admin/categories/create";
import { action as adminCreateCategoryAction } from "@/pages/admin/categories/create/action";
import AdminCategoryDeleteDialog from "@/pages/admin/categories/delete";
import { action as adminDeleteCategoryAction } from "@/pages/admin/categories/delete/action";
import { loader as adminDeleteCategoryLoader } from "@/pages/admin/categories/delete/loader";
import { loader as adminCategoriesLoader } from "@/pages/admin/categories/loader";
import AdminCategoryEditDialog from "@/pages/admin/categories/update";
import { action as adminUpdateCategoryAction } from "@/pages/admin/categories/update/action";
import { loader as adminEditCategoryLoader } from "@/pages/admin/categories/update/loader";
import AdminDashboardPage from "./pages/admin";

export const router = createBrowserRouter([
  {
    path: "/",
    ErrorBoundary: ErrorPage,
    Component: RootLayout,
    loader: rootLoader,
    children: [
      {
        index: true,
        Component: HomePage,
        loader: homeLoader,
      },
      { path: "about", Component: AboutPage },
      { path: "services", Component: ServicePage },
      {
        path: "logout",
        action: logoutAction,
      },
      {
        path: "blogs",
        children: [
          { index: true, Component: BlogPage },
          { path: ":blogId", Component: BlogDetailPage },
        ],
      },
      {
        path: "products",
        children: [
          {
            index: true,
            Component: ProductPage,
            loader: productsLoader,
          },
          {
            path: ":productId",
            Component: ProductDetailPage,
            loader: productLoader,
            action: productAction,
          },
        ],
      },
    ],
  },
  {
    Component: AuthLayout,
    loader: authLoader,
    children: [
      {
        path: "/sign-in",
        Component: SignInPage,
        loader: signInLoader,
        action: signInAction,
      },
      {
        path: "/sign-up",
        Component: SignUpPage,
        loader: signUpLoader,
        action: signUpAction,
      },
      {
        path: "/verify-otp",
        Component: VerifyOtpPage,
        loader: verifyOtpLoader,
        action: verifyOtpAction,
      },
      {
        path: "/verify-otp/resend",
        action: resendOtpAction,
      },
      {
        path: "/verify-password-otp",
        Component: VerifyOtpPage,
        loader: verifyOtpLoader,
        action: verifyOtpAction,
      },
      {
        path: "/verify-password-otp/resend",
        action: resendOtpAction,
      },
      {
        path: "/confirm-password",
        Component: ConfirmPasswordPage,
        loader: confirmPasswordLoader,
        action: confirmPasswordAction,
      },
      {
        path: "/forgot-password",
        Component: ForgotPasswordPage,
        loader: forgotPasswordLoader,
        action: forgotPasswordAction,
      },
      {
        path: "/reset-password",
        Component: ResetPasswordPage,
        loader: resetPasswordLoader,
        action: resetPasswordAction,
      },
    ],
  },
  {
    path: "/admin",
    ErrorBoundary: ErrorPage,
    Component: AdminLayout,
    loader: adminLoader,
    children: [
      {
        index: true,
        Component: AdminDashboardPage,
        // loader: adminDashboardLoader,
      },
      {
        path: "posts",
        children: [
          {
            index: true,
            Component: AdminPostsPage,
            loader: adminPostsLoader,
            
          },
          {
            path: "create",
            Component: AdminPostCreatePage,
            action: adminCreatePostAction,
          },
          {
            path: ":slug",
            Component: AdminPostDetailPage,
            loader: adminPostDetailLoader,
          },
          {
            path: ":slug/edit",
            Component: AdminPostEditPage,
            loader: adminEditPostLoader,
            action: adminUpdatePostAction,
          },
        ],
      },
      {
        path: "products",
        children: [
          {
            index: true,
            Component: AdminProductsPage,
            loader: adminProductsLoader,
          },
          {
            path: "create",
            Component: AdminProductCreatePage,
            action: adminCreateProductAction,
          },
          {
            path: ":slug",
            Component: AdminProductDetailPage,
            loader: adminProductDetailLoader,
          },
          {
            path: ":slug/edit",
            Component: AdminProductEditPage,
            loader: adminEditProductLoader,
            action: adminUpdateProductAction,
          },
          {
            path: ":slug/variants",
            Component: AdminProductVariantsPage,
            loader: adminProductVariantsLoader,
          },
          {
            path: ":slug/variants/create",
            Component: AdminProductVariantCreatePage,
            action: adminCreateProductVariantAction,
          },
          {
            path: ":slug/variants/:variantSlug/edit",
            Component: AdminProductVariantEditPage,
            loader: adminEditProductVariantLoader,
            action: adminUpdateProductVariantAction,
          },
          {
            path: ":slug/variants/:variantSlug",
            Component: AdminProductVariantDetailPage,
            loader: adminProductVariantDetailLoader,
          },
        ]
      },
      // {
      //   path: "materials",
      //   Component: AdminMaterialsPage,
      //   loader: adminMaterialsLoader,
      //   children: [
      //     {
      //       path: "create",
      //       Component: AdminMaterialCreateDialog,
      //       action: adminCreateMaterialAction,
      //     },
      //     {
      //       path: ":slug/edit",
      //       Component: AdminMaterialEditDialog,
      //       loader: adminEditMaterialLoader,
      //       action: adminUpdateMaterialAction,
      //     },
      //     {
      //       path: ":slug/delete",
      //       Component: AdminMaterialDeleteDialog,
      //       loader: adminDeleteMaterialLoader,
      //       action: adminDeleteMaterialAction,
      //     },
      //   ],
      // },
      // {
      //   path: "types",
      //   Component: AdminTypesPage,
      //   loader: adminTypesLoader,
      //   children: [
      //     {
      //       path: "create",
      //       Component: AdminTypeCreateDialog,
      //       action: adminCreateTypeAction,
      //     },
      //     {
      //       path: ":slug/edit",
      //       Component: AdminTypeEditDialog,
      //       loader: adminEditTypeLoader,
      //       action: adminUpdateTypeAction,
      //     },
      //     {
      //       path: ":slug/delete",
      //       Component: AdminTypeDeleteDialog,
      //       loader: adminDeleteTypeLoader,
      //       action: adminDeleteTypeAction,
      //     },
      //   ],
      // },
      {
        path: "brands",
        Component: AdminBrandsPage,
        loader: adminBrandsLoader,
        children: [
          {
            path: "create",
            Component: AdminBrandCreateDialog,
            action: adminCreateBrandAction,
          },
          {
            path: ":slug/edit",
            Component: AdminBrandEditDialog,
            loader: adminEditBrandLoader,
            action: adminUpdateBrandAction,
          },
          {
            path: ":slug/delete",
            Component: AdminBrandDeleteDialog,
            loader: adminDeleteBrandLoader,
            action: adminDeleteBrandAction,
          },
        ],
      },
      // {
      //   path: "posts",
      //   Component: AdminPostsPage,
      // },
      {
        path: "categories",
        Component: AdminCategoriesPage,
        loader: adminCategoriesLoader,
        children: [
          {
            path: "create",
            Component: AdminCategoryCreateDialog,
            action: adminCreateCategoryAction,
          },
          {
            path: ":slug/edit",
            Component: AdminCategoryEditDialog,
            loader: adminEditCategoryLoader,
            action: adminUpdateCategoryAction,
          },
          {
            path: ":slug/delete",
            Component: AdminCategoryDeleteDialog,
            loader: adminDeleteCategoryLoader,
            action: adminDeleteCategoryAction,
          },
        ],
      },
      {
        path: "users",
        Component: AdminUsersPage,
        loader: adminUsersLoader,
        children: [
          {
            path: "create",
            Component: AdminUserCreateDialog,
            action: adminCreateUserAction,
          },
          {
            path: ":username/edit",
            Component: AdminUserEditDialog,
            loader: adminEditUserLoader,
            action: adminUpdateUserAction,
          },
          {
            path: ":username/delete",
            Component: AdminUserDeleteDialog,
            loader: adminDeleteUserLoader,
            action: adminDeleteUserAction,
          },
        ],
      },
      {
        path: "orders",
        Component: AdminOrdersPage,
        loader: adminOrdersLoader,
      },
      {
        path: "settings",
        Component: AdminSettingsPage,
      },
    ],
  },
]);
