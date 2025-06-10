import React, { useRef, useEffect } from "react";
import { useAppSelector } from "../../store/hooks";
import { useDetectDevice } from "../../hooks/useDetectDevice";

const HelpSection = React.memo((props: any) => {
  const helpSectionRef = useRef<any>();
  const helpData: any = useAppSelector((state: any) => state.brena.helpData);
  const device: any = useDetectDevice();

  useEffect(() => {
    if (helpSectionRef?.current && device === "brena-desktop") {
      let anchorTags = helpSectionRef.current.querySelectorAll("a");
      anchorTags.forEach((tag: any) => {
        tag.removeAttribute("href");
        tag.setAttribute("href", "javascript:void(0)");
        tag.addEventListener("click", function (event: any) {
          event.preventDefault();
          postToHelpWidget(event);
        });
      });
    }
    if (device !== "brena-desktop") {
      let anchorTags = helpSectionRef.current.querySelectorAll("a");
      (anchorTags || []).forEach((tag: any) => {
        tag.removeAttribute("href");
        tag.setAttribute("href", "javascript:void(0)");
        tag.addEventListener("touchend", function (event: any) {
          event.preventDefault();
          postToHelpWidget(event);
        });
      });
    }
  }, [helpData?.html, device]);

  const postToHelpWidget = (event: any) => {
    let articleId: any;
    const parent = event.target.parentElement;
    const span = parent.querySelector(".brena-text-hidden-cls");
    if (span) {
      const spanText = span.textContent;
      articleId = spanText.replace(/[()]/g, "");
    }
    if (!articleId) return;
    window.postMessage(
      {
        event: "brena-help-widget",
        data: {
          articleid: articleId,
        },
      },
      "*"
    );
  };

  return (
    <div
      className="help-section"
      ref={helpSectionRef}
      dangerouslySetInnerHTML={{ __html: helpData?.html }}
    ></div>
  );
});
export default HelpSection;
