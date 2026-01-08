import type { GonkaSDKResults } from "./base.types";

export type AccountSuccess = {
  address: string;
  denom: string;
  amount: string;
  amountGonka: string;
};

export type AccountBalance = GonkaSDKResults<AccountSuccess>;

export type AccountBalances = GonkaSDKResults<AccountSuccess[]>;
