import { Cell, Slice } from "ton3-core";

export function parseReleaseBody(body: Cell) {
  const slice = Slice.parse(body);
  return {
    operation: slice.loadUint(32),
    queryId: slice.loadBigUint(64),
    customPayload: slice.loadBit() ? slice.loadRef() : null,
  };
}
