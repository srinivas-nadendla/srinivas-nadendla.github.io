import React, { useEffect } from "react";
import { useAppSelector, useAppDispatch } from "../../store/hooks";
import {
  updateFiltersApplied,
  setActiveChatWidget,
  setChatMessagesData,
  updateShowConfirmPrompt,
  updateLastActionPerformed,
  updateSelectedTaskItems,
  updateSelectedDriveItems,
} from "../../store/brenaSlice";
import { Button } from "@mui/material";
import NewChat from "../../img/new-chat.svg";
import NewHistory from "../../img/chat-history.svg";
import "./ChatWidgetToolbar.scss";
import { useDetectDevice } from "../../hooks/useDetectDevice";

const ChatWidgetToolbar = React.memo((props: any) => {
  const dispatch = useAppDispatch();
  const activeChatWidget = useAppSelector(
    (state: any) => state.brena.activeChatWidget
  );
  const isPreviewBtnClicked = useAppSelector(
    (state: any) => state.brena.isPreviewBtnClicked
  );
  const lastActionPerformed = useAppSelector(
    (state: any) => state.brena.lastActionPerformed
  );
  const filtersApplied = useAppSelector(
    (state: any) => state.brena.filtersApplied
  );

  const device = useDetectDevice();

  useEffect(() => {
    if (!isPreviewBtnClicked && lastActionPerformed?.type) {
      if (lastActionPerformed.type === "new_chat") {
        onNewChatBtnClick(null);
      } else if (lastActionPerformed.type === "chat_history") {
        onChatHistoryClick(null);
      }
    }
  }, [isPreviewBtnClicked, lastActionPerformed]);

  const resetCtxChange = () => {
    window.postMessage(
      {
        event: "brena-ui-extra-ctx",
        data: {
          item_ids: [],
        },
      },
      "*"
    );
    dispatch(updateSelectedDriveItems([]));
    dispatch(updateSelectedTaskItems([]));
  };

  const onNewChatBtnClick = (e: any) => {
    if (isPreviewBtnClicked) {
      dispatch(updateShowConfirmPrompt(true));
      dispatch(updateLastActionPerformed({ type: "new_chat" }));
      return;
    }
    if (saWebComp?.brenaApi?.onUIEvent) {
      saWebComp?.brenaApi?.onUIEvent("new_chat");
    }
    dispatch(setChatMessagesData([]));
    dispatch(setActiveChatWidget("welcome"));
    dispatch(updateLastActionPerformed({ type: "", content: "" }));
    resetCtxChange();
    if (filtersApplied) {
      if (saWebComp?.brenaApi) {
        saWebComp?.brenaApi?.onUIEvent("outside_area-clear-filter_click", "");
        let clearFilterData = {
          type: "clearFilter",
          filterData: [],
        };
        saWebComp?.brenaApi?.onUIEvent("brena_to_react", clearFilterData);
      }
      dispatch(updateFiltersApplied(false));
    }
  };

  const onChatHistoryClick = (e: any) => {
    if (isPreviewBtnClicked) {
      dispatch(updateShowConfirmPrompt(true));
      dispatch(updateLastActionPerformed({ type: "chat_history" }));
      return;
    }
    if (saWebComp?.brenaApi?.onUIEvent) {
      saWebComp?.brenaApi?.onUIEvent("chat_history", {});
    }
    dispatch(setActiveChatWidget("chat_history"));
    dispatch(updateLastActionPerformed({ type: "", content: "" }));
  };

  return (
    <div className="chat-widget-toolbar">
      {activeChatWidget !== "welcome" && (
        <Button variant="text" onClick={(e: any) => onNewChatBtnClick(e)}>
          <img src={NewChat} className="NewChat-cls" alt="chat icon" />
          New Chat
        </Button>
      )}
      {activeChatWidget !== "chat_history" && (
        <Button variant="text" onClick={(e: any) => onChatHistoryClick(e)}>
          <img src={NewHistory} className="NewHistory-cls" alt="history icon" />
          Chat History
        </Button>
      )}
    </div>
  );
});
export default ChatWidgetToolbar;
