import * as fs from "fs";
import * as path from "path";
import { BOC, Builder, Cell, HashmapE, Utils } from "ton3-core";
import DataURIParser from "datauri/parser";
import { Sha256 } from "@aws-crypto/sha256-js";

function sha256(input: string): Uint8Array {
  const sha = new Sha256();
  sha.update(input);
  return sha.digestSync();
}

function buildTokenContent(): Cell {
  const dataUriParser = new DataURIParser();

  const imageContent = fs.readFileSync(
    path.join(process.cwd(), "static/logo.svg")
  );

  const dataUri = dataUriParser.format("logo.svg", imageContent);

  const metadata = new HashmapE<Uint8Array, string>(256, {
    serializers: {
      key: (key) => Utils.Helpers.bytesToBits(key),
      value: (value) => {
        const storeTail = (builder: Builder, buffer: Uint8Array) => {
          const chunkSize = Math.floor(builder.remainder / 8);

          builder.storeBytes(buffer.slice(0, chunkSize));

          if (buffer.length > chunkSize) {
            const nextCell = new Builder();
            storeTail(nextCell, buffer.slice(chunkSize));
            builder.storeRef(nextCell.cell());
          }
        };

        const builder = new Builder().storeUint(0x00, 8);

        storeTail(builder, Utils.Helpers.stringToBytes(value));

        return new Builder().storeRef(builder.cell()).cell();
      },
    },
  });

  metadata.set(sha256("name"), "Wrapped TON");
  metadata.set(sha256("symbol"), "WTON");
  metadata.set(sha256("image"), dataUri.content!);

  return new Builder().storeUint(0x00, 8).storeDict(metadata).cell();
}

function main() {
  const jettonContent = buildTokenContent();
  const jettonWalletCode = BOC.fromStandard(
    fs.readFileSync(path.join(process.cwd(), "func/build/jetton-wallet.boc"))
  );

  const funcCode = `
;; NOTE: This file is auto-generated.
;; cell method_name() asm "B{...} B>boc PUSHREF";

cell jetton_content() asm "B{${BOC.toHexStandard(
    jettonContent
  )}} B>boc PUSHREF";

cell jetton_wallet_code() asm "B{${BOC.toHexStandard(
    jettonWalletCode
  )}} B>boc PUSHREF";
  `;

  fs.writeFileSync(
    path.join(process.cwd(), "func/jetton-minter.generated.fc"),
    funcCode.trim()
  );
}

main();
