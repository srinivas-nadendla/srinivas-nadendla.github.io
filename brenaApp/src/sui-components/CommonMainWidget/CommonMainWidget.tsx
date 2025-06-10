import React, { useRef, useState, useEffect, useDeferredValue } from "react";
import Dialog from "@mui/material/Dialog";
import Draggable from "react-draggable";
import { Card, CardHeader, IconButton, CardContent, Tooltip } from "@mui/material";
import { useDetectDevice } from "../../hooks/useDetectDevice";
import Close from "../../img/close.png";
import Collpse from "../../img/minimize.png";
import { useAppSelector, useAppDispatch } from "../../store/hooks";
import "./CommonMainWidget.scss";
import PinUnpin from "../PinUnpin/PinUnpin";
import { updateBrenaPinnedCls } from "../../store/brenaSlice";

export const CommonMainWidget = ({
  onClose,
  open,
  isDisabled,
  dialogClasses,
  renderSuggetsinPanelButtons,
  renderSuggestionsPanel,
  collapseWdgt,
  renderWidgetBody,
  renderMinimizedWidgetBody,
  cardParentClassName,
  collaspeWidget = false,
  isPressed,
  renderTitleBar,
  renderToolBar,
  renderFooterBar,
  renderConfirmationPrompt,
}: any) => {
  const [dlgPostion] = useState({
    right: "0px",
    bottom: "0px",
  });
  const [dragPostion] = useState<any>(null);
  const dlgRef: any = useRef();
  const device = useDetectDevice();
  const scrollBodyRef = useRef<any>();
  const dispatch = useAppDispatch();

  const activeChatWidget = useAppSelector(
    (state: any) => state.brena.activeChatWidget
  );

  const chatMeassgesData = useAppSelector(
    (state: any) => state.brena.chatMessagesData
  );
  const chatMessagesDefferedData = useDeferredValue(chatMeassgesData);
  const welcomeData = useAppSelector((state: any) => state.brena.welcomeData);
  const brenaPinnedCls = useAppSelector((state: any)=> state.brena.brenaPinnedCls);
  

  useEffect(() => {
    if (scrollBodyRef?.current) {
      const config = { attributes: true, childList: true, subtree: true };
      const callback = (mutationList: any) => {
        for (const mutation of mutationList) {
          if (mutation.type === "childList") {
            if (["chat_history", "welcome"].includes(activeChatWidget)) {
              scrollBodyRef?.current.scroll({ top: 0, behavior: "smooth" });
            } else {
              scrollBodyRef?.current.scroll({
                top: scrollBodyRef?.current.scrollHeight + 50,
                behavior: "smooth",
              });
            }
          }
        }
      };
      const observer = new MutationObserver(callback);
      observer.observe(scrollBodyRef?.current, config);

      if (scrollBodyRef?.current?.scrollHeight) {
        if (["chat_history", "welcome"].includes(activeChatWidget)) {
          scrollBodyRef?.current.scroll({ top: 0, behavior: "smooth" });
        } else {
          scrollBodyRef?.current.scroll({
            top: scrollBodyRef?.current.scrollHeight + 50,
            behavior: "smooth",
          });
        }
      }
    }
  }, [chatMessagesDefferedData, activeChatWidget]);

  const handleClose = (event: any, reason: any) => {
    if (reason && reason === "backdropClick") return;
    onClose("");
  };

  const handleDrag = () => {
    isPressed(true);
  };

  useEffect(() => {
    const handleMessage = (event: any) => {
      let data = event.data;
    
      // Ensure data is a valid JSON object if possible
      if (typeof data === "string") {
        try {
          const parsed = JSON.parse(data);
          if (typeof parsed === "object") {
            data = parsed;
          }
        } catch (e) {
          console.log("Failed to parse event data:", e);
        }
      }
    
      // Extract args if available
      if (data && typeof data === "object" && data.hasOwnProperty("args") && data.args[0]) {
        data = data.args[0];
      }
  
      if (data && typeof data === "object") {
          switch (data.event || data.evt) {
          case "brena-api-initarea":
          case "brena-pin-status":
            dispatch(updateBrenaPinnedCls(data?.data?.brenaPinned ? 'pinned' : 'unpinned'));
            break;
        }
      }
    };
  
    window.addEventListener("message", handleMessage);
  
    return () => {
      window.removeEventListener("message", handleMessage);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <Draggable
      onDrag={handleDrag}
      bounds="body"
      disabled={isDisabled}
      position={dragPostion}
    >
      <Dialog
        ref={dlgRef}
        onClose={handleClose}
        open={open}
        className={`common-widget-dlg brenaAI-Widget ${
          collaspeWidget ? "common-widget-dlg-minimized " : ""
        } ${dialogClasses} ${!welcomeData?.userDetails ? " common-widget-dlg-hidden-1 " : ""} ${brenaPinnedCls} `}
        PaperProps={{
          sx: {
            position: "fixed",
            right: dlgPostion.right,
            bottom: dlgPostion.bottom,
          },
        }}
      >
        <div className="common-widget-dlg-container">
          {renderSuggetsinPanelButtons && renderSuggetsinPanelButtons()}
          {renderSuggestionsPanel && renderSuggestionsPanel()}
          {!collaspeWidget && (
            <div
              className={
                "chat-widget-container " + device + " " + cardParentClassName
              }
            >
              <Card className={"close-widget-card"}>
                {device !== "brena-mobile" && 
                <CardHeader
                  action={
                      <>
                        <PinUnpin></PinUnpin>
                        <Tooltip title="Minimize" id="brenaMinimizeBtnTooltip" className="brena-action-btns-tooltip">
                        <IconButton
                          className="header-minimize"
                          aria-label="expand"
                          onClick={collapseWdgt}
                        >
                          <img src={Collpse} alt="collapse Icon" />
                        </IconButton>
                        </Tooltip>
                        <Tooltip title="Close" id="brenaCloseTooltip">
                        <IconButton
                          className="header-close"
                          aria-label="close"
                          onClick={onClose}
                        >
                          <img src={Close} alt="close icon" />
                        </IconButton>
                        </Tooltip>
                      </>
                  }
                
                />
              }
                <div className="chat-widget-container_title-img-wrapper">
                  {renderTitleBar && renderTitleBar()}
                </div>
                {renderToolBar && renderToolBar()}
                <CardContent>
                  <div
                    className="chat-widget-container_body"
                    ref={scrollBodyRef}
                  >
                    {renderWidgetBody && renderWidgetBody()}
                  </div>
                </CardContent>
                {renderFooterBar && renderFooterBar()}
              </Card>
            </div>
          )}
          {renderMinimizedWidgetBody && renderMinimizedWidgetBody()}
          {renderConfirmationPrompt && renderConfirmationPrompt()}
        </div>
      </Dialog>
    </Draggable>
  );
};

export default CommonMainWidget;
