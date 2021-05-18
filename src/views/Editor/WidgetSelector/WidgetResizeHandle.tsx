import classNames from "classnames";
import { AnimationDuration } from "kaleidoscope/src/styles/Animations";
import React, { CSSProperties, FC } from "react";
import { CSSTransition } from "react-transition-group";

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
}

const WidgetResizeHandle: FC<WidgetResizeHandleProps> = ({ position, trigger, offsetValue = 0, style }) => {
  return (
    <CSSTransition
      timeout={AnimationDuration.Short}
      classNames="widget-selector__resize-handle-"
      in={trigger}
      mountOnEnter
      unmountOnExit
    >
      <div
        className={classNames("widget-resize-handle", [
          { "widget-resize-handle--offset": offsetValue },
          `widget-resize-handle--${position}`,
        ])}
        style={style}
        onMouseOver={(event) => {
          event.stopPropagation();
        }}
      ></div>
    </CSSTransition>
  );
};

export default WidgetResizeHandle;
