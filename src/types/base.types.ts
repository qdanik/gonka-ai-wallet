export type GonkaSDKResults<S, F = undefined> = F extends undefined
  ? {
      success: true;
      data: S;
    }
  :
      | {
          success: true;
          data: S;
        }
      | {
          success: false;
          error: F;
        };
