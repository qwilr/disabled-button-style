import classNames from "classnames";
import Toolbar, { ToolbarButton } from "components/Toolbar";
import { Delete } from "kaleidoscope/src/global/icons";
import { AnimationDuration } from "kaleidoscope/src/styles/Animations";
import React, { FC, useRef, useState } from "react";
import { CSSTransition } from "react-transition-group";
import WidgetResizeHandle, { HandlePosition } from "./WidgetResizeHandle";

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
  /**
   * Create a unique identifier for the component instance
   */
  id?: string;
  /**
   * Widget selector must have a child to wrap around
   */
  children: any;
  /** Toolbar options */
  toolbarOptions?: any;
}

const WidgetSelector: FC<WidgetSelectorProps> = ({
  children,
  type,
  resizeable,
  innerClickable,
  offsetBorder,
}: WidgetSelectorProps) => {
  const [isHovering, setIsHovering] = useState(false);
  const [isHoveringClickable, setIsHoveringClickable] = useState(false);
  const [isSelected, setIsSelected] = useState(false);

  //Element Refs
  const widgetSelectorRef = useRef(null);
  const widgetSelectorBorderTopRef = useRef(null);
  const widgetSelectorBorderBottomRef = useRef(null);
  const widgetSelectorBorderLeftRef = useRef(null);
  const widgetSelectorBorderRightRef = useRef(null);
  const widgetSelectorContainerRef = useRef(null);

  const handleOuterClick = (event) => {
    if (!widgetSelectorRef.current.contains(event.target)) {
      setIsSelected(false);
      ``;
      // console.log("outside");
    }
  };

  const handleClick = (event) => {
    if (widgetSelectorContainerRef.current.contains(event.target) && innerClickable) {
      setIsSelected(true);
    } else if (
      event.target === widgetSelectorBorderTopRef.current ||
      event.target === widgetSelectorBorderBottomRef.current ||
      event.target === widgetSelectorBorderLeftRef.current ||
      event.target === widgetSelectorBorderRightRef.current
    ) {
      setIsSelected(true);
    } else if (!innerClickable) {
      setIsHovering(false);
      setIsSelected(false);
      console.log(isHovering);
    }
  };

  const handleMouseOver = (event) => {
    // console.log("hovering");
    if (
      event.target === widgetSelectorBorderTopRef.current ||
      event.target === widgetSelectorBorderBottomRef.current ||
      event.target === widgetSelectorBorderLeftRef.current ||
      event.target === widgetSelectorBorderRightRef.current
    ) {
      console.log("hovering border");
      setIsHoveringClickable(true);
    } else if (widgetSelectorContainerRef.current.contains(event.target)) {
      setIsHovering(true);
      console.log("hi");
      event.stopPropagation();
    }
  };

  const handleMouseOut = () => {
    setIsHovering(false);
    setIsHoveringClickable(false);
    // console.log("stopped hovering");
  };

  document.body.addEventListener("click", handleOuterClick);

  return (
    <>
      <Toolbar visible={isSelected} element={widgetSelectorRef.current}>
        {/* {props.toolbarOptions} */}
        <ToolbarButton icon={<Delete />} />
      </Toolbar>
      <div className="widget-selector" ref={widgetSelectorRef}>
        {/* <WidgetSelectorTarget
        position="top"
        onMouseOver={handleMouseOver}
        onMouseOut={handleMouseOut}
        onClick={handleClick}
      /> */}

        {resizeable && (
          // Not sure why this CSSTransition isn't triggering... "className" is being referenced in WidgetResizeHandle.tsx as a classNames item
          <CSSTransition
            timeout={AnimationDuration.Short}
            classNames="widget-selector__resize-handles-"
            in={isHovering || isSelected}
          >
            <div className="widget-selector__resize-handles-wrapper">
              <WidgetResizeHandle position={HandlePosition.Left} className="widget-selector__resize-handles" />
              <WidgetResizeHandle position={HandlePosition.Right} className="widget-selector__resize-handles" />
            </div>
          </CSSTransition>
        )}
        {!innerClickable && (
          <>
            <div
              className={classNames(["widget-selector__target", "widget-selector__target-top"])}
              onMouseOver={handleMouseOver}
              onMouseOut={handleMouseOut}
              onClick={handleClick}
              ref={widgetSelectorBorderTopRef}
            />
            <div
              className={classNames(["widget-selector__target", "widget-selector__target-bottom"])}
              onMouseOver={handleMouseOver}
              onMouseOut={handleMouseOut}
              onClick={handleClick}
              ref={widgetSelectorBorderBottomRef}
            />
            <div
              className={classNames(["widget-selector__target", "widget-selector__target-right"])}
              onMouseOver={handleMouseOver}
              onMouseOut={handleMouseOut}
              onClick={handleClick}
              ref={widgetSelectorBorderRightRef}
            />
            <div
              className={classNames(["widget-selector__target", "widget-selector__target-left"])}
              onMouseOver={handleMouseOver}
              onMouseOut={handleMouseOut}
              onClick={handleClick}
              ref={widgetSelectorBorderLeftRef}
            />
          </>
        )}
        <div
          className={classNames("widget-selector__container", [
            {
              "widget-selector__container--hover": isHovering,
              "widget-selector__container--hover-clickable": isHoveringClickable || (innerClickable && isHovering),
              "widget-selector__container--selected": isSelected,
            },
            { "widget-selector__container-offset": offsetBorder },
          ])}
          ref={widgetSelectorContainerRef}
          onMouseOver={handleMouseOver}
          onMouseOut={handleMouseOut}
          onClick={handleClick}
        >
          {children}
        </div>
      </div>
    </>
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
