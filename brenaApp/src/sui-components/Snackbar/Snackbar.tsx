import React, { useEffect } from "react";
import "./Snackbar.scss";
import { Snackbar, SnackbarContent } from "@mui/material";

export interface SnackbarProps {
  open?: any;
  message?: any;
  onclose?: any;
  icon?: any;
}

export const SUISnackbar = React.memo((props: SnackbarProps) => {
  const { open, message, onclose, icon } = props;

  const [snackOpen, setSnackOpen] = React.useState(false);

  useEffect(() => {
    setSnackOpen(open);
  }, [open]);

  const handleClose = (
    event: React.SyntheticEvent | Event,
    reason?: string
  ) => {
    if (reason === "clickaway") {
      return;
    }
    setSnackOpen(false);
    onclose && onclose();
  };

  return (
    <Snackbar
    className="snack-bar-cont brena-snack-bar-cont"
    open={snackOpen}
    autoHideDuration={3000}
    onClose={handleClose}
    anchorOrigin={{ vertical: "bottom", horizontal: "center" }}
  >
    <SnackbarContent
      message={
        <span style={{ display: "flex", alignItems: "center", justifyContent: 'left' }}>
          {icon && (
            <span style={{ marginRight: 8 }}>
              {icon}
            </span>
          )}
          {message}
        </span>
      }
    />
  </Snackbar>
  );
});

export default SUISnackbar;
