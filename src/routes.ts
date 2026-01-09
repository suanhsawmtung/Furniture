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
import AdminMaterialsPage from "@/pages/admin/materials";
import AdminOrdersPage from "@/pages/admin/orders";
import AdminPostsPage from "@/pages/admin/posts";
import AdminPostDetailPage from "@/pages/admin/posts/detail";
import { loader as adminPostDetailLoader } from "@/pages/admin/posts/detail/loader";
import { loader as adminPostsLoader } from "@/pages/admin/posts/loader";
import AdminProductsPage from "@/pages/admin/products";
import AdminSettingsPage from "@/pages/admin/settings";
import AdminTypesPage from "@/pages/admin/types";
import AdminUsersPage from "@/pages/admin/users";
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

import AdminCategoryCreateDialog from "@/pages/admin/categories/create";
import { action as adminCreateCategoryAction } from "@/pages/admin/categories/create/action";
import AdminCategoryDeleteDialog from "@/pages/admin/categories/delete";
import { action as adminDeleteCategoryAction } from "@/pages/admin/categories/delete/action";
import { loader as adminDeleteCategoryLoader } from "@/pages/admin/categories/delete/loader";
import { loader as adminCategoriesLoader } from "@/pages/admin/categories/loader";
import AdminCategoryEditDialog from "@/pages/admin/categories/update";
import { action as adminUpdateCategoryAction } from "@/pages/admin/categories/update/action";
import { loader as adminEditCategoryLoader } from "@/pages/admin/categories/update/loader";
import AdminMaterialCreateDialog from "@/pages/admin/materials/create";
import { action as adminCreateMaterialAction } from "@/pages/admin/materials/create/action";
import AdminMaterialDeleteDialog from "@/pages/admin/materials/delete";
import { action as adminDeleteMaterialAction } from "@/pages/admin/materials/delete/action";
import { loader as adminDeleteMaterialLoader } from "@/pages/admin/materials/delete/loader";
import { loader as adminMaterialsLoader } from "@/pages/admin/materials/loader";
import AdminMaterialEditDialog from "@/pages/admin/materials/update";
import { action as adminUpdateMaterialAction } from "@/pages/admin/materials/update/action";
import { loader as adminEditMaterialLoader } from "@/pages/admin/materials/update/loader";
import AdminTypeCreateDialog from "@/pages/admin/types/create";
import { action as adminCreateTypeAction } from "@/pages/admin/types/create/action";
import AdminTypeDeleteDialog from "@/pages/admin/types/delete";
import { action as adminDeleteTypeAction } from "@/pages/admin/types/delete/action";
import { loader as adminDeleteTypeLoader } from "@/pages/admin/types/delete/loader";
import { loader as adminTypesLoader } from "@/pages/admin/types/loader";
import AdminTypeEditDialog from "@/pages/admin/types/update";
import { action as adminUpdateTypeAction } from "@/pages/admin/types/update/action";
import { loader as adminEditTypeLoader } from "@/pages/admin/types/update/loader";

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
        path: "posts",
        children: [
          {
            index: true,
            Component: AdminPostsPage,
            loader: adminPostsLoader,
          },
          {
            path: ":slug",
            Component: AdminPostDetailPage,
            loader: adminPostDetailLoader,
          },
        ],
      },
      {
        path: "products",
        Component: AdminProductsPage,
      },
      {
        path: "materials",
        Component: AdminMaterialsPage,
        loader: adminMaterialsLoader,
        children: [
          {
            path: "create",
            Component: AdminMaterialCreateDialog,
            action: adminCreateMaterialAction,
          },
          {
            path: ":slug/edit",
            Component: AdminMaterialEditDialog,
            loader: adminEditMaterialLoader,
            action: adminUpdateMaterialAction,
          },
          {
            path: ":slug/delete",
            Component: AdminMaterialDeleteDialog,
            loader: adminDeleteMaterialLoader,
            action: adminDeleteMaterialAction,
          },
        ],
      },
      {
        path: "types",
        Component: AdminTypesPage,
        loader: adminTypesLoader,
        children: [
          {
            path: "create",
            Component: AdminTypeCreateDialog,
            action: adminCreateTypeAction,
          },
          {
            path: ":slug/edit",
            Component: AdminTypeEditDialog,
            loader: adminEditTypeLoader,
            action: adminUpdateTypeAction,
          },
          {
            path: ":slug/delete",
            Component: AdminTypeDeleteDialog,
            loader: adminDeleteTypeLoader,
            action: adminDeleteTypeAction,
          },
        ],
      },
      {
        path: "posts",
        Component: AdminPostsPage,
      },
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
      },
      {
        path: "orders",
        Component: AdminOrdersPage,
      },
      {
        path: "settings",
        Component: AdminSettingsPage,
      },
    ],
  },
]);
