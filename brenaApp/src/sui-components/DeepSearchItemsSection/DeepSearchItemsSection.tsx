import React, { useRef, useEffect, useState } from "react";
import "./DeepSearchItemsSection.scss";
import {
  handleDriveFileClick
} from "../../utils/CommonUtil";
import { useAppSelector, useAppDispatch } from "../../store/hooks";
import { useDetectDevice } from "../../hooks/useDetectDevice";
import { updateDeepSearchItems, updateDeepSearchSelectedItems, updateSelectedPageNumber } from "../../store/brenaSlice";
import DescriptionOutlinedIcon from '@mui/icons-material/DescriptionOutlined';
import descriptionImg from '../../img/discription.svg';
import referencesImg from '../../img/references.svg';
import SpecBookModal from "../SpecBookModal/SpecBookModal";

const DeepSearchItemsSection = React.memo(() => {
  const deepSearchItems: any = useAppSelector(
    (state: any) => state.brena.deepSearchItems
  );
  const deepSearchItemsList = useRef<any>([]);
  const deepSearchSelectedItems: any = useAppSelector(
    (state: any) => state.brena.deepSearchSelectedItems
  );
  const appThumbnails: any = useAppSelector(
    (state: any) => state.brena.appThumbnails
  );
  const [openSpecBookModal, setOpenSpecBookModal] = useState<any>(false);
  const [currentSpecBookId, setCurrentSpecBookId] = useState<any>('');

  const device = useDetectDevice();
  const dispatch = useAppDispatch();
   const tooltipTimerRef = useRef<any>();

  useEffect(() => {
    deepSearchItemsList.current = [...deepSearchSelectedItems];
  }, [deepSearchSelectedItems]);

  const onItemsSectionClick = (rec: any, e: any) => {
    const indx = deepSearchItemsList.current.findIndex(
        (itemId: any) => itemId === rec.recordId
      );
      if (indx >= 0) {
        deepSearchItemsList.current.splice(indx, 1);
      } else {
        deepSearchItemsList.current.push(rec.recordId);
      }
      dispatch(updateDeepSearchSelectedItems([...deepSearchItemsList.current]));
  };

  const onFileNameClick = (e: any, rec: any)=> {
    e.stopPropagation();
     const fileName: any = rec.Name;
    const splitNameArr: any = fileName?.split(".") || [];
    let fileType: any =
      splitNameArr?.length > 1
        ? splitNameArr[splitNameArr.length - 1]
        : "";
    handleDriveFileClick(device, rec, fileType, fileName);
  }

  
  /**
   * @param e curent dom event
   * @author Sirnivas Nadendla
   */
  const onMouseEnter = (e: any) => {
    let tooltipEl: any = e.target.parentElement?.querySelector(
      ".brena-deep-search-desc-tooltip"
    );
    if (e.target.offsetHeight < e.target.scrollHeight) {
      tooltipTimerRef.current = setTimeout(() => {
        tooltipEl.style.display = "block";
      }, 500);
    }
  };

  /**
   * On mouse out hiding out all the tooltips and clearing the timeout.
   * @author Srinivas Nadendla
   */
  const onMouseOut = () => {
    let tooltipEl: any = document.getElementsByClassName(
      "brena-deep-search-desc-tooltip"
    );
    if (tooltipEl?.length > 0) {
      for (let i = 0; i < tooltipEl.length; i++) {
        tooltipEl[i].style.display = "none";
      }
    }
    if (tooltipTimerRef.current) {
      clearTimeout(tooltipTimerRef.current);
    }
  };

  const onPageNumberClick = (rec: any)=> {
    setOpenSpecBookModal(true);
    setCurrentSpecBookId(rec.specbookId);
    dispatch(updateSelectedPageNumber(rec.pageNumber));
  } 

  const getPageNumbers = (specCitation: any) => {
    const citations = specCitation;
    const pageNumbers = citations.map((rec: any) => rec?.pageNumber);

    const formattedPages = pageNumbers.map((num: any, index: number) => {
      const isLast = index === pageNumbers.length - 1;
      const isSecondLast = index === pageNumbers.length - 2;

      const separator = isLast ? "" : isSecondLast ? " & " : ", ";

      return (
        <>
        <span
          key={index}
          className="deep-search-items-section_page-num"
          onClick={() => onPageNumberClick(citations[index])}
        >
          {num}
          
        </span>
        {separator}
        </>
      );
    });

    return formattedPages;
  };

  useEffect(() => {
    return () => {
      dispatch(updateDeepSearchSelectedItems([]));
      dispatch(updateDeepSearchItems([]));
    };
  }, []);
  

  return (
    <div className={"deep-search-items-section " + device}>
      <div className="deep-search-items-section_title">
        Showing {deepSearchItems.length} Smart Items.
      </div>
      {deepSearchItems.map((item: any, index: any) => {
        return (
          <div
            className={`deep-search-items-section_item ${
              deepSearchSelectedItems?.includes(item.recordId)
                ? "selected-item"
                : ""
            }
            `}
            key={item.recordId}
            onClick={(e: any) => onItemsSectionClick(item, e)}
          >
            <div className="deep-search-items-section_item-name-section">
              {(item.thumbnail || item.name) && (
                <span
                  className={
                    "thumbnail " +
                    (!item.appicon ? " thumbnail-without-border" : "")
                  }
                >
                  {item.thumbnail && (
                    <img
                      src={
                        "data:image/png;base64," + appThumbnails[item.appName]
                      }
                      alt="App Icon"
                    />
                  )}
                </span>
              )}

              <span className="deep-search-items-section_item-name-section_name">
                {item.name}
              </span>
            </div>

            <div className="deep-search-items-section_item-status-section">
              <span className="status-icon">
                <img
                  alt="Status Icon"
                  src="data:image/svg+xml;base64,PCEtLSBHZW5lcmF0ZWQgYnkgSWNvTW9vbi5pbyAtLT4KPHN2ZyB2ZXJzaW9uPSIxLjEiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyIgd2lkdGg9IjEwMjQiIGhlaWdodD0iMTAyNCIgdmlld0JveD0iMCAwIDEwMjQgMTAyNCI+Cjx0aXRsZT48L3RpdGxlPgo8ZyBpZD0iaWNvbW9vbi1pZ25vcmUiPgo8L2c+CjxwYXRoIGQ9Ik00MDIuODU5IDI5OC45MDFjMC4wNjAtOS41MjEgNy43OTMtMTcuMjE2IDE3LjMyMi0xNy4yMTYgMC4wMzggMCAwLjA3NSAwIDAuMTEzIDBoMTgxLjU2MmMwLjAzMiAwIDAuMDY5IDAgMC4xMDcgMCA5LjUzIDAgMTcuMjYyIDcuNjk1IDE3LjMyMiAxNy4yMTF2MC4wMDZjMC4wMDYgMC4xNiAwLjAwOSAwLjM0OCAwLjAwOSAwLjUzNyAwIDQuNjE1LTEuODg4IDguNzg5LTQuOTM1IDExLjc5MWwtMC4wMDIgMC4wMDJjLTMuMDc1IDMuMDEzLTcuMjkxIDQuODczLTExLjk0MSA0Ljg3My0wLjE5NyAwLTAuMzkzLTAuMDAzLTAuNTg5LTAuMDEwbDAuMDI4IDAuMDAxaC0xODEuNTg5Yy05LjI5LTAuNTk5LTE2LjY5Mi03LjkyOC0xNy40MDQtMTcuMTMxbC0wLjAwNC0wLjA2NHpNNjE5LjI4NSAzNzUuODkzYy0wLjA2MC05LjUyMS03Ljc5My0xNy4yMTYtMTcuMzIyLTE3LjIxNi0wLjAzOCAwLTAuMDc1IDAtMC4xMTMgMGgtMTgxLjU4M2MtMC4wMzIgMC0wLjA2OSAwLTAuMTA3IDAtOS41MyAwLTE3LjI2MiA3LjY5NS0xNy4zMjIgMTcuMjExdjAuMDA2YzAuMDYwIDkuNTIxIDcuNzkzIDE3LjIxNiAxNy4zMjIgMTcuMjE2IDAuMDM4IDAgMC4wNzUgMCAwLjExMyAwaDE4MS41NjJjOS40NS0wLjI1OSAxNy4wNjEtNy43ODcgMTcuNDQ5LTE3LjE4bDAuMDAxLTAuMDM2ek0xMDYuNjY3IDc4OC45NDl2LTY0LjMyYzAuMTgxLTI4LjU1MiAyMy4zNjktNTEuNjI4IDUxLjk0Ni01MS42MjggMC4xMTMgMCAwLjIyNiAwIDAuMzM4IDAuMDAxaDQ5LjQ5OHYtMTA0LjE3MWMwLjA2MC05LjUyMSA3Ljc5My0xNy4yMTYgMTcuMzIyLTE3LjIxNiAwLjAzOCAwIDAuMDc1IDAgMC4xMTMgMGgyNjguNzk0di03Mi41MzNoLTEwNy4yODVjLTM3LjY3Ni0wLjA0NS02OC4yNjItMzAuMzM4LTY4Ljc3OC02Ny44OThsLTAuMDAxLTAuMDQ5di0xNTEuMjc1YzAuNTE3LTM3LjYwOCAzMS4xMDMtNjcuOTAyIDY4Ljc3NC02Ny45NDdoMjQ5LjQzNGMzNy42NzYgMC4wNDUgNjguMjYyIDMwLjMzOCA2OC43NzggNjcuODk4bDAuMDAxIDAuMDQ5djE1MS4yNzVjLTAuNTE3IDM3LjYwOC0zMS4xMDMgNjcuOTAyLTY4Ljc3NCA2Ny45NDdoLTEwNy4yOXY3Mi41MzNoMjY4LjhjMC4wMzIgMCAwLjA2OSAwIDAuMTA3IDAgOS41MyAwIDE3LjI2MiA3LjY5NSAxNy4zMjIgMTcuMjExdjEwNC4xNzdoNDkuNTE1YzAuMDk1LTAuMDAxIDAuMjA4LTAuMDAxIDAuMzIxLTAuMDAxIDI4LjU3NyAwIDUxLjc2NSAyMy4wNzYgNTEuOTQ2IDUxLjYxdjY0LjMzN2MtMC4xODEgMjguNTUyLTIzLjM2OSA1MS42MjgtNTEuOTQ2IDUxLjYyOC0wLjExMyAwLTAuMjI2IDAtMC4zMzgtMC4wMDFoLTEzMy44NzFjLTAuMDk1IDAuMDAxLTAuMjA4IDAuMDAxLTAuMzIxIDAuMDAxLTI4LjU3NyAwLTUxLjc2NS0yMy4wNzYtNTEuOTQ2LTUxLjYxdi02NC4zMzdjMC4xODEtMjguNTUyIDIzLjM2OS01MS42MjggNTEuOTQ2LTUxLjYyOCAwLjExMyAwIDAuMjI2IDAgMC4zMzggMC4wMDFoNDkuNDk4di04Ni45NTVoLTI1MS4yNjR2ODYuOTU1aDQ5LjUxNWMwLjA5NS0wLjAwMSAwLjIwOC0wLjAwMSAwLjMyMS0wLjAwMSAyOC41NzcgMCA1MS43NjUgMjMuMDc2IDUxLjk0NiA1MS42MXY2NC4zMzdjLTAuMTgxIDI4LjU1Mi0yMy4zNjkgNTEuNjI4LTUxLjk0NiA1MS42MjgtMC4xMTMgMC0wLjIyNiAwLTAuMzM4LTAuMDAxaC0xMzMuODcxYy0wLjA5NSAwLjAwMS0wLjIwOCAwLjAwMS0wLjMyMSAwLjAwMS0yOC41NzcgMC01MS43NjUtMjMuMDc2LTUxLjk0Ni01MS42MXYtNjQuMzM3YzAuMTgxLTI4LjU1MiAyMy4zNjktNTEuNjI4IDUxLjk0Ni01MS42MjggMC4xMTMgMCAwLjIyNiAwIDAuMzM4IDAuMDAxaDQ5LjQ5OHYtODYuOTU1aC0yNTEuNTg0djg2Ljk1NWg0OS41MTVjMC4wOTUtMC4wMDEgMC4yMDgtMC4wMDEgMC4zMjEtMC4wMDEgMjguNTc3IDAgNTEuNzY1IDIzLjA3NiA1MS45NDYgNTEuNjF2NjQuMzM3Yy0wLjE4MSAyOC41NTItMjMuMzY5IDUxLjYyOC01MS45NDYgNTEuNjI4LTAuMTEzIDAtMC4yMjYgMC0wLjMzOC0wLjAwMWgtMTMzLjg3MWMtMjguNTQtMC4xOTktNTEuNjU5LTIzLjEzMS01Mi4xNTktNTEuNThsLTAuMDAxLTAuMDQ3ek01NzguMTMzIDcwNy40MTNoLTEzMy44ODhjLTAuMDMyIDAtMC4wNjkgMC0wLjEwNyAwLTkuNTMgMC0xNy4yNjIgNy42OTUtMTcuMzIyIDE3LjIxMXY2NC4zMjZjMC4wNjAgOS41MjEgNy43OTMgMTcuMjE2IDE3LjMyMiAxNy4yMTYgMC4wMzggMCAwLjA3NSAwIDAuMTEzIDBoMTMzLjg4MmMwLjAzMiAwIDAuMDY5IDAgMC4xMDcgMCA5LjUzIDAgMTcuMjYyLTcuNjk1IDE3LjMyMi0xNy4yMTF2LTY0LjMyNmMtMC4zOTMtOS40NTMtOC4wNTItMTYuOTkzLTE3LjUxNy0xNy4xOTRoLTAuMDE5ek04NjMuMzM5IDcwNy40MTNoLTEzMy44ODhjLTAuMDMyIDAtMC4wNjkgMC0wLjEwNyAwLTkuNTMgMC0xNy4yNjIgNy42OTUtMTcuMzIyIDE3LjIxMXY2NC4zMjZjMC4wNjAgOS41MjEgNy43OTMgMTcuMjE2IDE3LjMyMiAxNy4yMTYgMC4wMzggMCAwLjA3NSAwIDAuMTEzIDBoMTMzLjg4MmMwLjAzMiAwIDAuMDY5IDAgMC4xMDcgMCA5LjUzIDAgMTcuMjYyLTcuNjk1IDE3LjMyMi0xNy4yMTF2LTY0LjMyNmMtMC4wNzItOS41MTItNy44LTE3LjE5Ni0xNy4zMjItMTcuMTk2LTAuMDc1IDAtMC4xNSAwLTAuMjI1IDAuMDAxaDAuMDExek0zODYuNDc1IDQ0Ni41MjhoMjQ5LjI1OWMwLjAyNyAwIDAuMDYwIDAgMC4wOTIgMCA5LjMyMyAwIDE3Ljc3My0zLjczOCAyMy45MzQtOS43OTdsLTAuMDA1IDAuMDA1YzYuMTI1LTYuMDI5IDkuOTItMTQuNDEgOS45Mi0yMy42NzcgMC0wLjAxNiAwLTAuMDMyIDAtMC4wNDh2MC4wMDItMTUxLjI1M2MwLTAuMDE0IDAtMC4wMzAgMC0wLjA0NiAwLTkuMjY3LTMuNzk1LTE3LjY0OC05LjkxNi0yMy42NzNsLTAuMDA0LTAuMDA0Yy02LjE1Ni02LjA1NC0xNC42MDYtOS43OTItMjMuOTI5LTkuNzkyLTAuMDMzIDAtMC4wNjUgMC0wLjA5NyAwaC0yNDkuNDI0Yy0wLjAyNyAwLTAuMDYwIDAtMC4wOTIgMC05LjMyMyAwLTE3Ljc3MyAzLjczOC0yMy45MzQgOS43OTdsMC4wMDUtMC4wMDVjLTYuMTI1IDYuMDI5LTkuOTIgMTQuNDEtOS45MiAyMy42NzcgMCAwLjAxNiAwIDAuMDMyIDAgMC4wNDh2LTAuMDAyIDE1MS4yNzVjMC40MDQgMTguNTE3IDE1LjQ0NyAzMy4zODggMzMuOTkzIDMzLjUxNWgwLjAxMnpNMTQxLjYzMiA3ODguOTQ5YzAuMDYwIDkuNTIxIDcuNzkzIDE3LjIxNiAxNy4zMjIgMTcuMjE2IDAuMDM4IDAgMC4wNzUgMCAwLjExMyAwaDEzMy44ODJjMC4wMzIgMCAwLjA2OSAwIDAuMTA3IDAgOS41MyAwIDE3LjI2Mi03LjY5NSAxNy4zMjItMTcuMjExdi02NC4zMjZjLTAuMDYwLTkuNTIxLTcuNzkzLTE3LjIxNi0xNy4zMjItMTcuMjE2LTAuMDM4IDAtMC4wNzUgMC0wLjExMyAwaC0xMzMuODgyYy0wLjAzMiAwLTAuMDY5IDAtMC4xMDcgMC05LjUzIDAtMTcuMjYyIDcuNjk1LTE3LjMyMiAxNy4yMTF2MC4wMDZ6Ij48L3BhdGg+Cjwvc3ZnPgo="
                />
              </span>

              <span
                className="deep-search-items-section_item-status-section_status"
                style={{
                  backgroundColor: "#C93103",
                  color: "white",
                }}
              >
                DRAFT
              </span>
            </div>
            <div className="deep-search-items-section_item-desc-section">
              <img src={descriptionImg} alt="description" />
              <div
                className="deep-search-items-section_item-desc-section_text"
                onMouseEnter={onMouseEnter}
                onMouseOut={onMouseOut}
              >
                {item.description}
              </div>
              <div
                className="brena-deep-search-desc-tooltip"
                style={{ display: "none", top: 110 }}
              >
                {item.description}
              </div>
            </div>

            <div className="deep-search-items-section_item-date-section">
              <div className="deep-search-items-section_item-date-section_drive-link">
                <span className="deep-search-items-section_item-date-section_icon date-icon">
                  <DescriptionOutlinedIcon></DescriptionOutlinedIcon>
                </span>
                <span
                  className="deep-search-items-section_item-date-section_file-name"
                  onClick={(e: any) => onFileNameClick(e, item.citation)}
                >
                  {item.citation?.Name}
                </span>
              </div>
              {item.specCitation?.length > 0 && (
                <div className="deep-search-items-section_item-date-section_spec-link">
                  <img src={referencesImg} alt="references" />
                  <div>
                    References:
                    {getPageNumbers(item.specCitation)}
                    
                  </div>
                </div>
              )}
            </div>
          </div>
        );
      })}
      {openSpecBookModal && currentSpecBookId && 
        <SpecBookModal onClose={()=> setOpenSpecBookModal(false)} specBookId={currentSpecBookId}></SpecBookModal>
      }
    </div>
  );
});
export default DeepSearchItemsSection;
