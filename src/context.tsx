import {
  createContext,
  useContext,
  useReducer,
  useEffect,
  ReactNode,
} from "react";

import { InitialState, initialState } from "./reducer";
import { reducer } from "./reducer";

const url = "https://course-api.com/react-useReducer-cart-project";

type AppProviderProps = {
  children: ReactNode;
};

type AppContextData = InitialState & {
  clearCart: () => void;
  remove: (id: number) => void;
  toggleAmount: (id: number, type: "inc" | "dec") => void;
};

const AppContext = createContext({} as AppContextData);

export function AppProvider({ children }: AppProviderProps) {
  const [state, dispatch] = useReducer(reducer, initialState);

  function clearCart() {
    dispatch({ type: "CLEAR_CART" });
  }

  function remove(id: number) {
    dispatch({ type: "REMOVE", payload: id });
  }

  function toggleAmount(id: number, type: "inc" | "dec") {
    dispatch({ type: "TOGGLE_AMOUNT", payload: { id, type } });
  }

  async function fetchData() {
    dispatch({ type: "LOADING" });
    const response = await fetch(url);
    const cart = await response.json();
    dispatch({ type: "DISPLAY_ITEMS", payload: cart });
  }

  useEffect(() => {
    fetchData();
  }, []);

  useEffect(() => {
    dispatch({ type: "GET_TOTALS" });
  }, [state.cart]);

  return (
    <AppContext.Provider
      value={{
        ...state,
        clearCart,
        remove,
        toggleAmount,
      }}
    >
      {children}
    </AppContext.Provider>
  );
}
// make sure use
export function useGlobalContext() {
  return useContext(AppContext);
}
