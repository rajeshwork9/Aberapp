// src/navigation/types.ts
export type RootStackParamList = {
  Login:      undefined;      // no params
  Dashboard:  undefined;
  Topup:      { amount?: number } | undefined; // example with optional param
};
