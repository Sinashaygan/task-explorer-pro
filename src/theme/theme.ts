import { createTheme } from "@mui/material/styles";

export const theme = createTheme({
  direction: "rtl",

  palette: {
    mode: "light",
    background: {
      default: "#F7F8FA",
      paper: "#FFFFFF",
    },
    primary: {
      main: "#2563EB",
    },
    text: {
      primary: "#111827",
      secondary: "#6B7280",
    },
  },

  typography: {
    fontFamily:
      'var(--font-vazirmatn), system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif',
    body1: {
      lineHeight: 1.8,
    },
    body2: {
      lineHeight: 1.7,
    },
  },

  shape: {
    borderRadius: 12,
  },

  components: {
    MuiButton: {
      defaultProps: {
        disableElevation: true,
      },
      styleOverrides: {
        root: {
          textTransform: "none",
          borderRadius: 10,
          fontWeight: 600,
        },
      },
    },

    MuiPaper: {
      styleOverrides: {
        root: {
          backgroundImage: "none",
        },
      },
    },
  },
});
