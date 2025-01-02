import {
  AppBar,
  Container,
  Grid,
  IconButton,
  Toolbar,
  Typography,
  styled,
  useTheme,
} from "@mui/material";
import discord from "../../assets/discord.svg";
import twitter from "../../assets/twitter.svg";

type Props = {};
const Root = styled(AppBar)(({ theme }) => ({
  //   display: "flex",
  position: "fixed",
  bottom: 0,
  top: "auto",
  backgroundColor: theme.palette.mode === "dark" ? "#3c3744" : "#cce9f9",
  // right: 0,
  // left: 0,
}));

const Footer = (_props: Props) => {
  const theme = useTheme();
  return (
    <Root>
      <Toolbar variant="dense">
        <Container maxWidth="xl">
          <Grid
            container
            justifyContent={"space-between"}
            alignItems={"center"}
            p={1}
          >
            <Typography
              variant="h6"
              sx={{ color: theme.palette.mode === "dark" ? "white" : "black" }}
            >
              Tokenator
            </Typography>
            <Grid item>
              <IconButton>
                <img src={discord} alt="discord" width={40} />
              </IconButton>
              <IconButton>
                <img src={twitter} alt="twitter" width={40} />
              </IconButton>
            </Grid>
          </Grid>
        </Container>
      </Toolbar>
    </Root>
  );
};

export default Footer;
