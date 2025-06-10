import React, { useRef, useEffect } from "react";
import "./TaskItemsSection.scss";
import {
  formatDate,
  checkLightOrDark,
  reactAppTypeModules,
  getSubType,
} from "../../utils/CommonUtil";
import { useAppSelector, useAppDispatch } from "../../store/hooks";
import { useDetectDevice } from "../../hooks/useDetectDevice";
import { updateSelectedTaskItems } from "../../store/brenaSlice";

const TaskItemsSection = React.memo(() => {
  const tooltipTimerRef = useRef<any>();
  const taskItems: any = useAppSelector(
    (state: any) => state.brena.taskItemsData
  );
  const selectedItemsList = useRef<any>([]);
  const selectedTaskItems: any = useAppSelector(
    (state: any) => state.brena.selectedTaskItems
  );

  const device = useDetectDevice();
  const dispatch = useAppDispatch();

  useEffect(() => {
    selectedItemsList.current = [...selectedTaskItems];
  }, [selectedTaskItems]);

  const onTaskItemsSectionClick = (rec: any, e: any) => {
    const indx = selectedItemsList.current.findIndex(
      (itemId: any) => itemId === rec.id
    );
    if (indx >= 0) {
      selectedItemsList.current.splice(indx, 1);
    } else {
      selectedItemsList.current.push(rec.id);
      let currentType = reactAppTypeModules[rec.itemType] || "";
      let subType = getSubType(rec);
      if (rec.smartAppId && saWebComp?.brenaApi) {
        saWebComp?.brenaApi?.onUIEvent("item_click", { rec: rec });
      } else {
        if (rec?.itemType?.length && currentType?.length) {
          CommonUtility?.ReactHelper.openItem({
            itemId: rec.id,
            type: currentType,
            title: rec?.name,
            parentItemId: rec?.parentItemId,
            subType: subType,
          });
        }
      }
    }
    dispatch(updateSelectedTaskItems([...selectedItemsList.current]));

    window.postMessage(
      {
        event: "brena-ui-extra-ctx",
        data: {
          item_ids: [...selectedItemsList.current],
        },
      },
      "*"
    );
  };

  /**
   * @param e curent dom event
   * @author Sirnivas Nadendla
   */
  const onMouseEnter = (e: any) => {
    let tooltipEl: any = e.target.parentElement?.querySelector(
      ".brena-task-desc-tooltip"
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
      "brena-task-desc-tooltip"
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

  return (
    <div className={"task-items-section " + device}>
      <div className="task-items-section_title">
        Showing {taskItems.length} items.
      </div>
      {taskItems.map((item: any, index: any) => {
        return (
          <div
            className={`task-items-section_item ${
              selectedTaskItems?.includes(item.id) ? "selected-item" : ""
            }
            `}
            key={item.id}
            onClick={(e: any) => onTaskItemsSectionClick(item, e)}
          >
            <div
              className="brena-task-desc-tooltip"
              style={{ display: "none", top: index === 0 ? -20 : -70 }}
            >
              {item.desc}
            </div>

            <div className="task-items-section_item-name-section">
              {(item.appicon || item.name) && (
                <span
                  className={
                    "thumbnail " +
                    (!item.appicon ? " thumbnail-without-border" : "")
                  }
                >
                  {item.appicon && <img src={item.appicon} alt="App Icon"/>}
                </span>
              )}

              <span className="task-items-section_item-name-section_name">
                {item.name}
              </span>
            </div>
            <div
              className="task-items-section_item-desc-section"
              onMouseEnter={onMouseEnter}
              onMouseOut={onMouseOut}
            >
              {item.desc}
            </div>
            {item.stage && (
              <div className="task-items-section_item-status-section">
                <span className="status-icon">
                  <img alt="Status Icon" src="data:image/svg+xml;base64,PCEtLSBHZW5lcmF0ZWQgYnkgSWNvTW9vbi5pbyAtLT4KPHN2ZyB2ZXJzaW9uPSIxLjEiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyIgd2lkdGg9IjEwMjQiIGhlaWdodD0iMTAyNCIgdmlld0JveD0iMCAwIDEwMjQgMTAyNCI+Cjx0aXRsZT48L3RpdGxlPgo8ZyBpZD0iaWNvbW9vbi1pZ25vcmUiPgo8L2c+CjxwYXRoIGQ9Ik00MDIuODU5IDI5OC45MDFjMC4wNjAtOS41MjEgNy43OTMtMTcuMjE2IDE3LjMyMi0xNy4yMTYgMC4wMzggMCAwLjA3NSAwIDAuMTEzIDBoMTgxLjU2MmMwLjAzMiAwIDAuMDY5IDAgMC4xMDcgMCA5LjUzIDAgMTcuMjYyIDcuNjk1IDE3LjMyMiAxNy4yMTF2MC4wMDZjMC4wMDYgMC4xNiAwLjAwOSAwLjM0OCAwLjAwOSAwLjUzNyAwIDQuNjE1LTEuODg4IDguNzg5LTQuOTM1IDExLjc5MWwtMC4wMDIgMC4wMDJjLTMuMDc1IDMuMDEzLTcuMjkxIDQuODczLTExLjk0MSA0Ljg3My0wLjE5NyAwLTAuMzkzLTAuMDAzLTAuNTg5LTAuMDEwbDAuMDI4IDAuMDAxaC0xODEuNTg5Yy05LjI5LTAuNTk5LTE2LjY5Mi03LjkyOC0xNy40MDQtMTcuMTMxbC0wLjAwNC0wLjA2NHpNNjE5LjI4NSAzNzUuODkzYy0wLjA2MC05LjUyMS03Ljc5My0xNy4yMTYtMTcuMzIyLTE3LjIxNi0wLjAzOCAwLTAuMDc1IDAtMC4xMTMgMGgtMTgxLjU4M2MtMC4wMzIgMC0wLjA2OSAwLTAuMTA3IDAtOS41MyAwLTE3LjI2MiA3LjY5NS0xNy4zMjIgMTcuMjExdjAuMDA2YzAuMDYwIDkuNTIxIDcuNzkzIDE3LjIxNiAxNy4zMjIgMTcuMjE2IDAuMDM4IDAgMC4wNzUgMCAwLjExMyAwaDE4MS41NjJjOS40NS0wLjI1OSAxNy4wNjEtNy43ODcgMTcuNDQ5LTE3LjE4bDAuMDAxLTAuMDM2ek0xMDYuNjY3IDc4OC45NDl2LTY0LjMyYzAuMTgxLTI4LjU1MiAyMy4zNjktNTEuNjI4IDUxLjk0Ni01MS42MjggMC4xMTMgMCAwLjIyNiAwIDAuMzM4IDAuMDAxaDQ5LjQ5OHYtMTA0LjE3MWMwLjA2MC05LjUyMSA3Ljc5My0xNy4yMTYgMTcuMzIyLTE3LjIxNiAwLjAzOCAwIDAuMDc1IDAgMC4xMTMgMGgyNjguNzk0di03Mi41MzNoLTEwNy4yODVjLTM3LjY3Ni0wLjA0NS02OC4yNjItMzAuMzM4LTY4Ljc3OC02Ny44OThsLTAuMDAxLTAuMDQ5di0xNTEuMjc1YzAuNTE3LTM3LjYwOCAzMS4xMDMtNjcuOTAyIDY4Ljc3NC02Ny45NDdoMjQ5LjQzNGMzNy42NzYgMC4wNDUgNjguMjYyIDMwLjMzOCA2OC43NzggNjcuODk4bDAuMDAxIDAuMDQ5djE1MS4yNzVjLTAuNTE3IDM3LjYwOC0zMS4xMDMgNjcuOTAyLTY4Ljc3NCA2Ny45NDdoLTEwNy4yOXY3Mi41MzNoMjY4LjhjMC4wMzIgMCAwLjA2OSAwIDAuMTA3IDAgOS41MyAwIDE3LjI2MiA3LjY5NSAxNy4zMjIgMTcuMjExdjEwNC4xNzdoNDkuNTE1YzAuMDk1LTAuMDAxIDAuMjA4LTAuMDAxIDAuMzIxLTAuMDAxIDI4LjU3NyAwIDUxLjc2NSAyMy4wNzYgNTEuOTQ2IDUxLjYxdjY0LjMzN2MtMC4xODEgMjguNTUyLTIzLjM2OSA1MS42MjgtNTEuOTQ2IDUxLjYyOC0wLjExMyAwLTAuMjI2IDAtMC4zMzgtMC4wMDFoLTEzMy44NzFjLTAuMDk1IDAuMDAxLTAuMjA4IDAuMDAxLTAuMzIxIDAuMDAxLTI4LjU3NyAwLTUxLjc2NS0yMy4wNzYtNTEuOTQ2LTUxLjYxdi02NC4zMzdjMC4xODEtMjguNTUyIDIzLjM2OS01MS42MjggNTEuOTQ2LTUxLjYyOCAwLjExMyAwIDAuMjI2IDAgMC4zMzggMC4wMDFoNDkuNDk4di04Ni45NTVoLTI1MS4yNjR2ODYuOTU1aDQ5LjUxNWMwLjA5NS0wLjAwMSAwLjIwOC0wLjAwMSAwLjMyMS0wLjAwMSAyOC41NzcgMCA1MS43NjUgMjMuMDc2IDUxLjk0NiA1MS42MXY2NC4zMzdjLTAuMTgxIDI4LjU1Mi0yMy4zNjkgNTEuNjI4LTUxLjk0NiA1MS42MjgtMC4xMTMgMC0wLjIyNiAwLTAuMzM4LTAuMDAxaC0xMzMuODcxYy0wLjA5NSAwLjAwMS0wLjIwOCAwLjAwMS0wLjMyMSAwLjAwMS0yOC41NzcgMC01MS43NjUtMjMuMDc2LTUxLjk0Ni01MS42MXYtNjQuMzM3YzAuMTgxLTI4LjU1MiAyMy4zNjktNTEuNjI4IDUxLjk0Ni01MS42MjggMC4xMTMgMCAwLjIyNiAwIDAuMzM4IDAuMDAxaDQ5LjQ5OHYtODYuOTU1aC0yNTEuNTg0djg2Ljk1NWg0OS41MTVjMC4wOTUtMC4wMDEgMC4yMDgtMC4wMDEgMC4zMjEtMC4wMDEgMjguNTc3IDAgNTEuNzY1IDIzLjA3NiA1MS45NDYgNTEuNjF2NjQuMzM3Yy0wLjE4MSAyOC41NTItMjMuMzY5IDUxLjYyOC01MS45NDYgNTEuNjI4LTAuMTEzIDAtMC4yMjYgMC0wLjMzOC0wLjAwMWgtMTMzLjg3MWMtMjguNTQtMC4xOTktNTEuNjU5LTIzLjEzMS01Mi4xNTktNTEuNThsLTAuMDAxLTAuMDQ3ek01NzguMTMzIDcwNy40MTNoLTEzMy44ODhjLTAuMDMyIDAtMC4wNjkgMC0wLjEwNyAwLTkuNTMgMC0xNy4yNjIgNy42OTUtMTcuMzIyIDE3LjIxMXY2NC4zMjZjMC4wNjAgOS41MjEgNy43OTMgMTcuMjE2IDE3LjMyMiAxNy4yMTYgMC4wMzggMCAwLjA3NSAwIDAuMTEzIDBoMTMzLjg4MmMwLjAzMiAwIDAuMDY5IDAgMC4xMDcgMCA5LjUzIDAgMTcuMjYyLTcuNjk1IDE3LjMyMi0xNy4yMTF2LTY0LjMyNmMtMC4zOTMtOS40NTMtOC4wNTItMTYuOTkzLTE3LjUxNy0xNy4xOTRoLTAuMDE5ek04NjMuMzM5IDcwNy40MTNoLTEzMy44ODhjLTAuMDMyIDAtMC4wNjkgMC0wLjEwNyAwLTkuNTMgMC0xNy4yNjIgNy42OTUtMTcuMzIyIDE3LjIxMXY2NC4zMjZjMC4wNjAgOS41MjEgNy43OTMgMTcuMjE2IDE3LjMyMiAxNy4yMTYgMC4wMzggMCAwLjA3NSAwIDAuMTEzIDBoMTMzLjg4MmMwLjAzMiAwIDAuMDY5IDAgMC4xMDcgMCA5LjUzIDAgMTcuMjYyLTcuNjk1IDE3LjMyMi0xNy4yMTF2LTY0LjMyNmMtMC4wNzItOS41MTItNy44LTE3LjE5Ni0xNy4zMjItMTcuMTk2LTAuMDc1IDAtMC4xNSAwLTAuMjI1IDAuMDAxaDAuMDExek0zODYuNDc1IDQ0Ni41MjhoMjQ5LjI1OWMwLjAyNyAwIDAuMDYwIDAgMC4wOTIgMCA5LjMyMyAwIDE3Ljc3My0zLjczOCAyMy45MzQtOS43OTdsLTAuMDA1IDAuMDA1YzYuMTI1LTYuMDI5IDkuOTItMTQuNDEgOS45Mi0yMy42NzcgMC0wLjAxNiAwLTAuMDMyIDAtMC4wNDh2MC4wMDItMTUxLjI1M2MwLTAuMDE0IDAtMC4wMzAgMC0wLjA0NiAwLTkuMjY3LTMuNzk1LTE3LjY0OC05LjkxNi0yMy42NzNsLTAuMDA0LTAuMDA0Yy02LjE1Ni02LjA1NC0xNC42MDYtOS43OTItMjMuOTI5LTkuNzkyLTAuMDMzIDAtMC4wNjUgMC0wLjA5NyAwaC0yNDkuNDI0Yy0wLjAyNyAwLTAuMDYwIDAtMC4wOTIgMC05LjMyMyAwLTE3Ljc3MyAzLjczOC0yMy45MzQgOS43OTdsMC4wMDUtMC4wMDVjLTYuMTI1IDYuMDI5LTkuOTIgMTQuNDEtOS45MiAyMy42NzcgMCAwLjAxNiAwIDAuMDMyIDAgMC4wNDh2LTAuMDAyIDE1MS4yNzVjMC40MDQgMTguNTE3IDE1LjQ0NyAzMy4zODggMzMuOTkzIDMzLjUxNWgwLjAxMnpNMTQxLjYzMiA3ODguOTQ5YzAuMDYwIDkuNTIxIDcuNzkzIDE3LjIxNiAxNy4zMjIgMTcuMjE2IDAuMDM4IDAgMC4wNzUgMCAwLjExMyAwaDEzMy44ODJjMC4wMzIgMCAwLjA2OSAwIDAuMTA3IDAgOS41MyAwIDE3LjI2Mi03LjY5NSAxNy4zMjItMTcuMjExdi02NC4zMjZjLTAuMDYwLTkuNTIxLTcuNzkzLTE3LjIxNi0xNy4zMjItMTcuMjE2LTAuMDM4IDAtMC4wNzUgMC0wLjExMyAwaC0xMzMuODgyYy0wLjAzMiAwLTAuMDY5IDAtMC4xMDcgMC05LjUzIDAtMTcuMjYyIDcuNjk1LTE3LjMyMiAxNy4yMTF2MC4wMDZ6Ij48L3BhdGg+Cjwvc3ZnPgo=" />
                </span>

                <span
                  className="task-items-section_item-status-section_status"
                  style={{
                    backgroundColor: item.stageColor,
                    color:
                      checkLightOrDark(item.stageColor) === "light"
                        ? "black"
                        : "white",
                  }}
                >
                  {item.stage}
                </span>
              </div>
            )}
            {item.isQuery && item.assignedTo && (
              <div className="task-items-section_item-date-section">
                <span className="task-items-section_item-date-section_icon date-icon">
                  <img alt="Date Icon" src="data:image/svg+xml;base64,PCEtLSBHZW5lcmF0ZWQgYnkgSWNvTW9vbi5pbyAtLT4KPHN2ZyB2ZXJzaW9uPSIxLjEiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyIgd2lkdGg9IjEwMjQiIGhlaWdodD0iMTAyNCIgdmlld0JveD0iMCAwIDEwMjQgMTAyNCI+Cjx0aXRsZT48L3RpdGxlPgo8ZyBpZD0iaWNvbW9vbi1pZ25vcmUiPgo8L2c+CjxwYXRoIGZpbGw9IiM2NjYiIGQ9Ik04MDAuOTE3IDIzNS4xMTVoLTkzLjEydi00Mi45NjVjMC0xMS44NjUtOS42MTgtMjEuNDgzLTIxLjQ4My0yMS40ODNzLTIxLjQ4MyA5LjYxOC0yMS40ODMgMjEuNDgzdjAgNDIuOTY1aC0xMjguOTE3di00Mi45NjVjMC0xMS44NjUtOS42MTgtMjEuNDgzLTIxLjQ4My0yMS40ODNzLTIxLjQ4MyA5LjYxOC0yMS40ODMgMjEuNDgzdjAgNDIuOTY1aC0xMjguOTE3di00Mi45NjVjMC0xMS44NjUtOS42MTgtMjEuNDgzLTIxLjQ4My0yMS40ODNzLTIxLjQ4MyA5LjYxOC0yMS40ODMgMjEuNDgzdjQyLjk2NWgtOTMuMDk5Yy0wLjAwNiAwLTAuMDE0IDAtMC4wMjEgMC0zMS42MzUgMC01Ny4yOCAyNS42NDUtNTcuMjggNTcuMjggMCAwLjAwOCAwIDAuMDE1IDAgMC4wMjN2LTAuMDAxIDUwOC41MDFjMCAzMS42NDcgMjUuNjU1IDU3LjMwMSA1Ny4zMDEgNTcuMzAxdjBoNTcyLjk0OWMzMS42MzUgMCA1Ny4yOC0yNS42NDUgNTcuMjgtNTcuMjggMC0wLjAwNyAwLTAuMDE1IDAtMC4wMjJ2MC4wMDEtNTA4LjUwMWMwLTAuMDEzIDAtMC4wMjggMC0wLjA0MyAwLTMxLjYyMy0yNS42MzYtNTcuMjU5LTU3LjI1OS01Ny4yNTktMC4wMDggMC0wLjAxNSAwLTAuMDIzIDBoMC4wMDF6TTgxNS4yMzIgODAwLjg5NmMwIDAgMCAwIDAgMCAwIDcuOTEtNi40MDYgMTQuMzI0LTE0LjMxMyAxNC4zMzZoLTU3Mi45NWMtNy45MTggMC0xNC4zMzYtNi40MTgtMTQuMzM2LTE0LjMzNnYwLTUwOC40OGMwLjAxMi03LjkwOCA2LjQyNi0xNC4zMTUgMTQuMzM2LTE0LjMxNSAwIDAgMCAwIDAgMGg5My4wOTl2NDIuOTY1YzAgMTEuODY1IDkuNjE4IDIxLjQ4MyAyMS40ODMgMjEuNDgzczIxLjQ4My05LjYxOCAyMS40ODMtMjEuNDgzdjAtNDIuOTY1aDEyOC45MTd2NDIuOTY1YzAgMTEuODY1IDkuNjE4IDIxLjQ4MyAyMS40ODMgMjEuNDgzczIxLjQ4My05LjYxOCAyMS40ODMtMjEuNDgzdi00Mi45NjVoMTI4LjkxN3Y0Mi45NjVjMCAxMS44NjUgOS42MTggMjEuNDgzIDIxLjQ4MyAyMS40ODNzMjEuNDgzLTkuNjE4IDIxLjQ4My0yMS40ODN2MC00Mi45NjVoOTMuMTJjNy45MDEgMC4wMTIgMTQuMzAzIDYuNDE0IDE0LjMxNSAxNC4zMTR2MC4wMDF6Ij48L3BhdGg+CjxwYXRoIGZpbGw9IiM2NjYiIGQ9Ik0yNzYuMTE3IDQyMi41MjhoMTA1LjA4OHY3OC44MjdoLTEwNS4wODh2LTc4LjgyN3oiPjwvcGF0aD4KPHBhdGggZmlsbD0iIzY2NiIgZD0iTTI3Ni4xMTcgNTI3LjQ4OGgxMDUuMDg4djc4LjgyN2gtMTA1LjA4OHYtNzguODI3eiI+PC9wYXRoPgo8cGF0aCBmaWxsPSIjNjY2IiBkPSJNMjc2LjExNyA2MzIuNDQ4aDEwNS4wODh2NzguODI3aC0xMDUuMDg4di03OC44Mjd6Ij48L3BhdGg+CjxwYXRoIGZpbGw9IiM2NjYiIGQ9Ik00NjEuOTMxIDYzMi40NDhoMTA1LjA4OHY3OC44MjdoLTEwNS4wODh2LTc4LjgyN3oiPjwvcGF0aD4KPHBhdGggZmlsbD0iIzY2NiIgZD0iTTQ2MS45MzEgNTI3LjQ4OGgxMDUuMDg4djc4LjgyN2gtMTA1LjA4OHYtNzguODI3eiI+PC9wYXRoPgo8cGF0aCBmaWxsPSIjNjY2IiBkPSJNNDYxLjkzMSA0MjIuNTI4aDEwNS4wODh2NzguODI3aC0xMDUuMDg4di03OC44Mjd6Ij48L3BhdGg+CjxwYXRoIGZpbGw9IiM2NjYiIGQ9Ik02NDcuNjggNjMyLjQ0OGgxMDUuMDg4djc4LjgyN2gtMTA1LjA4OHYtNzguODI3eiI+PC9wYXRoPgo8cGF0aCBmaWxsPSIjNjY2IiBkPSJNNjQ3LjY4IDUyNy40ODhoMTA1LjA4OHY3OC44MjdoLTEwNS4wODh2LTc4LjgyN3oiPjwvcGF0aD4KPHBhdGggZmlsbD0iIzY2NiIgZD0iTTY0Ny42OCA0MjIuNTI4aDEwNS4wODh2NzguODI3aC0xMDUuMDg4di03OC44Mjd6Ij48L3BhdGg+Cjwvc3ZnPgo=" />
                </span>
                <span className="task-items-section_item-date-section_date">
                  <span className="task-items-section_item-date-section_date-text">
                    Assigned
                  </span>
                </span>
                <span className="task-items-section_item-date-section_name">
                  {" "}
                  {item.assignedTo}
                </span>
              </div>
            )}
            {!item.isQuery && (item.modifiedDate || item.modifiedBy) && (
              <div className="task-items-section_item-date-section">
                <span className="task-items-section_item-date-section_icon date-icon">
                  <img alt="Date Icon" src="data:image/svg+xml;base64,PCEtLSBHZW5lcmF0ZWQgYnkgSWNvTW9vbi5pbyAtLT4KPHN2ZyB2ZXJzaW9uPSIxLjEiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyIgd2lkdGg9IjEwMjQiIGhlaWdodD0iMTAyNCIgdmlld0JveD0iMCAwIDEwMjQgMTAyNCI+Cjx0aXRsZT48L3RpdGxlPgo8ZyBpZD0iaWNvbW9vbi1pZ25vcmUiPgo8L2c+CjxwYXRoIGZpbGw9IiM2NjYiIGQ9Ik04MDAuOTE3IDIzNS4xMTVoLTkzLjEydi00Mi45NjVjMC0xMS44NjUtOS42MTgtMjEuNDgzLTIxLjQ4My0yMS40ODNzLTIxLjQ4MyA5LjYxOC0yMS40ODMgMjEuNDgzdjAgNDIuOTY1aC0xMjguOTE3di00Mi45NjVjMC0xMS44NjUtOS42MTgtMjEuNDgzLTIxLjQ4My0yMS40ODNzLTIxLjQ4MyA5LjYxOC0yMS40ODMgMjEuNDgzdjAgNDIuOTY1aC0xMjguOTE3di00Mi45NjVjMC0xMS44NjUtOS42MTgtMjEuNDgzLTIxLjQ4My0yMS40ODNzLTIxLjQ4MyA5LjYxOC0yMS40ODMgMjEuNDgzdjQyLjk2NWgtOTMuMDk5Yy0wLjAwNiAwLTAuMDE0IDAtMC4wMjEgMC0zMS42MzUgMC01Ny4yOCAyNS42NDUtNTcuMjggNTcuMjggMCAwLjAwOCAwIDAuMDE1IDAgMC4wMjN2LTAuMDAxIDUwOC41MDFjMCAzMS42NDcgMjUuNjU1IDU3LjMwMSA1Ny4zMDEgNTcuMzAxdjBoNTcyLjk0OWMzMS42MzUgMCA1Ny4yOC0yNS42NDUgNTcuMjgtNTcuMjggMC0wLjAwNyAwLTAuMDE1IDAtMC4wMjJ2MC4wMDEtNTA4LjUwMWMwLTAuMDEzIDAtMC4wMjggMC0wLjA0MyAwLTMxLjYyMy0yNS42MzYtNTcuMjU5LTU3LjI1OS01Ny4yNTktMC4wMDggMC0wLjAxNSAwLTAuMDIzIDBoMC4wMDF6TTgxNS4yMzIgODAwLjg5NmMwIDAgMCAwIDAgMCAwIDcuOTEtNi40MDYgMTQuMzI0LTE0LjMxMyAxNC4zMzZoLTU3Mi45NWMtNy45MTggMC0xNC4zMzYtNi40MTgtMTQuMzM2LTE0LjMzNnYwLTUwOC40OGMwLjAxMi03LjkwOCA2LjQyNi0xNC4zMTUgMTQuMzM2LTE0LjMxNSAwIDAgMCAwIDAgMGg5My4wOTl2NDIuOTY1YzAgMTEuODY1IDkuNjE4IDIxLjQ4MyAyMS40ODMgMjEuNDgzczIxLjQ4My05LjYxOCAyMS40ODMtMjEuNDgzdjAtNDIuOTY1aDEyOC45MTd2NDIuOTY1YzAgMTEuODY1IDkuNjE4IDIxLjQ4MyAyMS40ODMgMjEuNDgzczIxLjQ4My05LjYxOCAyMS40ODMtMjEuNDgzdi00Mi45NjVoMTI4LjkxN3Y0Mi45NjVjMCAxMS44NjUgOS42MTggMjEuNDgzIDIxLjQ4MyAyMS40ODNzMjEuNDgzLTkuNjE4IDIxLjQ4My0yMS40ODN2MC00Mi45NjVoOTMuMTJjNy45MDEgMC4wMTIgMTQuMzAzIDYuNDE0IDE0LjMxNSAxNC4zMTR2MC4wMDF6Ij48L3BhdGg+CjxwYXRoIGZpbGw9IiM2NjYiIGQ9Ik0yNzYuMTE3IDQyMi41MjhoMTA1LjA4OHY3OC44MjdoLTEwNS4wODh2LTc4LjgyN3oiPjwvcGF0aD4KPHBhdGggZmlsbD0iIzY2NiIgZD0iTTI3Ni4xMTcgNTI3LjQ4OGgxMDUuMDg4djc4LjgyN2gtMTA1LjA4OHYtNzguODI3eiI+PC9wYXRoPgo8cGF0aCBmaWxsPSIjNjY2IiBkPSJNMjc2LjExNyA2MzIuNDQ4aDEwNS4wODh2NzguODI3aC0xMDUuMDg4di03OC44Mjd6Ij48L3BhdGg+CjxwYXRoIGZpbGw9IiM2NjYiIGQ9Ik00NjEuOTMxIDYzMi40NDhoMTA1LjA4OHY3OC44MjdoLTEwNS4wODh2LTc4LjgyN3oiPjwvcGF0aD4KPHBhdGggZmlsbD0iIzY2NiIgZD0iTTQ2MS45MzEgNTI3LjQ4OGgxMDUuMDg4djc4LjgyN2gtMTA1LjA4OHYtNzguODI3eiI+PC9wYXRoPgo8cGF0aCBmaWxsPSIjNjY2IiBkPSJNNDYxLjkzMSA0MjIuNTI4aDEwNS4wODh2NzguODI3aC0xMDUuMDg4di03OC44Mjd6Ij48L3BhdGg+CjxwYXRoIGZpbGw9IiM2NjYiIGQ9Ik02NDcuNjggNjMyLjQ0OGgxMDUuMDg4djc4LjgyN2gtMTA1LjA4OHYtNzguODI3eiI+PC9wYXRoPgo8cGF0aCBmaWxsPSIjNjY2IiBkPSJNNjQ3LjY4IDUyNy40ODhoMTA1LjA4OHY3OC44MjdoLTEwNS4wODh2LTc4LjgyN3oiPjwvcGF0aD4KPHBhdGggZmlsbD0iIzY2NiIgZD0iTTY0Ny42OCA0MjIuNTI4aDEwNS4wODh2NzguODI3aC0xMDUuMDg4di03OC44Mjd6Ij48L3BhdGg+Cjwvc3ZnPgo=" />
                </span>
                <span className="task-items-section_item-date-section_date-name-wrapper">
                  {item.modifiedDate && (
                    <span className="task-items-section_item-date-section_date">
                      <span className="task-items-section_item-date-section_date-text">
                        Modified{" "}
                      </span>
                      {item.modifiedDate && formatDate(item.modifiedDate)}
                      {item.modifiedBy && ","}
                    </span>
                  )}
                  {item.modifiedBy && (
                    <span className="task-items-section_item-date-section_name">
                      {" "}
                      {item.modifiedBy}
                    </span>
                  )}
                </span>
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
});
export default TaskItemsSection;
