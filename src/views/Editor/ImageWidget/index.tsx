import React, { FC, useEffect, useRef, useState } from "react";
import { Rnd } from "react-rnd";
import WidgetSelector from "../WidgetSelector";

interface ImageWidgetProps {
  imageURL: string;
  width: string;
  height: string;
}

const ImageWidget: FC<ImageWidgetProps> = (props) => {
  return (
    <WidgetSelector offsetBorder={false} resizeable={true}>
      <img
        className="image-widget__content"
        style={{ width: `${props.width}`, height: `${props.height}` }}
        src={`${props.imageURL}`}
      />
    </WidgetSelector>
  );
};

export default ImageWidget;
