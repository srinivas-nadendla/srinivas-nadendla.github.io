import React, { useRef, useState, useEffect, useCallback } from "react";
import { useAppSelector, useAppDispatch } from "../../store/hooks";
import brena from "../../img/Brena.png";
import SUIChatSuggestions from "../ChatSuggestions/ChatSuggestions";
import SUIChatWidget from "../ChatWidget/ChatWidget";
import ChatWidgetFooter from "../ChatWidgetFooter/ChatWidgetFooter";
import {
  getFormattedWelcomeData,
  getFormattedChatData,
  SECTIONS_TO_SHOW_SUGGESTIONS,
  getFormattedHelpData,
  getFormattedReportData,
  SECTIONS_NEED_EXTRA_WIDTH,
  SECTIONS_TO_KEEP_CHAT_AS_ACTIVE,
  getFormattedQueryItems,
  getFormattedFinanceData,
  getFormattedBreadCrumbsData,
  SUGGETSION_PANEL_SECTIONS,
  getBaseUrl,
  isTabletApp,
  SECTIONS_NEED_ETXRA_LARGE_WIDTH,
} from "../../utils/CommonUtil";
import { Button, IconButton } from "@mui/material";
import ArrowForwardIosIcon from "@mui/icons-material/ArrowForwardIos";
import ArrowBackIosNewIcon from "@mui/icons-material/ArrowBackIosNew";
import {
  setChatMessagesData,
  setActiveChatWidget,
  updateWelcomeData,
  updateTagsList,
  updateActualTagsList,
  updateLastTypedOrSelectedUserMessage,
  updateHelpData,
  updateReportData,
  updateChatHistoryData,
  updateSuggestionPanelSize,
  updateTaskItemsData,
  updateFinanceData,
  updateBreadCrumbsData,
  updateChatSectionAnimation,
  updateBudgetSuggestionsData,
  resetBudgetSugegstionsData,
  updateIsOutsideArea,
  updateActualQueryData,
  updateShowConfirmPrompt,
  updateLastActionPerformed,
  updateSpecsPagesData,
  updateDriveItemsData,
  updateTagsLastClickedBtn,
  updatePlannerTagGroups,
  updateGraphStorageData,
  updateSmartAppsData,
  updateMinimizeBrena,
  resetStoreState,
  updateLaunchPoint,
  updateDeepSearchProgress,
  updateDeepSearchItems,
  updateAppThumbnails,
  updateDeepSearchSelectedItems,
  updateAppStudioData,
  updateShowSnackbar
} from "../../store/brenaSlice";
import ConfirmationPrompt from "../ConfirmationPrompt/ConfirmationPrompt";
import { useDetectDevice } from "../../hooks/useDetectDevice";
import CommonMainWidget from "../CommonMainWidget/CommonMainWidget";
import brenaConstuction from "../../img/brena-construction-assistant.png";
import brenaAssist from "../../img/brena-construction-assistant.png";
import Collpse from "../../img/minimize.png";
import ChatWidgetToolbar from "../ChatWidgetToolbar/ChatWidgetToolbar";
import PinUnpin from "../PinUnpin/PinUnpin";
declare global {
  var IQSketchLiteManager: any;
}

export interface ChatWidgetDlgProps {
  open: boolean;
  onClose: (value: string) => void;
}

export const SUIChatDailog = (props: ChatWidgetDlgProps) => {
  const { onClose, open } = props;
  const [collaspeWidget, setCollaspeWidget] = useState(false);
  const [pressed, setPressed] = useState(false);
  const [showSuggetions, setShowSuggetions] = useState(false);
  const [isFinance, setIsFinance] = useState<any>(false);
  const [initializeInitUI, setInitializeInitUI] = useState<any>(false);
  const [widgetPos, setWidgetPos] = useState<any>("brena-widget-pos-right");
  const launchPoint = useAppSelector((state: any) => state.brena.launchPoint);

  const activeWidgetRef = useRef("welcome");
  
  const showConfirmationPrompt = useAppSelector(
    (state: any) => state.brena.showConfirmPrompt
  );
  const lastActionPerformed = useAppSelector(
    (state: any) => state.brena.lastActionPerformed
  );
  const breadCrumbsData = useAppSelector(
    (state: any) => state.brena.breadCrumbsData || []
  );
  const dlgRef: any = useRef();
  const dispatch: any = useAppDispatch();
  const chatMessagesData = useAppSelector(
    (state: any) => state.brena.chatMessagesData
  );
  const activeChatWidget = useAppSelector(
    (state: any) => state.brena.activeChatWidget
  );
  const tagsList: any = useAppSelector((state: any) => state.brena.tagsList);
  const helpData: any = useAppSelector((state: any) => state.brena.helpData);
  const reportData: any = useAppSelector(
    (state: any) => state.brena.reportData
  );
  const minimizeBrena: any = useAppSelector(
    (state: any) => state.brena.minimizeBrena
  );

  const chatHistorySuggestData: any = useAppSelector(
    (state: any) => state.brena.chatHistoryThreadData
  );

  const suggestionsPanelSize: any = useAppSelector(
    (state: any) => state.brena.suggestionsPanelSize
  );

  const lastTypedOrSelectedUserMessage: String = useAppSelector(
    (state: any) => state.brena.lastTypedOrSelectedUserMessage
  );
  const recentSelectedSmartItem: any = useAppSelector(
    (state: any) => state.brena.recentSelectedSmartItem
  );
  const deepSearchItems: any = useAppSelector(
    (state: any) => state.brena.deepSearchItems
  );
  const recentSelectedSmartItemRef: any = useRef(recentSelectedSmartItem);
  const chatDataRef = useRef<any>([]);
  const tagsDataRef = useRef<any>([]);
  const helpDataRef = useRef<any>({ html: "" });
  const reportDataRef = useRef<any>([]);
  const deepSearchDataRef = useRef<any>([]);
  
  const financeDataRef = useRef<any>({ html: "" });
  const isPreviewBtnClicked = useAppSelector(
    (state: any) => state.brena.isPreviewBtnClicked
  );
  const device = useDetectDevice();
  const selectedPageNumber: any = useAppSelector(
    (state: any) => state.brena.selectedPageNumber
  );

  const closeSuggestionsPanel: any = useAppSelector(
    (state: any) => state.brena.closeSuggestionsPanel
  );
  const filtersApplied: any = useAppSelector((state: any) => state.brena.filtersApplied);
  const filtersAppliedRef: any = useRef<any>(filtersApplied);
  
  useEffect(()=> {
   filtersAppliedRef.current = filtersApplied;
  }, [filtersApplied])

  useEffect(() => {
    if (closeSuggestionsPanel) {
      setShowSuggetions(false);
      dispatch(setActiveChatWidget("chat"));
    }
  }, [closeSuggestionsPanel]);

  useEffect(() => {
    if (breadCrumbsData?.length > 0) {
      setIsFinance(breadCrumbsData[0]?.type === "finance");
    }
  }, [breadCrumbsData]);

  useEffect(() => {
    if (!isPreviewBtnClicked && lastActionPerformed?.type) {
      if (lastActionPerformed.type === "close") {
        handleClose(null, null);
      }
    }
  }, [isPreviewBtnClicked, lastActionPerformed]);

  const handleClose = (event: any, reason: any) => {
    if (reason && reason === "backdropClick") return;
    if (isPreviewBtnClicked) {
      dispatch(updateShowConfirmPrompt(true));
      dispatch(updateLastActionPerformed({ type: "close" }));
      return;
    }
    if (filtersAppliedRef.current && saWebComp?.brenaApi) {
      saWebComp?.brenaApi?.onUIEvent("close_brena", "");
    }
    onClose("");
    dispatch(resetStoreState());
    
    dispatch(updateLastActionPerformed({ type: "", content: "" }));
    const elements = document.querySelectorAll(`.common-widget-dlg`);
    if (elements?.length >1) {
      (elements || []).forEach((element) => {
        element.parentNode?.removeChild(element);
      });
    }
    
  };

  const getMinimizedWidgetPosition = (e: any) => {
    console.log("on minmized fake button clicked");
    const buttonRect = e.target.getBoundingClientRect();
    const pageCenter = window.innerWidth / 2;
    const buttonCenter = buttonRect.left + buttonRect.width / 2;

    // Compare button's center to the page center
    if (buttonCenter < pageCenter) {
      return "brena-widget-pos-left";
    } else {
      return "brena-widget-pos-right";
    }
  };

  const onExpandWidget = useCallback((e: any, origin: any) => {
    if (!pressed) {
      if (origin !== "from-suggestions-expand" && device !== "brena-mobile") {
        const position: any = getMinimizedWidgetPosition(e);
        setWidgetPos(position);
      }
      setCollaspeWidget(false);
    } else {
      setPressed(false);
    }
  }, []);

  const onSuggestionExpand = () => {
    if (collaspeWidget) {
      onExpandWidget(null, "from-suggestions-expand");
    }
    setShowSuggetions(true);
  };

  const onSuggestionCollapse = () => {
    setShowSuggetions(false);
  };

  useEffect(() => {
    recentSelectedSmartItemRef.current = recentSelectedSmartItem;
  }, [recentSelectedSmartItem]);

  /**
   * Triggers when we receive addSection details from brena
   * @param sectionName @string Active action name
   * @param batchId @string Id generated from brena
   * @author Srinivas Nadendla
   */
  const onAddSectionReceive = (sectionName: any, batchId: any) => {
    if ((activeWidgetRef.current === 'chat_history' && sectionName === 'welcome') || (activeWidgetRef.current === 'welcome' && sectionName === 'chat_history')) {
      return;
    }
    if (
      !(
        sectionName === "chat" &&
        SECTIONS_TO_KEEP_CHAT_AS_ACTIVE.includes(activeWidgetRef?.current)
      )
    ) {
      dispatch(setActiveChatWidget(sectionName));
    }
    if (activeWidgetRef?.current) {
      activeWidgetRef.current = sectionName;
    }

    if (SUGGETSION_PANEL_SECTIONS.includes(sectionName)) {
      if (SECTIONS_NEED_EXTRA_WIDTH.includes(sectionName)) {
        dispatch(updateSuggestionPanelSize("medium"));
      } else if (SECTIONS_NEED_ETXRA_LARGE_WIDTH.includes(sectionName)){
        dispatch(updateSuggestionPanelSize("large"));
      } else {
        dispatch(updateSuggestionPanelSize("small"));
      }
    }
  };
  /**
   * Tiggers from brena api
   * @param batchId @string Id generated from brena
   * @param data @array of resposne we get from brena - Need to diffrentiate the data based on type key
   */
  const onAddDataReceive = (batchId: any, data: any) => {
    if (data.type === "graphStorage") dispatch(updateGraphStorageData(data));
    switch (activeWidgetRef.current) {
      case "welcome":
        let isWelcomeData: any = false;
        (data || []).forEach((item: any = {}) => {
          if (item?.type === "suggestion" || item.type === "user_role") {
            isWelcomeData = true;
          }
        });
        if (!isWelcomeData) return;
        dispatch(updateWelcomeData(getFormattedWelcomeData(data)));
        resetAllExcept(['welcome']);

        break;
      case "chat":
      case "search":
      case "recommend":
      case "prompt":
        const formattedData = getFormattedChatData(
          data,
          chatDataRef.current,
          tagsDataRef.current
        );
        const allChatData = [...(formattedData.chatList || [])];

        chatDataRef.current = allChatData;
        tagsDataRef.current = [...formattedData?.tagsList];
        dispatch(setChatMessagesData(allChatData));
        dispatch(updateTagsList(formattedData?.tagsList));
        dispatch(updateActualTagsList(formattedData?.tagsList));
        if (activeWidgetRef.current === "recommend") {
          resetAllExcept(['tags']);
        }

        break;
      case "help":
        const formattedHelpData = getFormattedHelpData(
          data,
          helpDataRef.current
        );
        const allHelpData = { ...(formattedHelpData || {}) };
        helpDataRef.current = allHelpData;
        dispatch(updateHelpData(allHelpData));

        //Clear our existing content from suggestions panel
        resetAllExcept(['help']);
        break;
      case "report":
        const formattedReportData = getFormattedReportData(data) || [];
        const allReportData = [...formattedReportData];
        reportDataRef.current = allReportData;
        dispatch(updateReportData(allReportData));

        //Clear our existing content from suggestions panel
        resetAllExcept(['report']);
        break;
      case "chat_history":
        dispatch(updateChatHistoryData(data?.[0]?.data || []));
        resetChatData();
        break;
      case "query":
        const formattedQueryData = getFormattedQueryItems(
          data?.[0]?.data || []
        );
        dispatch(updateActualQueryData(data?.[0]?.data || []));
        dispatch(updateTaskItemsData(formattedQueryData));

        resetAllExcept(['tasks']);
        break;
      case "finance":
        resetFinanceData();
        const formattedFinanceData = getFormattedFinanceData(
          data,
          financeDataRef.current
        );
        const allFinanceData = { ...(formattedFinanceData || {}) };
        financeDataRef.current = allFinanceData;
        dispatch(updateFinanceData(allFinanceData));
        dispatch(
          updateBudgetSuggestionsData({
            assumptions: allFinanceData.assumptions,
            influencers: allFinanceData.influencers,
          })
        );

        resetAllExcept(['finance']);
        break;
      case "drivefiles":
        dispatch(updateDriveItemsData(data?.[0]?.data || []));

        resetAllExcept(['drive']);
        break;
      case "massItemCreator":
        dispatch(updateDeepSearchItems(data?.[0]?.data?.items || []));
        dispatch(updateDeepSearchSelectedItems([]));
        dispatch(updateAppThumbnails(data?.[0]?.data?.thumnails || {}));
        resetAllExcept(['deepSearch']);
        break;
      case "appbuilder":
        dispatch(updateAppStudioData(data?.[0] || {}));
        resetAllExcept(['appbuilder']);
        break;

    }
  };

  useEffect(() => {
    if (chatHistorySuggestData?.length > 0) {
      const dataType: any = chatHistorySuggestData[0].type?.toLowerCase();
      let sectionType = dataType;
      switch (dataType) {
        case "tag":
          sectionType = "recommend";
          break;
        case "html":
          sectionType = "help";
          break;
        case "budget":
          sectionType = "finance";
          break;
      }
      onAddSectionReceive(sectionType, "");
      onAddDataReceive("", chatHistorySuggestData);
    }
    // eslint-disable-next-line
  }, [chatHistorySuggestData]);

  const resetDeepSearchItemsData = () => {
    deepSearchDataRef.current = [];
    dispatch(updateDeepSearchItems([]));
    dispatch(updateDeepSearchSelectedItems([]));
    dispatch(updateDeepSearchProgress(null));
  };

  const resetReportData = () => {
    reportDataRef.current = [];
    dispatch(updateReportData([]));
  };

  const resetHelpData = () => {
    helpDataRef.current = { html: "" };
    dispatch(updateHelpData({ html: "" }));
  };

  const resetTagsData = () => {
    tagsDataRef.current = [];
    dispatch(updateTagsList([]));
    dispatch(updateActualTagsList([]));
    dispatch(updateTagsLastClickedBtn(""));
  };

  const resetTasksItemsData = () => {
    dispatch(updateTaskItemsData([]));
  };

  const resetChatData = () => {
    chatDataRef.current = [];
    dispatch(setChatMessagesData([]));
  };

  const resetFinanceData = () => {
    financeDataRef.current = { html: "" };
    dispatch(updateFinanceData({ html: "" }));
    dispatch(resetBudgetSugegstionsData());
  };

  const resetSpecsData = () => {
    dispatch(updateSpecsPagesData([]));
  };

  const resetDrivesData = () => {
    dispatch(updateDriveItemsData([]));
  };

  const resetAppBuilderData = ()=> {
    dispatch(updateAppStudioData({}));
    dispatch(updateDeepSearchProgress(null));
  }

  /**
   * This will take care of the reset of earlier used sections whenever new section is active.
   * @param exclude Array of strings
   * @author Srinivas Nadendla
   */
  const resetAllExcept = (exclude: string[]) => {
    if (!exclude.includes("help")) resetHelpData();
    if (!exclude.includes("tags")) resetTagsData();
    if (!exclude.includes("report")) resetReportData();
    if (!exclude.includes("tasks")) resetTasksItemsData();
    if (!exclude.includes("finance")) resetFinanceData();
    if (!exclude.includes("specs")) resetSpecsData();
    if (!exclude.includes("drive")) resetDrivesData();
    if (!exclude.includes("deepSearch")) resetDeepSearchItemsData();
    if (!exclude.includes("appbuilder")) resetAppBuilderData();
  };

  const onFinishSection = (section: any) => {
    console.log("On finish", section);
  };

  const onClear = (section: any) => {
    console.log("on Clear", section);
  };

  useEffect(() => {
    if (activeWidgetRef?.current) {
      activeWidgetRef.current = activeChatWidget;
    }
    if (activeChatWidget === "specs") {
      resetAllExcept(['specs']);
    }
    if (activeChatWidget === "chat" && device === "brena-mobile") {
      setShowSuggetions(false);
    }
  }, [activeChatWidget]);

  useEffect(() => {
    if (selectedPageNumber) {
      setShowSuggetions(true);
      setCollaspeWidget(false);
    }
  }, [selectedPageNumber]);

  useEffect(() => {
    if (
      lastTypedOrSelectedUserMessage?.length > 0 &&
      saWebComp?.brenaApi?.onUIEvent
    ) {
      let data: any = {human_input: lastTypedOrSelectedUserMessage};
      if (chatMessagesData?.length > 0 && chatMessagesData[0].createAppByConversation) {
        data.tool = 'AppBuilder';
      }
      saWebComp?.brenaApi?.onUIEvent(
        "chat_message",
        data
      );
      dispatch(updateLastTypedOrSelectedUserMessage(""));
    }
    // eslint-disable-next-line
  }, [lastTypedOrSelectedUserMessage]);

  const onContextChange = (contextId: any, data: any = {}) => {
    dispatch(
      updateBreadCrumbsData(getFormattedBreadCrumbsData(data?.ui || {}))
    );
    dispatch(updatePlannerTagGroups(data?.ui?.groups || []));
  };

  const waitAnimate = (animate: any) => {
    dispatch(updateChatSectionAnimation(animate));
  };

  /**
   *  Will use this in future for any direct comunications with Brena JS package
   * @param type
   * @param data
   */
  const onBrenaMessage = (type: any, data: any) => {
    if (type === "outside_area") {
      dispatch(updateIsOutsideArea(data));
    } else if (type === "itemCreator") {
      hitCreateItemApi(data?.data);
    } else if (type === "progressUpdate") {
      if (data?.data?.Message) {
        dispatch(updateDeepSearchProgress(data.data));
      } else {
        setTimeout(()=> {
          dispatch(updateDeepSearchProgress(null));
        }, 1000)
      }
      
    } else if (type === "createAppStatus") {
      onCreateAppStatus(data?.success);
    }
  };

  const onCreateAppStatus = (isSuccess: any) => {
    const toastMsg = isSuccess ? "Suggested new Smartapp is Added to the AppStudio." : "Failed to add the Suggested Smartapp to the AppStudio";
    dispatch(updateShowSnackbar({ open: true, msg: toastMsg }));
    setTimeout(() => {
      dispatch(updateShowSnackbar({ open: false, msg: "" }));
    }, 3000);
  };

  const hitCreateItemApi = (data: any = {}) => {
    let metaDataObj = { ...data },
      links = [...(data.links || [])];
    metaDataObj = JSON.parse(JSON.stringify(metaDataObj));
    if (metaDataObj.links) delete metaDataObj.links;

    let projectId: any;
    if (device === "brena-mobile" || isTabletApp()) {
      projectId = getIQMobileApp()?.GetCurrentProject()?.projectUId;
    } else {
      if (GBL && GBL.config) {
        projectId = GBL.config.currentProjectInfo?.projectUniqueId;
      }
    }
    let baseUrl = getBaseUrl();
    const endpoint =
      baseUrl + "/EnterpriseDesktop/brenaai/brena/CreateUpdateItem";
    let payload: any = {
      appId: recentSelectedSmartItemRef.current?.smartAppId,
      projectId: projectId,
      metaData: metaDataObj,
      links: links,
    };
    fetch(endpoint, {
      method: "POST",
      headers: {
        "content-type": "application/x-www-form-urlencoded;charset=UTF-8",
      },
      body: JSON.stringify([payload]),
    })
      .then((res: any) => res.json())
      .then((res: any) => {
        //TODO: To Re-validate once BE changes in place
        if (res.data?.[0]?.Id) {
          if (device === "brena-mobile" || isTabletApp()) {
            dispatch(updateMinimizeBrena(Date.now()));
            IQMobile.Utilities.openPropertyPage(res.data[0].Id);
          } else {
            CommonUtility.openSAPropPage({
              instanceId: res.data[0].Id,
            });
          }
        }
      });
  };

  useEffect(() => {
    if (
      !showSuggetions &&
      SECTIONS_TO_SHOW_SUGGESTIONS.includes(activeChatWidget)
    ) {
      setShowSuggetions(true);
    } else if (showSuggetions && activeChatWidget === "welcome") {
      setShowSuggetions(false);
    }
    // eslint-disable-next-line
  }, [activeChatWidget]);

  const getScriptTag = (path: any) => {
    let script = document.createElement("script");
    script.type = "text/javascript";
    script.src = path;
    return script;
  };

  const getLinkTag = (path: any) => {
    const link = document.createElement("link");
    link.rel = "stylesheet";
    link.type = "text/css";
    link.href = path;
    return link;
  };

  const loadIqSketchFiles = () => {
    const brenaFilePath: any = document.getElementById("BRENDA-AI-LIB");
    const brenaPath = brenaFilePath?.src;
    const relUrl = brenaPath?.split("index.js")?.[0];
    const fullPath: any = relUrl + "iqsketchlite/";

    document.head.appendChild(getScriptTag(fullPath + "index.js"));
    document.head.appendChild(getLinkTag(fullPath + "index.css"));
  };


  useEffect(() => {
    if (!open) return;
    if (open) window.postMessage({ event: "brena-initialize" }, "*");

    /**
     * Triggers when we open the brena widget or When user clicks on New Chat
     * Calling initUI method and adding callbacks needed to receive the data
     * @author Srinivas Nadendla
     */
    const initializeBrena = async () => {
      if (saWebComp?.brenaApi) {
        let baseUrl = getBaseUrl();
        saWebComp.brenaApi.initUI(
          {
            addSection: onAddSectionReceive,
            addData: onAddDataReceive,
            finishSection: onFinishSection,
            clear: onClear,
            onContextChange: onContextChange,
            waitAnimate: waitAnimate,
            zoneUrl: baseUrl,
            postMessage: onBrenaMessage
          },
          () => {
            saWebComp.brenaApi.onUIEvent("new_chat");
            setTimeout(()=> {
              getAllSmartApps();
            }, 3000)
          }
        );
      }
    };
    if (open && initializeInitUI) {
      console.log("brena initUI called");
      initializeBrena();
      setTimeout(() => {
        if (typeof IQSketchLiteManager === "undefined") {
          console.log("IQSketchLiteManager is undefined");
          loadIqSketchFiles();
        }
      }, 6000);
    }

    setTimeout(() => {
      document
        .querySelector(".common-widget-dlg .MuiDialog-container")
        ?.removeAttribute("tabindex");
    }, 1000);

    // eslint-disable-next-line
  }, [open, initializeInitUI]);

  useEffect(() => {
    chatDataRef.current = chatMessagesData || [];
  }, [chatMessagesData]);

  useEffect(() => {
    tagsDataRef.current = tagsList || [];
  }, [tagsList]);

  useEffect(() => {
    helpDataRef.current = helpData || { html: "" };
  }, [helpData]);

  useEffect(() => {
    reportDataRef.current = reportData || [];
  }, [reportData]);

  useEffect(()=> {
    deepSearchDataRef.current = deepSearchItems || []
  }, [])

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
          case "brena-maximize":
            const pageCenter = window.innerWidth / 2;
            if (data?.data?.xPos < pageCenter) {
              setWidgetPos("brena-widget-pos-left");
            } else {
              setWidgetPos("brena-widget-pos-right");
            }
            setCollaspeWidget(false);
            break;
    
          case "brena-api-initarea":
            console.log("brena-api-initarea --- called");
            if (data?.data?.extraInfo?.launchPoint) {
              dispatch(updateLaunchPoint(data.data.extraInfo.launchPoint));
            }
            setInitializeInitUI(true);
            break;
        }
      }
    };
    
    window.addEventListener("message", handleMessage);
    
    return () => {
      window.removeEventListener("message", handleMessage);
    };
    
  }, []);

  const SuggetsionsTmplButtons = React.memo(() => {
    return (
      <>
        {!showSuggetions &&
          SECTIONS_TO_SHOW_SUGGESTIONS.includes(activeChatWidget) &&
          !collaspeWidget && (
            <Button
              className="chat-dlg-suggestion-expand"
              onClick={onSuggestionExpand}
            >
              <ArrowBackIosNewIcon />
            </Button>
          )}

        {showSuggetions && (
          <Button
            className="chat-dlg-suggestion-collapse"
            onClick={onSuggestionCollapse}
          >
            <ArrowForwardIosIcon />
          </Button>
        )}
      </>
    );
  });

  const BrenaLogoTmpl = React.memo(() => {
    return (
      <>
        {device === "brena-mobile" ? (
          <img
            draggable={false}
            className="mobile-logo-btn"
            src="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAPYAAAArCAYAAABLsnU5AAAACXBIWXMAAAsTAAALEwEAmpwYAAAFJmlUWHRYTUw6Y29tLmFkb2JlLnhtcAAAAAAAPD94cGFja2V0IGJlZ2luPSLvu78iIGlkPSJXNU0wTXBDZWhpSHpyZVN6TlRjemtjOWQiPz4gPHg6eG1wbWV0YSB4bWxuczp4PSJhZG9iZTpuczptZXRhLyIgeDp4bXB0az0iQWRvYmUgWE1QIENvcmUgOS4xLWMwMDIgNzkuYTZhNjM5NiwgMjAyNC8wMy8xMi0wNzo0ODoyMyAgICAgICAgIj4gPHJkZjpSREYgeG1sbnM6cmRmPSJodHRwOi8vd3d3LnczLm9yZy8xOTk5LzAyLzIyLXJkZi1zeW50YXgtbnMjIj4gPHJkZjpEZXNjcmlwdGlvbiByZGY6YWJvdXQ9IiIgeG1sbnM6eG1wPSJodHRwOi8vbnMuYWRvYmUuY29tL3hhcC8xLjAvIiB4bWxuczpkYz0iaHR0cDovL3B1cmwub3JnL2RjL2VsZW1lbnRzLzEuMS8iIHhtbG5zOnBob3Rvc2hvcD0iaHR0cDovL25zLmFkb2JlLmNvbS9waG90b3Nob3AvMS4wLyIgeG1sbnM6eG1wTU09Imh0dHA6Ly9ucy5hZG9iZS5jb20veGFwLzEuMC9tbS8iIHhtbG5zOnN0RXZ0PSJodHRwOi8vbnMuYWRvYmUuY29tL3hhcC8xLjAvc1R5cGUvUmVzb3VyY2VFdmVudCMiIHhtcDpDcmVhdG9yVG9vbD0iQWRvYmUgUGhvdG9zaG9wIDI1LjEyICgyMDI0MDgxMi5tLjI3MzUgYjJkYzM3NCkgIChXaW5kb3dzKSIgeG1wOkNyZWF0ZURhdGU9IjIwMjQtMDgtMjFUMTQ6Mjg6MjErMDU6MzAiIHhtcDpNb2RpZnlEYXRlPSIyMDI0LTA4LTIxVDE0OjM3OjI1KzA1OjMwIiB4bXA6TWV0YWRhdGFEYXRlPSIyMDI0LTA4LTIxVDE0OjM3OjI1KzA1OjMwIiBkYzpmb3JtYXQ9ImltYWdlL3BuZyIgcGhvdG9zaG9wOkNvbG9yTW9kZT0iMyIgeG1wTU06SW5zdGFuY2VJRD0ieG1wLmlpZDphYjlkNDhhMC04ODNlLWI0NDUtOTE0MC1jOGEx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"
          />
        ) : (
          <img
            draggable={false}
            src={isFinance ? brenaAssist : brenaConstuction}
            alt="Brena"
            className={
              "chat-widget-container_title-img " +
              (isFinance ? " chat-widget-container_title-img-assistant" : "")
            }
          />
        )}
      </>
    );
  });

  const TitleBarTmpl = React.memo(() => {
    return (
      <React.Fragment key={"title-bar"}>
        {device === "brena-mobile" && (
          <div
            className="chat-widget-container_left-arrow"
            onClick={() => handleClose(null, null)}
          >
            {" "}
            <img
              alt="header-back-btn"
              className="header-back-btn"
              src="data:image/svg+xml;base64,PCEtLSBHZW5lcmF0ZWQgYnkgSWNvTW9vbi5pbyAtLT4KPHN2ZyB2ZXJzaW9uPSIxLjEiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyIgd2lkdGg9IjEwMjQiIGhlaWdodD0iMTAyNCIgdmlld0JveD0iMCAwIDEwMjQgMTAyNCI+Cjx0aXRsZT48L3RpdGxlPgo8ZyBpZD0iaWNvbW9vbi1pZ25vcmUiPgo8L2c+CjxwYXRoIGQ9Ik02NjEuMjA1IDc5My4wNDVsLTYwLjU4NyA2MC4xNi0zNDQuMjk5LTM0MS4yMDUgMzQ0LjI5OS0zNDEuMjA1IDYwLjU4NyA2MC4xNi0yODMuNjA1IDI4MS4wNDV6Ij48L3BhdGg+Cjwvc3ZnPgo="
            />{" "}
          </div>
        )}
        <BrenaLogoTmpl></BrenaLogoTmpl>

        {device === "brena-mobile" && (
          <>
            <PinUnpin></PinUnpin>
            <IconButton
              className="header-minimize-mob"
              aria-label="expand"
              onClick={() => {
                window.postMessage({ event: "brena-minimize" }, "*");
                setCollaspeWidget(true);
              }}
            >
              <img src={Collpse} alt="collapse Icon" />
            </IconButton>
          </>
        )}
      </React.Fragment>
    );
  });

  const getAllSmartApps = () => {
    if (launchPoint === 'gantter_public') return;
    let projectId: any;
    
    if (typeof getIQMobileApp !== "undefined" && (device === "brena-mobile" || isTabletApp())) {
      projectId = getIQMobileApp()?.GetCurrentProjectId();
    } else {
      if (typeof GBL !== "undefined") {
        projectId = GBL?.config?.currentProjectInfo?.id;
      }
    }
    if (!projectId) return;
    const endpointUrl =
      getBaseUrl() +
      `/EnterpriseDesktop/AppGroups/AppGroups.iapi/SmartAppList?groupId=3245&projectId=${projectId}`;
    fetch(endpointUrl)
      .then((res: any) => res.json())
      .then((res: any) => {
        dispatch(updateSmartAppsData(res.values || []));
      })
      .catch((error: any) => console.log(error));
  };

  useEffect(() => {
    if (minimizeBrena) {
      window.postMessage({ event: "brena-minimize" }, "*");
      setCollaspeWidget(true);
    }
  }, [minimizeBrena]);


  return (
    <CommonMainWidget
      isDisabled={collaspeWidget && !showSuggetions ? false : true}
      dialogClasses={`${suggestionsPanelSize} ${device} ${widgetPos}`}
      renderSuggetsinPanelButtons={() => (
        <SuggetsionsTmplButtons></SuggetsionsTmplButtons>
      )}
      renderSuggestionsPanel={() => (
        <SUIChatSuggestions
          className={showSuggetions ? "d-block" : "d-block"}
          onClose={() => setCollaspeWidget(!collaspeWidget)}
          collaspeWidget={!collaspeWidget}
          panelSize={suggestionsPanelSize}
        ></SUIChatSuggestions>
      )}
      renderConfirmationPrompt={() =>
        showConfirmationPrompt ? (
          <ConfirmationPrompt></ConfirmationPrompt>
        ) : (
          <></>
        )
      }
      collapseWdgt={() => {
        window.postMessage({ event: "brena-minimize" }, "*");
        setCollaspeWidget(true);
      }}
      collaspeWidget={collaspeWidget}
      cardParentClassName={
        device === "brena-mobile" &&
        showSuggetions &&
        SECTIONS_TO_SHOW_SUGGESTIONS.includes(activeChatWidget)
          ? "d-none"
          : ""
      }
      open={open}
      onClose={handleClose}
      renderWidgetBody={() =>
        !collaspeWidget ? <SUIChatWidget></SUIChatWidget> : <></>
      }
      renderMinimizedWidgetBody={() =>
        collaspeWidget ? (
          <div
            className="chat-brena"
            onClick={(e: any) => onExpandWidget(e, "on-click")}
          >
            <div className="chat-brena-cont">
              <img src={brena} alt="brena" draggable="false" />
            </div>
          </div>
        ) : (
          <></>
        )
      }
      renderTitleBar={() => <TitleBarTmpl />}
      renderToolBar={() => <ChatWidgetToolbar></ChatWidgetToolbar>}
      renderFooterBar={() => <ChatWidgetFooter></ChatWidgetFooter>}
      isPressed={(boolVal: any) => setPressed(boolVal)}
    ></CommonMainWidget>
  );
};

export default SUIChatDailog;
