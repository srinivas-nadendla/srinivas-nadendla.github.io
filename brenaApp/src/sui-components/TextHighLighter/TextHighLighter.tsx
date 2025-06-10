import React from "react";

const TextHighLighter = (props: any) => {
  const strSections = (props.str || '')?.split(new RegExp(`(${props.highlight})`, "gi"));

  return (
    <>
      {strSections.map((section: any, i: number) => {
        const highlightCls =
        section?.toLowerCase() === props.highlight?.toLowerCase()
            ? props.highlightedItemClass
            : "";
        return (
          <span key={i} className={highlightCls}>
            {section}
          </span>
        );
      })}
    </>
  );
};

export default TextHighLighter;
