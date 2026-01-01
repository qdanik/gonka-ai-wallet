import { Bip39, EnglishMnemonic, Slip10, Slip10Curve } from "@cosmjs/crypto";
import {
  DirectSecp256k1HdWallet,
  DirectSecp256k1Wallet,
  type OfflineSigner,
} from "@cosmjs/proto-signing";
import { GONKA_ADDRESS_PREFIX, GONKA_HD_PATH } from "@/constants";
import type { GonkaWallet } from "@/types";
import type { GonkaClient } from "./client.module";

export class WalletModule {
  constructor(readonly _client: GonkaClient) {}

  async create(): Promise<GonkaWallet> {
    const signer = await DirectSecp256k1HdWallet.generate(24, {
      prefix: GONKA_ADDRESS_PREFIX,
    });
    const [account] = await signer.getAccounts();
    return {
      success: true,
      data: {
        signer,
        address: account.address,
      },
    };
  }

  async fromPrivateKey(privateKey: string): Promise<GonkaWallet> {
    const signer = await DirectSecp256k1Wallet.fromKey(
      Buffer.from(privateKey, "hex"),
      GONKA_ADDRESS_PREFIX,
    );
    const [account] = await signer.getAccounts();

    return {
      success: true,
      data: {
        address: account.address,
        signer,
      },
    };
  }

  async mnemonicToPrivateKey(mnemonic: string): Promise<string> {
    const seed = await Bip39.mnemonicToSeed(new EnglishMnemonic(mnemonic));
    const { privkey } = Slip10.derivePath(Slip10Curve.Secp256k1, seed, GONKA_HD_PATH);
    return Buffer.from(privkey).toString("hex");
  }

  async fromMnemonic(mnemonic: string): Promise<GonkaWallet> {
    const signer = await DirectSecp256k1HdWallet.fromMnemonic(mnemonic, {
      prefix: GONKA_ADDRESS_PREFIX,
      hdPaths: [GONKA_HD_PATH],
    });
    const [account] = await signer.getAccounts();
    return {
      success: true,
      data: {
        address: account.address,
        signer,
      },
    };
  }

  async getSigner(value: string): Promise<OfflineSigner> {
    const words = value.trim().split(" ");
    if (words.length === 12 || words.length === 24) {
      // it's a mnemonic
      return DirectSecp256k1HdWallet.fromMnemonic(value, {
        prefix: GONKA_ADDRESS_PREFIX,
        hdPaths: [GONKA_HD_PATH],
      });
    }

    if (value.length === 64) {
      // it's a private key
      return DirectSecp256k1Wallet.fromKey(Buffer.from(value, "hex"), GONKA_ADDRESS_PREFIX);
    }

    // assume it's a mnemonic
    return DirectSecp256k1HdWallet.fromMnemonic(value, {
      prefix: GONKA_ADDRESS_PREFIX,
      hdPaths: [GONKA_HD_PATH],
    });
  }
}
