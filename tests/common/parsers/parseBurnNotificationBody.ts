import { Cell, Slice } from "ton3-core";

export function parseBurnNotificationBody(body: Cell) {
  const slice = Slice.parse(body);
  return {
    operation: slice.loadUint(32),
    queryId: slice.loadBigUint(64),
    amount: slice.loadCoins(),
    walletOwner: slice.loadAddress(),
    responseAddress: slice.loadAddress(),
    customPayload: slice.loadBit() ? slice.loadRef() : null,
  };
}
