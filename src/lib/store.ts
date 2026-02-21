import { create } from "zustand";
import { persist } from "zustand/middleware";

export interface CartItem {
    id: string;
    name: string;
    price: number;
    image: string;
    size: string;
    color: string;
    quantity: number;
    slug: string;
}

interface CartStore {
    items: CartItem[];
    isOpen: boolean;
    openCart: () => void;
    closeCart: () => void;
    toggleCart: () => void;
    addItem: (item: Omit<CartItem, "quantity"> & { quantity?: number }) => void;
    removeItem: (id: string, size: string) => void;
    updateQuantity: (id: string, size: string, quantity: number) => void;
    clearCart: () => void;
    total: () => number;
    itemCount: () => number;
}

export const useCartStore = create<CartStore>()(
    persist(
        (set, get) => ({
            items: [],
            isOpen: false,
            openCart: () => set({ isOpen: true }),
            closeCart: () => set({ isOpen: false }),
            toggleCart: () => set((state) => ({ isOpen: !state.isOpen })),
            addItem: (item) =>
                set((state) => {
                    const quantityToAdd = item.quantity || 1;
                    const existing = state.items.find(
                        (i) => i.id === item.id && i.size === item.size
                    );
                    if (existing) {
                        return {
                            items: state.items.map((i) =>
                                i.id === item.id && i.size === item.size
                                    ? { ...i, quantity: i.quantity + quantityToAdd }
                                    : i
                            ),
                        };
                    }
                    const newItem = { ...item, quantity: quantityToAdd };
                    return { items: [...state.items, newItem as CartItem] };
                }),
            removeItem: (id, size) =>
                set((state) => ({
                    items: state.items.filter((i) => !(i.id === id && i.size === size)),
                })),
            updateQuantity: (id, size, quantity) =>
                set((state) => ({
                    items:
                        quantity <= 0
                            ? state.items.filter((i) => !(i.id === id && i.size === size))
                            : state.items.map((i) =>
                                i.id === id && i.size === size ? { ...i, quantity } : i
                            ),
                })),
            clearCart: () => set({ items: [] }),
            total: () =>
                get().items.reduce((sum, item) => sum + item.price * item.quantity, 0),
            itemCount: () =>
                get().items.reduce((sum, item) => sum + item.quantity, 0),
        }),
        {
            name: "cart-storage",
            partialize: (state) => ({ items: state.items }),
        }
    )
);
