import { readFileSync } from "fs";
import * as path from "path";
import { BOC } from "ton3-core";

export const MINTER_CODE = BOC.fromStandard(
  readFileSync(path.join(__dirname, "../../func/build/jetton-minter.boc"))
);

export const WALLET_CODE = BOC.fromStandard(
  readFileSync(path.join(__dirname, "../../func/build/jetton-wallet.boc"))
);
