import { Address, Cell, Coins } from "ton3-core";

export interface MessageInput {
  ihrDisabled: boolean;
  bounce: boolean;
  bounced: boolean;
  value: Coins;
  src: Address;
  dest: Address;
  init: Cell;
  body: Cell;
}
