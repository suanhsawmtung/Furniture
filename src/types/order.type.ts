import type { orderFilterFormSchema } from "@/validations/order.validation";
import type z from "zod";
import type { BrandType } from "./brand.type";
import type { ProductType, VariantSource } from "./product.type";

export type OrderStatus = "PENDING" | "REJECTED" | "ACCEPTED" | "DONE" | "CANCELLED";
export type OrderPaymentStatus = "UNPAID" | "PAID" | "PENDING" | "FAILED" | "REFUNDED" | "PARTIALLY_REFUNDED";
export type OrderSource = "CUSTOMER" | "ADMIN";

export interface OrderType {
  id: number;
  code: string;
  totalPrice: number;
  status: OrderStatus;
  paymentStatus: OrderPaymentStatus;
  customerName: string | null;
  customerPhone: string | null;
  customerAddress: string | null;
  customerNotes: string | null;
  rejectedReason: string | null;
  cancelledReason: string | null;
  createdAt: string;
  updatedAt: string;
  deletedAt: string | null;
  userId: number;
  source: OrderSource;
  image?: string
  user: {
    // Assuming partial user data is returned
    firstName: string | null;
    lastName: string | null;
    username: string;
    email: string;
  };
  _count?: {
    orderItems: number;
  };
}

export type OrderItemType = "PRODUCT_VARIANT" | "BUNDLE";

export interface OrderItem {
  id: number;
  orderId: number;
  itemId: number;
  itemType: OrderItemType;
  quantity: number;
  price: string | number;
  productVariant?: {
    id: number;
    slug: string;
    sku: string;
    size: number;
    price: number;
    discount: number;
    stock: number;
    productId: number;
    source: VariantSource;
    isPrimary: boolean;
    isActive: boolean;
    createdAt: string;
    updatedAt: string;
    deletedAt: string | null;
    product: ProductType & {
      brand: BrandType;
    };
  };
}

export interface OrderDetailType extends OrderType {
  orderItems: OrderItem[];
  // /** @deprecated use orderItems */
  // products: OrderItem[];
}

export interface OrderListResult {
  orders: OrderType[];
  currentPage: number;
  totalPages: number;
  pageSize: number;
}

export interface OrderQueryParams {
  limit?: number;
  offset?: number;
  search?: string;
  status?: string;
  paymentStatus?: string;
  source?: string;
}

export type OrderFilterFormValues = z.infer<typeof orderFilterFormSchema>;

export interface OrderItemCreateInput {
  itemId: number;
  itemType: OrderItemType;
  quantity: number;
  price: number;
}

export interface CreateOrderParams {
  customerName: string;
  customerPhone: string;
  customerAddress: string;
  customerNotes?: string;
  status: OrderStatus;
  paymentStatus: OrderPaymentStatus;
  userId: number;
  items: OrderItemCreateInput[];
  rejectedReason?: string;
  cancelledReason?: string;
}
