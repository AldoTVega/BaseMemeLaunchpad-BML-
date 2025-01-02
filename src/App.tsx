import { Suspense } from "react";
import "./App.css";
import { RouterProvider } from "react-router-dom";
import { routes } from "./routers/routers";
import { css, useTheme } from "@mui/material";
import { Global } from "@emotion/react";
import { Web3ModalProvider } from "./context/Web3ModalProvider";

function App() {
  const theme = useTheme();

  const generateGlobalStyles = (props: any) => css`
    body {
      background-color: ${props || "#fbfff1"};
    }
  `;
  return (
    <>
      <Global
        styles={generateGlobalStyles(
          theme.palette.mode === "dark"
            ? theme.palette.grey[700]
            : theme.palette.grey[100]
        )}
      />
      <Web3ModalProvider>
        <Suspense fallback={<p>loading...</p>}>
          <RouterProvider router={routes} />
        </Suspense>
      </Web3ModalProvider>
    </>
  );
}

export default App;
