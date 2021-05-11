import classNames from "classnames";
import React, { FC, useEffect, useState } from "react";

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
  className?: string;
}

const WidgetResizeHandle: FC<WidgetResizeHandleProps> = ({ position, className }) => {
  return (
    <div className={classNames(["widget-resize-handle", `widget-resize-handle--${position}`, `${className}`])}></div>
  );
};

export default WidgetResizeHandle;
