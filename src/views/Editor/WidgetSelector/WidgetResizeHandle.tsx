import classNames from "classnames";
import { AnimationDuration } from "kaleidoscope/src/styles/Animations";
import React, { CSSProperties, FC, useContext } from "react";
import { CSSTransition } from "react-transition-group";
import { ConfigContext } from "views/App/AppConfig";
import { useWidgetSelectorContext } from "./index";

export enum HandlePosition {
  Top = "top",
  Bottom = "bottom",
  Left = "left",
  Right = "right",
  TopLeft = "top-left",
  TopRight = "top-right",
  BottomLeft = "bottom-left",
  BottomRight = "bottom-right",
}

export interface WidgetResizeHandleProps {
  position?: HandlePosition;
  trigger?: boolean;
  offsetValue?: number;
  style?: CSSProperties;
  onMouseOver?: (event: any) => void;
  onMouseOut?: (event: any) => void;
}

const WidgetResizeHandle: FC<WidgetResizeHandleProps> = ({
  position,
  offsetValue = 0,
  style,
  onMouseOver,
  onMouseOut,
}) => {
  const config = useContext(ConfigContext);

  const { isSelected, isHovering, isHoveringClickable } = useWidgetSelectorContext();

  return (
    <CSSTransition
      timeout={AnimationDuration.Short}
      classNames="widget-selector__resize-handle-"
      in={config.showResizeHandlesOn === "Hover" ? isSelected || isHovering || isHoveringClickable : isSelected}
      mountOnEnter
      unmountOnExit
    >
      <div
        className={classNames(
          "widget-resize-handle",
          {
            "widget-resize-handle--target-area": config.showTargetAreas,
          },
          `widget-resize-handle--${position}`,
        )}
        style={style}
        onMouseOver={onMouseOver}
        onMouseOut={onMouseOut}
        onMouseDown={() => {
          console.log(isSelected);
          console.log(isHovering);
          console.log(isHoveringClickable);
          console.log("test");
        }}
      >
        <div
          className={classNames("widget-resize-handle__background", {
            "widget-resize-handle__background--hovering":
              isHovering && config.showResizeHandlesOn === "Hover" && !isSelected,
          })}
        ></div>
      </div>
    </CSSTransition>
  );
};

export default WidgetResizeHandle;
