import { InventoryItem } from "./itemInvCrud";

export type CartItem = InventoryItem & {
  cartQuantity: number;
};

const CART_KEY = "posCart";

export const getCart = (): CartItem[] => {
  const raw = localStorage.getItem(CART_KEY);
  return raw ? JSON.parse(raw) : [];
};

export const saveCart = (cart: CartItem[]) => {
  localStorage.setItem(CART_KEY, JSON.stringify(cart));
};

export const addItemToCart = (item: InventoryItem) => {
  const cart = getCart();

  const existingItem = cart.find((c) => c.item_id === item.item_id);

  let updatedCart: CartItem[];

  if (existingItem) {
    updatedCart = cart.map((c) =>
      c.item_id === item.item_id
        ? {
            ...c,
            cartQuantity: Math.min(c.cartQuantity + 1, c.quantity),
          }
        : c,
    );
  } else {
    updatedCart = [
      ...cart,
      {
        ...item,
        cartQuantity: item.quantity > 0 ? 1 : 0,
      },
    ];
  }

  saveCart(updatedCart);
};

export const updateItemCartQuantity = (itemId: string, newCount: number) => {
  const cart = getCart()
    .map((item) =>
      item.item_id === itemId
        ? {
            ...item,
            cartQuantity: Math.max(0, Math.min(newCount, item.quantity)),
          }
        : item,
    )
    .filter((item) => item.cartQuantity > 0);

  saveCart(cart);
  return cart;
};

export const clearCart = () => {
  localStorage.removeItem(CART_KEY);
};