import React, { useEffect, useState } from "react";
import "./SuggestionFooter.scss";
import { Button } from "@mui/material";
import suggestionlike from "../../../img/like.svg";
import suggestiondislike from "../../../img/dislike.svg";
import SUISnackbar from "../../Snackbar/Snackbar";
import { useAppSelector, useAppDispatch } from "../../../store/hooks";
import {
  updateIsPreviewBtnClicked,
  updateOpenSaveReportModal,
  updateTagsList,
  updateSelectedTags,
  updateShowSnackbar,
  updateTagsLastClickedBtn,
  updateCloseSuggestionsPanel,
  updateFiltersApplied,
  updateDeepSearchItems,
  updateDeepSearchSelectedItems,
} from "../../../store/brenaSlice";
import { useDetectDevice } from "../../../hooks/useDetectDevice";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import { isTabletApp } from "../../../utils/CommonUtil";
import { getBaseUrl } from "../../../utils/CommonUtil";

const SUISuggestionFooter = React.memo(() => {
  const [snackOpen, setSnackOpen] = React.useState(false);
  const [snackMsg, setSnackMsg] = React.useState("");
  const isPreviewBtnClicked = useAppSelector(
    (state: any) => state.brena.isPreviewBtnClicked
  );
  const tagsList: any = useAppSelector((state: any) => state.brena.tagsList);
  const actualTagsList: any = useAppSelector(
    (state: any) => state.brena.actualTagsList
  );
  const [isBoardActive, setIsBoardActive] = useState<any>(false);
  const [isPlannerTabActive, setIsPlannerTabActive] = useState<any>(false);

  const financeData: any = useAppSelector(
    (state: any) => state.brena.financeData
  );
  const toggleChatSectionAnimation = useAppSelector(
    (state: any) => state.brena.toggleChatSectionAnimation
  );
  const taskItems: any = useAppSelector(
    (state: any) => state.brena.taskItemsData
  );
  const isOutsideArea: any = useAppSelector(
    (state: any) => state.brena.isOutsideArea
  );
  const actualQueryData: any = useAppSelector(
    (state: any) => state.brena.actualQueryData
  );
  const reportData: any = useAppSelector(
    (state: any) => state.brena.reportData
  );
  const showSnackbar = useAppSelector((state: any) => state.brena.showSnackbar);
  const breadCrumbsData = useAppSelector(
    (state: any) => state.brena.breadCrumbsData || []
  );
  const driveItemsData: any = useAppSelector(
    (state: any) => state.brena.driveItemsData
  );
  const deepSearchItems: any = useAppSelector(
    (state: any) => state.brena.deepSearchItems
  );
  const deepSearchSelectedItems: any = useAppSelector(
    (state: any) => state.brena.deepSearchSelectedItems
  );
  const selectedTags: any = useAppSelector(
    (state: any) => state.brena.selectedTags
  );
  const appStudioData = useAppSelector((state: any) => state.brena.appStudioData);

  const device = useDetectDevice();

  const dispatch = useAppDispatch();

  useEffect(() => {
    if (breadCrumbsData?.length > 1) {
      setIsBoardActive(
        breadCrumbsData[0].name?.toLowerCase() === "planner" &&
          breadCrumbsData[1].name === "Current Board"
      );
    } else {
      setIsBoardActive(false);
    }
    if (breadCrumbsData?.length > 0) {
      setIsPlannerTabActive(
        breadCrumbsData[0].name?.toLowerCase() === "planner"
      );
    } else {
      setIsPlannerTabActive(false);
    }
  }, [breadCrumbsData]);

  const onSuggestionLikeNdDislike = () => {
    setSnackOpen(true);
    setSnackMsg("Thank you for the Recommendation");
  };

  const onCreateAppBtnClick = () => {
    if (saWebComp?.brenaApi?.onUIEvent) {
      saWebComp?.brenaApi?.onUIEvent("create_app_click", {
        appId: appStudioData?.data?.appId || "",
      });
    }
  };

  const onPreviewBtnClick = () => {
    dispatch(updateIsPreviewBtnClicked(true));
    if (saWebComp?.brenaApi) {
      saWebComp?.brenaApi?.onUIEvent("preview_click", { tagsList: tagsList });
    }
  };

  const onAddAllBtnClick = () => {
    dispatch(updateIsPreviewBtnClicked(false));

    if (saWebComp?.brenaApi) {
      saWebComp?.brenaApi?.onUIEvent("addall_click", { tagsList: tagsList });
      dispatch(
        updateShowSnackbar({
          open: true,
          msg: "All the Tags are added to the Planboard",
        })
      );
      setTimeout(() => {
        dispatch(updateShowSnackbar({ open: false, msg: "" }));
      }, 3000);
      dispatch(updateTagsList([]));
      dispatch(updateSelectedTags([]));
    }
  };

  const onAddToShelfBtnClick = () => {
    if (saWebComp?.brenaApi) {
      saWebComp?.brenaApi?.onUIEvent("add_shelf", { tagsList: tagsList });
      dispatch(
        updateShowSnackbar({
          open: true,
          msg: `${tagsList.length} Tags are added to the Shelf`,
        })
      );
      setTimeout(() => {
        dispatch(updateShowSnackbar({ open: false, msg: "" }));
      }, 3000);
    }
  };

  const onClearAllBtnClick = () => {
    dispatch(updateIsPreviewBtnClicked(false));
    if (saWebComp?.brenaApi) {
      saWebComp?.brenaApi?.onUIEvent("clearall_click", { tagsList: tagsList });
    }
  };

  const onAddToBudgetBtnClick = (eventName: any, orderNum: any) => {
    if (saWebComp?.brenaApi) {
      saWebComp?.brenaApi?.onUIEvent(eventName, {
        reqId: financeData?.reqId || "",
        session: financeData?.session || "",
        btnOrderNumber: orderNum,
      });
    }
  };

  const onApplyFilterBtnClick = () => {
    dispatch(updateFiltersApplied(true));
    const moduleTypes = ["finance", "safety", "smartapp"];
    if (saWebComp?.brenaApi) {
      saWebComp?.brenaApi?.onUIEvent(
        "outside_area-apply-filter_click",
        actualQueryData
      );
    }
    if (taskItems.length && moduleTypes.includes(taskItems[0]?.infoType)) {
      let filterData;
      if (taskItems[0]?.itemType === "submittals") {
        filterData = taskItems.map((task: any) => {
          return { id: task?.sectionId?.toLowerCase() };
        });
      } else {
        filterData = taskItems.map((task: any) => {
          return { id: task.id?.toLowerCase() };
        });
      }
      let applyFilterData = {
        type: "applyFilter",
        filterData: filterData,
      };
      saWebComp?.brenaApi?.onUIEvent("brena_to_react", applyFilterData);
    }
  };
  const onClearFilterBtnClick = () => {
    const moduleTypes = ["finance", "safety", "smartapp"];
    if (saWebComp?.brenaApi) {
      saWebComp?.brenaApi?.onUIEvent("outside_area-clear-filter_click", "");
    }
    if (taskItems.length && moduleTypes.includes(taskItems[0]?.infoType)) {
      let clearFilterData = {
        type: "clearFilter",
        filterData: [],
      };
      saWebComp?.brenaApi?.onUIEvent("brena_to_react", clearFilterData);
    }
    dispatch(updateCloseSuggestionsPanel(Date.now()));
    dispatch(updateFiltersApplied(false));
  };

  const onSaveReportBtnClick = () => {
    dispatch(updateOpenSaveReportModal(true));
  };

  const removeSelectedTagsFromStoreAndUpdate = () => {
    let clonedTags: any = JSON.parse(JSON.stringify(tagsList));
    //Do not remove If it is a parent/group
    selectedTags.forEach((rec: any) => {
      if (!rec.isGroup) {
        const tagIndex = clonedTags.findIndex(
          (tag: any) => tag.tId === rec.tId
        );
        if (tagIndex > -1) {
          clonedTags.splice(tagIndex, 1);
        }
      }
    });

    dispatch(updateTagsList(clonedTags));
    dispatch(updateSelectedTags([]));
  };

  const onAddSelectedBtnClick = () => {
    if (saWebComp?.brenaApi) {
      saWebComp?.brenaApi?.onUIEvent("add_selected_click", {
        tagsList: selectedTags,
      });
      removeSelectedTagsFromStoreAndUpdate();
      let toastMsg: any = `Added ${selectedTags?.length} Tag${
        selectedTags?.length > 1 ? "s" : ""
      } to the board`;
      if (selectedTags?.length === tagsList?.length) {
        toastMsg = "All the Tags are added to the board";
      }
      dispatch(updateShowSnackbar({ open: true, msg: toastMsg }));
      dispatch(updateTagsLastClickedBtn("add-selected"));
      setTimeout(() => {
        dispatch(updateShowSnackbar({ open: false, msg: "" }));
      }, 3000);
    }
  };

  const onRemoveSelectedBtnClick = () => {
    removeSelectedTagsFromStoreAndUpdate();
    let toastMsg: any = `Removed ${selectedTags?.length} Tag${
      selectedTags?.length > 1 ? "s" : ""
    }`;
    if (tagsList?.length === selectedTags?.length) {
      toastMsg = "All the Tags have been Removed";
    }
    dispatch(updateShowSnackbar({ open: true, msg: toastMsg }));
    dispatch(updateTagsLastClickedBtn("remove-selected"));
    setTimeout(() => {
      dispatch(updateShowSnackbar({ open: false, msg: "" }));
    }, 3000);
  };

  const onDriveClearFilterBtnClick = () => {
    dispatch(updateCloseSuggestionsPanel(Date.now()));
  };

  const onDeepSearchRemoveSelected = () => {
    let clonedItems = [...deepSearchItems];
    const filteredItems: any = [];
    clonedItems.forEach((rec: any) => {
      if (!deepSearchSelectedItems.includes(rec.recordId)) {
        filteredItems.push(rec);
      }
    });
    let toastMsg: any = `Removed ${deepSearchSelectedItems?.length} Smart Item${
      deepSearchSelectedItems?.length > 1 ? "s" : ""
    }`;
    dispatch(updateShowSnackbar({ open: true, msg: toastMsg }));
    dispatch(updateDeepSearchItems(filteredItems));
    dispatch(updateDeepSearchSelectedItems([]));
    setTimeout(() => {
      dispatch(updateShowSnackbar({ open: false, msg: "" }));
    }, 3000);
  };

  const onDeepSearchCreateAll = () => {
    hitCreateBulkSmartItemsApi(deepSearchItems, true);
  };

  const onDeepSearchCreatedSelected = () => {
    let clonedItems = [...deepSearchItems];
    let filteredItems: any = [];
    clonedItems.forEach((rec: any) => {
      if (deepSearchSelectedItems.includes(rec.recordId)) {
        filteredItems.push(rec);
      }
    });
    hitCreateBulkSmartItemsApi(filteredItems, false);
  };

  const hitCreateBulkSmartItemsApi = (data: any = [], isAll: any) => {
    let projectId: any;
    if (device === "brena-mobile" || isTabletApp()) {
      projectId = getIQMobileApp()?.GetCurrentProject()?.projectUId;
    } else {
      if (GBL && GBL.config) {
        projectId = GBL.config.currentProjectInfo?.projectUniqueId;
      }
    }
    let metaDataArr = JSON.parse(JSON.stringify([...data]));
    let payloadArr: any = [];
    metaDataArr.forEach((rec: any) => {
      let links = [...(rec.links || [])];
      let metaDataObj = JSON.parse(JSON.stringify(rec));
      if (metaDataObj.links) delete metaDataObj.links;
      if(metaDataObj.thumbnail) delete metaDataObj.thumbnail;
      payloadArr.push({
        appId: rec.appId,
        projectId: projectId,
        status: 0,
        metaData: metaDataObj,
        links: links,
      });
    });

    let baseUrl = getBaseUrl();
    const endpoint =
      baseUrl + "/EnterpriseDesktop/brenaai/brena/CreateUpdateItem";

    fetch(endpoint, {
      method: "POST",
      headers: {
        "content-type": "application/x-www-form-urlencoded;charset=UTF-8",
      },
      body: JSON.stringify(payloadArr),
    })
      .then((res: any) => res.json())
      .then((res: any) => {
        if (res.success) {
          dispatch(
            updateShowSnackbar({
              open: true,
              msg: `${data.length} Items Created Successfully`
            })
          );
        } else {
          dispatch(
            updateShowSnackbar({
              open: true,
              msg: "Failed to create the Smart Items!",
            })
          );
        }
        
        setTimeout(() => {
          dispatch(updateShowSnackbar({ open: false, msg: "" }));
        }, 3000);
        if (isAll) {
          dispatch(updateDeepSearchItems([]));
        } else {
          let clonedItems = [...deepSearchItems];
          const filteredItems: any = [];
          clonedItems.forEach((rec: any) => {
            if (!deepSearchSelectedItems.includes(rec.recordId)) {
              filteredItems.push(rec);
            }
          });
          dispatch(updateDeepSearchItems(filteredItems));
        }
        dispatch(updateDeepSearchSelectedItems([]));
      })
      .catch(() => {
        dispatch(
          updateShowSnackbar({
            open: true,
            msg: "Failed to create the Smart Items!",
          })
        );
        setTimeout(() => {
          dispatch(updateShowSnackbar({ open: false, msg: "" }));
        }, 3000);
      });
  };

  return (
    <div className={"suggestion-footer-cont " + device}>
      <div className="recommendation-cont">
        <div className="recommendation-cont_child">
          <img
            src={suggestionlike}
            onClick={onSuggestionLikeNdDislike}
            className="suggestion-like"
            alt="Like icon"
          />
          <img
            src={suggestiondislike}
            onClick={onSuggestionLikeNdDislike}
            className="suggestion-dislike"
            alt="disLike Icon"
          />
          Like this Recommendation?
        </div>
        {actualTagsList?.length > 0 && selectedTags?.length > 0 && (
          <div className="recommendation-cont_selected-block">
            {selectedTags.length} selected
          </div>
        )}
      </div>
      {actualTagsList?.length > 0 && (
        <div className="footer-cont">
          {selectedTags?.length === 0 ? (
            <>
              {!isPreviewBtnClicked && (
                <Button
                  variant="outlined"
                  className="preview-btn"
                  onClick={() => onPreviewBtnClick()}
                  disabled={
                    toggleChatSectionAnimation === "start" ||
                    tagsList?.length === 0 ||
                    !isPlannerTabActive
                  }
                >
                  PREVIEW
                </Button>
              )}
              {isPreviewBtnClicked && (
                <Button
                  variant="outlined"
                  className="preview-btn"
                  onClick={() => onClearAllBtnClick()}
                  disabled={
                    toggleChatSectionAnimation === "start" ||
                    !isPlannerTabActive
                  }
                >
                  CLEAR PREVIEW
                </Button>
              )}
              {isBoardActive && (
                <Button
                  variant="contained"
                  className="add-shelf-btn"
                  onClick={() => onAddToShelfBtnClick()}
                  disabled={
                    toggleChatSectionAnimation === "start" ||
                    tagsList?.length === 0
                  }
                >
                  ADD TO SHELF
                </Button>
              )}
              <Button
                variant="contained"
                className="adall-btn"
                onClick={() => onAddAllBtnClick()}
                disabled={
                  toggleChatSectionAnimation === "start" ||
                  tagsList?.length === 0 ||
                  !isPlannerTabActive
                }
              >
                ADD ALL
              </Button>
            </>
          ) : (
            <>
              <Button
                variant="outlined"
                className="outlined-grey-btn"
                onClick={() => onRemoveSelectedBtnClick()}
              >
                REMOVE SELECTED
              </Button>
              <Button
                variant="contained"
                className="add-selected-btn"
                onClick={() => onAddSelectedBtnClick()}
                disabled={!isPlannerTabActive}
              >
                ADD SELECTED
              </Button>
            </>
          )}
        </div>
      )}
      {financeData?.html?.length > 0 && !financeData?.isEstimate && (
        <div
          className={
            "footer-cont " +
            (device !== "brena-desktop" ? "flex-column-cls" : "")
          }
        >
          <Button
            variant="contained"
            className="add-to-budget-btn"
            onClick={() => onAddToBudgetBtnClick("addtobudget_click", 1)}
          >
            ADD TO BUDGET (CBS)
          </Button>
          <Button
            variant="contained"
            className="add-to-budget-btn"
            onClick={() => onAddToBudgetBtnClick("addtoplanner_click", 2)}
          >
            ADD TO PLANNER (WBS)
          </Button>
          <Button
            variant="contained"
            className="add-to-budget-btn"
            onClick={() => onAddToBudgetBtnClick("addtobudgetplanner_click", 3)}
          >
            ADD TO BOTH
          </Button>
        </div>
      )}
      {financeData?.html?.length > 0 && financeData?.isEstimate && (
        <div
          className={
            "footer-cont " +
            (device !== "brena-desktop" ? "flex-column-cls" : "")
          }
        >
          <Button
            variant="contained"
            className="add-to-budget-btn"
            onClick={() => onAddToBudgetBtnClick("addtobudget_click", 1)}
          >
            ADD TO ESTIMATE
          </Button>
        </div>
      )}
      {taskItems?.length > 0 && !isOutsideArea && (
        <div className="footer-cont">
          <Button
            variant="outlined"
            className="preview-btn"
            onClick={() => onClearFilterBtnClick()}
          >
            CLEAR
          </Button>
          <Button variant="contained" onClick={() => onApplyFilterBtnClick()}>
            APPLY FILTER
          </Button>
        </div>
      )}
      {driveItemsData?.length > 0 && !isOutsideArea && (
        <div className="footer-cont">
          <Button
            variant="outlined"
            className="preview-btn"
            onClick={() => onDriveClearFilterBtnClick()}
          >
            CLEAR
          </Button>
          <Button variant="contained">APPLY FILTER</Button>
        </div>
      )}
      {reportData?.length > 0 && (
        <div className="footer-cont">
          <Button
            variant="contained"
            className="savereport-btn"
            onClick={() => onSaveReportBtnClick()}
          >
            SAVE CHART
          </Button>
        </div>
      )}
      {deepSearchItems?.length > 0 && (
        <div className="footer-cont">
          <Button
            variant="outlined"
            className="outlined-grey-btn"
            disabled={deepSearchSelectedItems?.length === 0}
            onClick={() => onDeepSearchRemoveSelected()}
          >
            REMOVE SELECTED
          </Button>
          {deepSearchSelectedItems?.length === 0 ? (
            <Button
              variant="contained"
              className="deep-search-create-btn"
              onClick={() => onDeepSearchCreateAll()}
            >
              CREATE ALL
            </Button>
          ) : (
            <Button
              variant="contained"
              className="deep-search-create-btn"
              onClick={() => onDeepSearchCreatedSelected()}
            >
              CREATE SELECTED
            </Button>
          )}
        </div>
      )}
      {appStudioData?.data?.AppDefinition?.length > 0 && (

        <div className="footer-cont">
          <Button
            variant="contained"
            className="deep-search-create-btn"
            onClick={() => onCreateAppBtnClick()}
          >
            CREATE APP
          </Button>
          </div>
      )}
      <SUISnackbar
        open={snackOpen}
        message={snackMsg}
        onclose={() => {
          setSnackOpen(false);
        }}
      />
      <div>
        <SUISnackbar
          open={showSnackbar.open}
          message={showSnackbar.msg}
          icon={
            <CheckCircleIcon color="success" fontSize="small"></CheckCircleIcon>
          }
        ></SUISnackbar>
      </div>
    </div>
  );
});
export default SUISuggestionFooter;
