import type { HTMLAttributes } from "react";

export interface NavItem {
  title: string;
  href?: string;
  description?: string;
}

export interface NavItemWithChildren extends NavItem {
  card?: NavItemWithChildren[];
  menu?: NavItemWithChildren[];
}

export type CommonNavItem = NavItemWithChildren;

export interface NavigationProps {
  title: string;
  description: string;
  items: CommonNavItem[];
}

export type Image = {
  id: number;
  path: string;
};

export type Product = {
  id: string;
  name: string;
  description: string;
  images: string[];
  categoryId: string;
  price: number;
  discount: number;
  rating: number;
  inventory: number;
  status: "active" | "sold";
};

export type Tag = {
  name: string;
};

export type Post = {
  id: number;
  author: {
    fullName: string;
  };
  title: string;
  content: string;
  image: string;
  body: string;
  updatedAt: string;
  tags: string[];
};

export type CategoryType = {
  id: number;
  name: string;
  slug: string;
  createdAt: Date | string;
  updatedAt: Date | string;
  _count?: {
    posts: number;
  };
};

export type MaterialType = {
  id: number;
  name: string;
  slug: string;
  createdAt: Date | string;
  updatedAt: Date | string;
  _count?: {
    products: number;
  };
};

export type ProductTypeType = {
  id: number;
  name: string;
  slug: string;
  createdAt: Date | string;
  updatedAt: Date | string;
  _count?: {
    products: number;
  };
};

export type User = {
  id: string;
  firstName: string;
  lastName: string;
  username: string;
  email: string;
  imageUrl: string;
};

export type Cart = {
  id: string;
  name: string;
  price: number;
  quantity: number;
  image: {
    id: string;
    name: string;
    url: string;
  };
  category: string;
  subcategory: string;
};

export type IconProps = HTMLAttributes<SVGElement>;

// Auth action response type
export interface AuthActionResponse {
  success?: boolean;
  error?: string;
  message?: string;
}
