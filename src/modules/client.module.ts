import { StargateClient } from "@cosmjs/stargate";
import type { GonkaConnectOptions } from "../types";

export class GonkaClient {
  constructor(private readonly opts: Required<GonkaConnectOptions>) {}

  get rpcUrl() {
    return `${this.opts.url}:${this.opts.rpcPort}`;
  }

  get apiUrl() {
    return `${this.opts.url}:${this.opts.apiPort}/chain-api`;
  }

  get gasPrice() {
    return this.opts.gasPrice;
  }

  get denom() {
    return this.opts.denom;
  }

  async connect() {
    return StargateClient.connect(this.rpcUrl);
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
