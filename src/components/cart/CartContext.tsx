"use client";

import React, { createContext, useContext, useEffect, useState, useCallback } from "react";
import { CartItem, Product } from "@/types";
import {
  getStoredCart,
  saveStoredCart,
  addToCart as helperAddToCart,
  updateCartQuantity as helperUpdateQuantity,
  removeFromCart as helperRemoveFromCart,
  clearCart as helperClearCart,
  getSessionRFQReference,
} from "@/lib/cart";

interface CartContextType {
  items: CartItem[];
  totalCount: number;
  totalQuantity: number;
  rfqReference: string;
  lastAddedProduct: { product: Product; quantity: number } | null;
  miniCartOpen: boolean;
  pulseTrigger: boolean;
  addItem: (product: Product, quantity?: number, openDrawer?: boolean) => void;
  updateQuantity: (productId: string, quantity: number) => void;
  removeItem: (productId: string) => void;
  clearAll: () => void;
  openMiniCart: () => void;
  closeMiniCart: () => void;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

export function CartProvider({ children }: { children: React.ReactNode }) {
  const [items, setItems] = useState<CartItem[]>([]);
  const [rfqReference, setRfqReference] = useState<string>("RFQ-2026-0001");
  const [lastAddedProduct, setLastAddedProduct] = useState<{ product: Product; quantity: number } | null>(null);
  const [miniCartOpen, setMiniCartOpen] = useState(false);
  const [pulseTrigger, setPulseTrigger] = useState(false);
  const [isMounted, setIsMounted] = useState(false);

  // Load from localStorage on mount
  useEffect(() => {
    setIsMounted(true);
    const stored = getStoredCart();
    setItems(stored);
    setRfqReference(getSessionRFQReference());

    const syncStorage = () => {
      setItems(getStoredCart());
    };

    window.addEventListener("storage", syncStorage);
    return () => window.removeEventListener("storage", syncStorage);
  }, []);

  const triggerBadgePulse = useCallback(() => {
    setPulseTrigger(true);
    setTimeout(() => setPulseTrigger(false), 800);
  }, []);

  const addItem = useCallback(
    (product: Product, quantity = 1, openDrawer = true) => {
      setItems((prev) => {
        const next = helperAddToCart(prev, product, quantity);
        saveStoredCart(next);
        return next;
      });
      setLastAddedProduct({ product, quantity });
      triggerBadgePulse();
      if (openDrawer) {
        setMiniCartOpen(true);
      }
    },
    [triggerBadgePulse]
  );

  const updateQuantity = useCallback(
    (productId: string, quantity: number) => {
      setItems((prev) => {
        const next = helperUpdateQuantity(prev, productId, quantity);
        saveStoredCart(next);
        return next;
      });
      triggerBadgePulse();
    },
    [triggerBadgePulse]
  );

  const removeItem = useCallback(
    (productId: string) => {
      setItems((prev) => {
        const next = helperRemoveFromCart(prev, productId);
        saveStoredCart(next);
        return next;
      });
      triggerBadgePulse();
    },
    [triggerBadgePulse]
  );

  const clearAll = useCallback(() => {
    helperClearCart();
    setItems([]);
    triggerBadgePulse();
  }, [triggerBadgePulse]);

  const openMiniCart = useCallback(() => setMiniCartOpen(true), []);
  const closeMiniCart = useCallback(() => setMiniCartOpen(false), []);

  const totalCount = isMounted ? items.length : 0;
  const totalQuantity = isMounted ? items.reduce((acc, curr) => acc + curr.quantity, 0) : 0;

  return (
    <CartContext.Provider
      value={{
        items,
        totalCount,
        totalQuantity,
        rfqReference,
        lastAddedProduct,
        miniCartOpen,
        pulseTrigger,
        addItem,
        updateQuantity,
        removeItem,
        clearAll,
        openMiniCart,
        closeMiniCart,
      }}
    >
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error("useCart must be used within a CartProvider");
  }
  return context;
}
