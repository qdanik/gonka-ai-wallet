export class GonkaSDKError extends Error {
  override name = "GonkaSDKError";
}

export class UnknownSignerError extends GonkaSDKError {
  override name = "UnknownSignerError";
  constructor() {
    super(
      "Signer is unknown. Use wallet.fromMnemonic(...) or wallet.fromPrivateKey(...) to provide a valid signer.",
    );
  }
}

export class TimeoutError extends GonkaSDKError {
  override name = "TimeoutError";
  constructor(
    reason: string,
    public readonly txId: string,
  ) {
    super(reason);
  }
}
