import { PaletteMode } from "@mui/material";
import { grey } from "@mui/material/colors";
import { ThemeOptions, createTheme } from "@mui/material/styles";

const theme: ThemeOptions = {
  breakpoints: {
    values: {
      xs: 0,
      sm: 600,
      md: 900,
      lg: 1372,
      xl: 1536,
    },
  },

  palette: {
    // mode: "light",
    background: {
      paper: "#fff",
      default: "#fbfff1",
    },
    grey: {
      50: "#fbfff1",
      100: "#EDF0F7",
      200: "#DFE4EC",
      300: "#CCD2DC",
      400: "#A5A9B0",
      500: "#93949F",
      600: "#6A6F7A",
      700: "#484B50",
      800: "#303239",
    },
    // text: {
    //   secondary: "#FFAF59",
    //   disabled: "#6A6F7A",
    // },
    primary: {
      main: "#3c5d76",
      light: "#3066be",
      contrastText: "#fbfff1",
    },
    secondary: {
      main: "#38D7A8",
      contrastText: "rgba(249,249,249,0.87)",
    },
    // text: {
    //   primary: "#3c3744",
    //   secondary: "#fbfff1",
    // },
  },
  typography: {
    fontFamily: "Circular",
    h1: {
      fontSize: "96px",
      fontWeight: 900,
    },
    subtitle1: {
      fontSize: "18px",
      fontWeight: 500,
    },
    caption: {
      // fontSize: "14px",
      color: "#93949F",
    },
    body1: {
      fontSize: "14px",
      fontWeight: 400,
    },
    body2: {
      fontSize: "16px",
      fontWeight: 600,
    },
    h6: {
      fontWeight: 500,
    },
  },
  components: {
    MuiButton: {
      styleOverrides: {
        root: {
          //   background: 'linear-gradient(45deg, #FE6B8B 30%, #FF8E53 90%)',
          //   border: 0,
          borderRadius: 20,
          textTransform: "capitalize",
          fontWeight: 400,
          fontSize: "16px",

          //   boxShadow: '0 3px 5px 2px rgba(255, 105, 135, .3)',
          // //   color: 'white',
          height: 46,
          padding: "0 1px",
        },
      },
    },
    MuiChip: {
      styleOverrides: {
        label: {
          // color: "#CCD2DC",
          fontSize: "11px",
          cursor: "pointer",
        },
      },
    },
    MuiSelect: {
      styleOverrides: {
        root: {
          borderRadius: 18,
        },
      },
    },
    MuiAlert: {
      styleOverrides: {
        root: {
          borderRadius: 8,
        },
      },
    },

    MuiOutlinedInput: {
      styleOverrides: {
        root: ({ theme }) => ({
          borderRadius: 10,
          fontWeight: 500,
          padding: "8px 16px",
          boxSizing: "border-box",
          height: "46px",
          backgroundColor:
            theme.palette.mode === "dark" ? grey[700] : grey[200],
        }),

        notchedOutline: {
          borderColor: "rgba(69, 72, 81, 0.1) !important",
        },
      },
    },

    MuiDivider: {
      styleOverrides: {
        root: {},
      },
    },
  },
};

export const customTheme = (mode: PaletteMode) =>
  mode === "light"
    ? createTheme({ ...theme })
    : createTheme({
        ...theme,
        palette: {
          ...theme.palette,
          mode: "dark",
          background: {
            // paper: 'red',
            default: "#F9FAFE",
          },
        },
      });
