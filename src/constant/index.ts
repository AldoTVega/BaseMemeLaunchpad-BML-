export const BACKEND_API = import.meta.env.VITE_BACKEND_URL;
export const NETWORK = import.meta.env.VITE_NETWORK;
export const CONTRACT_ADDRESS = import.meta.env.VITE_CONTRACT_ADDRESS;
export const SERVICE_FEE = import.meta.env.VITE_PAYMENT;
export const DEAD_ADDRESS = "0x0000000000000000000000000000000000000000";
export const LIQUIDITY_POOL_ABI = [
  "function getReserves() external view returns (uint112 reserve0, uint112 reserve1, uint32 blockTimestampLast)",
];
