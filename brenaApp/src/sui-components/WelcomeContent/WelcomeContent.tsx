import React, { useEffect, useState, useRef } from "react";
import { Button, Typography, Tooltip } from "@mui/material";
import "./WelcomeContent.scss";
import { useAppSelector, useAppDispatch } from "../../store/hooks";
import {
  setActiveChatWidget,
  updateLastTypedOrSelectedUserMessage,
  setChatMessagesData
} from "../../store/brenaSlice";
import { SUBTYPES_MAPPING_LIST_WITH_RESPONSE } from "../../utils/CommonUtil";
import { brenaWelcomeImg } from "../../utils/Base64Files";
import BrenaDeepSearch from "../../img/BrenaDeepSearch.png";

export const WelcomContent = React.memo((props: any) => {
  const [welcomeOptions, setWelcomeOptions] = useState<any>([]);
  const [userDetails, setUserDetails] = useState<any>({});
  const welcomeData = useAppSelector((state: any) => state.brena.welcomeData);
  const breadCrumbsData = useAppSelector(
    (state: any) => state.brena.breadCrumbsData || []
  );
  const dispatch = useAppDispatch();
  const parsedSuggestions = useRef<any>([]);

  useEffect(() => {
    if (welcomeData?.welcomeOptions) {
      setWelcomeOptions(welcomeData.welcomeOptions);
    }
    if (welcomeData?.userDetails) {
      setUserDetails(welcomeData.userDetails);
    }

    const suggestionData: any = sessionStorage.getItem("brenaSuggestionsData");
    let parsedData: any;

    try {
      parsedData =
        typeof suggestionData === "string"
          ? JSON.parse(suggestionData)?.data
          : [];
      parsedSuggestions.current = parsedData;
    } catch (e) {
      console.log("Failed to parse suggetsion data:", e);
    }
  }, [welcomeData]);

  const getSelectedItemsSuggetsions = () => {
    if (breadCrumbsData?.length > 0) {
      if (breadCrumbsData[0]?.item_ids?.length > 0) {
        let subTypeIdIndex = breadCrumbsData[0].item_ids?.findIndex(
          (item: any) => item === breadCrumbsData[0]?.subTypeId
        );
        if (subTypeIdIndex > -1 && breadCrumbsData[0]?.item_ids?.length === 1) {
          return [];
        }

        const suggestionData: any = sessionStorage.getItem(
          "brenaSuggestionsData"
        );
        let parsedData: any;

        try {
          parsedData =
            typeof suggestionData === "string"
              ? JSON.parse(suggestionData)?.data
              : [];
          parsedSuggestions.current = parsedData;
          const typeLower = breadCrumbsData[1]?.type?.toLowerCase();

          //If area is drive, then handling it in a diffrent way based on sub folders - if anyone of the file is selected then changing the suggetsion
          if (breadCrumbsData[0]?.type?.toLowerCase() === "drive") {
            if (breadCrumbsData?.length > 1 && breadCrumbsData[0]?.isFolderSelected) {
              const subAreaIndx: any = parsedData.findIndex(
                (rec: any) =>
                  rec.area?.toLowerCase() === "selecteditems" &&
                  rec.subarea?.toLowerCase() === "none"
              );
              if (subAreaIndx > -1) {
                return { suggestions: parsedData[subAreaIndx]?.suggestions, deepSearch:parsedData[subAreaIndx].deepSearch, rest: parsedData[subAreaIndx].rest };
              }
            }
            if (breadCrumbsData?.length <=2 && breadCrumbsData[0]?.isFileSelected) {
              const subAreaIndx: any = parsedData.findIndex(
                (rec: any) =>
                  rec.area?.toLowerCase() === "selecteditems" &&
                  rec.subarea?.toLowerCase() === "drive"
              );
              if (subAreaIndx > -1) {
                return { suggestions: parsedData[subAreaIndx]?.suggestions, deepSearch:parsedData[subAreaIndx]?.deepSearch, rest: parsedData[subAreaIndx].rest };
              }
            }
          }
          
          const subAreaType: any = SUBTYPES_MAPPING_LIST_WITH_RESPONSE[
            typeLower
          ]
            ? SUBTYPES_MAPPING_LIST_WITH_RESPONSE[typeLower]
            : typeLower;
          const subAreaIndx: any = parsedData.findIndex(
            (rec: any) =>
              rec.area?.toLowerCase() === "selecteditems" &&
              rec.subarea?.toLowerCase() === subAreaType?.toLowerCase()
          );
          if (subAreaIndx > -1) {
            return { suggestions: parsedData[subAreaIndx]?.suggestions, deepSearch: parsedData[subAreaIndx]?.deepSearch, rest: parsedData[subAreaIndx].rest };
          } else {
            const defaultIndx: any = parsedData.findIndex(
              (rec: any) => rec.area?.toLowerCase() === "selecteditems"
            );
            return { suggestions: parsedData[defaultIndx]?.suggestions, deepSearch:parsedData[defaultIndx]?.deepSearch, rest: parsedData[defaultIndx].rest  };
          }
        } catch (e) {
          console.log("Failed to parse suggetsion data:", e);
          return [];
        }
      }
    }
    return [];
  };

  useEffect(() => {
    if (breadCrumbsData?.length > 0) {
      let selectedItemsSuggetsions: any = getSelectedItemsSuggetsions();
        let options: any = [];
        if (selectedItemsSuggetsions?.suggestions?.length > 0) {
          selectedItemsSuggetsions.suggestions?.forEach((sugText: any) => {
            options.push({ text: sugText, id: sugText, isDeepSearch: selectedItemsSuggetsions.deepSearch?.includes(sugText), rest: selectedItemsSuggetsions.rest});
          });
          setWelcomeOptions(options);
        }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [breadCrumbsData]);

  const onWelcomeSuggestionClick = (e: any, rec: any)=> {
    dispatch(setActiveChatWidget("chat"));
    if (
      rec.rest &&
      (rec.rest.createAppByConversation?.length > 0 ||
        rec.rest.createAppByFile?.length > 0)
    ) {
      if (rec.rest.createAppByConversation.includes(rec.text)) {
        const preMessages: any = [
          {
            msg: rec.text,
            type: "user",
            reqId: "",
            isReply: false,
            createAppByConversation: true
          }
        ];
        if (parsedSuggestions.current?.length > 0) {
          const conversationTexts = parsedSuggestions.current.find((item: any)=> item.area.toLowerCase() === 'appstudio' && item.subarea === 'CreateByConversation')

          if (conversationTexts?.suggestions?.length > 0) {
            conversationTexts?.suggestions.forEach((sugTxt: any) => {
              preMessages.push({
                msg: sugTxt,
                type: "assistant",
                reqId: "",
                isReply: true
              });
            });
          }
        }

        dispatch(setChatMessagesData(preMessages));
      } else if (rec.rest.createAppByFile.includes(rec.text)) {
        const preMessages = [
          {
            msg: 'Upload a file: Select from the following options to upload a File',
            type: "assistant",
            reqId: "",
            isReply: true,
          },
          {
            msg: 'Select from Drive',
            type: "user",
            reqId: "",
            isReply: false,
            isButton: true,
            buttonId: 'selectFromDrive'
          },
          {
            msg: 'Select from Local',
            type: "user",
            reqId: "",
            isReply: false,
            isButton: true,
            buttonId: 'selectFromLocal'
          }
        ];
        dispatch(setChatMessagesData(preMessages));
      }

      return;
    }
    props.onWelcomOptionSelectionChange(rec, e);
    dispatch(updateLastTypedOrSelectedUserMessage(rec.text));
  }

  return (
    <div className="welcome-content">
      <div className="welcome-content_img-welcome">
        <img
        alt="welcome"
        draggable={false}
        src={brenaWelcomeImg}
        className="welcome_img"
          />
      </div>
      <Typography>
        <span style={{ fontWeight: "bold" }}>
          Hi {userDetails?.firstName},{" "}
        </span>
        {userDetails?.role && userDetails?.company && (
          <>
            <span>
              {" "}
              you are the {userDetails?.role} from {userDetails?.company}.
            </span>{" "}
            <br />
          </>
        )}
        How can I assist you today?
      </Typography>
      <div className="welcome-content_options">
        {welcomeOptions.map((rec: any) => {
          return (
            <Button
              className={"welcome-content_btn " + (rec.isDeepSearch ? ' welcome-content_deep-search-item ': '')}
              variant="outlined"
              key={rec.id}
              onClick={(e: any) => onWelcomeSuggestionClick(e, rec)}
            >
              {rec?.text}
              {rec.isDeepSearch && <Tooltip arrow  id="brenaDsTooltip" title="Brena Deep Search">
                <img src={BrenaDeepSearch} className="welcome-content_deep-search-img" alt="brena ds"/>
                </Tooltip>}
            </Button>
          );
        })}{" "}
      </div>
      <div></div>
      <br />
    </div>
  );
});
export default WelcomContent;
