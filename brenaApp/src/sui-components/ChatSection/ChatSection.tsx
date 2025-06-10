import React, { useEffect, useState, useDeferredValue, useRef } from "react";
import { useAppSelector, useAppDispatch } from "../../store/hooks";
import {
  getSpecBookPages,
  updateChatHistoryThreadData,
  updateSelectedChatMsg,
  updateShowSnackbar,
  setActiveChatWidget,
  updateSelectedPageNumber,
  updateSuggestionPanelSize,
  updateSmartItemClicked,
  setChatMessagesData,
} from "../../store/brenaSlice";

import "./ChatSection.scss";
import {
  RESTRICTED_TO_BUTTONS,
  getFormattedVideoRec,
  getFormattedDriveFilesData,
  fileTypesToSupportQuickViewer,
  fileTypesToSupportVideoPlayer,
  fileTypesToSupportSkecthViewer,
  reactAppTypeModules,
  getParentItemId,
  getSubType,
  handleDriveFileClick
} from "../../utils/CommonUtil";
import Button from "@mui/material/Button";
import { useDetectDevice } from "../../hooks/useDetectDevice";
import { marked } from "marked";
import TextReader from "../TextReader/TextReader";
import SmartappsTooltip from "../SmartappsTooltip/SmartappsTooltip";
import DeepSearchProgress from "../DeepSearchProgress/DeepSearchProgress";
import ArticleIcon from '@mui/icons-material/Article';

const ChatSection = React.memo((props: any) => {
  const [chatItems, setChatItems] = useState([]);
  const chatMessagesData = useAppSelector(
    (state: any) => state.brena.chatMessagesData
  );
  const toggleChatSectionAnimation = useAppSelector(
    (state: any) => state.brena.toggleChatSectionAnimation
  );
  const launchPoint = useAppSelector((state: any) => state.brena.launchPoint);
  const chatMessagesDefferedData = useDeferredValue(chatMessagesData);
  const dispatch = useAppDispatch();
  const device = useDetectDevice();
  const chatMessagesDataRef = useRef<any>([]);

  useEffect(()=> {
    chatMessagesDataRef.current = chatMessagesData;
  }, [chatMessagesData])

  useEffect(() => {
    let updatedChatItems: any = [];
    if (chatMessagesData?.length) {
      updatedChatItems = [...chatMessagesData];
    }
    setChatItems(updatedChatItems);
    // eslint-disable-next-line
  }, [chatMessagesDefferedData]);

  const handleSelectFromDrive = ()=> {
    const viewData = {
      launchPoint: "reactFrame",
      uploadType: "single",
      pickFileBtnText: "Upload",
      pickFileBtnCls: "extract-specs-cls",
    };
    if (device === "brena-desktop") {
       CommonUtility.openFilesSelectionWindow(viewData, function (files: any) {
        console.log('srini files', files);
        if (files?.length > 0) {
          let messagesList = [];
          let itemIdsList = [];
          for (let i = 0; i < files.length; i++) {
            let obj = {
              msg: `File uploaded to create new Smartapp ${files[i].data?.displayName}`,
              isReply: false,
              fileType: files[i].data?.fileType,
            };
            messagesList.push(obj);
            itemIdsList.push(files[i].data?.uniqueId);
          }
          let cloneChatMessagesData = [...chatMessagesDataRef.current];
          const localIndex = cloneChatMessagesData.findIndex(
            (rec: any) => rec.buttonId === "selectFromLocal"
          );
          if (localIndex > -1) {
            cloneChatMessagesData.splice(localIndex, 1);
            dispatch(
              setChatMessagesData([...cloneChatMessagesData, ...messagesList])
            );
          }
          //Trigger onuiEvent
          if (saWebComp?.brenaApi?.onUIEvent) {
            saWebComp?.brenaApi?.onUIEvent("select_from_drive", itemIdsList);
          }
        }
        
       });
    }
   
  }

  const onChatSecionItemClick = (rec: any) => {
    if (rec.isButton) {
      if (rec.buttonId === 'selectFromDrive') {
        handleSelectFromDrive();
      } else if (rec.buttonId === 'selectFromLocal') {
        //TODO: Yet to implement
      }
    } else if (rec.isReply && rec.suggest?.length) {
      dispatch(updateChatHistoryThreadData(rec.suggest));
    } else if (!rec.isReply) {
      //TODO: set the selected value to input.
      dispatch(updateSelectedChatMsg({ msg: rec.msg, count: Date.now() }));
    }
  };

  const onPromptBtnClick = (btnRec: any, userPromptText: any) => {
    if (btnRec?.name === "yes") {
      saWebComp?.brenaApi?.onUIEvent("restricted_to_area", {
        text: userPromptText,
      });
    }
  };

  const onCopyBtnClick = (e: any, msg: any) => {
    e.preventDefault();
    e.stopPropagation();
    const selection: any = window.getSelection();

    let selectedText: any = msg;
    if (selection.rangeCount > 0) {
      const selectionText: any = selection.toString().trim();

      if (selectionText.length > 0) {
        selectedText = selectionText;
      }
    }
    let divEl = document.createElement("div");
    divEl.innerHTML = selectedText;
    navigator.clipboard.writeText(divEl.innerText).then(() => {
      dispatch(
        updateShowSnackbar({ open: true, msg: "Text is copied to clipboard" })
      );
      setTimeout(() => {
        dispatch(updateShowSnackbar({ open: false, msg: "" }));
      }, 3000);
    });
  };

  const getFormattedMsg = (rec: any) => {
    let msg: any = marked.parse(rec.msg);
    if (rec.pageNumber && rec.specBookId && msg?.includes(rec.pageNumber)) {
      const linkTag = `<span class="chat-section_inner-item-page-num" id="brena-specs-book-id">${rec.pageNumber}</span>`;
      msg = msg.replace(new RegExp(rec.pageNumber, "g"), linkTag);
    } else {
      msg = msg || "";
      if (rec.links && Object.keys(rec.links)?.length > 0) {
        const keys: any = Object.keys(rec.links);
        console.log("links data", rec.links);
        keys.forEach((keyItem: any) => {
          const linkTag = `<span class="chat-section_inner-item-clickable-link" id="brena-links-id" data-guid="${rec.links[keyItem]}">${keyItem}</span>`;
          msg = msg.replace(keyItem, linkTag);
          console.log("links msg ", msg);
        });
      }

      if (rec?.reactLinks && Object.keys(rec?.reactLinks)?.length > 0) {
        const keys: any = Object.keys(rec.reactLinks);
        console.log("React links data", rec.reactLinks);
        keys.forEach((keyItem: any) => {
          const linkTag = `<span class="chat-section_inner-item-clickable-link" id="brena-react-links-id" data-reactlinkname="${keyItem}">${keyItem}</span>`;
          msg = msg.replace(keyItem, linkTag);
          console.log("reactLinks msg ", msg);
        });
      }

      if (rec.docObj && Object.keys(rec.docObj)?.length > 0) {
        const keys: any = Object.keys(rec.docObj);
        keys.forEach((keyItem: any) => {
          const docTag = `<span class="chat-section_inner-item-clickable-link" id="brena-doc-id" data-guid="${rec.docObj[keyItem]?.Id}">${keyItem}</span>`;
          msg = msg.replace(keyItem, docTag);
        });
      }
    }

    return msg;
  };

  const updateCtxChange = (guid: any) => {
    window.postMessage(
      {
        event: "brena-ui-extra-ctx",
        data: {
          item_ids: [{ id: guid, Id: guid }],
        },
      },
      "*"
    );
  };

  const onMessageClick = async (event: any, rec: any) => {
    const targetId: any = event?.target?.id;
    if (targetId === "brena-specs-book-id") {
      dispatch(setActiveChatWidget("specs"));
      dispatch(getSpecBookPages({ id: rec.specBookId }));
      dispatch(updateSelectedPageNumber(rec.pageNumber));
      dispatch(updateSuggestionPanelSize("medium"));
    } else if (targetId === "brena-links-id") {
      const guid: any = event.target.dataset?.guid;
      if (guid) {
        if (device === "brena-desktop") {
          CommonUtility.openSAPropPage({
            smartItemId: guid,
          });
        } else {
          if (IQMobile && IQMobile.Utilities) {
            IQMobile.Utilities.openPropertyPage(guid);

            if (device === "brena-mobile") {
              dispatch(updateSmartItemClicked(true));
              setTimeout(() => {
                dispatch(updateSmartItemClicked(false));
              }, 1000);
            }
          }
        }
        updateCtxChange(guid);
      }
    } else if (
      targetId === "brena-doc-id" &&
      device === "brena-desktop"
    ) {
      const guid: any = event.target.dataset?.guid;
      if (guid) {
        const docObjValues: any = Object.values(rec.docObj);
        const docIndex: any = docObjValues.findIndex(
          (item: any) => item.Id === guid
        );
        if (docIndex > -1) {
          const currentDocRec: any = docObjValues[docIndex];
          const fileName: any = currentDocRec.Name
            ? currentDocRec.Name
            : currentDocRec.FileName;
          const splitNameArr: any = fileName?.split(".") || [];
          let fileType: any =
            splitNameArr?.length > 1
              ? splitNameArr[splitNameArr.length - 1]
              : "";
          handleDriveFileClick(device, currentDocRec, fileType, fileName);
        }
      }
    } else if (targetId === "brena-react-links-id") {
      let reactLinkName = event?.target?.dataset?.reactlinkname;
      let selectedReactLink = rec.reactLinks[reactLinkName];
      let currentType =
        reactAppTypeModules[selectedReactLink?.itemType.toLowerCase()];
      if (selectedReactLink?.itemType?.length && currentType.length) {
        CommonUtility?.ReactHelper.openItem({
          itemId: selectedReactLink?.id,
          type: currentType,
          title: selectedReactLink?.Name, //TODO need to check data
          parentItemId: getParentItemId(selectedReactLink), //TODO need to check data
          subType: getSubType(selectedReactLink),
        });
      }
    } else if(event?.target?.tagName?.toLowerCase() === 'a') {
      event.preventDefault();
      event.stopPropagation();
      let href: any = event.target.href;
      if (href.includes('brenamarkdown.fn')) {
        let splits: any = href.split('/');
        if (saWebComp?.brenaApi) {
          saWebComp?.brenaApi?.onUIEvent(splits[splits.length -1]);
        }

      }

    }
  };

  return (
    <div className="chat-section">
      {chatItems.map((rec: any, index: any) => {
        const formattedMsg: any = getFormattedMsg(rec);
        return (
          <div key={index} className="chat-section_item-wrapper">
            <div
              className={
                "chat-section_item " +
                (rec.isReply ? " is-reply " : " is-selection ") +
                (rec.isWaiting ? " is-waiting " : "") +
                (rec.suggest?.length ? " chat-history-thread " : "") + 
                (rec.isButton ? ' is-button ' : '')
              }
              tabIndex={0}
              onClick={() => onChatSecionItemClick(rec)}
            >
              <div
                className="chat-inner-item"
                //onClick={(e)=> rec.pageNumber ? onMessageClick(e, rec): null}
                onClick={(e) => onMessageClick(e, rec)}
                contentEditable={device !== "brena-desktop"}
                suppressContentEditableWarning={device !== "brena-desktop"}
                onKeyDown={(e) => device !== "brena-desktop" && e.preventDefault()} // Prevent typing
                onPaste={(e) => device !== "brena-desktop" && e.preventDefault()} // Prevent pasting
                onInput={(e) => device !== "brena-desktop" && e.preventDefault()} // Prevent direct content changes
                onFocus={(e) => device !== "brena-desktop" && e.target.blur()}
                dangerouslySetInnerHTML={{ __html: formattedMsg }}
              ></div>
              {rec.isReply && rec.copy && (
                <div
                  className={
                    "brena-chat-inline-bar " +
                    (launchPoint === "gantter_public"
                      ? " brena-gantter_launchpoint "
                      : "")
                  }
                >
                  <div className="copy-icon-container">
                    <svg
                      onMouseDown={(e: any) => onCopyBtnClick(e, rec.msg)}
                      className="MuiSvgIcon-root MuiSvgIcon-fontSizeSmall  css-f5io2"
                      focusable="false"
                      aria-hidden="true"
                      viewBox="0 0 24 24"
                      data-testid="ContentCopyIcon"
                      aria-label="fontSize small"
                    >
                      <path d="M16 1H4c-1.1 0-2 .9-2 2v14h2V3h12zm3 4H8c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h11c1.1 0 2-.9 2-2V7c0-1.1-.9-2-2-2m0 16H8V7h11z"></path>
                    </svg>
                    <div className="brena-copy-tooltip">Copy</div>
                  </div>
                  {launchPoint !== "gantter_public" && (
                    <div className="brena-chat-smart-item-plus-container">
                      <SmartappsTooltip
                        brenaMsg={formattedMsg}
                      ></SmartappsTooltip>
                    </div>
                  )}
                  <TextReader text={rec.msg}></TextReader>
                </div>
              )}

              {rec.type === "prompt" && (
                <div className="prompt-btns-warpper">
                  {RESTRICTED_TO_BUTTONS.map((btn: any, index: any) => {
                    return (
                      <Button
                        variant="outlined"
                        key={btn.name}
                        className={
                          "prompt-btns " +
                          (index % 2 === 0 ? "even-btn" : "odd-btn")
                        }
                        onClick={() => onPromptBtnClick(btn, rec.lastUserMsg)}
                      >
                        {btn.displayText}
                      </Button>
                    );
                  })}
                </div>
              )}
            </div>
          </div>
        );
      })}
      {toggleChatSectionAnimation === "start" && (
        <div key="dot-pulse" className="chat-section_item-wrapper">
          <div className="chat-section_item is-reply is-waiting">
            <div className="dot-pulse"></div>
          </div>
        </div>
      )}
      <DeepSearchProgress></DeepSearchProgress>
    </div>
  );
});
export default ChatSection;
