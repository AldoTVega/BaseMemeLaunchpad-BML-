import { Dialog, Grid, IconButton, Typography } from "@mui/material";
import Success from "../../../assets/success.png";
import CancelIcon from "@mui/icons-material/Cancel";
type Props = {
  open: boolean;
  handleClose: () => void;
  url: string;
};

const SuccessDialog = ({ open, handleClose, url }: Props) => {
  return (
    <Dialog
      onClose={handleClose}
      PaperProps={{ sx: { p: 4, overflow: "hidden" } }}
      open={open}
      maxWidth={"sm"}
    >
      <IconButton
        onClick={handleClose}
        sx={{ position: "absolute", top: 4, right: 4 }}
      >
        <CancelIcon />
      </IconButton>
      <Grid
        container
        justifyContent={"center"}
        flexDirection={"column"}
        alignItems={"center"}
      >
        <img src={Success} alt="mint" width={200} />
        <Typography mb={4}>Successfully deployed</Typography>
        <Typography>
          {" "}
          you can see the transaction{" "}
          <a
            href={url.replace("address", "token")}
            target="_blank"
            style={{ textDecoration: "underline", color: "blue" }}
          >
            here
          </a>
        </Typography>
      </Grid>
    </Dialog>
  );
};

export default SuccessDialog;
