import type { OrderPaymentStatus, OrderSource, OrderStatus } from "@/types/order.type";
import type { PaymentStatus } from "@/types/payment.type";
import type { PostStatus } from "@/types/post.type";
import type { Concentration, Gender } from "@/types/product.type";
import type { RefundStatus } from "@/types/refund.type";
import type { Role, Status } from "@/types/user.type";
import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatPrice(
  price: number | string,
  opts: Intl.NumberFormatOptions = {},
) {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: opts.currency ?? "USD",
    notation: opts.notation ?? "compact",
  }).format(+price);
}

// Format user display name from AuthUser
// Returns firstName + lastName if available, otherwise username, email, or "User"
export function formatUserDisplayName(user: {
  firstName?: unknown;
  lastName?: unknown;
  username?: unknown;
  email?: string;
}): string {
  const firstName = user.firstName as string | undefined;
  const lastName = user.lastName as string | undefined;
  const username = user.username as string | undefined;

  if (firstName && lastName) {
    return `${firstName} ${lastName}`;
  }

  return username || user.email || "User";
}

// Get user initials from AuthUser
// Returns first letter of firstName + lastName, or first letter of username/email, or "U"
export function getUserInitials(user: {
  firstName?: unknown;
  lastName?: unknown;
  username?: unknown;
  email?: string;
}): string {
  const firstName = user.firstName as string | undefined;
  const lastName = user.lastName as string | undefined;
  const username = user.username as string | undefined;
  const email = user.email;

  if (firstName && lastName) {
    return `${firstName[0]}${lastName[0]}`.toUpperCase();
  }
  if (username) {
    return username[0].toUpperCase();
  }
  if (email) {
    return email[0].toUpperCase();
  }
  return "U";
}

// Format date and time as "Oct 22, 1998 08:30 AM"
export const formatDateTime = (date: Date | string): string => {
  const dateObj = typeof date === "string" ? new Date(date) : date;
  return new Intl.DateTimeFormat("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
    hour12: true,
  }).format(dateObj);
};

// Format date as "Oct 22, 1998"
export const formatDate = (date: Date | string): string => {
  const dateObj = typeof date === "string" ? new Date(date) : date;
  return new Intl.DateTimeFormat("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  }).format(dateObj);
};

// Type guard to validate if a string is a valid PostStatus
export function isPostStatus(
  value: string | null | undefined,
): value is PostStatus {
  return value === "DRAFT" || value === "PUBLISHED" || value === "ARCHIVED";
}

// Type guard to validate if a string is a valid RefundStatus
export function isRefundStatus(
  value: string | null | undefined,
): value is RefundStatus {
  return value === "PENDING" || value === "SUCCESS" || value === "FAILED" || value === "VOIDED";
}

// Type guard to validate if a string is a valid PaymentStatus
export function isPaymentStatus(
  value: string | null | undefined,
): value is PaymentStatus {
  return value === "PENDING" || value === "SUCCESS" || value === "FAILED" || value === "VOIDED";
}

// Type guard to validate if a string is a valid Status
export function isStatus(value: string | null | undefined): value is Status {
  return value === "ACTIVE" || value === "INACTIVE" || value === "FREEZE";
}

// Type guard to validate if a string is a valid Role
export function isRole(value: string | null | undefined): value is Role {
  return value === "USER" || value === "ADMIN" || value === "AUTHOR";
}

export function isReviewStatus(value: string | null | undefined): value is "publish" | "unpublish" {
  return value === "publish" || value === "unpublish";
}

export function getPostStatusVariant(status: PostStatus) {
  return status === "DRAFT"
    ? "secondary"
    : status === "PUBLISHED"
      ? "default"
      : "destructive";
}

// Get user role variant for badge
export function getUserRoleVariant(role: Role) {
  return role === "ADMIN"
    ? "default"
    : role === "AUTHOR"
      ? "secondary"
      : "outline";
}

// Get user status variant for badge
export function getUserStatusVariant(status: Status) {
  return status === "ACTIVE"
    ? "default"
    : status === "INACTIVE"
      ? "secondary"
      : "destructive";
}

// Get order status variant for badge
export function getOrderStatusVariant(status: OrderStatus) {
  switch (status) {
    case "PENDING":
      return "secondary";
    case "ACCEPTED":
      return "default";
    case "REJECTED":
      return "destructive";
    case "CANCELLED":
    case "DONE":
      return "outline";
    default:
      return "secondary";
  }
}

// Get payment status variant for badge
export function getPaymentStatusVariant(status: OrderPaymentStatus | PaymentStatus) {
  switch (status) {
    case "UNPAID":
      return "default";
    case "PENDING":
      return "secondary";
    case "PAID":
    case "SUCCESS":
      return "outline";
    case "FAILED":
    case "REFUNDED":
    case "PARTIALLY_REFUNDED":
    case "VOIDED":
      return "destructive";
    default:
      return "secondary";
  }
}

// Get refund status variant for badge
export function getRefundStatusVariant(status: RefundStatus) {
  switch (status) {
    case "PENDING":
      return "secondary";
    case "SUCCESS":
      return "outline";
    case "FAILED":
    case "VOIDED":
      return "destructive";
    default:
      return "secondary";
  }
}

// Format name from firstName and lastName
// Returns "firstName lastName" if both exist, just firstName/lastName if one exists, or "-" if neither exists
export function formatName({
  firstName,
  lastName,
  username,
}: {
  firstName: string | null | undefined;
  lastName: string | null | undefined;
  username: string | null | undefined;
}): string {
  const first = firstName || "";
  const last = lastName || "";

  if (first && last) {
    return `${first} ${last}`;
  }
  if (first) {
    return first;
  }
  if (last) {
    return last;
  }
  return username || "-";
}

// Type guard to validate if a string is a valid Concentration
export function isConcentration(
  value: string | null | undefined,
): value is Concentration {
  return (
    value === "EDC" || value === "EDT" || value === "EDP" || value === "PARFUM"
  );
}

// Type guard to validate if a string is a valid Gender
export function isGender(value: string | null | undefined): value is Gender {
  return value === "MALE" || value === "FEMALE" || value === "UNISEX";
}

// Get concentration variant for badge
export function getConcentrationVariant(concentration: Concentration) {
  return concentration === "PARFUM"
    ? "default"
    : concentration === "EDP"
      ? "secondary"
      : concentration === "EDT"
        ? "outline"
        : "destructive";
}

// Get gender variant for badge
export function getGenderVariant(gender: Gender) {
  return gender === "MALE"
    ? "default"
    : gender === "FEMALE"
      ? "secondary"
      : "outline";
}

// Type guard to validate if a string is a valid OrderStatus
export function isOrderStatus(
  value: string | null | undefined,
): value is OrderStatus {
  return (
    value === "PENDING" ||
    value === "REJECTED" ||
    value === "ACCEPTED" ||
    value === "DONE" ||
    value === "CANCELLED"
  );
}

// Type guard to validate if a string is a valid PaymentStatus
export function isOrderPaymentStatus(
  value: string | null | undefined,
): value is OrderPaymentStatus {
  return (
    value === "PAID" ||
    value === "UNPAID" ||
    value === "PENDING" ||
    value === "FAILED" ||
    value === "REFUNDED" ||
    value === "PARTIALLY_REFUNDED"
  );
}

export const isOrderSource = (
  value: string | null | undefined
): value is OrderSource => {
  return value === "ADMIN" || value === "CUSTOMER";
}

export function parseBoolean(value: string | null) {
  if (value === "true") return true;
  if (value === "false") return false;
  return undefined;
}

export const sleep = (ms: number) =>
  new Promise((resolve) => setTimeout(resolve, ms));
