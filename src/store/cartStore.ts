import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";
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
  timestamp?: number;
}

export const useCartStore = create<CartState>()(
  persist(
    (set, get) => ({
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
        const timestamp = Date.now();
        set({ cart: [...existing, ...items], timestamp });
        toast.success("Products added to cart!");
      },

      removeFromCart: (id) =>
        set((state) => ({
          cart: state.cart.filter((item) => item.id !== id),
        })),

      clearCart: () => set({ cart: [] }),
    }),
    {
      name: "products_cart_storage",
      storage: typeof window !== "undefined"
        ? createJSONStorage(() => localStorage)
        : undefined,
      migrate: (persistedState: any) => {
        if (!persistedState) return { cart: [] };
        const ONE_DAY = 24 * 60 * 60 * 1000;
        if (persistedState.timestamp && Date.now() - persistedState.timestamp > ONE_DAY) {
          return { cart: [] };
        }
        return persistedState;
      },
    }
  )
);




export const useFacilityCartStore  =   create<any>()(
  (set)=>(
    {
      facility: {},
      setFacility: (item: any) => set({ facility: item }),
      clearFacility: () => set({ facility: {} }),
    }
  )
)