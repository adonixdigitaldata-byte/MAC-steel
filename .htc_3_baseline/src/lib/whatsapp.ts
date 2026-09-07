import { CartItem, OrderCustomerDetails } from "@/types";
import { SITE_CONFIG } from "@/data/config";

/**
 * Formats order request details into a WhatsApp message URL.
 * Message content is explicitly generated in ENGLISH regardless of locale.
 */
export function buildWhatsAppUrl(
  items: CartItem[],
  customer: OrderCustomerDetails
): string {
  const cleanPhone = SITE_CONFIG.whatsappNumber.replace(/[^0-9+]/g, "");

  let message = `ORDER REQUEST\n\n`;
  message += `Customer:\n${customer.name}\n\n`;
  message += `Mobile:\n${customer.mobile}\n\n`;
  
  if (customer.email && customer.email.trim() !== "") {
    message += `Email:\n${customer.email}\n\n`;
  }

  message += `Products:\n\n`;

  items.forEach((item, index) => {
    const qtyStr = String(item.quantity).padStart(2, "0");
    message += `${index + 1}. ${item.product.name}\nQuantity: ${qtyStr}\n\n`;
  });

  const encodedMessage = encodeURIComponent(message);
  return `https://wa.me/${cleanPhone}?text=${encodedMessage}`;
}
