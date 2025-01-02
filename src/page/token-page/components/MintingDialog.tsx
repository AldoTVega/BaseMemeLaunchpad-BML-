import { Dialog } from "@mui/material";
import MintGif from "../../../assets/mint.gif";

type Props = {
  open: boolean;
};

const MintingDialog = ({ open }: Props) => {
  return (
    <Dialog
      PaperProps={{ sx: { background: "transparent", boxShadow: "none" } }}
      sx={{ overflow: "hidden" }}
      open={open}
    >
      <img src={MintGif} alt="mint" width={300} />
    </Dialog>
  );
};

export default MintingDialog;
