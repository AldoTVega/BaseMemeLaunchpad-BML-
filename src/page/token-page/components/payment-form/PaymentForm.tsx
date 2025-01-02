import { Alert, Dialog, DialogTitle, Grid, IconButton } from "@mui/material";
import CryptoSelect from "./CryptoSelect";
// import bnb from "../../../../assets/crypto/bnb@2x.png";
import eth from "../../../../assets/crypto/eth@2x.png";
import Base from "../../../../assets/crypto/base.png";
import CancelIcon from "@mui/icons-material/Cancel";
import { base, baseSepolia, mainnet, sepolia } from "viem/chains";
import { GenerateParamType } from "../../../../types/generate";
import { useState } from "react";

type Props = {
  handleClose: () => void;
  open: boolean;
  info: Partial<GenerateParamType>;
  handleSuccess: (url: string) => void;
  handleLoading: () => void;
  handleError: () => void;
};

const PaymentForm = ({
  handleClose,
  open,
  info,
  handleSuccess,
  handleError,
  handleLoading,
}: Props) => {
  const [err, setError] = useState<string>("");
  const handlePaymentError = (err: string) => {
    setError(err);
  };
  return (
    <Dialog open={open} PaperProps={{ sx: { p: 4 } }}>
      {err && <Alert severity="error">{err}</Alert>}
      <IconButton
        onClick={handleClose}
        sx={{ position: "absolute", top: 4, right: 4 }}
      >
        <CancelIcon />
      </IconButton>
      <DialogTitle>Payment</DialogTitle>
      <Grid container spacing={4}>
        <Grid item md={6} sm={12} xs={12}>
          <CryptoSelect
            handlePaymentError={handlePaymentError}
            handleError={handleError}
            handleLoading={handleLoading}
            handleSuccess={handleSuccess}
            url={Base}
            title={`${import.meta.env.VITE_PAYMENT} ETH`}
            info={info}
            chainId={
              import.meta.env.VITE_MODE === "development"
                ? baseSepolia.id
                : base.id
            }
          />
        </Grid>
        <Grid item md={6} sm={12} xs={12}>
          <CryptoSelect
            handlePaymentError={handlePaymentError}
            handleError={handleError}
            handleLoading={handleLoading}
            handleSuccess={handleSuccess}
            url={eth}
            title={`${import.meta.env.VITE_PAYMENT} ETH`}
            info={info}
            chainId={
              import.meta.env.VITE_MODE === "development"
                ? sepolia.id
                : mainnet.id
            }
          />
        </Grid>
        {/* <Grid item md={4}> */}
        {/* <CryptoSelect url={sol} title="1SOL" chainId={base.id} /> */}
        {/* </Grid> */}
      </Grid>
    </Dialog>
  );
};

export default PaymentForm;
