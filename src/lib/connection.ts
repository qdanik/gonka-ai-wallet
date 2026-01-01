import {
  GONKA_CHAIN_ID,
  GONKA_DEFAULT_API_PORT,
  GONKA_DEFAULT_NODE_URL,
  GONKA_DEFAULT_RPC_PORT,
  GONKA_DENOM,
  GONKA_GAS_PRICE,
} from "@/constants";
import type { GonkaConnectOptions } from "../types";

export function withDefaults(opts: GonkaConnectOptions): Required<GonkaConnectOptions> {
  return {
    url: opts?.url ?? GONKA_DEFAULT_NODE_URL,
    rpcPort: opts?.rpcPort ?? GONKA_DEFAULT_RPC_PORT,
    apiPort: opts?.apiPort ?? GONKA_DEFAULT_API_PORT,
    chainId: opts?.chainId ?? GONKA_CHAIN_ID,
    denom: opts?.denom ?? GONKA_DENOM,
    gasPrice: opts?.gasPrice ?? GONKA_GAS_PRICE,
  };
}
