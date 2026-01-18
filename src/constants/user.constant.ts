import type { Role, Status } from "@/types/user.type";

export const USER_ROLES: { text: string; key: Role }[] = [
  { text: "User", key: "USER" },
  { text: "Admin", key: "ADMIN" },
  { text: "Author", key: "AUTHOR" },
];

export const USER_STATUSES: { text: string; key: Status }[] = [
  { text: "Active", key: "ACTIVE" },
  { text: "Inactive", key: "INACTIVE" },
  { text: "Freeze", key: "FREEZE" },
];
