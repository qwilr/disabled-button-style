import React from "react";
import WidgetSelector, { ResizeHandleType } from "../WidgetSelector";
import TwoColsLayout from "./TwoColumnsLayout";

const TwoColsWidget = () => {
  return (
    <WidgetSelector
      offsetBorder={true}
      offsetValue={16}
      innerSelect={false}
      resizeHandles={ResizeHandleType.LeftRight}
      resizeHandleProps={{ offsetValue: 16 }}
    >
      <TwoColsLayout />
    </WidgetSelector>
  );
};

export default TwoColsWidget;
