import { useState } from "react";
import ReactDOM from "react-dom/client";
import App from "./App.tsx";
import "./index.css";
import { ThemeContext } from "./context/themeContext.ts";
import { PaletteMode, ThemeProvider } from "@mui/material";
import { customTheme } from "./styles/theme.ts";
import { ContractContext } from "./context/ContractProvider.ts";

const AppWrapper = () => {
  const [themeMode, setThemeMode] = useState<PaletteMode>("light");
  const [updated, setUpdated] = useState<boolean>(false);
  const [hash, setHash] = useState<boolean>(false);
  const toggleThemeMode = () => {
    setThemeMode((prevMode) => (prevMode === "light" ? "dark" : "light"));
  };

  const changeUpdate = (e: boolean) => {
    setUpdated(e);
  };
  const openDialog = (e: boolean) => {
    setHash(e);
  };

  return (
    // <React.StrictMode>
    <ThemeContext.Provider value={{ themeMode, toggleThemeMode }}>
      {/* <PageContextProvider> */}
      <ThemeProvider theme={customTheme(themeMode)}>
        <ContractContext.Provider
          value={{ updated, changeUpdate, hash, openDialog }}
        >
          <App />
        </ContractContext.Provider>
        {/* <TonConnectUIProvider manifestUrl={import.meta.env.VITE_API_URL +"manifest.json"}> */}
        {/* </TonConnectUIProvider> */}
      </ThemeProvider>
      {/* </PageContextProvider> */}
    </ThemeContext.Provider>
    // </React.StrictMode>
  );
};

ReactDOM.createRoot(document.getElementById("root")!).render(<AppWrapper />);
