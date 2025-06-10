import React, { useState, useEffect, useRef } from "react";
import { useAppSelector, useAppDispatch } from "../../store/hooks";
import { updateSelectedTags, updateTagsList } from "../../store/brenaSlice";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import "./TagsSection.scss";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import { CalendarPicker } from "@mui/x-date-pickers/CalendarPicker";
import dayjs from "dayjs";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import tinycolor from "tinycolor2";

const TagsSection = React.memo(() => {
  const dispatch = useAppDispatch();
  const [tags, setTags] = useState<any>([]);
  const [groupsData, setGroupsData] = useState<any>([]);
  const tooltipTimerRef = useRef<any>();
  const selectedTagsRef: any = useRef<any>([]);
  const tagsList: any = useAppSelector((state: any) => state.brena.tagsList);
  const plannerTagsGroups: any = useAppSelector(
    (state: any) => state.brena.plannerTagsGroups
  );
  const tagsLastClickedBtn: any = useAppSelector(
    (state: any) => state.brena.tagsLastClickedBtn
  );
  const isPreviewBtnClicked = useAppSelector(
    (state: any) => state.brena.isPreviewBtnClicked
  );
  const selectedTags: any = useAppSelector(
    (state: any) => state.brena.selectedTags
  );
  const tagsRef: any = useRef([]);
  const canShowToolitpRef: any = useRef(true);
  const plannerTagsGroupsRef: any = useRef([]);

  useEffect(()=> {
    if (plannerTagsGroups?.length && plannerTagsGroupsRef.current?.length === 0) {
      plannerTagsGroupsRef.current = JSON.parse(JSON.stringify(plannerTagsGroups));
    }
  }, [plannerTagsGroups])

  useEffect(() => {
    setTags(tagsList);
    tagsRef.current = tagsList;
  }, [tagsList]);

  const getTagSection: any = (rec: any = {}) => {
    const tooltipHtml: any = `<div class="brena-ellipisis-tooltip" style="display:none">
        ${rec.nm}
      </div>`;
    
    let data = { ...rec, nm: rec?.nm?.replace(/'/g, "&apos;") };
    return `<sa-adv-tag  data-json='${JSON.stringify(data)}'></sa-adv-tag>${tooltipHtml}`;
  };

  const onTagDragStart = (evnt: any, rec: any) => {
    const itemsToDrop =
      selectedTagsRef.current?.length > 0 ? selectedTagsRef.current : [rec];
    window.postMessage({ event: "brena-tag-dragstart" }, "*");
    evnt.dataTransfer.clearData();
    evnt.dataTransfer.setData(
      "application/json-advtag",
      JSON.stringify(itemsToDrop)
    );
    evnt.dataTransfer.setData("text/plain", "link smartitem...");
    evnt.dataTransfer.effectAllowed = "copy";
  };

  const onTagDropEnd = (evnt: any, rec: any) => {
    window.postMessage({ event: "brena-tag-dragend" }, "*");
    
  };

  /**
   * On hover of Tag finding the tgaName element and deciding whether to show tooltip or not.
   * Getting the toolitp elemnet rendered on the parent and add inline styles to display.
   * @param e c
   * @author Sirnivas Nadendla
   */
  const onMouseEnter = (e: any) => {
    if (!canShowToolitpRef.current) return;
    const root = e.target?.children[0]?.shadowRoot;
    const tagName = root.querySelector(".advPlan-tagName");
    let tooltipEl: any = e.target.parentElement?.querySelector(
      ".brena-ellipisis-tooltip"
    );
    if (tagName.offsetWidth < tagName.scrollWidth) {
      tooltipTimerRef.current = setTimeout(() => {
        tooltipEl.style.left = 10 + "px";
        tooltipEl.style.display = "block";
        tooltipEl.style.top =
          -(tooltipEl.getBoundingClientRect()?.height - 10) + "px";
      }, 500);
    }
  };

  /**
   * On mouse out hiding out all the tooltips and clearing the timeout.
   * @author Srinivas Nadendla
   */
  const onMouseOut = () => {
    let tooltipEl: any = document.getElementsByClassName(
      "brena-ellipisis-tooltip"
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

  const onTagItemClick = (e: any, rec: any) => {
    e.stopPropagation();
    e.preventDefault();
    if (isPreviewBtnClicked) return;
    const selectedItems: any = [...selectedTagsRef.current];
    if (e.currentTarget.children?.[0]?.className?.includes("selected")) {
      e.currentTarget.children?.[0]?.classList.remove("selected");
      const index = selectedItems.findIndex(
        (item: any) => item.tId === rec.tId
      );
      if (index > -1) {
        selectedItems.splice(index, 1);
      }
      selectedTagsRef.current = [...selectedItems];
    } else {
      e.currentTarget.children?.[0]?.classList.add("selected");
      const index = selectedItems.findIndex(
        (item: any) => item.tId === rec.tId
      );
      if (index === -1) {
        selectedItems.push({ ...rec });
      }
      selectedTagsRef.current = [...selectedItems];
    }
    dispatch(updateSelectedTags(selectedTagsRef.current));
  };

  useEffect(() => {
    selectedTagsRef.current = selectedTags;
  }, [selectedTags])

  const clearTagSelctions = (droppedData: any = []) => {
    let wrapper: any = document.getElementsByClassName(
      "tags-section_web-wrapper"
    );

    if (wrapper?.length > 0) {
      let clonedTags: any = JSON.parse(JSON.stringify(tagsRef.current));

      droppedData.forEach((rec: any) => {
        const tagIndex = clonedTags.findIndex(
          (tag: any) => tag.tId === rec.tId
        );

        if (tagIndex > -1) {
          clonedTags.splice(tagIndex, 1);
        }
      });
      dispatch(updateTagsList(clonedTags));
      dispatch(updateSelectedTags([]));
    }
  };

  useEffect(() => {
    window.addEventListener("message", (event: any) => {
      let data = event.data;
      data = typeof data == "string" ? JSON.parse(data) : data;
      data = data.hasOwnProperty("args") && data.args[0] ? data.args[0] : data;
      if (data) {
        switch (data.event || data.evt) {
          case "resp_ondrop":
            console.log('res_ondrop tags data', data);
            clearTagSelctions(data?.data);
            break;
        }
      }
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const getFormattedDate = (dt: any)=> {
    if (!dt) return '';
      const date = new Date(dt);
      const mm = String(date.getMonth() + 1).padStart(2, "0"); // Months are 0-based
      const dd = String(date.getDate()).padStart(2, "0");
      const yy = String(date.getFullYear()).slice(-2);

      return `${mm}/${dd}/${yy}`;
  }

  useEffect(() => {
    let isSpecialGrpIndex: any = (tags || []).findIndex((tag: any)=> {
      return tag.parent === '@$grouphead$@'
    })
    if (
      (plannerTagsGroupsRef.current?.length > 0 || isSpecialGrpIndex > -1) &&
      tags?.length > 0
    ) {
      let clonedGroups: any = JSON.parse(JSON.stringify(plannerTagsGroups?.length > 0 ? plannerTagsGroups : plannerTagsGroupsRef.current));
      let formattedGroups: any = [];
      clonedGroups.forEach((group: any) => {
        let grpTags: any = [];
        tags.forEach((tag: any) => {
          if (
            tag.parent &&
            tag.parent?.toLowerCase() === group.id?.toLowerCase()
          ) {
            grpTags.push(tag);
          }
        });
        group.tags = grpTags;
        group.formattedDate = getFormattedDate(group.start);
        group.assignee = group.assignedTo ? group.assignedTo : 'Unassigned';
        group.isGroup = true;
        if (grpTags?.length > 0) {
          formattedGroups.push(group);
        }
      });
      //Below part is to handle specal groups which we can expect in gantter/zone
      let specialGroups: any = [], specialGrupsWithTags: any = [];
      tags.forEach((tag: any)=> {
        if (tag.parent && tag.parent === '@$grouphead$@') {
          specialGroups.push({name: tag.nm, id: tag.tId, ...tag});
        }
      })
      specialGroups.forEach((group: any)=> {
        let grpTags: any = [];
        tags.forEach((tag: any) => {
          if (
            tag.parent &&
            tag.parent?.toLowerCase() === group.name?.toLowerCase()
          ) {
            grpTags.push(tag);
          }
        });
        group.tags = grpTags;
        group.formattedDate = getFormattedDate(group.start);
        group.assignee = group.assignedTo ? group.assignedTo : 'Unassigned';
        group.isGroup = true;
        if (grpTags?.length > 0) {
          specialGrupsWithTags.push(group);
        }
      })
      let allGroups: any = [...formattedGroups, ...specialGrupsWithTags];
      allGroups.forEach((grp: any)=> {
        grp.tags.sort((a: any, b: any) => {
          if (!a.sort) {
            return 0;
          }
          // Extract numbers from "aX" or "aX_zY" format
          const aMatches = a.sort.match(/\d+/g)?.map(Number) || [0];
          const bMatches = b.sort.match(/\d+/g)?.map(Number) || [0];
        
          // Compare the first number (aX)
          if (aMatches[0] !== bMatches[0]) {
            return aMatches[0] - bMatches[0];
          }
        
          // Compare the second number (zY) if present
          return (aMatches[1] || 0) - (bMatches[1] || 0);
        });
      })

      setGroupsData(allGroups);
    } else {
      setGroupsData([]);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [tags]);

  const updateClonedTags = (data: any) => {
    const tagData: any = data;
    const clonedTags = JSON.parse(JSON.stringify(tagsRef.current));
    const tagIndex = clonedTags.findIndex(
      (rec: any) => rec.tId === tagData.tId
    );
    if (tagIndex > -1) {
      clonedTags[tagIndex].cr = tagData.cr;
      clonedTags[tagIndex].dr = tagData.dr;
      clonedTags[tagIndex].un = tagData.un;
      clonedTags[tagIndex].start = tagData.start;
      dispatch(updateTagsList(clonedTags));
    }
  };

  /**
   * LIstening to custom event which is being fired from webcomponent tag
   * @param e
   * @author Srinivas Nadendla
   */
  const onTagAction = (e: any) => {
    canShowToolitpRef.current = false;
    if (e?.detail && e.detail.action === "inlineEdit") {
      const datePickerEle: any =
        e.target.parentNode?.parentNode?.childNodes?.[1];
      if (e.detail.subAction === "exit") {
        canShowToolitpRef.current = true;
        setTimeout(() => {
          const tagData = JSON.parse(e.target.getAttribute("data-json"));
          updateClonedTags(tagData);
        }, 500);
        datePickerEle.classList.add("brena-tags-date-picker_hide");
      }
      if (e.detail.subAction === "calendar") {
        if (datePickerEle) {
          datePickerEle.classList.remove("brena-tags-date-picker_hide");
        }
      }
    }
  };

  const onCaledarPickerChange = (newSelection: any, rec: any) => {
    const tagEleList: any = document.getElementsByClassName(
      "tags-section_item-container"
    );
    const tagsLen = tagEleList.length;
    for (let i = 0; i < tagsLen; i++) {
      if (tagEleList[i].getAttribute("data-id") === rec.tId) {
        const datePickerEle: any = tagEleList[i].childNodes?.[1];
        datePickerEle.classList.add("brena-tags-date-picker_hide");
        tagEleList[i].childNodes?.[0].childNodes[0].setStartDate(
          new Date(dayjs(newSelection).format('YYYY/MM/DD'))
        );
        setTimeout(() => {
          const tagData = JSON.parse(
            tagEleList[i].childNodes?.[0]?.childNodes?.[0]?.getAttribute(
              "data-json"
            )
          );
          updateClonedTags(tagData);
        }, 500);
        break;
      }
    }
  };

  useEffect(() => {
    document.addEventListener("tag-action", onTagAction);

    return () => {
      document.removeEventListener("tag-action", onTagAction);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const onExpandClick = (e: any) => {
    e.preventDefault();
    e.stopPropagation();
    const groupElement = e.target.closest(".tags-section_group");
    if (groupElement) {
      groupElement.classList.toggle("collapse");
    }
  };

  const onHeaderClick = (e: any, group: any)=> {
    e.preventDefault();
    e.stopPropagation();
    const groupElement = e.target.closest(".tags-section_group");
    const grodupHeaderEle = e.target.closest(".tags-section_group-header");
    const tagsElements = groupElement.querySelectorAll('.tags-section_web-wrapper');

    const selectedItems: any = [...selectedTagsRef.current];
    const clonedGroup: any = JSON.parse(JSON.stringify(group));

    if (grodupHeaderEle.className.includes('selected')) {
      (clonedGroup.tags || []).forEach((rec: any)=> {
      const index = selectedItems.findIndex(
        (item: any) => item.tId === rec.tId
      );
      if (index > -1) {
        selectedItems.splice(index, 1);
      }
    });
    //Remove group from selectedItems
    const grpIndex: any = selectedItems.findIndex((rec: any)=> {
      return rec.isGroup;
    });
    if (grpIndex > -1) {
      selectedItems.splice(grpIndex, 1);
    }

    // Remove selected class from all tags.
    Array.from(tagsElements).forEach((tagEl: any)=> {
      tagEl.children?.[0]?.classList.remove("selected")
    });

    } else {
      (clonedGroup.tags || []).forEach((rec: any)=> {
        const index = selectedItems.findIndex(
          (item: any) => item.tId === rec.tId
        );
        if (index === -1) {
          selectedItems.push({ ...rec });
        }
      })
      //Add group to selectedItems
      const onlyGroupRec: any = {...clonedGroup};
      delete onlyGroupRec.tags;
      selectedItems.push(onlyGroupRec);

      // Add selected class to all tags.
      Array.from(tagsElements).forEach((tagEl: any)=> {
        tagEl.children?.[0]?.classList.add("selected")
      })
    }
    selectedTagsRef.current = [...selectedItems];

    if (grodupHeaderEle) {
      grodupHeaderEle.classList.toggle("selected");
    }
    dispatch(updateSelectedTags(selectedTagsRef.current));
  };

  const onGroupBodyClick = (e: any)=> {
    e.preventDefault();
    e.stopPropagation();
    // Remove header selection from dom
    let headerElements: any = Array.from(document.getElementsByClassName('tags-section_group-header'));
    headerElements.forEach((ele: any)=> ele.classList.remove('selected'));

    //Remove selected class from all tags
    const tagsElements = document.querySelectorAll('.tags-section_web-wrapper');
    Array.from(tagsElements).forEach((tagEl: any)=> {
      tagEl.children?.[0]?.classList.remove("selected")
    });

    // Empty selectedTags from store
    selectedTagsRef.current = [];
    dispatch(updateSelectedTags([]));

  
  }

  return (
    <>
      {tags?.length > 0 && (
        <>
        <div className="tags-text">Showing {tags.length} tags.</div>
        <div className="tags-section">
           <div
            className={
              "tags-section_items " +
              (isPreviewBtnClicked ? "tags-section_items-blur" : "")
            }
          >
            <>
              {groupsData?.length > 0 &&
                groupsData.map((group: any) => {
                  return <div className="tags-section_group" key={group?.id}>
                      <div
                        className="tags-section_group-header"
                        style={{ backgroundColor: group.color }}
                        onClick={(e: any)=> onHeaderClick(e, group)}
                        draggable="true"
                        onDragStart={(event) => {
                          onTagDragStart(event, group);
                        }}
                        onDragEnd={(event) => {
                          onTagDropEnd(event, group);
                        }}
                      >
                        <div className="tags-section_group-header_child-wrapper">
                        <span
                          className="tags-section_group-header-name"
                          style={{
                            color: tinycolor(group.color).isLight()
                              ? "black"
                              : "white",
                          }}
                        >
                          {group.name}
                        </span>
                        <div className="tags-section_group-header_date-assignee" style={{
                            color: tinycolor(group.color).isLight()
                              ? "black"
                              : "white",
                          }}>
                          <div className="tags-section_group-header_date brena-advPlan-tagDates">{group.formattedDate}</div>
                          <div className="tags-section_group-header_assignee brena-advPlan-tagAssignTo">{group.assignee}</div>
                        </div>
                        </div>
                        <ExpandMoreIcon  onClick={(e: any) => onExpandClick(e)} className="tags-section_group-header-icon"></ExpandMoreIcon>
                      </div>
                      {group.tags?.length > 0 &&
                      <div className="tags-section_group-body" onClick={(e: any)=> onGroupBodyClick(e)}>
                        {group.tags.map((rec: any, index: any) => {
                          return (
                            <div
                              key={rec.nm + index}
                              className="tags-section_item-container"
                              data-id={rec.tId}
                            >
                              <div
                                className="tags-section_web-wrapper"
                                draggable="true"
                                onDragStart={(event) => {
                                  onTagDragStart(event, rec);
                                }}
                                onDragEnd={(event) => {
                                  onTagDropEnd(event, rec);
                                }}
                                dangerouslySetInnerHTML={{
                                  __html: getTagSection(rec),
                                }}
                                onMouseEnter={(e: any) => onMouseEnter(e)}
                                onMouseOut={(e: any) => onMouseOut()}
                                onClick={(e: any) => onTagItemClick(e, rec)}
                              ></div>
                              <div className="brena-tags-date-picker brena-tags-date-picker_hide">
                                <div className="brena-tags-date-picker_wrapper">
                                  <LocalizationProvider
                                    dateAdapter={AdapterDayjs}
                                  >
                                    <CalendarPicker
                                      date={dayjs(rec.start)}
                                      onChange={(newSelction: any) =>
                                        onCaledarPickerChange(newSelction, rec)
                                      }
                                    ></CalendarPicker>
                                  </LocalizationProvider>
                                </div>
                              </div>
                            </div>
                          );
                        })}
                      </div> }
                    </div>
                })}
              {groupsData?.length === 0 && (
                <>
                  {tags.map((rec: any, index: any) => {
                    return (
                      <div
                        key={rec.nm + index}
                        className="tags-section_item-container"
                        data-id={rec.tId}
                      >
                        <div
                          className="tags-section_web-wrapper"
                          draggable="true"
                          onDragStart={(event) => {
                            onTagDragStart(event, rec);
                          }}
                          onDragEnd={(event) => {
                            onTagDropEnd(event, rec);
                          }}
                          dangerouslySetInnerHTML={{
                            __html: getTagSection(rec),
                          }}
                          onMouseEnter={(e: any) => onMouseEnter(e)}
                          onMouseOut={(e: any) => onMouseOut()}
                          onClick={(e: any) => onTagItemClick(e, rec)}
                        ></div>
                        <div className="brena-tags-date-picker brena-tags-date-picker_hide">
                          <div className="brena-tags-date-picker_wrapper">
                            <LocalizationProvider dateAdapter={AdapterDayjs}>
                              <CalendarPicker
                                date={dayjs(rec.start)}
                                onChange={(newSelction: any) =>
                                  onCaledarPickerChange(newSelction, rec)
                                }
                              ></CalendarPicker>
                            </LocalizationProvider>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </>
              )}
            </>
          </div>
        </div>
        </>
      )}
      {tags.length === 0 && 
      <div className="tags-section">
          <div className="tags-section_no-tags-wrapper">
            <div className="tags-section_no-tags">
              <div className="tags-section_no-tags_icon">
                <CheckCircleIcon
                  color="primary"
                  fontSize="small"
                ></CheckCircleIcon>
              </div>
              <div className="tags-section_no-tags_img">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="74.865"
                  height="59.892"
                  viewBox="0 0 74.865 59.892"
                >
                  <path
                    id="Path_card-text"
                    data-name="Path / card-text"
                    d="M69.378,63.892H9.486A7.486,7.486,0,0,1,2,56.405V11.486A7.486,7.486,0,0,1,9.486,4H69.378a7.486,7.486,0,0,1,7.486,7.486V56.405a7.486,7.486,0,0,1-7.486,7.486M13.23,37.689v7.486H54.405V37.689H13.23m0-14.973V30.2H65.635V22.716Z"
                    transform="translate(-2 -4)"
                    opacity="0.3"
                  />
                </svg>
              </div>
              <div className="tags-section_no-tags_desc">
                {tagsLastClickedBtn === "remove-selected"
                  ? "All the Tags have been Removed"
                  : "All the suggested Tasks were added to the Schedule."}
              </div>
            </div>
          </div>
      </div>
      }
    </>
  );
});
export default TagsSection;
