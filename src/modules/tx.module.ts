import type { OfflineSigner } from "@cosmjs/proto-signing";
import { calculateFee, coin } from "@cosmjs/stargate";
import { assertGonkaPrefix } from "@/lib/denom";
import { TimeoutError, UnknownSignerError } from "@/lib/errors";
import { sleep } from "@/lib/sleep";
import type {
  TxSendParams as TxSendOptions,
  TxSendResults,
  TxStatusResults,
  TxStatusSuccess,
} from "@/types";
import type { TxBetaResult } from "@/types/tx.beta.types";
import type { GonkaClient } from "./client.module";

export class TxModule {
  constructor(private readonly client: GonkaClient) {}
  // Starting with Cosmos SDK 0.47, we see many cases in which 1.3 is not enough anymore
  // E.g. https://github.com/cosmos/cosmos-sdk/issues/16020
  private readonly defaultGasMultiplier = 1.4;

  async details(txHash: string): Promise<TxStatusResults> {
    const result = await this.client.chainApi<TxBetaResult>(`/cosmos/tx/v1beta1/txs/${txHash}`);
    if (!result || !result.tx_response) {
      return {
        success: false,
        error: {
          hash: txHash,
        },
      };
    }

    const code = result.tx_response.code;

    return {
      success: true,
      data: {
        hash: txHash,
        height: Number(result.tx_response.height),
        code,
        rawLog: result.tx_response.raw_log,
        events: result.tx_response.events,
        gasUsed: BigInt(result.tx_response.gas_used),
        gasWanted: BigInt(result.tx_response.gas_wanted),
      },
    };
  }

  private async broadcastTx(transactionId: string, timeoutMs = 60_000, pollIntervalMs = 3_000) {
    let timedOut = false;
    const txPollTimeout = setTimeout(() => {
      timedOut = true;
    }, timeoutMs);
    const pollForTx = async (txId: string): Promise<TxStatusSuccess> => {
      if (timedOut) {
        throw new TimeoutError(
          `Transaction with ID ${txId} was submitted but was not yet found on the chain. You might want to check later. There was a wait of ${timeoutMs / 1000} seconds.`,
          txId,
        );
      }
      await sleep(pollIntervalMs);
      const result = await this.details(txId);
      return result.success ? result.data : pollForTx(txId);
    };
    return pollForTx(transactionId).finally(() => {
      clearTimeout(txPollTimeout);
    });
  }

  async send(
    from: OfflineSigner,
    to: string,
    amount: string,
    options: TxSendOptions = {},
  ): Promise<TxSendResults> {
    const { memo = "" } = options;
    if (!from) {
      throw new UnknownSignerError();
    }

    const [account] = await from.getAccounts();

    assertGonkaPrefix(account.address);
    assertGonkaPrefix(to);

    const gasPrice = await this.client.gasPrice(options?.gasPrice);
    const signingClient = await this.client.connectSigner(from, gasPrice);

    const messages = {
      typeUrl: "/cosmos.bank.v1beta1.MsgSend",
      value: {
        fromAddress: account.address,
        toAddress: to,
        amount: [coin(amount, this.client.denom)],
      },
    };

    const gasEstimation = await signingClient.simulate(account.address, [messages], memo);
    const gasLimit = Math.ceil(gasEstimation * this.defaultGasMultiplier);
    const transactionId = await signingClient.signAndBroadcastSync(
      account.address,
      [messages],
      calculateFee(gasLimit, gasPrice),
      memo,
    );
    const response = await this.broadcastTx(transactionId);

    return {
      success: true,
      data: {
        txHash: response.hash,
        height: response.height,
        gasUsed: response.gasUsed,
        gasWanted: response.gasWanted,
        events: response.events,
      },
    };
  }
}
