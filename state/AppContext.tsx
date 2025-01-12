import React, {
  useReducer,
  useContext,
  createContext,
  Dispatch,
  ReactNode,
} from "react";
import { mergeAppState } from "@/services/storageService";
import { initialState } from "@/state/initialState";
import { State, Action } from "@/types/state";

const appReducer = (state: State, action: Action): State => {
  switch (action.type) {
    case "loadStoredState":
      return {
        ...state,
        ...action.payload.state,
        stateLoaded: true,
      };
    case "saveProducts":
      let products = action.payload.products;
      mergeAppState({ products });
      return {
        ...state,
        products,
      };
    case "saveOrders":
      let orders = action.payload.orders;
      mergeAppState({ orders });
      return {
        ...state,
        orders,
      };
    default:
      throw new Error("Undefined action " + action);
  }
};

const StateCtx = createContext(initialState);
const DispatchCtx = createContext((() => 0) as Dispatch<Action>);

export const StateProvider = ({ children }: { children: ReactNode }) => {
  const [state, dispatch] = useReducer(appReducer, initialState);
  return (
    <DispatchCtx.Provider value={dispatch}>
      <StateCtx.Provider value={state}>{children}</StateCtx.Provider>
    </DispatchCtx.Provider>
  );
};
export const useDispatch = () => useContext(DispatchCtx);
export const useGlobalState = () => {
  return useContext(StateCtx);
};
