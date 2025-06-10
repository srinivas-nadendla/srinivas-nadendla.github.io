import React, { useRef, useEffect } from "react";
import "./DriveItems.scss";
import { useAppSelector, useAppDispatch } from "../../store/hooks";
import { useDetectDevice } from "../../hooks/useDetectDevice";
import { updateSelectedDriveItems } from "../../store/brenaSlice";
import { getFormattedVideoRec, getFormattedDriveFilesData, fileTypesToSupportQuickViewer, fileTypesToSupportVideoPlayer, fileTypesToSupportSkecthViewer, isTabletApp } from "../../utils/CommonUtil";

const DriveItems = React.memo(() => {
  const driveItemsData: any = useAppSelector(
    (state: any) => state.brena.driveItemsData
  );
  const selectedDriveItems: any = useAppSelector(
    (state: any) => state.brena.selectedDriveItems
  );
  const selectedItemsList = useRef<any>([]);
  const dispatch = useAppDispatch();
  const device = useDetectDevice();
  
  useEffect(() => {
      selectedItemsList.current = [...selectedDriveItems];
  }, [selectedDriveItems])


  let baseUrl: any;
  if (window?.location?.host) {
    baseUrl = window.location.protocol + "//" + window.location.host;
  } else {
    try {
      baseUrl = getIQMobileApp()?.GetServerRootUrl();
    } catch (err) {}
  }

  const getFilePath = (rec: any) => {
    return `${baseUrl}/EnterpriseDesktop/thumbnail/getThumbnailUrl?objectid=${
      rec.Id
    }&iconname=${rec.Type?.toLowerCase() === "bim" ? 5 : 1}`;
  };


  const onImgClick = (e: any, rec: any, index: any) => {
    e.stopPropagation();
    e.preventDefault();
    const fileName: any = rec.Name ? rec.Name : rec.FileName;
    const splitNameArr: any = fileName?.split(".");
    let fileType: any = splitNameArr[splitNameArr?.length - 1];
    
    if (fileTypesToSupportQuickViewer.includes(rec.Type)) {
      const files: any = getFormattedDriveFilesData(driveItemsData);
      if (device === 'brena-mobile' || isTabletApp()) {
        window.postMessage({
          event: "brena-openfiles",
          data: {
              allFiles: files,
              open: 'QUICKVIEW',
              startIndex: index,
              totalCount: files.length,
              launchPoint: "brena"
          }
      }, "*")
      } else {
        CommonUtility.openQuickViewFile(files, {
          startIndex: index,
          totalCount: files.length,
          launchPoint: "brena",
        });
      }
      
    } else if (fileTypesToSupportVideoPlayer.includes(rec.Type)) {
      if (device === 'brena-mobile' || isTabletApp()) {
        window.postMessage({
          event: "brena-openfiles",
          data: {
              fileData: getFormattedVideoRec(rec),
              open: 'VIDEO',
              launchPoint: "brena"
          }
      }, "*")
      } else {
        CommonUtility.openVideoPlayer(getFormattedVideoRec(rec));
      }
    } else if (fileTypesToSupportSkecthViewer.includes(rec.Type) && fileType !== 'pln') {
      if (GBL) {
        if (device === 'brena-mobile' || isTabletApp()) {
          window.postMessage({
            event: "brena-openfiles",
            data: {
                allFiles: [{
                    contentId: rec.Id,
                    hostType: "xss",
                }],
                open: 'VIEWER',
                launchPoint: "brena"
            }
        }, "*")
        } else {
          GBL.launchViewerEditor([
            {
              contentId: rec.Id,
              hostType: "xss",
            },
          ]);
        }
      }
    } else if(fileType === 'pln' || isTabletApp()) {
      if (device === 'brena-mobile') {
        window.postMessage({
          event: "brena-openfiles",
          data: {
              editorUrl: rec.editorUrl, 
              fileName: splitNameArr[0],
              open: 'GANTTER',
              launchPoint: "brena"
          }
      }, "*")
      } else {
        GBL.launchGantter(rec.editorUrl, splitNameArr[0]);
      }
    } else if(fileType === 'seq') {
      GBL.openSequenceEditor(rec.Id);
    } else if(fileType === 'sim') {
      GBL.openSimulatorWindow({id: rec.Id});
    }
  };


  const onDriveItemClick = (e: any, rec: any, index: any) => {
    if (e.target.tagName !== "IMG") {
      const indx = selectedItemsList.current.findIndex(
        (itemId: any) => itemId === rec.Id
      );
      if (indx >= 0) {
        selectedItemsList.current.splice(indx, 1);
      } else {
        selectedItemsList.current.push(rec.Id);
      }
      dispatch(updateSelectedDriveItems([...selectedItemsList.current]));
      updateCtxChange();
      
    }
  };

  const updateCtxChange = ()=> {
      window.postMessage(
        {
          event: "brena-ui-extra-ctx",
          data: {
            item_ids: [...selectedItemsList.current],
          },
        },
        "*"
      );
  }

  return (
    <div className="brena-drive-items">
      <div className="brena-drive-items_title">
        Showing {driveItemsData.length} files from drive.
      </div>
      <div className="brena-drive-items_wrapper">
        {driveItemsData.map((rec: any, index: any) => {
          const fileName: any = rec.Name ? rec.Name : rec.FileName;
          const splitNameArr: any = fileName?.split(".");
          
          return (
            <div
              className={`brena-drive-items_item ${
                selectedDriveItems?.includes(rec.Id) ? "selected-item" : ""
              }`}
              onClick={(e) => onDriveItemClick(e, rec, index)}
            >
              <div className="brena-drive-items_item-img-wrapper">
                <img
                  src={getFilePath(rec)}
                  alt={rec.Type}
                  onClick={(e) => onImgClick(e, rec, index)}
                />
              </div>
              <div className="brena-drive-items_item-name">{fileName}</div>
              <div className="brena-drive-items_item-type">
                Type: {rec.Type || splitNameArr[splitNameArr?.length - 1]}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
});
export default DriveItems;
