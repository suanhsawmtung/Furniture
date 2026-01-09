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
