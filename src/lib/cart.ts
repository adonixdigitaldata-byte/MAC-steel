import { CartItem, Product } from "@/types";
import { SITE_CONFIG } from "@/data/config";

const CART_STORAGE_KEY = "contratek_rfq_cart_v1";
const RFQ_SESSION_KEY = "contratek_rfq_session_ref";
const CUSTOMER_INFO_KEY = "contratek_rfq_customer_info";

export interface ProjectInformation {
  fullName: string;
  companyName: string;
  phone: string;
  email: string;
  projectLocation: string;
  projectName?: string;
  additionalNotes?: string;
}

export function getStoredCart(): CartItem[] {
  if (typeof window === "undefined") return [];
  try {
    const raw = localStorage.getItem(CART_STORAGE_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
}

export function saveStoredCart(cart: CartItem[]): void {
  if (typeof window === "undefined") return;
  try {
    localStorage.setItem(CART_STORAGE_KEY, JSON.stringify(cart));
  } catch (e) {
    console.error("Failed to save RFQ cart to localStorage", e);
  }
}

export function getStoredCustomerInfo(): ProjectInformation | null {
  if (typeof window === "undefined") return null;
  try {
    const raw = localStorage.getItem(CUSTOMER_INFO_KEY);
    return raw ? JSON.parse(raw) : null;
  } catch {
    return null;
  }
}

export function saveStoredCustomerInfo(info: ProjectInformation): void {
  if (typeof window === "undefined") return;
  try {
    localStorage.setItem(CUSTOMER_INFO_KEY, JSON.stringify(info));
  } catch (e) {
    console.error("Failed to save customer info to localStorage", e);
  }
}

export function addToCart(cart: CartItem[], product: Product, quantity = 1): CartItem[] {
  const existingIndex = cart.findIndex((item) => item.product.id === product.id);
  if (existingIndex > -1) {
    const updated = [...cart];
    updated[existingIndex] = {
      ...updated[existingIndex],
      quantity: updated[existingIndex].quantity + quantity,
    };
    return updated;
  }
  return [...cart, { product, quantity }];
}

export function updateCartQuantity(cart: CartItem[], productId: string, quantity: number): CartItem[] {
  if (quantity <= 0) {
    return cart.filter((item) => item.product.id !== productId);
  }
  return cart.map((item) => (item.product.id === productId ? { ...item, quantity } : item));
}

export function removeFromCart(cart: CartItem[], productId: string): CartItem[] {
  return cart.filter((item) => item.product.id !== productId);
}

export function clearCart(): void {
  if (typeof window === "undefined") return;
  localStorage.removeItem(CART_STORAGE_KEY);
  localStorage.removeItem(RFQ_SESSION_KEY);
}

/**
 * Generate or retrieve persistent RFQ reference ID (e.g., RFQ-2026-0001)
 */
export function getSessionRFQReference(): string {
  if (typeof window === "undefined") return "RFQ-2026-0001";
  try {
    const existing = localStorage.getItem(RFQ_SESSION_KEY);
    if (existing) return existing;
    const randomSuffix = String(Math.floor(1000 + Math.random() * 9000));
    const newRef = `RFQ-2026-${randomSuffix}`;
    localStorage.setItem(RFQ_SESSION_KEY, newRef);
    return newRef;
  } catch {
    return "RFQ-2026-0001";
  }
}

/**
 * Format plain text RFQ summary for clipboard copying
 */
export function generateRFQPlainText(
  items: CartItem[],
  info: ProjectInformation,
  rfqRef: string,
  isRtl: boolean = false
): string {
  const productList = items
    .map((item, idx) => {
      const p = item.product;
      const name = isRtl ? p.nameAr : p.name;
      const partNo = p.partNumber || p.id;
      const finish = p.finish ? `\n   Finish: ${p.finish}` : "";
      const material = p.material ? `\n   Material: ${p.material}` : "";
      return `${idx + 1}. ${name}\n   Part No: ${partNo}\n   Qty: ${item.quantity}${finish}${material}`;
    })
    .join("\n\n");

  const lines = [
    `CONTRATEK ENGINEERING RFQ SPECIFICATION`,
    `Reference: ${rfqRef}`,
    `----------------------------------------`,
    `CUSTOMER DETAILS:`,
    `Name: ${info.fullName}`,
    `Company: ${info.companyName}`,
    `Phone: ${info.phone}`,
    `Email: ${info.email}`,
    `Location: ${info.projectLocation}`,
    info.projectName ? `Project: ${info.projectName}` : "",
    `----------------------------------------`,
    `SPECIFICATION SCHEDULE:`,
    productList,
    `----------------------------------------`,
    info.additionalNotes ? `Notes: ${info.additionalNotes}` : `Notes: Please confirm availability and mill test certificates.`
  ].filter(Boolean);

  return lines.join("\n");
}

/**
 * Generates properly formatted and URL-encoded WhatsApp inquiry message
 */
export function generateWhatsAppRFQUrl(
  items: CartItem[],
  info: ProjectInformation,
  rfqRef: string,
  isRtl: boolean = false
): string {
  const phone = SITE_CONFIG.whatsappNumber.replace(/[^0-9]/g, "");

  const productList = items
    .map((item, idx) => {
      const p = item.product;
      const name = isRtl ? p.nameAr : p.name;
      const partNo = p.partNumber || p.id;
      const finish = p.finish ? `\n   Finish: ${p.finish}` : "";
      const material = p.material ? `\n   Material: ${p.material}` : "";
      return `${idx + 1}. ${name}\n   Part No: ${partNo}\n   Qty: ${item.quantity}${finish}${material}`;
    })
    .join("\n\n");

  const messageLines = [
    isRtl ? "مرحباً كونتراتك للهندسة والتوريد،" : "Hello Contratek Engineering,",
    "",
    isRtl ? "أود طلب عرض أسعار رسمي للمواصفات التالية:" : "I'd like to request a formal quotation.",
    "",
    `Reference:\n${rfqRef}`,
    "",
    `Products:\n\n${productList}`,
    "",
    `Customer:\n${info.fullName}`,
    "",
    `Company:\n${info.companyName}`,
    "",
    `Phone:\n${info.phone}`,
    "",
    `Email:\n${info.email}`,
    "",
    `Project Location:\n${info.projectLocation}`,
  ];

  if (info.projectName?.trim()) {
    messageLines.push("", `Project Name:\n${info.projectName.trim()}`);
  }

  if (info.additionalNotes?.trim()) {
    messageLines.push("", `Notes:\n${info.additionalNotes.trim()}`);
  } else {
    messageLines.push("", `Notes:\nPlease confirm availability, mill test certificates, and lead time.`);
  }

  const fullText = messageLines.join("\n");
  return `https://wa.me/${phone}?text=${encodeURIComponent(fullText)}`;
}
