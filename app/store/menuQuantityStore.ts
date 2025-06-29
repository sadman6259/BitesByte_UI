import { atom } from "jotai";
import { atomWithStorage, createJSONStorage } from "jotai/utils";
import { SimpleMenuType } from "../type/SimpleMenuType";

type CartItem = {
  quantity: number;
  menu: SimpleMenuType;
  menuName: string;
};

const storage = createJSONStorage<CartItem[]>(() => {
  if (typeof window !== 'undefined') {
    return {
      getItem: (key) => {
        try {
          const item = localStorage.getItem(key);
          return item ? JSON.parse(item) : null;
        } catch (error) {
          console.error('Error reading from localStorage', error);
          return null;
        }
      },
      setItem: (key, value) => {
        try {
          localStorage.setItem(key, JSON.stringify(value));
        } catch (error) {
          console.error('Error writing to localStorage', error);
        }
      },
      removeItem: (key) => {
        try {
          localStorage.removeItem(key);
        } catch (error) {
          console.error('Error removing from localStorage', error);
        }
      },
    };
  }
  return {
    getItem: () => null,
    setItem: () => {},
    removeItem: () => {},
  };
});

export const cartAtom = atomWithStorage<CartItem[]>("cart", [], storage);

// Derived atoms for common cart operations
export const totalItemsAtom = atom((get) => 
  get(cartAtom).reduce((total, item) => total + item.quantity, 0)
);

export const totalPriceAtom = atom((get) => 
  get(cartAtom).reduce((total, item) => 
    total + (item.menu.price * item.quantity), 0)
);

export const cartItemCountAtom = (menuName: string) => 
  atom((get) => {
    const cart = get(cartAtom);
    const item = cart.find(i => i.menu.menuName === menuName);
    return item ? item.quantity : 0;
  });