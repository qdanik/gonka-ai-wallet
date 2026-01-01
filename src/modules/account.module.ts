import { assertGonkaPrefix, fromNgonka } from "@/lib/denom";
import type { AccountBalance } from "@/types/account.types";
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
}
