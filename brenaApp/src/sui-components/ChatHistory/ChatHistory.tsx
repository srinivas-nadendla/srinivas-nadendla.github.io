import React, { useDeferredValue, useEffect, useState } from "react";
import { TextField } from "@mui/material";

import InputAdornment from "@mui/material/InputAdornment";
import SearchIcon from "@mui/icons-material/Search";
import IconButton from "@mui/material/IconButton";
import { getFormattedChatHistory } from "../../utils/CommonUtil";
import "./ChatHistory.scss";
import TextHighLighter from "../TextHighLighter/TextHighLighter";
import { useAppSelector } from "../../store/hooks";

const ChatHistory = (props: any) => {
  
  const chatHistoryData = useAppSelector(
    (state: any) => state.brena.chatHistoryData
  );
  const [chatHistory, setChatHistory] = useState<any>([]);
  const [chatHistoryCopy, setChatHistoryCopy] = useState<any>([]);
  const [searchTxt, setSearchTxt] = useState<any>("");
  const searchTextDefferedVal = useDeferredValue(searchTxt);
  const [chatHistoryDataUpdated, setChatHistoryDataUpdated] = useState<any>();

  useEffect(() => {
    if (chatHistoryData?.length > 0) {
      const formattedChatHistory = getFormattedChatHistory(chatHistoryData);
      setChatHistory(formattedChatHistory);
      setChatHistoryCopy(formattedChatHistory);
      setChatHistoryDataUpdated(Date.now());
    }
      
  }, [chatHistoryData]);

  /**
   * Triggers when user start typing text on the search box
   * Filters out the grouped data based on searchText
   * @param e event
   * @author Srinivas Nadendla
   */
  const onSearchChange = (e: any) => {
    const txt = e?.target?.value?.toLowerCase();
    setSearchTxt(txt)
  };

  useEffect(() => {
    const chatHistoryClone = [...chatHistoryCopy];
    if (searchTextDefferedVal?.length > 0) {
      const filteredList: any = [];
      ([...chatHistoryClone]).forEach((item: any) => {
        const filteredRecords = item?.records?.filter((rec: any) => {
          return rec?.name?.toLowerCase()?.includes(searchTextDefferedVal);
        });
        const obj = { ...item };
        obj.records = filteredRecords;
        if (filteredRecords?.length) filteredList.push(obj);
      });
      setChatHistory(filteredList);
    } else {
      setChatHistory(chatHistoryClone);
    }
    // eslint-disable-next-line
  }, [searchTextDefferedVal, chatHistoryDataUpdated]);

  /**
   * On chat history thread click firing an event to API
   * @param item 
   */
  const onChatHistoryThreadClick = (item: any) => {
    if (saWebComp?.brenaApi?.onUIEvent) {
      saWebComp?.brenaApi?.onUIEvent('thread_click', item) ;
    }
  };

  return (
    <div className="chat-history">
      <div className="chat-history_search">
        <TextField
          className="chat-history_search-text-box"
          placeholder="Search"
          onChange={(e: any)=> onSearchChange(e) }
          InputProps={{
            endAdornment: (
              <InputAdornment position="end">
                <IconButton className="chat-history_search-btn" edge="end">
                  <SearchIcon></SearchIcon>
                </IconButton>
              </InputAdornment>
            ),
          }}
        ></TextField>
      </div>
      <div className="chat-history_group">
        {chatHistoryDataUpdated && chatHistory?.length > 0 && chatHistory.map((rec: any, index: any) => {
          return (
            <div className="chat-history_group-section" key={index}>
              <div className="chat-history_group-name"><span>{rec.groupName}</span></div>
              {(rec.records || []).map((item: any) => {
                return (
                  <div className="chat-history_group-item-wrapper">
                    <div className="chat-history_group-item" onClick={(e: any)=> onChatHistoryThreadClick(item) }>
                      {searchTextDefferedVal?.length > 0 ? <TextHighLighter
                        str={item.name || ''}
                        highlight={searchTextDefferedVal}
                        highlightedItemClass="chat-history_highlight"
                      /> : item.name}
                    </div>
                  </div>
                );
              })}
            </div>
          );
        })}
      </div>
    </div>
  );
};
export default ChatHistory;
