
import { create } from "zustand";


export const useRestaurantCartStore = create<any>()((set)=>({
    cart:[],
    restaurant: null,
    setRestaurantCart: (item:any) => set((state:any)=>({cart: [...state.cart, item]})),
    setRestaurant: (restaurant:any) => set({restaurant}),
    clearCart: () => set({cart: []}),
    removeItem: (id:any) => set((state:any)=>({cart: state.cart.filter((item:any)=> item.id !== id)}))

}))