import type { Event, StdFee } from "@cosmjs/stargate";
import type { GonkaSDKResults } from "./base.types";

export type TxEventAttribute = {
  key: string;
  value: string;
};

export type TxEvent = Event;

export type TxStatusSuccess = {
  code: number;
  hash: string;
  height: number;
  rawLog: string;
  gasUsed: bigint;
  gasWanted: bigint;
  events: readonly TxEvent[];
};

export type TxStatusFailure = {
  hash: string;
};

export type TxStatusResults = GonkaSDKResults<TxStatusSuccess, TxStatusFailure>;

export type TxSendParams = {
  memo?: string;
  gasPrice?: string;
  fee?: StdFee | "auto" | number;
};

export type TxSendSuccess = {
  txHash: string;
  height: number;
  gasUsed: bigint;
  gasWanted: bigint;
  events: readonly TxEvent[];
};

export type TxSendResults = GonkaSDKResults<TxSendSuccess>;
