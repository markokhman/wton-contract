import { Builder, Cell, Coins } from "ton3-core";
import { MessageInput } from "./MessageInput";
import { generateAddress } from "../generateAddress";

export function packInternalMessage(input: Partial<MessageInput> = {}): Cell {
  const builder = new Builder()
    // CommonMsgInfo
    .storeBit(0) // int_msg_info$0
    .storeBit(input.ihrDisabled ?? true ? 1 : 0) // ihr_disabled:Bool
    .storeBit(input.bounce ? 1 : 0) // bounce:Bool
    .storeBit(input.bounced ? 1 : 0) // bounced:Bool
    .storeAddress(input.src ?? generateAddress()) // src:MsgAddressInt
    .storeAddress(input.dest ?? generateAddress()) // dest:MsgAddressInt
    .storeCoins(input.value ?? new Coins(1)) // grams:Grams
    .storeBit(0) // other:ExtraCurrencyCollection
    .storeCoins(new Coins(0)) // ihr_fee:Grams
    .storeCoins(new Coins(0)) // fwd_fee:Grams
    .storeUint(0, 64) // created_lt:uint64
    .storeUint(0, 32); // created_at:uint32

  // init:(Maybe (Either StateInit ^StateInit))
  if (input.init) {
    builder.storeUint(0b11, 2).storeRef(input.init);
  } else {
    builder.storeBit(0);
  }

  // body:(Either X ^X)
  if (input.body) {
    builder.storeBit(1).storeRef(input.body);
  } else {
    builder.storeBit(0);
  }

  return builder.cell();
}
