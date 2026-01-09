export type PostType = {
  id: number;
  slug: string;
  title: string;
  content: string;
  body: string;
  image: string;
  authorId: number;
  categoryId: number;
  createdAt: string; // ISO date string
  updatedAt: string; // ISO date string
  author: {
    id: number;
    firstName: string | null;
    lastName: string | null;
    phone: string | null;
    email: string;
  };
  category: {
    id: number;
    slug: string;
    createdAt: string;
    updatedAt: string;
    name: string;
  };
};

export interface PostListResult {
  posts: PostType[];
  currentPage: number;
  totalPages: number;
  pageSize: number;
}

export interface PostQueryParams {
  limit?: number;
  offset?: number;
  search?: string;
  category?: string;
}
