/**
 * Formats the given data for "welcome" section in desired format.
 * So that In future if response format changes, we don't have to change the UI bindings.
 */
export const getFormattedWelcomeData = (data: any) => {
  let welcomeOptions: any = [];
  let userDetails: any = {};
  (data || []).forEach((item: any = {}) => {
    if (item?.type === "suggestion") {
      welcomeOptions.push({ text: item?.data, id: item?.data, isDeepSearch: item.deepSearch?.includes(item.data), ...item });
    } else if (item.type === "user_role") {
      userDetails = { name: item?.data?.name, ...item.data };
    }
  });
  return {
    welcomeOptions: welcomeOptions,
    userDetails: userDetails,
  };
};

export const getFormattedChatData = (
  data: any,
  oldChatData: any = [],
  oldTagsData: any = []
) => {
  let tagsList: any = [...oldTagsData];
  let chatList: any = [...oldChatData];
  (data || []).forEach((item: any = {}, index: any) => {
    if (item.type === "user" && item.data) {
      chatList.push({
        msg: item.data,
        reqId: item.reqId,
        type: item.type,
        isReply: false,
      });
    } else if ((item.type === "assistant" || item.type === "prompt") && item.data) {

      if (item.reqId) {
        const index = chatList.findIndex((rec: any) => {
          return rec.reqId === item.reqId && rec.type === item.type;
        });
        if (index > -1) {
          let obj = {
            ...chatList[index],
            msg: item.data,
          };
          chatList[index] = obj;
        } else {
          chatList.push({
            msg: item.data,
            reqId: item.reqId,
            type: item.type,
            isReply: true,
            copy: item.copy,
            pageNumber: item.pageNumber,
						specBookId: item.specBookId,
            links: item.links,
            reactLinks: item?.reactLinks,
            docObj : item.docObj 
          });
        }
      } else {
        if (item.data === 'outside_restricted_to_area') {
          let lastUserMsg = '';
          for(let i=chatList.length -1;i>=0;i--) {
            if (!chatList[i].isReply) {
              lastUserMsg = chatList[i].msg;
              break;
            }
          }
          chatList.push({
            msg: 'Question you have asked is not in the context of the current view. Would like me to extend my response to this entire Project Level?',
            reqId: item.reqId,
            type: item.type,
            isReply: true,
            suggest: item.suggest ? item.suggest : [],
            lastUserMsg: lastUserMsg
          });
        } else {
          chatList.push({
            msg: item.data,
            reqId: item.reqId,
            type: item.type,
            isReply: true,
            copy: item.copy,
            suggest: item.suggest ? item.suggest : [],
            pageNumber: item.pageNumber,
						specBookId: item.specBookId,
            links: item.links,
            reactLinks: item?.reactLinks,
            isDocView: item.isDocView,
            docObj : item.docObj 
          });
        }
       
      }
    } else if (item.type === "tag" && item.data) {
      const isWaitingIndex = chatList.findIndex((rec: any) => rec.isWaiting);
      if (isWaitingIndex > -1) {
        chatList.splice(isWaitingIndex, 1);
      }
      if (
        tagsList?.length > 0 &&
        item?.reqId !== tagsList[tagsList?.length - 1]?.reqId
      ) {
        tagsList = [];
      }
      if (Array.isArray(item.data)) {
        //When we get the data from chat-history
        tagsList = [...item.data];
      } else {
        tagsList.push({ ...item.data, reqId: item.reqId });
      }
    }
  });
    return { chatList: chatList, tagsList: tagsList };
};

/**
 * Formatting the hostory data into sub groups (Today, yesterday, This week..etc) based on date/timestamp
 * @param data - Array of chat history data
 * @returns Grouped data
 * @author Srinivas Nadendla
 */
export const getFormattedChatHistory = (data: any) => {
  const today = new Date();
  const yesterday = new Date(today);
  yesterday.setDate(yesterday.getDate() - 1);
  const currentWeek = new Date(today);
  currentWeek.setDate(currentWeek.getDate() - 7);

  const formattedData: any = [];
  if (data?.length > 0) {
    data.forEach((rec: any) => {
      if (rec.name && rec.name.length > 0) {
        let groupName = "";
        let recDate = new Date(rec?.date)?.toDateString();

        if (recDate === today.toDateString()) {
          groupName = "Today";
        } else if (recDate === yesterday.toDateString()) {
          groupName = "Yesterday";
        } else if (new Date(rec?.date) > currentWeek) {
          groupName = "This Week";
        } else {
          groupName = `${new Date(rec.date).toLocaleString("default", {
            month: "long",
          })}, ${new Date(rec.date).getFullYear()}`;
        }
        const index = formattedData.findIndex(
          (item: any) => item.groupName === groupName
        );
        if (index === -1) {
          formattedData.push({
            groupName: groupName,
            records: [rec],
          });
        } else {
          formattedData[index].records.push(rec);
        }
      }
    });
    return formattedData;
  }
};
const replaceTextWithSpans = (text: any) => {
  const regex = /\((\d+)\)/g; // Matches "(digits)" globally
  return text.replace(regex, (match: any) => `<span class='brena-text-hidden-cls'>${match}</span>`);
};

export const getFormattedHelpData = (data: any = [], oldHelpData: any = {}) => {
  let helpData: any = { ...oldHelpData };
  (data || []).forEach((item: any, index: any) => {
    if (item.type === "html" && item.data) {
      if (Array.isArray(item.data)) {
        //For data comes from chat-history
        helpData.html = item.data.join("");
      } else {
        if (helpData.reqId === item.reqId) {
          helpData.html = (helpData[index].html || "") + item.data;
        } else {
          helpData.html = item.data;
        }
      }
      helpData.html = replaceTextWithSpans(helpData.html);
      
    }
  });
  return helpData;
};

export const getFormattedReportData = (
  records: any = [],
) => {
  if (records?.length && records[0].data?.length) {
    return records[0].data;
  } else {
    return [];
  }
};

/**
 *
 * @param dateVal
 * @returns ex: 05-27-2015 10:35 AM format
 */
export const formatDate = (dateVal: any) => {
  const newDate = new Date(dateVal);

  const sMonth = padValue(newDate.getMonth() + 1);
  let sDay = padValue(newDate.getDate());
  let sYear = newDate.getFullYear();
  let sHour: any = newDate.getHours();
  let sMinute = padValue(newDate.getMinutes());
  let sAMPM = "AM";

  let iHourCheck = parseInt(sHour);

  if (iHourCheck > 12) {
    sAMPM = "PM";
    sHour = iHourCheck - 12;
  } else if (iHourCheck === 0) {
    sHour = "12";
  }

  sHour = padValue(sHour);

  return (
    sMonth +
    "-" +
    sDay +
    "-" +
    sYear +
    " " +
    sHour +
    ":" +
    sMinute +
    " " +
    sAMPM
  );
};

export const padValue = (value: any) => {
  return value < 10 ? "0" + value : value;
};

export const SECTIONS_TO_SHOW_SUGGESTIONS = [
  "recommend",
  "search",
  "help",
  "report",
  'query',
  'finance',
  'specs',
  'drivefiles',
  "massItemCreator",
  "appbuilder"
];
export const SECTIONS_TO_KEEP_CHAT_AS_ACTIVE = [
  "chat",
  "search",
  "recommend",
  "help",
  "report",
  'query',
  'finance',
  'specs',
  'drivefiles',
  "massItemCreator",
  "appbuilder"
];

export const SUGGETSION_PANEL_SECTIONS = [
  "search",
  "recommend",
  "help",
  "report",
  'query',
  'finance',
  'specs',
  'drivefiles',
  "massItemCreator",
  "appbuilder"
]

export const SECTIONS_WITHOUT_SUGGESTIONS = [
  'welcome',
  'chat_history'
];
export const SECTIONS_NEED_EXTRA_WIDTH = ["report", "help", 'specs', 'massItemCreator', 'appbuilder'];

export const SECTIONS_NEED_ETXRA_LARGE_WIDTH = ["finance"];

export const RESTRICTED_TO_BUTTONS = [
  {
    name: "no",
    displayText: "No",
  },
  {
    name: "yes",
    displayText: "Yes, Please",
  },
];

export const getParentItemId = (rec: any) => {
  if (rec?.itemType?.toLowerCase() === "forecasts") {
    return rec?.forecastRoomUniqueId;
  } else if (rec?.itemType?.toLowerCase() === "forecastbreakdown") {
    return rec?.forecastRoomUniqueId;
  }else if (rec?.itemType?.toLowerCase() === "estimates") {
    return rec?.estimateUniqueId;
  } else if (rec?.itemType?.toLowerCase() === "budgetbreakdown") {
    return rec?.budgetUniqueId;
  } else if (rec?.itemType?.toLowerCase() === "bidresponse") {
    return rec?.bidderUID;
  } else if (rec?.itemType?.toLowerCase() === "specs") {
    return rec?.specbookid || rec?.SpecBookId;
  } else if (rec?.itemType?.toLowerCase() === "submittals") {
    return rec?.specbookid || rec?.SpecBookId;
  } else {
    return "";
  }
};

export const getSubType = (rec: any) => {
  if (rec?.itemType?.toLowerCase() === "specs") {
    return "specs";
  } else if (rec?.itemType?.toLowerCase() === "submittals") {
    return "submittals"
  } else {
    return "";
  }
};

export const getFormattedQueryItems = (data: any)=> {
    let formattedItems: any = [];
    console.log('query data', data);
    (data || []).forEach((rec: any)=>{
      formattedItems.push({
        name: rec.Name,
        id: rec.Id,
        desc: rec.Description,
        stage: rec.StageName,
        stageColor: rec.StageColor,
        assignedTo: rec.AssignedContacts,
        modifiedBy: rec.ModifiedBy,
        modifiedDate: rec.ModifiedDate,
        isQuery: rec.AssignedContacts ? true : false,//To differentiate Query Items and smartItems
        appicon: rec.appicon,
        smartAppId: rec.SmartAppId,
        itemType: rec.itemType,
        infoType: rec.infoType,
        parentItemId: getParentItemId(rec),
        sectionId: rec?.SectionId, // Only for Submittals to do brena filtering
      })
  
    });
    return formattedItems;
}

/**
 * 
 * @param colorCode hex or rgb color
 * @returns whether the given color is light/dark
 * @author Srinivas Nadendla
 */
export const checkLightOrDark = (colorCode: any) => {
  let r, g, b, hsp;
  //block for rgb
  if (colorCode.match(/^rgb/)) {
    colorCode = colorCode.match(
      /^rgba?\((\d+),\s*(\d+),\s*(\d+)(?:,\s*(\d+(?:\.\d+)?))?\)$/
    );

    r = colorCode[1];
    g = colorCode[2];
    b = colorCode[3];
  } else {
    //Block for hex values
    colorCode = +(
      "0x" + colorCode.slice(1).replace(colorCode.length < 5 && /./g, "$&$&")
    );

    r = colorCode >> 16;
    g = (colorCode >> 8) & 255;
    b = colorCode & 255;
  }
  hsp = Math.sqrt(0.299 * (r * r) + 0.587 * (g * g) + 0.114 * (b * b));
  if (hsp > 127.5) {
    return "light";
  } else {
    return "dark";
  }
};

export const getFormattedFinanceData = (data: any = [], oldFinanceData: any = {}) => {
  let financeData: any = { ...oldFinanceData };
  (data || []).forEach((item: any, index: any) => {
    if (item.type === "budget" && item.data) {
      if (Array.isArray(item.data)) {
        //For data comes from chat-history
        financeData.html = item.data.join("");
        financeData.reqId = item.reqId;
        financeData.session = item.session;
        financeData.assumptions = {
          category:  item.category,
          approxProjectArea: item.projectarea,
          estBudget: item.projectbudget,
          brenaSuggestedBudget: item.brenabudget,
          estDuration: item.projectduration,
          brenaSuggestedDuration: item.brenaduration,
        };
        financeData.influencers = {
          pastperformance: item.pastperformance,
          industrymatrix: item.industrymatrix
        }
      } else {
        if (financeData.reqId && item.reqId && financeData.reqId === item.reqId) {
          financeData.html = (financeData[index]?.html || "") + item.data;
        } else {
          financeData.html = item.data;
          financeData.reqId = item.reqId;
          financeData.session = item.session;
          financeData.assumptions = {
            category:  item.category,
            approxProjectArea: item.projectarea,
            estBudget: item.projectbudget,
            brenaSuggestedBudget: item.brenabudget,
            estDuration: item.projectduration,
            brenaSuggestedDuration: item.brenaduration,
          };
          financeData.influencers = {
            pastperformance: item.pastperformance,
            industrymatrix: item.industrymatrix
          }
                                        
        }
      }
      financeData.isEstimate = item.isEstimate;
    }
  });
  return financeData;
};

export const SUB_TYPES_MAPPING_LIST:any = {
  'gantter': 'Schedule',
  'board_list': 'Current Board',
  'board_dispatch':'Current Board',
  'task_list': 'List View',
  'board_plan': 'Current Board',
  'calendar_list': 'Calendar View',
  'resource_list': 'Resource List',
  'board_split': 'Split Board',
  'schedule': 'Schedule',
  "estimates": 'Estimate Room',
  "risk": "Risks",
  "resource": "Resources",
  "calendar": "Calendars"
}

export const SUBTYPES_MAPPING_LIST_WITH_RESPONSE: any = {
  "board_dispatch" : "board_dispatch",
  "board_split": "dispatchview",
  "timelogsegments": "time",
  "board_plan": "board_plan",
  "dispatchview": "dispatchview",
  "schedule": "schedule",
  "safetyflyer": "Safety Onboarding Flyer",
  "sostracker": "sostracker",
  "safetybulletin": "safetybulletin",
  "daily": "daily"
} 


export const getFormattedBreadCrumbsData = (data: any = {}) => {
  if (Object.keys(data).length) {
    let formattedData: any = [];
    if (data.type || data?.display?.type) {
      let obj: any = {
        name: data?.display?.type || data.type?.toUpperCase(),//TODO: need to remove once danilo adds a key to boards/cpmSchedule
        type: data.ui_type || data.type,
        item_ids: data.item_ids || [],
        subTypeId: data.display?.sub_type_id,
        isFileSelected: data.display?.isFileSelected,
        isFolderSelected: data.display?.isFolderSelected
      };
      formattedData.push({...obj});
      let subTypeText = data.display?.hasOwnProperty("sub_type")
        ? data.display.sub_type
        : data.sub_type;
      if (subTypeText && subTypeText !== 'other') {
        if (SUB_TYPES_MAPPING_LIST[subTypeText]) {
          subTypeText = SUB_TYPES_MAPPING_LIST[subTypeText];
        }
        formattedData.push({
          name: subTypeText,
          type: data.sub_type || data.ui_sub_type,
        });
        
      }
      if (data.item_ids && data.item_ids.length > 0) {
        if (data?.display?.sub_type_id) {
          if (!data.item_ids.includes(data.display.sub_type_id)) {
            formattedData.push({name: "Selected Items"});
          }
        } else {
          formattedData.push({name: "Selected Items"});
        }
      }
    }
    return formattedData;
  } else {
    return [];
  }
};

export const getDeviceName = () => {
  const isMobile = window.innerWidth < 768;
  const isTablet = window.innerWidth >= 768 && window.innerWidth <= 1024;

  if (isMobile) {
    return "brena-mobile";
  } else if (isTablet) {
    return "brena-tablet";
  } else {
    return "brena-desktop";
  }
};
export const fileTypesToSupportQuickViewer = [
  "Photo",
  "Drawing",
  "Drawings",
  "SpecBooks",
  "Certificate",
  "Safety Policy",
  "File",
  "Certification",
  "TextBasedPolicy",
  "LiveLinkScreenshot",
  "360",
  "Daily Photos"
];
export const fileTypesToSupportVideoPlayer = [
  "Video",
  "LiveNote",
  "LiveLink Videos",
  "360 Video"
];
export const fileTypesToSupportSkecthViewer = ["Schedule", "BIM", "Sketch", "3D Site Reconstruction"];


export const getFormattedDriveFilesData = (driveItemsData: any = []) => {
  let formattedData: any = [];
  driveItemsData.forEach((rec: any) => {
    const fileName: any = rec.Name ? rec.Name : rec.FileName;
    const splitNameArr: any = fileName?.split(".");
    let fileType: any = splitNameArr[splitNameArr?.length - 1];
    fileType = fileType === 'fjpg' ? 'jpg': fileType;
    formattedData.push({
      uniqueId: rec.Id,
      id: rec.Id,
      name: fileName,
      fileType: fileType,
      type: rec.Type || fileType,
      modifiedOn: rec.ModifiedDate || rec.DateIssued,
      videoType: rec.Type === "Video" ? "video" : undefined,
    });
  });
  return formattedData;
};
export const  getFormattedVideoRec = (rec: any) => {
  const fileName: any = rec.Name ? rec.Name : rec.FileName;
  const splitNameArr: any = fileName?.split(".");
  return {
    uniqueId: rec.Id,
    id: rec.Id,
    name: fileName,
    fileType: splitNameArr[splitNameArr?.length - 1],
    type: rec.Type || splitNameArr[splitNameArr?.length - 1],
    modifiedOn: rec.ModifiedDate || rec.DateIssued,
    videoType: fileTypesToSupportVideoPlayer.includes(rec.Type)
      ? rec.Type?.toLowerCase()
      : undefined,
  };
};

export const reactAppTypeModules:any = {
  tasks: "",
  budgetbreakdown: "Budgets",
  bidmanager: "Bids",
  drivefolders: "",
  clientcontracts: "Client Contracts",
  vendorcontracts: "Vendor Contracts",
  changeevents: "Change Events",
  clientpayapplications: "Client Pay App",
  vendorpayapplications: "Vendor Pay App",
  timelogsegments: "",
  drivefiles: "",
  projectteam: "ProjectTeam",
  Drive_SafetyPolicies: "",
  estimates: "Estimates",
  forecasts: "Forecasts",
  forecastbreakdown:"Forecasts",
  DriveFolders: "",
  SafetyPermits: "",
  BudgetTransactions: "",
  safetyAlertLog: "",
  specs:"smartSubmittals",
  submittals:"smartSubmittals"
};

export const getBaseUrl: any = () => {
  let baseUrl;
  if (
    typeof CommonUtility !== "undefined" &&
    CommonUtility.BrenaAIHelper &&
    CommonUtility.BrenaAIHelper.getProjectUrl
  ) {
    baseUrl = CommonUtility.BrenaAIHelper.getProjectUrl();
    return baseUrl;
  } else {
    if (window?.location?.host) {
      baseUrl = window.location.protocol + "//" + window.location.host;
    } else {
      try {
        baseUrl = getIQMobileApp()?.GetServerRootUrl();
      } catch (err) {}
    }
    return baseUrl;
  }
};

export const isTabletApp: any = () => {
  let isTablet = true;
  if (typeof getIQMobileApp !== "undefined") {
    isTablet = IQMobile?.Utilities?.isTablet();
  } else {
    isTablet = false;
  }
  return isTablet;
};

export const handleDriveFileClick: any = (
  device: any,
  currentDocRec: any,
  fileType: any,
  fileName: any
) => {
  if (fileTypesToSupportQuickViewer.includes(currentDocRec.Type)) {
    const files: any = getFormattedDriveFilesData([currentDocRec]);
    if (device === "brena-desktop") {
      CommonUtility.openQuickViewFile(files, {
        startIndex: 0,
        totalCount: files.length,
        launchPoint: "brena",
      });
    } else {
      window.postMessage(
        {
          event: "brena-openfiles",
          data: {
            allFiles: files,
            open: "QUICKVIEW",
            startIndex: 0,
            totalCount: files.length,
            launchPoint: "brena",
          },
        },
        "*"
      );
    }
  } else if (fileTypesToSupportVideoPlayer.includes(currentDocRec.Type)) {
    if (device === "brena-desktop") {
      CommonUtility.openVideoPlayer(getFormattedVideoRec(currentDocRec));
    } else {
      window.postMessage(
        {
          event: "brena-openfiles",
          data: {
            fileData: getFormattedVideoRec(currentDocRec),
            open: "VIDEO",
            launchPoint: "brena",
          },
        },
        "*"
      );
    }
  } else if (fileTypesToSupportSkecthViewer.includes(currentDocRec.Type)) {
    if (GBL) {
      if (device === "brena-desktop") {
        GBL.launchViewerEditor([
          {
            contentId: currentDocRec.Id,
            hostType: "xss",
          },
        ]);
      } else {
        window.postMessage(
          {
            event: "brena-openfiles",
            data: {
              allFiles: [
                {
                  contentId: currentDocRec.Id,
                  hostType: "xss",
                },
              ],
              open: "VIEWER",
              launchPoint: "brena",
            },
          },
          "*"
        );
      }
    }
  } else if (fileType === "pln") {
    //TODO: yet to get the file type in chatsection data
    if (device === "brena-desktop") {
      GBL.launchGantter(currentDocRec.editorUrl, fileName);
    } else {
      window.postMessage(
        {
          event: "brena-openfiles",
          data: {
            editorUrl: currentDocRec.editorUrl,
            fileName: fileName,
            open: "GANTTER",
            launchPoint: "brena",
          },
        },
        "*"
      );
    }
  } else if (fileType === "seq") {
    //TODO: yet to get the file type in chatsection data
    GBL.openSequenceEditor(currentDocRec.Id);
  } else if (fileType === "sim") {
    //TODO: yet to get the file type in chatsection data
    GBL.openSimulatorWindow({ id: currentDocRec.Id });
  }
};
export const AppStudioWorkflowIcons: any = {
  "Acknowledge": "/Admin/Static/img/icons/no-sprite/acknowledge-32.svg",
  "Adjudicate": "/Admin/Static/img/icons/no-sprite/adjudicate-32.svg",
  "Approval": "/Admin/Static/img/icons/no-sprite/tick-32.svg",
  "MonitorSubItems": "/Admin/Static/img/icons/no-sprite/monitor-item-32.svg",
  "Multioutcome": "/Admin/Static/img/icons/no-sprite/multi-outcome-32.svg",
  "Notification": "/Admin/Static/img/icons/no-sprite/notifications-32.svg",
  "PromptForParticipants": "/Admin/Static/img/icons/no-sprite/user-32.svg",
  "Waiting": "/Admin/Static/img/icons/no-sprite/hourglass-32.svg",
  "Start": "/Admin/Static/img/workflow/start.svg",
  "CreateScheduleImpact": "/Admin/Static/img/icons/no-sprite/schedule-32.svg",
  "End": "/Admin/Static/img/icons/no-sprite/stop-32.svg",
  "Script": "/Admin/Static/img/icons/no-sprite/script-32.svg",
  "SetData": "/Admin/Static/img/icons/no-sprite/database-32.svg",
  "SetDocumentSecurity": "/Admin/Static/img/icons/no-sprite/document-security-32.svg",
  "SetDocumentStage": "/Admin/Static/img/icons/no-sprite/document-stage-32.svg",
  "SetPercentComplete": "/Admin/Static/img/icons/no-sprite/percentcomplete_32dp.svg",
  "Sync": "/Admin/Static/img/icons/no-sprite/updates-32.svg",
  "Synchronize": "/Admin/Static/img/icons/no-sprite/sync-activities-32.svg",
  "Expression": "/Admin/Static/img/icons/no-sprite/exoutcome.svg",
  "StopWorkflow": "/Admin/Static/img/icons/no-sprite/stopWorkflow.svg",
  "StartSubItemActivity": "/Admin/Static/img/icons/no-sprite/right-32.svg",
  "ExternalActivity": "/Admin/Static/img/icons/no-sprite/external_Activity_32dp.svg",
  "ScheduleItem": "/Admin/Static/img/icons/no-sprite/schedule-item-activity-32dp.svg",
  "WorkActivity": "/Admin/Static/img/icons/no-sprite/work_activity_32dp.svg",
  "SpawnItem": "/Admin/Static/img/icons/no-sprite/spawnitemuser-activity.svg",
  "SpawnItemSystem": "/Admin/Static/img/icons/no-sprite/spawnitemuser-activity.svg",
  "WorkReviewActivity": "/Admin/Static/img/icons/no-sprite/workreviewactivity-32.svg",
  "InspectWork": "/Admin/Static/img/icons/no-sprite/InspectWork.svg",
  "PostBudget": "/Admin/Static/img/icons/no-sprite/post-budget.svg",
  "MonitorSubApp": "/Admin/Static/img/icons/no-sprite/MonitorSubApp.svg",
  "PostChangeEvent": "/Admin/Static/img/icons/no-sprite/post-change-event.svg",
  "PostVendorContract": "/Admin/Static/img/icons/no-sprite/post-vendor-contract.svg",
  "PostClientContract": "/Admin/Static/img/icons/no-sprite/post-client-contract.svg",
  "PostClientPay": "/Admin/Static/img/icons/no-sprite/post-client-pay.svg",
  "PostVendorPay": "/Admin/Static/img/icons/no-sprite/post-vendor-pay.svg",
  "FinanceEditor": "/Admin/Static/img/icons/no-sprite/post-change-event.svg"
};
