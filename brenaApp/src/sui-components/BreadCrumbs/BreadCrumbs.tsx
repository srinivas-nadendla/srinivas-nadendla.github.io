import React, { useEffect, useRef, useState } from "react";
import "./BreadCrumbs.scss";
import Breadcrumbs from "@mui/material/Breadcrumbs";
import NavigateNextIcon from "@mui/icons-material/NavigateNext";
import { useAppSelector, useAppDispatch } from "../../store/hooks";
import plannerIcon from "../../img/planner.png";
import fieldIcon from "../../img/field.png";
import financeIcon from "../../img/finance.png";
import safetyIcon from "../../img/safety.png";
import appsIcon from "../../img/smartapp.svg";
import analyticsIcon from "../../img/analytics.svg";
import driveIcon from "../../img/drive.svg";
import mapIcon from "../../img/map.svg";
import projectIcon from "../../img/project.png";
import {
  setActiveChatWidget,
  setChatMessagesData,
} from "../../store/brenaSlice";

const BreadCrumbs = React.memo(() => {
  const dispatch = useAppDispatch();
  const breadCrumbsData = useAppSelector(
    (state: any) => state.brena.breadCrumbsData || []
  );
  const chatMessagesData = useAppSelector(
    (state: any) => state.brena.chatMessagesData
  );
  const activeChatWidget = useAppSelector((state: any)=> state.brena.activeChatWidget);
  const launchPoint = useAppSelector((state: any)=> state.brena.launchPoint);
  const [isProjectMenuOpened, setIsProjectMenuOpened] = useState<any>(false);
  const menuRef: any = useRef<any>(false);
  const breadCrumbRef: any = useRef<any>();

  const isAreaLimited = (areaName: any = "", subArea: any = 'None') => {
    const suggestionData: any = sessionStorage.getItem("brenaSuggestionsData");
    let area: any = areaName?.toLowerCase();
    let subarea: any = subArea?.toLowerCase();
    let parsedData: any;
    try {
      parsedData =
        typeof suggestionData === "string"
          ? JSON.parse(suggestionData)?.data
          : [];
      const indx: any = parsedData.findIndex(
        (rec: any) => rec.area?.toLowerCase() === area && rec.subarea?.toLowerCase() === subarea
      );
      if (indx > -1) {
        return parsedData[indx]?.limited;
      } else return false;
    } catch (e) {
      console.log("Failed to parse suggetsion data:", e);
      return false;
    }
  };

  useEffect(() => {
    const handleMessage = (event: any) => {
      let data;
      try {
        data =
          typeof event.data === "string" ? JSON.parse(event.data) : event.data;
      } catch (e) {
        console.log("Failed to parse event data:", e);
        return; // Exit the function if parsing fails
      }

      data = data.hasOwnProperty("args") && data.args[0] ? data.args[0] : data;

      if (data) {
        switch (data.event || data.evt) {
          case "projectmenushow":
            setIsProjectMenuOpened(true);
            break;
          case "projectmenuhide":
            setIsProjectMenuOpened(false);
            break;
        }
      }
    };

    window.addEventListener("message", handleMessage);

    return () => {
      window.removeEventListener("message", handleMessage);
    };
  }, []);

  useEffect(() => {
    if (isProjectMenuOpened) {
      menuRef.current = true;
      addLimitedTextToChat();
    } else if (!isProjectMenuOpened && menuRef.current) {
      menuRef.current = false;
      removeLimitedTextFromChat();
    }
  }, [isProjectMenuOpened]);

  const addLimitedTextToChat = () => {
    dispatch(setActiveChatWidget("chat"));
    let chatItems = [...chatMessagesData];
    let indx: any = chatItems.findIndex((rec: any)=> rec.isLimited);
    if (indx === -1) {
      chatItems.push({
        msg: "My current functionality in this area is limited, come back soon and I may be able to better assist you.",
        reqId: "",
        type: "",
        isReply: true,
        copy: false,
        isLimited: true,
      });
      dispatch(setChatMessagesData(chatItems));
    }
    
  };

  const removeLimitedTextFromChat = () => {
    let chatItems = [...chatMessagesData];
    const limitedIndx: any = chatItems.findIndex((rec: any) => rec.isLimited);
    if (limitedIndx > -1 && !isAreaLimited(breadCrumbsData[0]?.type, breadCrumbsData[1]?.type)) {
      chatItems.splice(limitedIndx, 1);
      dispatch(setChatMessagesData(chatItems));
      if (chatItems.length === 0 && activeChatWidget === 'chat') {
        dispatch(setActiveChatWidget("welcome"));
        if (saWebComp?.brenaApi?.onUIEvent) {
          saWebComp?.brenaApi?.onUIEvent('new_chat');
        }
        
      }
    }
  };

  useEffect(() => {
    if (breadCrumbsData?.length > 0) {
      if (
        isAreaLimited(breadCrumbsData[0]?.type, breadCrumbsData[1]?.type)
      ) {
        addLimitedTextToChat();
      } else {
        removeLimitedTextFromChat();
      }
      if (launchPoint === 'gantter_public') {
        const separators: any = breadCrumbRef.current.querySelectorAll('.MuiBreadcrumbs-separator')
        if (separators.length > 0) {
          separators[0].style.display = 'none';
        }
      }
    }
  }, [breadCrumbsData, isProjectMenuOpened]);

  const getTabIcon = (tabType: string) => {
    switch (tabType) {
      case "planner":
        return plannerIcon;
      case "finance":
        return financeIcon;
      case "field":
        return fieldIcon;
      case "safety":
        return safetyIcon;
      case "smartapps":
      case "apps":
        return appsIcon;
      case "analytics":
        return analyticsIcon;
      case "drive":
        return driveIcon;
      case "map":
        return mapIcon;
      case "Project":
      case "project":
        return projectIcon;
      default:
        return fieldIcon;
    }
  };
  return (
    <div className="brena-bread-crumbs-wrapper">
      <div ref={breadCrumbRef} className={"brena-bread-crumbs " + (launchPoint === 'gantter_public' ? ' brena-gantter-launchpoint ' : '')}>
        <Breadcrumbs
          separator={<NavigateNextIcon fontSize="small" />}
          aria-label="breadcrumb"
          maxItems={3}
        >
          {breadCrumbsData.map((rec: any, index: any) => {
            if (index === 0) {
              return (
                <p
                  key={index + rec.name}
                  className={"brena-bread-crumbs_initial first-crumb"}
                >
                  {index === 0 && (
                    <img
                      alt={rec.name}
                      className={"brena-bread-crumbs_icon "}
                      src={getTabIcon(rec.type)}
                    />
                  )}{" "}
                  {launchPoint !== 'gantter_public' && rec.name}
                </p>
              );
            } else {
              return (
                <p
                  key={index + 1}
                  className={
                    breadCrumbsData.length - 1 === index
                      ? "brena-bread-crumbs_last-child"
                      : "brena-bread-crumbs_initial middle-crumb"
                  }
                >
                  {rec.name}
                </p>
              );
            }
          })}
        </Breadcrumbs>
      </div>
    </div>
  );
});

export default BreadCrumbs;
