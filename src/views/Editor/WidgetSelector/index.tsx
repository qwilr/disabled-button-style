import classNames from "classnames";
import Toolbar, { ToolbarButton } from "components/Toolbar";
import { Delete } from "kaleidoscope/src/global/icons";
import { AnimationDuration } from "kaleidoscope/src/styles/Animations";
import React, { createContext, CSSProperties, FC, useContext, useEffect, useRef, useState } from "react";
import { CSSTransition, TransitionGroup } from "react-transition-group";
import { ConfigContext } from "views/App/AppConfig";
import WidgetResizeHandle, { HandlePosition, WidgetResizeHandleProps } from "./WidgetResizeHandle";

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
  resizeHandleProps?: WidgetResizeHandleProps;
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
   * Widget selector must have a child to wrap around
   */
  children: any;
}

interface WidgetSelectorContextProps {
  isHovering?: boolean;
  isHoveringClickable?: boolean;
  isSelected?: boolean;
}

const WidgetSelectorContext = createContext({} as WidgetSelectorContextProps);

export function useWidgetSelectorContext() {
  return useContext(WidgetSelectorContext);
}

const WidgetSelector: FC<WidgetSelectorProps> = ({
  children,
  resizeHandles,
  innerSelect,
  offsetBorder,
  offsetValue = 0,
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
      if (!widgetSelectorRef.current.contains(event.target)) {
        setIsSelected(false);
      }
    };

    const handleEscKey = (event) => {
      if (event.key === "Esc") {
        setIsSelected(false);
      }
    };

    document.body.addEventListener("mousedown", handleOuterClick);
    document.body.addEventListener("mousedown", handleClick);
    document.addEventListener("keydown", handleEscKey);

    return () => {
      document.body.removeEventListener("mousedown", handleOuterClick);
      document.body.removeEventListener("mousedown", handleClick);
      document.removeEventListener("keydown", handleEscKey);
    };
  }, []);

  const handleClick = (event) => {
    if (
      (widgetSelectorContainerRef.current.contains(event.target) && innerSelect) ||
      event.target === widgetSelectorBorderTopRef.current ||
      event.target === widgetSelectorBorderBottomRef.current ||
      event.target === widgetSelectorBorderLeftRef.current ||
      event.target === widgetSelectorBorderRightRef.current
    ) {
      setIsSelected(true);
    } else if (widgetSelectorContainerRef.current.contains(event.target) && config.showToolbarOn === "Focus Within") {
      setIsSelected(true);
      event.stopPropagation();
      console.log("focusss");
    } else if (widgetSelectorContainerRef.current.contains(event.target) && !innerSelect) {
      setIsHovering(false);
      setIsSelected(false);
      event.stopPropagation();
    }
  };

  const handleMouseOver = (event) => {
    event.stopPropagation();

    if (
      /**
       * If hovering WidgetSelector border
       */
      event.target === widgetSelectorBorderTopRef.current ||
      event.target === widgetSelectorBorderBottomRef.current ||
      event.target === widgetSelectorBorderLeftRef.current ||
      event.target === widgetSelectorBorderRightRef.current
    ) {
      setIsHoveringClickable(true);
    } else if (widgetSelectorContainerRef.current.contains(event.target) && innerSelect) {
      /**
       * If hovering inside WidgetSelector
       */
      setIsHoveringClickable(true);
    } else if (widgetSelectorContainerRef.current.contains(event.target)) {
      /**
       * If hovering inside WidgetSelector
       */
      setIsHovering(true);
    }
  };

  const handleResizeHandleHover = (event) => {
    event.stopPropagation();

    if (config.showResizeHandlesOnHover) {
      setIsHoveringClickable(true);
    }
  };

  const handleMouseOut = () => {
    setIsHovering(false);
    setIsHoveringClickable(false);
    // console.log("outttt");
  };

  const handleKeyDown = (event) => {
    if (widgetSelectorContainerRef.current.contains(event.target) && config.showToolbarOn === "Focus Within") {
      setIsSelected(false);
      setIsHovering(false);
      console.log("key pressed");
    }
  };

  return (
    <WidgetSelectorContext.Provider
      value={{ isHovering: isHovering, isHoveringClickable: isHoveringClickable, isSelected: isSelected }}
    >
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
              style={{ cursor: "nwse-resize" }}
              onMouseOver={handleResizeHandleHover}
              onMouseOut={handleMouseOut}
            />
            <WidgetResizeHandle
              position={HandlePosition.BottomLeft}
              style={{ cursor: "nesw-resize" }}
              onMouseOver={handleResizeHandleHover}
              onMouseOut={handleMouseOut}
            />
            <WidgetResizeHandle
              position={HandlePosition.TopRight}
              style={{ cursor: "nesw-resize" }}
              onMouseOver={handleResizeHandleHover}
              onMouseOut={handleMouseOut}
            />
            <WidgetResizeHandle
              position={HandlePosition.BottomRight}
              style={{ cursor: "nwse-resize" }}
              onMouseOver={handleResizeHandleHover}
              onMouseOut={handleMouseOut}
            />
          </>
        )}
        {resizeHandles === "left-right" && (
          <>
            <WidgetResizeHandle
              position={HandlePosition.Left}
              style={{ cursor: "ew-resize", "--offsetValue": `${offsetValue}px` } as CSSProperties}
              onMouseOver={handleResizeHandleHover}
              onMouseOut={handleMouseOut}
            />
            <WidgetResizeHandle
              position={HandlePosition.Right}
              style={{ cursor: "ew-resize", "--offsetValue": `${offsetValue}px` } as CSSProperties}
              onMouseOver={handleResizeHandleHover}
              onMouseOut={handleMouseOut}
            />
          </>
        )}
        {resizeHandles === "top-bottom" && (
          <>
            <WidgetResizeHandle
              position={HandlePosition.Top}
              style={{ cursor: "ns-resize" }}
              onMouseOver={handleResizeHandleHover}
              onMouseOut={handleMouseOut}
            />
            <WidgetResizeHandle
              position={HandlePosition.Bottom}
              style={{ cursor: "ns-resize" }}
              onMouseOver={handleResizeHandleHover}
              onMouseOut={handleMouseOut}
            />
          </>
        )}

        {!innerSelect && (
          <>
            <div
              className={classNames(["widget-selector__target", "widget-selector__target-top"])}
              onMouseOver={handleMouseOver}
              onMouseOut={handleMouseOut}
              // onClick={handleClick}
              style={{ "--borderOffset": `-${offsetValue}px` } as CSSProperties}
              ref={widgetSelectorBorderTopRef}
            />
            <div
              className={classNames(["widget-selector__target", "widget-selector__target-bottom"])}
              onMouseOver={handleMouseOver}
              onMouseOut={handleMouseOut}
              // onClick={handleClick}
              style={{ "--borderOffset": `-${offsetValue}px` } as CSSProperties}
              ref={widgetSelectorBorderBottomRef}
            />
            <div
              className={classNames(["widget-selector__target", "widget-selector__target-right"])}
              onMouseOver={handleMouseOver}
              onMouseOut={handleMouseOut}
              // onClick={handleClick}
              style={{ "--borderOffset": `-${offsetValue}px` } as CSSProperties}
              ref={widgetSelectorBorderRightRef}
            />
            <div
              className={classNames(["widget-selector__target", "widget-selector__target-left"])}
              onMouseOver={handleMouseOver}
              onMouseOut={handleMouseOut}
              // onClick={handleClick}
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
          onKeyDown={handleKeyDown}
          // onClick={handleClick}
        >
          {/* {children} */}
          {children}
        </div>
      </div>
    </WidgetSelectorContext.Provider>
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
