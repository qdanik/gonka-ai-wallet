import { stringToPath } from "@cosmjs/crypto";

export const GONKA_COIN_TYPE = 1200;

export const GONKA_HD_PATH = stringToPath(`m/44'/${GONKA_COIN_TYPE}'/0'/0/0`);

export const GONKA_DEFAULT_NODE_URL = "http://node1.gonka.ai";
export const GONKA_DEFAULT_RPC_PORT = 26657;
export const GONKA_DEFAULT_API_PORT = 8000;
export const GONKA_CHAIN_ID = "gonka-mainnet";
export const GONKA_ADDRESS_PREFIX = "gonka";
export const GONKA_DENOM = "ngonka";
export const GONKA_GAS_PRICE = "0.025ngonka";

export const NGONKA_DECIMALS = 9;
