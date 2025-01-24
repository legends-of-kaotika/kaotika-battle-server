import { ItemData } from "./ItemData";

export interface CartItem extends ItemData {
  qty: number;
}