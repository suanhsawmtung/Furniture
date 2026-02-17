
export type OrderStatus = "PENDING" | "REJECTED" | "ACCEPTED" | "DONE";
export type PaymentStatus = "UNPAID" | "PAID";

export interface OrderType {
  id: number;
  code: string;
  totalPrice: number;
  status: OrderStatus;
  paymentStatus: PaymentStatus;
  customerName: string | null;
  customerPhone: string | null;
  customerAddress: string | null;
  customerNotes: string | null;
  rejectedReason: string | null;
  createdAt: string;
  updatedAt: string;
  userId: number;
  User: {
    // Assuming partial user data is returned
    firstName: string | null;
    lastName: string | null;
    username: string;
    email: string;
  };
  _count?: {
      products: number;
  }
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
}
