import React, { useEffect, useState } from "react";
import AddCircleIcon from "@mui/icons-material/AddCircle";
import { useAppSelector, useAppDispatch } from "../../store/hooks";
import { updateRecentSelectedSmartItem, updateSmartappBuilderChatRecentSelection } from "../../store/brenaSlice";

const SmartappsTooltipItems = (props: any) => {
  const smartAppsData = useAppSelector(
    (state: any) => state.brena.smartAppsData
  );
  const smartappBuilderChatRecentSelection: any = useAppSelector((state: any) => state.brena.smartappBuilderChatRecentSelection); 
  const [smartappItemsData, setSmartappItemsData] = useState<any>([]);
  const dispatch = useAppDispatch();

  useEffect(() => {
    const filtedredData = [...smartAppsData].filter((rec: any) => {
      return rec.text?.toLowerCase().includes(props.searchQuery);
    });
    setSmartappItemsData(filtedredData);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [props.searchQuery]);

  const onListItemClick = (e: any) => {
    const bodyRef: any = document.getElementsByClassName(
      "smartapp-add-tooltip-content_body"
    )?.[0];
    if (bodyRef) {
      const allLists: any = bodyRef.querySelectorAll(
        ".smartapp-add-tooltip-content_body-item"
      );
      allLists.forEach((item: any) => {
        item.classList.remove("selected");
      });
    }
    e.currentTarget.classList.add("selected");
  };


  const onAddBtnClick = (rec: any) => {
    dispatch(updateRecentSelectedSmartItem(rec));
    saWebComp?.brenaApi?.onUIEvent("smart_item_builder", {
      tool: "itemCreator",
      appName: rec.text,
      human_input: smartappBuilderChatRecentSelection ? smartappBuilderChatRecentSelection : props.brenaMsg
    });
    
    props.addBtnClicked(Date.now());
    setTimeout(()=> {
      dispatch(updateSmartappBuilderChatRecentSelection(''));
    }, 1000)
  };

  useEffect(() => {
    setSmartappItemsData(smartAppsData);
  }, [smartAppsData]);

  return (
    <div className="smartapp-add-tooltip-content_body">
      {smartappItemsData.map((rec: any) => {
        return (
          <div
            className="smartapp-add-tooltip-content_body-item"
            onClick={(e: any) => onListItemClick(e)}
            key={rec.id}
          >
            <img
              className="smartapp-add-tooltip-content_body-item-img"
              src={rec.imgSrc}
              alt="App"
            />
            <div className="smartapp-add-tooltip-content_body-item-name">
              {rec.text}
            </div>
            <AddCircleIcon
              color="primary"
              className="smartapp-add-tooltip-content_body-item-add-icon"
              onClick={() => onAddBtnClick(rec)}
            ></AddCircleIcon>
          </div>
        );
      })}
    </div>
  );
};

export default React.memo(SmartappsTooltipItems);
