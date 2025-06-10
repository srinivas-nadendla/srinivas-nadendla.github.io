import React, { useState, useEffect } from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  IconButton,
  Paper,
} from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import CropSquareIcon from "@mui/icons-material/CropSquare";
import FilterNoneIcon from "@mui/icons-material/FilterNone";
import IQBrenaDocViewer from "../IQBrenaDocViewer/IQBrenaDocViewer";
import { fetchSpecBookPages } from "../../utils/BrenaApi";

const SpecBookModal = (props: any) => {
  const [maximized, setMaximized] = useState(false);
  const [specBooksPagesData, setSpecBooksPagesData] = useState<any>([]);

  const toggleMaximize = () => {
    setMaximized(!maximized);
  };

  useEffect(() => {
    if (!props.specBookId) return;
    fetchSpecBookPages({ id: props.specBookId })
      .then((res) => {
        setSpecBooksPagesData(res);
      })
      .catch((err) => {
        console.error(err);
      });
  }, [props.specBookId]);

  useEffect(() => {
    setTimeout(() => {
      const containers = document.querySelectorAll(".MuiDialog-container");
      if (containers) {
        let arrContainers = Array.from(containers);
        arrContainers.forEach((ele: any) => {
          ele.removeAttribute("tabindex");
        });
      }
    }, 2000);
  }, []);

  return (
    <Dialog
      open={true}
      onClose={props.onClose}
      hideBackdrop
      disablePortal={false}
      PaperComponent={({ children, ...paperProps }) => (
        <Paper
          {...paperProps}
          style={{
            width: maximized ? "100%" : "80%",
            height: maximized ? "100%" : "90%",
            position: "fixed",
            left: maximized ? 0 : 75,
            top: maximized ? 0 : 46,
            zIndex: 29010,
            margin: 0,
            overflow: "hidden",
            minWidth: "80vw",
          }}
        >
          {children}
        </Paper>
      )}
    >
      <DialogTitle
        sx={{
          display: "flex",
          justifyContent: "flex-end",
          alignItems: "center",
          paddingRight: 1,
        }}
      >
        <div>
          {/* <IconButton size="small" onClick={toggleMaximize}>
            {maximized ? (
              <FilterNoneIcon fontSize="small" />
            ) : (
              <CropSquareIcon fontSize="small" />
            )}
          </IconButton> */}
          <IconButton size="small" onClick={props.onClose}>
            <CloseIcon fontSize="small" />
          </IconButton>
        </div>
      </DialogTitle>
      <DialogContent>
        <IQBrenaDocViewer
          showToolbar={false}
          docViewElementId={"canvasWrapper-brena-spec-modal"}
          sketchData={specBooksPagesData}
          stopFocus={true}
        />
      </DialogContent>
    </Dialog>
  );
};

export default SpecBookModal;
