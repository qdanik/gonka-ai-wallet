import type { OfflineSigner } from "@cosmjs/proto-signing";
import { GasPrice, SigningStargateClient, StargateClient } from "@cosmjs/stargate";
import type { GonkaConnectOptions } from "../types";

const PORT_REGEX = /^(https?:\/\/[^:/]+)(:\d+)?/;

export class GonkaClient {
  constructor(private readonly opts: Required<GonkaConnectOptions>) {}

  get url() {
    // remove port by regex
    const match = this.opts.url.match(PORT_REGEX);
    if (match) {
      return match[1];
    }
    return this.opts.url;
  }

  get rpcUrl() {
    return `${this.url}:${this.opts.rpcPort}`;
  }

  get apiUrl() {
    return `${this.url}:${this.opts.apiPort}/chain-api`;
  }

  get denom() {
    return this.opts.denom;
  }

  get txGasMultiplier() {
    return this.opts.txGasMultiplier;
  }

  get voteGasMultiplier() {
    return this.opts.voteGasMultiplier;
  }

  async connect() {
    return StargateClient.connect(this.rpcUrl);
  }

  async gasPrice(gasPrice?: string) {
    return GasPrice.fromString(gasPrice ?? this.opts.gasPrice);
  }

  async connectSigner(signer: OfflineSigner, gasPrice?: GasPrice) {
    return await SigningStargateClient.connectWithSigner(this.rpcUrl, signer, {
      gasPrice,
    });
  }

  async chainApi<T>(url: string): Promise<T> {
    const fullUrl = `${this.apiUrl}/${url}`;
    const response = await fetch(fullUrl.replaceAll("//", "/"), {
      method: "GET",
      mode: "cors",
      credentials: "include",
    });
    return response.json() as Promise<T>;
  }
}
