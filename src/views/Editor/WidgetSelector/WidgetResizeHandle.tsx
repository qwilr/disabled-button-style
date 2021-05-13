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

interface WidgetResizeHandleProps {
  position: HandlePosition;
  trigger: boolean;
  offset?: boolean;
  style?: CSSProperties;
}

const WidgetResizeHandle: FC<WidgetResizeHandleProps> = ({ position, trigger, offset, style }) => {
  return (
    <CSSTransition timeout={AnimationDuration.Short} classNames="widget-selector__resize-handle-" in={trigger}>
      <div
        className={classNames("widget-resize-handle", [
          { "widget-resize-handle--offset": offset },
          `widget-resize-handle--${position}`,
        ])}
        style={style}
      ></div>
    </CSSTransition>
  );
};

export default WidgetResizeHandle;
