import { assertGonkaPrefix, fromNgonka } from "@/lib/denom";
import type { AccountBalance, AccountBalances } from "@/types/account.types";
import type { GonkaClient } from "./client.module";

export class AccountModule {
  constructor(private readonly client: GonkaClient) {}

  async balance(address: string): Promise<AccountBalance> {
    assertGonkaPrefix(address);
    const client = await this.client.connect();
    const balance = await client.getBalance(address, this.client.denom);

    return {
      success: true,
      data: {
        address,
        denom: balance.denom,
        amount: balance.amount,
        amountGonka: fromNgonka(balance.amount),
      },
    };
  }

  async balances(address: string): Promise<AccountBalances> {
    assertGonkaPrefix(address);
    const client = await this.client.connect();
    const balances = await client.getAllBalances(address);

    return {
      success: true,
      data: balances.map((balance) => ({
        address,
        denom: balance.denom,
        amount: balance.amount,
        amountGonka: fromNgonka(balance.amount),
      })),
    };
  }

  async sequence(address: string): Promise<number> {
    assertGonkaPrefix(address);
    const client = await this.client.connect();
    const account = await client.getAccount(address);

    if (!account) {
      throw new Error("Account not found");
    }

    return account.sequence;
  }

  async info(address: string) {
    assertGonkaPrefix(address);
    const client = await this.client.connect();
    const account = await client.getAccount(address);

    if (!account) {
      return {
        success: false,
        error: "Account not found",
      };
    }

    return {
      success: true,
      data: {
        address: account.address,
        pubkey: account.pubkey,
        accountNumber: account.accountNumber,
        sequence: account.sequence,
      },
    };
  }
}
