import { Box, Container } from "@mui/material";
import ResponsiveAppBar from "./header/header";
import { Outlet } from "react-router-dom";
import Footer from "./footer/Footer";

type Props = {};

const MainLayout = (_props: Props) => {
  return (
    <Container>
      <ResponsiveAppBar />
      <Box mt={10} />
      <Outlet />
      <Box mt={20}></Box>
      <Footer />
    </Container>
  );
};

export default MainLayout;
