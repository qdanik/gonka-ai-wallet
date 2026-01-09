export type GonkaConnectOptions = {
  // @default 'http://node1.gonka.ai:26657'
  // endpoint URL for connecting to the Gonka network
  url?: string;
  // @default 26657
  rpcPort?: number;
  // @default 8000
  apiPort?: number;
  // @default 'gonka-mainnet'
  // Chain ID of the Gonka network
  chainId?: "gonka-mainnet";
  // @default 'ngonka'
  // Denomination for the native token
  denom?: "ngonka";
  // @default '0.025ngonka'
  // Default gas price for transactions
  gasPrice?: "0.025ngonka";
  // @default 2
  // Default transaction gas multiplier
  txGasMultiplier?: number;
  // @default 1.5
  // Default vote gas multiplier
  voteGasMultiplier?: number;
};
