export interface TxBetaResult {
  tx: Tx;
  tx_response: TxResponse;
}

export interface Tx {
  body: TxBody;
  auth_info: TxAuthInfo;
  signatures: string[];
}

export interface TxBody {
  messages: TxBodyMessage[];
  memo: string;
  timeout_height: string;
  unordered: boolean;
  timeout_timestamp: any;
  extension_options: any[];
  non_critical_extension_options: any[];
}

export interface TxBodyMessage {
  "@type": string;
  from_address: string;
  to_address: string;
  amount: TxBodyMessageAmount[];
}

export interface TxBodyMessageAmount {
  denom: string;
  amount: string;
}

export interface TxAuthInfo {
  signer_infos: TxAuthInfoSignerInfo[];
  fee: TxAuthInfoFee;
  tip: any;
}

export interface TxAuthInfoSignerInfo {
  public_key: TxAuthInfoSignerInfoPublicKey;
  mode_info: TxAuthInfoSignerInfoModeInfo;
  sequence: string;
}

export interface TxAuthInfoSignerInfoPublicKey {
  "@type": string;
  key: string;
}

export interface TxAuthInfoSignerInfoModeInfo {
  single: Single;
}

export interface Single {
  mode: string;
}

export interface TxAuthInfoFee {
  amount: FeeAmount[];
  gas_limit: string;
  payer: string;
  granter: string;
}

export interface FeeAmount {
  denom: string;
  amount: string;
}

export interface TxResponse {
  height: string;
  txhash: string;
  codespace: string;
  code: number;
  data: string;
  raw_log: string;
  logs: any[];
  info: string;
  gas_wanted: string;
  gas_used: string;
  tx: TxResponseTx;
  timestamp: string;
  events: Event[];
}

export interface TxResponseTx {
  "@type": string;
  body: TxResponseTxBody;
  auth_info: TxResponseTxAuthInfo;
  signatures: string[];
}

export interface TxResponseTxBody {
  messages: TxResponseTxBodyMessage[];
  memo: string;
  timeout_height: string;
  unordered: boolean;
  timeout_timestamp: any;
  extension_options: any[];
  non_critical_extension_options: any[];
}

export interface TxResponseTxBodyMessage {
  "@type": string;
  from_address: string;
  to_address: string;
  amount: TxResponseTxBodyMessageAmount[];
}

export interface TxResponseTxBodyMessageAmount {
  denom: string;
  amount: string;
}

export interface TxResponseTxAuthInfo {
  signer_infos: TxResponseTxAuthInfoSignerInfo[];
  fee: TxResponseTxAuthInfoSignerInfoModeInfoFee;
  tip: any;
}

export interface TxResponseTxAuthInfoSignerInfo {
  public_key: TxResponseTxAuthInfoSignerInfoPublicKey;
  mode_info: TxResponseTxAuthInfoSignerInfoModeInfo;
  sequence: string;
}

export interface TxResponseTxAuthInfoSignerInfoPublicKey {
  "@type": string;
  key: string;
}

export interface TxResponseTxAuthInfoSignerInfoModeInfo {
  single: TxResponseTxAuthInfoSignerInfoModeInfoSingle;
}

export interface TxResponseTxAuthInfoSignerInfoModeInfoSingle {
  mode: string;
}

export interface TxResponseTxAuthInfoSignerInfoModeInfoFee {
  amount: TxResponseTxAuthInfoSignerInfoModeInfoFeeAmount[];
  gas_limit: string;
  payer: string;
  granter: string;
}

export interface TxResponseTxAuthInfoSignerInfoModeInfoFeeAmount {
  denom: string;
  amount: string;
}

export interface Event {
  type: string;
  attributes: Attribute[];
}

export interface Attribute {
  key: string;
  value: string;
  index: boolean;
}
