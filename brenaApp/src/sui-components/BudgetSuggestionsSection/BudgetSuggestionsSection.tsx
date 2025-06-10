import React, { useEffect, useState } from "react";
import { useAppSelector } from "../../store/hooks";
import Assumptions from "./Assumptions/Assumptions";
import "./BudgetSuggestionsSection.scss";
import IconButton from "@mui/material/IconButton";
import { useDetectDevice } from "../../hooks/useDetectDevice";
import Influencers from "./Influencers/Influencers";

const BudgetSuggestionsSection = (props: any) => {
  const budgetSuggestionData: any = useAppSelector(
    (state: any) => state.brena.budgetSuggestionData
  );
  const [collapseHeader, setCollapseHeader] = useState<boolean>(false);
  const [pinnedHeader, setPinnedHeader] = useState<boolean>(false);
  const device = useDetectDevice();

  useEffect(() => {
    if (collapseHeader) {
      setPinnedHeader(false);
    }
  }, [collapseHeader]);

  useEffect(() => {
    if (!pinnedHeader) {
      setCollapseHeader(props.scrollTop > 1 ? true : false);
    }
    
  }, [props.scrollTop]);

  return (
    <div className={"budget-suggestions-section " + device}>
      <div className="budget-suggestions-section_header">
        <Assumptions
          data={budgetSuggestionData.assumptions}
          collapseHeader={collapseHeader}
        ></Assumptions>
        {!collapseHeader && (
          <Influencers data={budgetSuggestionData.influencers}></Influencers>
        )}
      </div>
      <div className="budget-suggestions-section_tools">
        
        {!pinnedHeader && <IconButton
          className="budget-suggestions-section_tools-arrow"
          onClick={() => setCollapseHeader(!collapseHeader)}
        >
          {!collapseHeader && (
            <svg
              focusable="false"
              preserveAspectRatio="xMidYMid meet"
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 512 512"
              role="presentation"
              aria-hidden="true"
            >
              <g role="presentation">
                <path d="M96 326q0-10 7-17l135-141q6-8 18-8 11 0 19 8l134 141q7 7 7 17 0 11-7.5 18.5T390 352q-10 0-18-8L256 223 140 344q-8 8-18 8-11 0-18.5-7.5T96 326z"></path>
              </g>
            </svg>
          )}
          {collapseHeader && (
            <svg
              focusable="false"
              preserveAspectRatio="xMidYMid meet"
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 512 512"
              role="presentation"
              aria-hidden="true"
            >
              <g role="presentation">
                <path d="M96 186q0-11 7.5-18.5T122 160q10 0 18 8l116 121 116-121q8-8 18-8 11 0 18.5 7.5T416 186q0 10-7 17L275 344q-8 8-19 8-12 0-18-8L103 203q-7-7-7-17z"></path>
              </g>
            </svg>
          )}
        </IconButton>
        }
        {!collapseHeader && (
          <IconButton
            className={
              "budget-suggestions-section_tools-pin " +
              (pinnedHeader ? "is-pinned" : "")
            }
            onClick={() => setPinnedHeader(!pinnedHeader)}
          >
            <svg
              focusable="false"
              preserveAspectRatio="xMidYMid meet"
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 512 512"
              role="presentation"
              aria-hidden="true"
            >
              <g role="presentation">
                <path d="M473 168q7 9 7 18 0 11-7.5 18.5T454 212h-32l-52 52-41 165q-5 19-25 19-10 0-18-8l-89-89L76 472q-8 8-18 8-11 0-18.5-7.5T32 454q0-10 8-18l121-121-89-89q-8-8-8-18 0-20 19-25l165-41 52-52V58q0-11 7.5-18.5T326 32q9 0 18 7zm-76-3l-50-50-68 68q-6 6-11 7l-128 32 150 150 32-128q1-5 7-11z"></path>
              </g>
            </svg>
          </IconButton>
        )}
      </div>
    </div>
  );
};
export default BudgetSuggestionsSection;
