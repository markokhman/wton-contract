import { Address, Builder, Cell, Coins } from "ton3-core";
import { storeShardAccount } from "@tonkite/types";

export function packShardAccount({
  address,
  code,
  data,
  balance,
}: {
  address: Address;
  code: Cell;
  data: Cell;
  balance: Coins;
}): Cell {
  return storeShardAccount({
    account: {
      address,
      storageStat: {
        used: {
          bits: 0,
          cells: 0,
          publicCells: 0,
        },
        lastPaid: 0,
        duePayment: null,
      },
      storage: {
        lastTransactionLt: 0n,
        balance: {
          coins: balance,
          other: null,
        },
        state: {
          type: "active",
          splitDepth: null,
          special: null,
          code,
          data,
          libraries: null,
        },
      },
    },
    lastTransactionId: {
      hash: new Uint8Array(32),
      lt: 0n,
    },
  })(new Builder()).cell();
}
