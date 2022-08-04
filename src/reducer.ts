import cartItems from "./data";
import { CartData } from "./@types/cart";

type ACTIONTYPE =
  | { type: "CLEAR_CART" }
  | { type: "REMOVE"; payload: number }
  | { type: "GET_TOTALS" }
  | { type: "LOADING" }
  | { type: "DISPLAY_ITEMS"; payload: CartData[] }
  | { type: "TOGGLE_AMOUNT"; payload: { id: number; type: "inc" | "dec" } };

export type InitialState = {
  loading: boolean;
  cart: CartData[];
  total: number;
  amount: number;
};

export const initialState: InitialState = {
  loading: false,
  cart: cartItems,
  total: 0,
  amount: 0,
};

export function reducer(state: typeof initialState, action: ACTIONTYPE) {
  if (action.type === "CLEAR_CART") {
    return { ...state, cart: [] };
  }

  if (action.type === "REMOVE") {
    const tempCart = state.cart.filter(cartItem => {
      const { id } = cartItem;

      return id !== action.payload;
    });

    return { ...state, cart: tempCart };
  }

  if (action.type === "TOGGLE_AMOUNT") {
    const tempCart = state.cart
      .map(cartItem => {
        if (cartItem.id === action.payload.id) {
          if (action.payload.type === "inc") {
            return { ...cartItem, amount: cartItem.amount + 1 };
          }

          if (action.payload.type === "dec") {
            return { ...cartItem, amount: cartItem.amount - 1 };
          }
        }

        return cartItem;
      })
      .filter(cartItem => cartItem.amount !== 0);

    return { ...state, cart: tempCart };
  }

  if (action.type === "GET_TOTALS") {
    let { total, amount } = state.cart.reduce(
      (cartTotal, cartItem) => {
        const { price, amount } = cartItem;
        const itemTotal = price * amount;

        cartTotal.total += itemTotal;
        cartTotal.amount += amount;

        return cartTotal;
      },
      {
        total: 0,
        amount: 0,
      }
    );

    total = parseFloat(total.toFixed(2));

    return { ...state, total, amount };
  }

  if (action.type === "LOADING") {
    return { ...state, loading: true };
  }

  if (action.type === "DISPLAY_ITEMS") {
    return { ...state, cart: action.payload, loading: false };
  }

  throw new Error("no matching action type");
}
