import { Dayjs } from "dayjs";

export type GenerateParamType = {
  name: string;
  symbol: string;
  decimal?: number;
  supply?: number;
  maxBuy?: number;
  initialLP?: number;
  owner: string;
  mintable?: boolean;
  buyMarketingFee: number;
  buyLiquidityFee: number;
  buyDevelopmentFee: number;
  sellMarketingFee: number;
  sellLiquidityFee: number;
  sellDevelopmentFee: number;
  teamWalletAddress: string;
  teamDistributionPercentage: number;
  unlockTime: Dayjs;
  totalSupply: number;
  mode: "advance" | "basic";
  liquidityAdd: boolean;
};

export type CreateTokenType = {
  tokenAddress: string;
  creatorAddress: string;
  tokenType: "basic" | "custom" | "custom_mint" | "liq_mint";
  select: ("burn" | "fee" | "mint" | "team" | "liquidity")[];
};
export type CreateTokenResponseType = {
  tokenAddress: string;
  creatorAddress: string;
  token_type: "basic" | "custom" | "custom_mint" | "liq_mint";
  select: ("burn" | "fee" | "mint" | "team" | "liquidity")[];
};
