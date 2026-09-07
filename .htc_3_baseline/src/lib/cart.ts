import { CartItem, Product } from "@/types";

const CART_STORAGE_KEY = "mac_product_request_cart";

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
    console.error("Failed to save cart to localStorage", e);
  }
}

export function addToCart(cart: CartItem[], product: Product, quantity = 1): CartItem[] {
  const existingIndex = cart.findIndex((item) => item.product.id === product.id);
  if (existingIndex > -1) {
    const updated = [...cart];
    updated[existingIndex].quantity += quantity;
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
