import type { OfflineSigner } from "@cosmjs/proto-signing";
import type { GonkaSDKResults } from "./base.types";

export type GonkaSigner = {
  /** Bech32 address (gonka1...) */
  address: string;
  /** For server-side usage. In browser you'd pass OfflineSigner instead */
  mnemonic?: string;
};

export type WalletSuccess = {
  signer: OfflineSigner;
  address: string;
};

export type GonkaWallet = GonkaSDKResults<WalletSuccess>;
