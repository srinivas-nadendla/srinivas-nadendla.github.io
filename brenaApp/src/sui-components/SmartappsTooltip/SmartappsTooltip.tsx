import React, { useState, useCallback, useEffect } from "react";
import Tooltip from "@mui/material/Tooltip";
import ClickAwayListener from "@mui/material/ClickAwayListener";
import smartappadd from "../../img/smartapp-add.svg";
import smartappaddblue from "../../img/smartapp-add-blue.svg";
import smartapplogo from "../../img/smartapp-logo.svg";
import TextField from "@mui/material/TextField";
import InputAdornment from "@mui/material/InputAdornment";
import SearchIcon from "@mui/icons-material/Search";
import ClearIcon from "@mui/icons-material/Clear";
import "./SmartappsTooltip.scss";
import { IconButton } from "@mui/material";
import SmartappsTooltipItems from "./SmartappsTooltipItems";
import { useAppSelector } from "../../store/hooks";
import { updateSmartappBuilderChatRecentSelection } from "../../store/brenaSlice";
import { useDispatch } from "react-redux";

const SmartappsTooltip = (props: any) => {
  const [open, setOpen] = useState<any>(false);
  const smartAppsData = useAppSelector((state: any)=> state.brena.smartAppsData);
  const [keepInputFocused, setKeepInputFocused] = useState(false);
  const dispatch = useDispatch();

  useEffect(()=> {
    setKeepInputFocused(true);
    return ()=> {
      setKeepInputFocused(false);
    }
  }, [])

  const handleTooltipClose = () => {
    setOpen(false);
  };

  useEffect(()=> {
    if (!open) {
      let el: any = document.getElementsByClassName('brena-chat-inline-bar');
    if (el?.length > 0) {
      (Array.from(el)).forEach((e: any)=> {
        if (e?.classList) {
          e.classList.remove('brena-zindex');
        }
        
      })
    }
    }
  }, [open])

  const handleTooltipOpen = (e: any) => {
    e.preventDefault();
    const selection: any = window.getSelection();
    if (selection.rangeCount > 0) {
      const selectionText: any = selection.toString().trim();
      // Check if the selected range is inside the text container
      //if (brenaMsgTxt?.includes(selectionText)) {
        if (selectionText.length > 0) {
          dispatch(updateSmartappBuilderChatRecentSelection(selectionText));
        }
      //}
    }
   
    setOpen(true);
    setTimeout(()=>{
      if (e?.target?.closest('.brena-chat-inline-bar')) {
        e.target.closest('.brena-chat-inline-bar').classList.add('brena-zindex');
      }
    }, 300)
  };

  const SearchBar = React.memo((props: any) => {
    const [searchTxt, setSearchTxt] = useState<any>("");
    
    
    const onSearchChange = useCallback((e: any) => {
      const txt = e.target.value.toLowerCase();
      setSearchTxt(txt);
      props.onTextChange(txt);
      // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    const onClearClick = ()=> {
      setSearchTxt('');
      props.onTextChange('');
    }

    return (
      <TextField
        placeholder="Search Smartapp"
        onChange={(e: any) => onSearchChange(e)}
        value={searchTxt}
        inputRef={(input) => keepInputFocused ?  input && input.focus() : ''}
        InputProps={{
          endAdornment: (
            <InputAdornment position="end">
              {searchTxt?.length > 0 ?
              (<IconButton
              className="smartapp-add-tooltip-content_search-btn"
              edge="end"
            >
              <ClearIcon onClick={()=> onClearClick()}/>
            </IconButton>)
            :
              (<IconButton
                className="smartapp-add-tooltip-content_search-btn"
                edge="end"
              >
                <SearchIcon />
              </IconButton>)
        }
              
            </InputAdornment>
          ),
        }}
      ></TextField>
    );
  });

  const ToolTipContent = React.memo(() => {
    const [searchQuery, setSearchQuery] = useState("");
    const onTextChange = (txt: any) => {
      setSearchQuery(txt);
    };

    return (
      <div className="smartapp-add-tooltip-content">
        <div className="smartapp-add-tooltip-content_header">
          <img
            src={smartapplogo}
            className="smartapp-add-tooltip-content_header-logo"
            alt="Smartapp logo"
          />
          Select Smartapp
        </div>
        <SearchBar onTextChange={onTextChange}></SearchBar>
        <SmartappsTooltipItems
          data={smartAppsData}
          searchQuery={searchQuery}
          brenaMsg={props.brenaMsg}
          addBtnClicked={()=> handleTooltipClose()}
        ></SmartappsTooltipItems>
      </div>
    );
  });

  return (
    <>
      <ClickAwayListener onClickAway={handleTooltipClose}>
        <div className={"smartapp-add-tooltip " }>
          <Tooltip
            PopperProps={{
               className:"brena-smartapp-tooltip-cls",
              disablePortal: false, // Ensures tooltip is rendered in a separate layer
              modifiers: [
                {
                  name: 'preventOverflow',
                  options: {
                    boundary: 'viewport', // Prevents tooltip from overflowing outside the viewport
                  },
                },
              ],
            }}
            onClose={handleTooltipClose}
            open={open}
            disableFocusListener
            disableHoverListener
            disableTouchListener
            title={<ToolTipContent></ToolTipContent>}
            arrow
           
          >
            <div>
            <img
              src={smartappaddblue}
              className={"smartapp-add-img " + (open ? '' : ' brena-text-hidden-cls')}
              alt="Smartapp Add"
              onClick={(e: any) => handleTooltipOpen(e)}
            />
             <Tooltip title="Add SmartItem" id="brenaAddSmartItem">
            <img
              src={smartappadd}
              className={"smartapp-add-img " + (!open ? '' : ' brena-text-hidden-cls')}
              alt="Smartapp Add"
              onClick={(e: any) => handleTooltipOpen(e)}
            />
            </Tooltip>
            </div>
         </Tooltip>
        </div>
      </ClickAwayListener>
    </>
  );
};
export default React.memo(SmartappsTooltip);
