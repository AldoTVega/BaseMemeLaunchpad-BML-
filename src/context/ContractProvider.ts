import { createContext } from "react";

export interface ContractContextType {
  updated: boolean;
  changeUpdate: (e: boolean) => void;
  hash: boolean;
  openDialog: (e: boolean) => void;
}

export const ContractContext = createContext<ContractContextType | undefined>(
  undefined
);
