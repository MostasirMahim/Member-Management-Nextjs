import { create } from "zustand";
import { toast } from "react-toastify";

interface Product {
  id: number;
  name: string;
  sku: string;
  price: number;
  quantity: number;
}

interface CartState {
  cart: Product[];
  addToCart: (items: Product[]) => void;
  removeFromCart: (id: number) => void;
  clearCart: () => void;
}

export const useCartStore = create<CartState>((set, get) => ({
  cart: [],

  addToCart: (items) => {
    const existing = get().cart;
    const duplicates = items.filter(item =>
      existing.some(e => e.id === item.id)
    );

    if (duplicates.length) {
      toast.error(`Product "${duplicates[0].name}" is already in the cart`);
      return;
    }

    set({ cart: [...existing, ...items] });
    toast.success("Products added to cart!");
  },

  removeFromCart: (id) =>
    set((state) => ({
      cart: state.cart.filter((item) => item.id !== id),
    })),

  clearCart: () => set({ cart: [] }),
}));
