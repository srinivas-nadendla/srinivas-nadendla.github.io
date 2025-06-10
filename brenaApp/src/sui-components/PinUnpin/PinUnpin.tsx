import React, { useState, useEffect } from "react";
import PushPinIcon from "@mui/icons-material/PushPin";
import { IconButton, Tooltip } from "@mui/material";
import "./PinUnpin.scss";

const PinUnpin = () => {
  const [pinned, setPinned] = useState<any>(false);
  useEffect(()=> {
    setTimeout(()=> {
      setPinned(document.getElementsByClassName('common-widget-dlg')?.[0]?.className?.includes('pinned'));
    }, 2000)
  }, [])

  const onPinUnpinClicked = () => {
    window.postMessage(
      {
        event: "brena-pinunpin"
      },
      "*"
    );
    setTimeout(()=> {
      setPinned(document.getElementsByClassName('common-widget-dlg')?.[0]?.className?.includes('pinned'));
    }, 2000)
  };

  return (
    <Tooltip title={pinned ? 'Unpin' : 'Pin'} id="brenaPinUnpinTooltip">
        <IconButton onClick={() => onPinUnpinClicked()} className="brena-pin-unpin-btn">
          <PushPinIcon className="brena-pin-unpin-icon" color="primary"></PushPinIcon>
        </IconButton>
        </Tooltip>
  );
};
export default PinUnpin;
