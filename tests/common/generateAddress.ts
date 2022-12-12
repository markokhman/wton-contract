import * as crypto from "crypto";
import { Address } from "ton3-core";

export function generateAddress(workchain = 0): Address {
  return new Address(`${workchain}:${crypto.randomBytes(32).toString("hex")}`);
}
