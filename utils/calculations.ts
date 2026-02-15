import { GST_RATE } from "../constants/config";

export interface BillItem {
  id: string;
  itemName: string;
  vehicleBrand: string;
  quantity: number;
  listPrice: number;
  discountPercent: number;
  discountAmount: number;
  net: number;
  amount: number;
}

export interface ValidationError {
  hasError: boolean;
  message: string;
}

export const validateItemInput = (
  itemName: string,
  quantity: string,
  listPrice: string,
  discount: string
): ValidationError => {
  const qty = parseFloat(quantity);
  const list = parseFloat(listPrice);
  const discountPercent = parseFloat(discount) || 0;

  if (!itemName.trim()) {
    return { hasError: true, message: "Item name is required" };
  }
  if (!qty || qty <= 0) {
    return { hasError: true, message: "Valid quantity is required" };
  }
  if (!list || list <= 0) {
    return { hasError: true, message: "Valid price is required" };
  }
  if (discountPercent < 0 || discountPercent > 100) {
    return { hasError: true, message: "Discount must be between 0-100%" };
  }

  return { hasError: false, message: "" };
};

export const createBillItem = (
  itemName: string,
  vehicleBrand: string,
  quantity: string,
  listPrice: string,
  discount: string
): BillItem => {
  const qty = parseFloat(quantity);
  const list = parseFloat(listPrice);
  const discountPercent = parseFloat(discount) || 0;

  const discountAmount = list * (discountPercent / 100);
  const net = list - discountAmount;
  const amount = net * qty;

  return {
    id: Date.now().toString(),
    itemName,
    vehicleBrand,
    quantity: qty,
    listPrice: list,
    discountPercent,
    discountAmount,
    net,
    amount,
  };
};

export const calculateTotals = (items: BillItem[], gstIncluded: boolean) => {
  const grandTotal = items.reduce((acc, item) => acc + item.amount, 0);
  const totalGST = gstIncluded
    ? 0
    : items.reduce((acc, item) => acc + (item.amount * GST_RATE) / (1 + GST_RATE), 0);

  return { grandTotal, totalGST };
};
