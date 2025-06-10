import React from "react";
import "./ChatBot.scss";
import SUIChatDailog from "../sui-components/ChatDailog/ChatDailog";

declare global {
  namespace JSX {
    interface IntrinsicElements {
      "sa-adv-tag": React.DetailedHTMLProps<
        React.HTMLAttributes<HTMLElement>,
        HTMLElement
      >;
    }
  }
  var saWebComp: any;
  var getIQMobileApp: any;
  var CommonUtility: any;
  var cordova: any;
  var IQMobile: any;
  var GBL: any;
  var IQSketchLiteManager: any;
}

export const SUIChatBot = () => {
  const [open, setOpen] = React.useState(true);

  const chatDlgClose = () => {
    setOpen(false);
    window.postMessage({"event":"brena-close"},"*");
  };

  

  return (
    <div>
      <SUIChatDailog open={open} onClose={chatDlgClose} />
    </div>
  );
};
export default SUIChatBot;
