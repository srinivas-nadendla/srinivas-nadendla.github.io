import React, { useRef, useEffect, useState } from "react";
import { useAppSelector } from "../../store/hooks";
import BudgetSuggestionsSection from "../BudgetSuggestionsSection/BudgetSuggestionsSection";

const FinanceSection = React.memo(() => {
  const financeSectionRef = useRef<any>();
  const financeData: any = useAppSelector(
    (state: any) => state.brena.financeData
  );
  const [scrollTop, setScrollTop] = useState<any>(0);

  useEffect(() => {
    if (financeSectionRef?.current) {
      const anchorTags = financeSectionRef.current.querySelectorAll("a");
      (anchorTags || []).forEach((tag: any) => {
        tag.setAttribute("target", "_new");
      });
    }
  }, [financeData?.html]);

  const onSuggestionPanelScroll = (e: any) => {
    setScrollTop(e.target.scrollTop);
  }

  return (
    <div className="finance-section">
      <BudgetSuggestionsSection
        scrollTop={scrollTop}
      ></BudgetSuggestionsSection>
      <div
        className="finance-section_body"
        ref={financeSectionRef}
        dangerouslySetInnerHTML={{ __html: financeData?.html }}
        onScroll={(e)=> onSuggestionPanelScroll(e)}
      ></div>
    </div>
  );
});
export default FinanceSection;
