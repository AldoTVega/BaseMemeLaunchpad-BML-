import { Box, Grid, Typography, useTheme } from "@mui/material";
import TokenInfoContent from "./token-info-content/TokenInfoContent";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
const TokenPage = () => {
  const theme = useTheme();
  return (
    <>
      <Box position={"relative"}>
        <Grid container justifyContent={"center"}>
          <Typography variant="h5" mt={8} textAlign={"center"}>
            Create your own tokens with ease!
          </Typography>
        </Grid>

        <TokenInfoContent />
        <ToastContainer
          position="bottom-right"
          autoClose={5000}
          hideProgressBar={false}
          newestOnTop={false}
          closeOnClick
          rtl={false}
          pauseOnFocusLoss
          draggable
          pauseOnHover
          theme={theme.palette.mode}
        />
      </Box>
    </>
  );
};

export default TokenPage;
