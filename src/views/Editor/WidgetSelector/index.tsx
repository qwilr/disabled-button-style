import classNames from "classnames";
import Toolbar, { ToolbarButton } from "components/Toolbar";
import { Delete } from "kaleidoscope/src/global/icons";
import { AnimationDuration } from "kaleidoscope/src/styles/Animations";
import React, { CSSProperties, FC, useContext, useEffect, useRef, useState } from "react";
import { CSSTransition, TransitionGroup } from "react-transition-group";
import { ConfigContext } from "views/App/AppConfig";
import WidgetResizeHandle, { HandlePosition } from "./WidgetResizeHandle";

export enum WidgetType {
  Image = "image",
  Table = "table",
  TwoColumns = "two-columns",
  Accordion = "accordion",
}

export enum ResizeHandleType {
  Corners = "corners",
  LeftRight = "left-right",
  TopBottom = "top-bottom",
}

interface WidgetSelectorProps {
  /**
   * Choose the type of resizing handle(s)
   */
  resizeHandles?: ResizeHandleType;
  /**
   * If true, then set the whole inner area to be clickable
   */
  innerSelect?: boolean;
  /**
   * If true, then offset the selection border from the edge of the child
   */
  offsetBorder?: boolean;
  offsetValue?: number;
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
  resizeHandles,
  innerSelect,
  offsetBorder,
  offsetValue,
}) => {
  const config = useContext(ConfigContext);

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

  /**
   * This is essentially using componentDidMount and componentWillUnmount to add and remove eventListeners
   */
  useEffect(() => {
    const handleOuterClick = (event) => {
      if (!widgetSelectorRef.current.contains(event.target) || event.key === "Esc") {
        setIsSelected(false);
        // console.log("outside");
      }
    };

    document.body.addEventListener("mousedown", handleOuterClick);
    document.addEventListener("keydown", handleOuterClick);

    return () => {
      document.body.removeEventListener("mousedown", handleOuterClick);
      document.removeEventListener("keydown", handleOuterClick);
    };
  }, []);

  const handleClick = (event) => {
    if (widgetSelectorContainerRef.current.contains(event.target) && innerSelect) {
      setIsSelected(true);
    } else if (
      event.target === widgetSelectorBorderTopRef.current ||
      event.target === widgetSelectorBorderBottomRef.current ||
      event.target === widgetSelectorBorderLeftRef.current ||
      event.target === widgetSelectorBorderRightRef.current
    ) {
      setIsSelected(true);
    } else if (!innerSelect) {
      setIsHovering(false);
      setIsSelected(false);
      event.stopPropagation();
    }
  };

  const handleMouseOver = (event) => {
    if (
      /**
       * If hovering WidgetSelector border
       */
      event.target === widgetSelectorBorderTopRef.current ||
      event.target === widgetSelectorBorderBottomRef.current ||
      event.target === widgetSelectorBorderLeftRef.current ||
      event.target === widgetSelectorBorderRightRef.current
    ) {
      console.log("hovering border", offsetValue);
      setIsHoveringClickable(true);
      event.stopPropagation();
    } else if (widgetSelectorContainerRef.current.contains(event.target)) {
      /**
       * If hovering inside WidgetSelector
       */
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

        {resizeHandles === "corners" && (
          <>
            <WidgetResizeHandle
              position={HandlePosition.TopLeft}
              trigger={isSelected}
              style={{ cursor: "nwse-resize" }}
            />
            <WidgetResizeHandle
              position={HandlePosition.BottomLeft}
              trigger={isSelected}
              style={{ cursor: "nesw-resize" }}
            />
            <WidgetResizeHandle
              position={HandlePosition.TopRight}
              trigger={isSelected}
              style={{ cursor: "nesw-resize" }}
            />
            <WidgetResizeHandle
              position={HandlePosition.BottomRight}
              trigger={isSelected}
              style={{ cursor: "nwse-resize" }}
            />
          </>
        )}
        {resizeHandles === "left-right" && (
          <>
            <WidgetResizeHandle position={HandlePosition.Left} trigger={isSelected} style={{ cursor: "ew-resize" }} />
            <WidgetResizeHandle position={HandlePosition.Right} trigger={isSelected} style={{ cursor: "ew-resize" }} />
          </>
        )}
        {resizeHandles === "top-bottom" && (
          <>
            <WidgetResizeHandle position={HandlePosition.Top} trigger={isSelected} style={{ cursor: "ns-resize" }} />
            <WidgetResizeHandle position={HandlePosition.Bottom} trigger={isSelected} style={{ cursor: "ns-resize" }} />
          </>
        )}

        {!innerSelect && (
          <>
            <div
              className={classNames(["widget-selector__target", "widget-selector__target-top"])}
              onMouseOver={handleMouseOver}
              onMouseOut={handleMouseOut}
              onClick={handleClick}
              style={{ "--borderOffset": `-${offsetValue}px` } as CSSProperties}
              ref={widgetSelectorBorderTopRef}
            />
            <div
              className={classNames(["widget-selector__target", "widget-selector__target-bottom"])}
              onMouseOver={handleMouseOver}
              onMouseOut={handleMouseOut}
              onClick={handleClick}
              style={{ "--borderOffset": `-${offsetValue}px` } as CSSProperties}
              ref={widgetSelectorBorderBottomRef}
            />
            <div
              className={classNames(["widget-selector__target", "widget-selector__target-right"])}
              onMouseOver={handleMouseOver}
              onMouseOut={handleMouseOut}
              onClick={handleClick}
              style={{ "--borderOffset": `-${offsetValue}px` } as CSSProperties}
              ref={widgetSelectorBorderRightRef}
            />
            <div
              className={classNames(["widget-selector__target", "widget-selector__target-left"])}
              onMouseOver={handleMouseOver}
              onMouseOut={handleMouseOut}
              onClick={handleClick}
              style={{ "--borderOffset": `-${offsetValue}px` } as CSSProperties}
              ref={widgetSelectorBorderLeftRef}
            />
          </>
        )}
        <div
          className={classNames("widget-selector__container", [
            {
              "widget-selector__container--hover": isHovering,
              "widget-selector__container--hover-clickable": isHoveringClickable || (innerSelect && isHovering),
              "widget-selector__container--selected": isSelected,
            },
            { "widget-selector__container-offset": offsetBorder },
          ])}
          ref={widgetSelectorContainerRef}
          style={
            { cursor: innerSelect ? "pointer" : "inherit", "--borderOffset": `-${offsetValue}px` } as CSSProperties
          }
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
