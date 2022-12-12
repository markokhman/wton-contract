import { Builder, Cell, Slice } from "ton3-core";

export function parseInternalTransferBody(body: Cell) {
  const slice = Slice.parse(body);

  return {
    operation: slice.loadUint(32),
    queryId: slice.loadBigUint(64),
    amount: slice.loadCoins(),
    from: slice.loadAddress(),
    responseAddress: slice.loadAddress(),
    forwardAmount: slice.loadCoins(),
    forwardPayload: slice.loadBit()
      ? slice.loadRef()
      : new Builder().storeSlice(slice).cell(),
  };
}
