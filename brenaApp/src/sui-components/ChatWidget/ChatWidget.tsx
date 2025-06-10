import React, { useState, useEffect } from "react";
import { useAppSelector } from "../../store/hooks";
import WelcomContent from "../WelcomeContent/WelcomeContent";
import ChatSection from "../ChatSection/ChatSection";
import ChatHistory from "../ChatHistory/ChatHistory";
import { ErrorBoundary } from "react-error-boundary";
import { SECTIONS_WITHOUT_SUGGESTIONS } from "../../utils/CommonUtil";

export interface ChatWidgetDlgProps {
  onClose?: any;
  collapseWdgt?: any;
  chatData?: any;
  className?: string;
  scrollBodyRef?: any;
}

const SUIChatWidget = React.memo((props: ChatWidgetDlgProps) => {
  const { collapseWdgt } = props;
  const [selectedOption, setSelectionOption] = useState<any>(null);
  const activeChatWidget = useAppSelector(
    (state: any) => state.brena.activeChatWidget
  );
  const isSmartItemClicked = useAppSelector(
    (state: any) => state.brena.smartItemClicked
  );


  useEffect(() => {
    if (isSmartItemClicked) collapseWdgt();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isSmartItemClicked]);


  const onWelcomOptionSelectionChange = (val: any, e: any) => {
    setSelectionOption(val);
  };

  return (
    <>
      {activeChatWidget === "welcome" && (
        <ErrorBoundary fallback={<div>Something went wrong in welcome</div>}>
          <WelcomContent
            onWelcomOptionSelectionChange={onWelcomOptionSelectionChange}
          ></WelcomContent>
        </ErrorBoundary>
      )}
      {!SECTIONS_WITHOUT_SUGGESTIONS.includes(activeChatWidget) && (
        <ErrorBoundary fallback={<div>Something went wrong in chat</div>}>
          <ChatSection selectedOption={selectedOption}></ChatSection>
        </ErrorBoundary>
      )}
      {activeChatWidget === "chat_history" && (
        <ErrorBoundary fallback={<div>Something went wrong in history</div>}>
          <ChatHistory></ChatHistory>
        </ErrorBoundary>
      )}
    </>
  );
});

export default SUIChatWidget;
