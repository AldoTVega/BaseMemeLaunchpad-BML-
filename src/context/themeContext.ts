import { createContext } from "react";

export interface ThemeContextType {
  themeMode: string;
  toggleThemeMode: () => void;
}

export const ThemeContext = createContext<ThemeContextType | undefined>(
  undefined
);
