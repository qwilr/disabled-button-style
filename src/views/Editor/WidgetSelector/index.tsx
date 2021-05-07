import classNames from "classnames";
import React, { FC, useRef, useState } from "react";

export enum WidgetType {
  Image = "image",
  Table = "table",
  TwoColumns = "two-columns",
  Accordion = "accordion",
}

interface WidgetSelectorProps {
  /**
   * Define the widget type to surface widget-specific controls
   */
  type?: WidgetType;
  /**
   * If true, then show resizing handles
   */
  resizeable?: boolean;
  /**
   * If true, then set the whole inner area to be clickable
   */
  innerClickable?: boolean;
  /**
   * If true, then offset the selection border from the edge of the child
   */
  offsetBorder?: boolean;
}

const WidgetSelector: FC<WidgetSelectorProps> = (
  { children },
  { type, resizeable = null, innerClickable = true, offsetBorder }: WidgetSelectorProps,
) => {
  const [isHovering, setIsHovering] = useState(false);
  const [isSelected, setIsSelected] = useState(false);
  const widgetSelectorRef = useRef(null);

  const handleOuterClick = (event) => {
    if (!widgetSelectorRef.current.contains(event.target)) {
      setIsSelected(false);
      ``;
      // console.log("outside");
    }
  };

  const handleClick = () => {
    setIsSelected(true);
    console.log("selected");
    console.log(innerClickable);
  };

  const handleMouseOver = () => {
    setIsHovering(true);
    // console.log("hovering");
  };

  const handleMouseOut = () => {
    setIsHovering(false);
    // console.log("stopped hovering");
  };

  document.body.addEventListener("click", handleOuterClick);

  return (
    <div className="widget-selector" ref={widgetSelectorRef}>
      {/* <WidgetSelectorTarget
        position="top"
        onMouseOver={handleMouseOver}
        onMouseOut={handleMouseOut}
        onClick={handleClick}
      /> */}
      <div
        className={classNames(["widget-selector__target", "widget-selector__target-top"])}
        onMouseOver={handleMouseOver}
        onMouseOut={handleMouseOut}
        onClick={handleClick}
      />
      <div
        className={classNames(["widget-selector__target", "widget-selector__target-bottom"])}
        onMouseOver={handleMouseOver}
        onMouseOut={handleMouseOut}
        onClick={handleClick}
      />
      <div
        className={classNames(["widget-selector__target", "widget-selector__target-right"])}
        onMouseOver={handleMouseOver}
        onMouseOut={handleMouseOut}
        onClick={handleClick}
      />
      <div
        className={classNames(["widget-selector__target", "widget-selector__target-left"])}
        onMouseOver={handleMouseOver}
        onMouseOut={handleMouseOut}
        onClick={handleClick}
      />
      <div
        className={classNames("widget-selector__border", [
          {
            "widget-selector__border--hover": isHovering,
            "widget-selector__border--selected": isSelected,
          },
          { "widget-selector__border-offset": offsetBorder },
        ])}
        onMouseOver={handleMouseOver}
        onMouseOut={handleMouseOut}
        onClick={innerClickable ? handleClick : null}
      >
        {children}
      </div>
    </div>
  );
};

// Attempt to set up a sub component for the WidgetSelectorTarget, but couldn't figure out how to abstract the isSelected to be a global state

// interface WidgetSelectorTargetProps {
//   position: string;
//   onMouseOver?: () => void;
//   onMouseOut?: () => void;
//   onClick?: () => void;
// }

// const WidgetSelectorTarget: FC<WidgetSelectorTargetProps> = (props) => {
//   return (
//     <>
//       <div className={classNames(["widget-selector__target", `widget-selector__target-${props.position}`])}></div>
//     </>
//   );
// };

export default WidgetSelector;
