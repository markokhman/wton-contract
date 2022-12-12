import { Builder, Cell, Coins } from "ton3-core";
import { Emulator, matchers } from "@tonkite/vm";
import { globalConfig } from "./common/globalConfig";
import { JettonOperation } from "./common/JettonOperation";
import { parseBurnNotificationBody } from "./common/parsers/parseBurnNotificationBody";
import { WALLET_CODE } from "./common/contracts";
import { packInternalMessage } from "./common/packers/packInternalMessage";
import { packShardAccount } from "./common/packers/packShardAccount";
import { generateAddress } from "./common/generateAddress";

expect.extend(matchers);

describe("jetton_wallet", () => {
  const ROOT_ADDRESS = generateAddress();
  const OWNER_ADDRESS = generateAddress();

  let emulator: Emulator;
  let jettonWalletAccount: Cell;

  beforeAll(() => {
    emulator = new Emulator(globalConfig, null);
  });

  beforeEach(() => {
    jettonWalletAccount = packShardAccount({
      address: generateAddress(),
      code: WALLET_CODE,
      data: new Builder()
        .storeCoins(new Coins(1000)) // balance.
        .storeAddress(OWNER_ADDRESS) // owner_address
        .storeAddress(ROOT_ADDRESS) // jetton_master_address
        .storeRef(WALLET_CODE) // jetton_wallet_code
        .cell(),
      balance: new Coins(0.1),
    });
  });

  describe("burn", () => {
    test("should fail if balance is less than amount", async () => {
      const QUERY_ID = BigInt(Date.now());
      const AMOUNT = new Coins(5000);
      const RECIPIENT = generateAddress();

      const { transaction } = await emulator.emulateTransaction(
        jettonWalletAccount,
        packInternalMessage({
          src: OWNER_ADDRESS,
          value: new Coins(1), // 1 < 1 + 0.015 + 0.1
          body: new Builder()
            .storeUint(JettonOperation.BURN, 32)
            .storeUint(QUERY_ID, 64)
            .storeCoins(AMOUNT)
            .storeAddress(RECIPIENT)
            .storeBit(0)
            .cell(),
        })
      );

      expect(transaction).toHaveExitCode(706);
    });

    test("should fail if custom_response is null", async () => {
      const QUERY_ID = BigInt(Date.now());
      const AMOUNT = new Coins(100);

      const { transaction } = await emulator.emulateTransaction(
        jettonWalletAccount,
        packInternalMessage({
          src: OWNER_ADDRESS,
          value: new Coins(1),
          body: new Builder()
            .storeUint(JettonOperation.BURN, 32)
            .storeUint(QUERY_ID, 64)
            .storeCoins(AMOUNT)
            .storeAddress(null)
            .storeBit(0)
            .cell(),
        })
      );

      expect(transaction).toHaveExitCode(710);
    });

    test("should attach custom_response to burn_notification", async () => {
      const QUERY_ID = BigInt(Date.now());
      const AMOUNT = new Coins(100);
      const RECIPIENT = generateAddress();
      const CUSTOM_PAYLOAD = new Builder()
        .storeString("Custom payload.")
        .cell();

      const { transaction } = await emulator.emulateTransaction(
        jettonWalletAccount,
        packInternalMessage({
          src: OWNER_ADDRESS,
          value: new Coins(1),
          body: new Builder()
            .storeUint(JettonOperation.BURN, 32)
            .storeUint(QUERY_ID, 64)
            .storeCoins(AMOUNT)
            .storeAddress(RECIPIENT)
            .storeBit(1)
            .storeRef(CUSTOM_PAYLOAD)
            .cell(),
        })
      );

      expect(transaction).toHaveExitCode(0);

      const burnNotificationMessage = transaction.outMessages[0];
      const burnNotificationBody = parseBurnNotificationBody(
        burnNotificationMessage.body
      );

      expect(burnNotificationMessage.info.dest).toEqual(ROOT_ADDRESS);
      expect(burnNotificationBody).toEqual({
        operation: JettonOperation.BURN_NOTIFICATION_EXT,
        queryId: QUERY_ID,
        amount: AMOUNT,
        walletOwner: OWNER_ADDRESS,
        responseAddress: RECIPIENT,
        customPayload: CUSTOM_PAYLOAD,
      });
    });
  });
});
