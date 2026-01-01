import { withDefaults } from "./lib/connection";
import { AccountModule } from "./modules/account.module";
import { GonkaClient } from "./modules/client.module";
import { TxModule } from "./modules/tx.module";
import { WalletModule } from "./modules/wallet.module";
import type { GonkaConnectOptions } from "./types";

export class GonkaWalletSDK {
  public readonly wallet: WalletModule;
  public readonly account: AccountModule;
  public readonly tx: TxModule;
  private readonly client: GonkaClient;

  private constructor(private readonly opts: Required<GonkaConnectOptions>) {
    this.client = new GonkaClient(this.opts);

    this.wallet = new WalletModule(this.client);
    this.account = new AccountModule(this.client);
    this.tx = new TxModule(this.client);
  }

  static async connect(opts: GonkaConnectOptions) {
    const defaultedOpts = withDefaults(opts);
    return new GonkaWalletSDK(defaultedOpts);
  }
}
