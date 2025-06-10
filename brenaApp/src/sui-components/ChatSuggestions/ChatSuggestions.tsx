import React, { useState, useRef, useMemo } from "react";
import "./ChatSuggestions.scss";
import SUIInitialSuggestion from "./InitialSuggestion/InitialSuggestion";
import TagsSection from "../TagsSection/TagsSection";
import HelpSection from "../HelpSection/HelpSection";
import ReportSection from "../ReportSection/ReportSection";
import suggestionheader from "../../img/brena-suggestion-logo.png";
import resizerimg from "../../img/resize.jpg";
import SUISuggestionFooter from "./SuggestionFooter/SuggestionFooter";
import { useAppSelector, useAppDispatch } from "../../store/hooks";
import { ErrorBoundary } from "react-error-boundary";
import TaskItemsSection from "../TaskItemsSection/TaskItemsSection";
import FinanceSection from "../FinanceSection/FinanceSection";
import { useDetectDevice } from "../../hooks/useDetectDevice";
import { setActiveChatWidget } from "../../store/brenaSlice";
import DriveItems from "../DriveItems/DriveItems";
import IQBrenaDocViewer from "../IQBrenaDocViewer/IQBrenaDocViewer";
import chartErrorImg from '../../img/chart-error.png';
import DeepSearchItemsSection from "../DeepSearchItemsSection/DeepSearchItemsSection";
import AppStudioLayoutSection from "../AppStudioSection/AppStudioLayoutSection";

const SUIChatSuggestions = React.memo((props: any) => {
  const [noDataAvailabe, setNoDataAvialbe] = useState<any>(true);
  const actualTagsList: any = useAppSelector((state: any) => state.brena.actualTagsList);
  const helpData: any = useAppSelector((state: any) => state.brena.helpData);
  const reportData: any = useAppSelector(
    (state: any) => state.brena.reportData
  );
  const taskItemsData: any = useAppSelector(
    (state: any) => state.brena.taskItemsData
  );
  const financeData: any = useAppSelector(
    (state: any) => state.brena.financeData
  );
  const budgetSuggestionsData: any = useAppSelector(
    (state: any) => state.brena.budgetSuggestionData
  );
  const driveItemsData: any = useAppSelector((state: any)=> state.brena.driveItemsData);
  const specPagesData: any = useAppSelector((state: any)=> state.brena.specPagesData);
  const deepSearchItems: any = useAppSelector(
      (state: any) => state.brena.deepSearchItems
    );
  const appStudioData = useAppSelector((state: any) => state.brena.appStudioData);
  
    const resizerRef = useRef<any>("");
  const original_width = useRef<any>();
  const original_x = useRef<any>();
  const original_mouse_x = useRef<any>();
  const [isSUggestionPanelResized, setIsSuggestionPanelResized] =
    useState(false);
  const sizeRef = useRef("small");
  const device = useDetectDevice();
  const dispatch = useAppDispatch();

  useMemo(() => {
    const hasData =
      actualTagsList?.length > 0 ||
      helpData?.html?.length > 0 ||
      reportData?.length > 0 ||
      taskItemsData?.length > 0 ||
      financeData?.html?.length > 0 ||
      budgetSuggestionsData?.category ||
      driveItemsData?.length > 0 ||
      specPagesData?.length > 0 ||
      deepSearchItems?.length > 0 || 
      appStudioData?.data?.AppDefinition?.length > 0;
      
    setNoDataAvialbe(!hasData);
  }, [actualTagsList, helpData, reportData, taskItemsData, financeData, driveItemsData, specPagesData, deepSearchItems, appStudioData]);

  useMemo(() => {
    if(sizeRef) sizeRef.current = props.panelSize;
  }, [props.panelSize]);

  /**
   * Clearing out the width/maxWidth for div's which are set in mousemove. 
   * Triggers when there is change in suggetionPanel's hide/show status.
   * 
   */
  useMemo(() => {
    if (props.className === "d-none") {
      setIsSuggestionPanelResized(false);
      let element: any = document.querySelector(".chat-widget-suggestion-cont");
      const widgetEle: any = document.querySelector(
        ".common-widget-dlg .MuiDialog-container .MuiPaper-root"
      );
      if (element?.style) element.style.width = null;
      if(widgetEle?.style) widgetEle.style.maxWidth = null;
    }
  }, [props.className]);

  /**
   * On mouse move calculate the latest width of panel based on x & width
   * @param e 
   * @author Srinivas Nadendla
   */
  const onMouseMoveResize = (e: any) => {
    e.preventDefault();
    let width: any;
    if (document.getElementsByClassName('common-widget-dlg')?.[0]?.classList?.contains('brena-widget-pos-left')) {
      width = original_width.current + (e.pageX - original_mouse_x.current);
    } else {
      width = original_width.current - (e.pageX - original_mouse_x.current);
    }
    
    let element: any = document.querySelector(".chat-widget-suggestion-cont");
    const widgetEle: any = document.querySelector(
      ".common-widget-dlg .MuiDialog-container .MuiPaper-root"
    );
    const currentSectionMinWidth = sizeRef.current === "small"  ? 435 : 820;
    if (width >= currentSectionMinWidth) {
      element.style.width = width + "px";
      widgetEle.style.maxWidth = width + currentSectionMinWidth + "px";
    }
    setIsSuggestionPanelResized(true);
  };

  const onMouseUpStopResize = (e: any) => {
    e.preventDefault();
    window.removeEventListener("mousemove", onMouseMoveResize);
  };

  
  /**
   * On panel initial load adding an event to resizer element and saving the actual x & left values.
   * and adding events ofr mosue move and mouse up - to be used to add/remove dynamic width's
   * @author Srinivas Nadendla
   */
  const onMouseDownResizer = (e: any)=> {
        e.preventDefault();
        let element: any = document.querySelector(
          ".chat-widget-suggestion-cont"
        );
        original_width.current = parseFloat(
          getComputedStyle(element, null)
            .getPropertyValue("width")
            .replace("px", "")
        );
        //TODO:
        if (document.getElementsByClassName('common-widget-dlg')?.[0]?.classList?.contains('brena-widget-pos-left')) {
          original_x.current = element.getBoundingClientRect().right;
        } else {
          original_x.current = element.getBoundingClientRect().left;
        }
        
        original_mouse_x.current = e.pageX;
        window.addEventListener("mousemove", onMouseMoveResize);
        window.addEventListener("mouseup", onMouseUpStopResize);
  }

  const onLeftArrowClick = ()=> {
    dispatch(setActiveChatWidget('chat'));
  }

  return (
    <div
      className={
        "chat-widget-suggestion-cont " + props.className + " " + device
      }
    >
      {device === "brena-desktop" && (
        <div
          className="chat-widget-suggestion-cont_resizer"
          ref={resizerRef}
          onMouseDown={onMouseDownResizer}
        >
          <img src={resizerimg} className="resizer-img-cls" alt="Resize Icon" />
        </div>
      )}
      {(!noDataAvailabe || device === "brena-mobile") && (
        <div className="chat-suggestion-header-img_wrapper">
          {device === "brena-mobile" && (
            <div
              className="chat-suggestion-header_left-arrow"
              onClick={onLeftArrowClick}
            >
              <img
                alt="header-back-btn"
                className="header-back-btn"
                src="data:image/svg+xml;base64,PCEtLSBHZW5lcmF0ZWQgYnkgSWNvTW9vbi5pbyAtLT4KPHN2ZyB2ZXJzaW9uPSIxLjEiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyIgd2lkdGg9IjEwMjQiIGhlaWdodD0iMTAyNCIgdmlld0JveD0iMCAwIDEwMjQgMTAyNCI+Cjx0aXRsZT48L3RpdGxlPgo8ZyBpZD0iaWNvbW9vbi1pZ25vcmUiPgo8L2c+CjxwYXRoIGQ9Ik02NjEuMjA1IDc5My4wNDVsLTYwLjU4NyA2MC4xNi0zNDQuMjk5LTM0MS4yMDUgMzQ0LjI5OS0zNDEuMjA1IDYwLjU4NyA2MC4xNi0yODMuNjA1IDI4MS4wNDV6Ij48L3BhdGg+Cjwvc3ZnPgo="
              />{" "}
            </div>
          )}
          <img
            draggable={false}
            src={suggestionheader}
            alt="header img"
            className="chat-suggestion-header-img"
          />
        </div>
      )}

      <div
        className={
          "chat-widget-suggestion-cont_body " +
          (isSUggestionPanelResized ? " is-resized " : "") +
          (financeData?.html?.length > 0 ? " no-scroll " : "")
        }
      >
        {noDataAvailabe && <SUIInitialSuggestion></SUIInitialSuggestion>}
        {!noDataAvailabe && (
          <ErrorBoundary fallback={<div>Something went wrong</div>}>
            {actualTagsList?.length > 0 && <TagsSection></TagsSection>}
            {helpData?.html?.length > 0 && <HelpSection></HelpSection>}
            {reportData?.length > 0 && (
              <ErrorBoundary
                fallback={
                  <div className="brena-report-fallback">
                    <div>
                    <img src={chartErrorImg} alt="Charts Error" />
                    <div className="brena-report-fallback-msg">Error Loading the Chart, Try again... </div>
                    </div>
                  </div>
                }
              >
                <ReportSection></ReportSection>
              </ErrorBoundary>
            )}
            {taskItemsData?.length > 0 && <TaskItemsSection></TaskItemsSection>}
            {(financeData?.html?.length > 0 ||
              budgetSuggestionsData?.category) && (
              <FinanceSection></FinanceSection>
            )}
            {specPagesData?.length > 0 && (
              <IQBrenaDocViewer
                showToolbar={false}
                docViewElementId={"canvasWrapper-brena-suggestions"}
                sketchData={specPagesData}
                stopFocus={true}
                //defaultPageToNavigate={selectedPageNumber || 1}
              />
            )}
            {driveItemsData?.length > 0 && <DriveItems></DriveItems>}
            {deepSearchItems?.length > 0 && <DeepSearchItemsSection></DeepSearchItemsSection>}
            {appStudioData?.data?.AppDefinition?.length > 0 && <AppStudioLayoutSection></AppStudioLayoutSection>}
          </ErrorBoundary>
        )}
      </div>

      {!noDataAvailabe && <SUISuggestionFooter></SUISuggestionFooter>}
    </div>
  );
});
export default SUIChatSuggestions;
