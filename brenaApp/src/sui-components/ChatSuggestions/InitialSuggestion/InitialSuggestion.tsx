import React from "react";
import "./InitialSuggestion.scss";
import chartAnimation from '../../../img/chart-animation.gif';
import { useAppSelector } from "../../../store/hooks";
import { brenaSuggestionsImg } from "../../../utils/Base64Files";

const SUIInitialSuggestion = React.memo(() => {
   const activeChatWidget: any = useAppSelector(
      (state: any) => state.brena.activeChatWidget
    );
  return (
    <div className="initial-suggestion-cont">
      {activeChatWidget === 'report' ? <img src={chartAnimation} alt='Brena Chart Animation'/> :
     <> <img alt="Brena Suggestions" draggable={false} className="initial-imgs" src={brenaSuggestionsImg}/>
      <div className="text-cls">Brena is generating suggestions....</div>
  </>}
    </div>
  );
});
export default SUIInitialSuggestion;
