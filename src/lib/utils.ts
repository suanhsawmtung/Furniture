import type { PostStatus } from "@/types/post.type";
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

// Type guard to validate if a string is a valid Status
export function isStatus(
  value: string | null | undefined,
): value is Status {
  return value === "ACTIVE" || value === "INACTIVE" || value === "FREEZE";
}

// Type guard to validate if a string is a valid Role
export function isRole(
  value: string | null | undefined,
): value is Role {
  return value === "USER" || value === "ADMIN" || value === "AUTHOR";
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
