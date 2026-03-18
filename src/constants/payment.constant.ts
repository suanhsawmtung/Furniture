export const PAYMENT_STATUSES = [
  { key: "PENDING", text: "Pending" },
  { key: "SUCCESS", text: "Success" },
  { key: "FAILED", text: "Failed" },
  { key: "VOIDED", text: "Voided" },
] as const;

export const PAYMENT_METHODS = [
  { key: "BANK_TRANSFER", text: "Bank Transfer" },
  { key: "CASH", text: "Cash" },
  { key: "CARD", text: "Card" },
  { key: "E_WALLET", text: "E-Wallet" },
] as const;
