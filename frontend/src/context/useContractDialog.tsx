import { useContext } from "react";
import { ContractContext } from "./ContractProvider";

export const useContractDialog = () => {
  const context = useContext(ContractContext);
  if (context === undefined) {
    throw new Error("useContract must be used within a ContractProvider");
  }
  return context;
};
