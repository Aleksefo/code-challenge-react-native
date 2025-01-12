import { Product } from "@/types/products";
import { Order } from "@/types/orders";

export interface State {
  products?: Product[];
  orders?: Order[];
  stateLoaded?: boolean;
}

export type Action =
  | {
      type: "loadStoredState";
      payload: {
        state: State;
      };
    }
  | {
      type: "saveProducts";
      payload: {
        products: Product[];
      };
    }
  | {
      type: "saveOrders";
      payload: {
        orders: Order[];
      };
    };
