import { Dialog, Grid, IconButton, Typography } from "@mui/material";
import { NETWORK } from "../../../constant";
import CloseIcon from "@mui/icons-material/Close";
import { useContractDialog } from "../../../context/useContractDialog";
import successImg from "../../../assets/icons8-bot.gif";

type Props = {};

const TransactionDialog = (_props: Props) => {
  const { hash, openDialog } = useContractDialog();
  //   console.log("tsdialog==", updated);
  return (
    <Dialog
      open={hash}
      maxWidth="xs"
      onClose={() => openDialog(false)}
      PaperProps={{
        sx: {
          p: 3,
          display: "flex",
          alignItems: "center",
        },
      }}
    >
      <IconButton
        size="small"
        sx={{ position: "absolute", top: 4, right: 4 }}
        onClick={() => openDialog(false)}
      >
        <CloseIcon />
      </IconButton>
      <img src={successImg} width={160} />
      <Grid container justifyContent={"center"} flexDirection={"column"}>
        <Typography textAlign={"center"} mt={2} variant="subtitle1">
          The operation has succeeded.
        </Typography>

        <Typography
          mt={2}
          textAlign={"center"}
          component={"a"}
          href={`${NETWORK}tx/${localStorage.getItem("hash")}`}
          target="_blank"
          sx={{ textDecoration: "underline", color: "blue" }}
        >
          Transaction
        </Typography>
      </Grid>
    </Dialog>
  );
};

export default TransactionDialog;
