import React, { useRef, useState } from "react";
import classNames from "classnames";
import ImageWidget from "../ImageWidget";
import TextEditor, { TextEditorBlock } from "views/TextEditor";
import WidgetSelector from "../WidgetSelector";
import { ButtonSize, ButtonTheme, IconButton, Tooltip, TooltipPosition } from "kaleidoscope/src";
import { Swap } from "kaleidoscope/src/global/icons";

const TwoColsWidget = () => {
  const [widgetHovering, setWidgetHovering] = useState(false);
  const [widgetSelected, setWidgetSelected] = useState(false);
  //   const [imageHovering, setImageHovering] = useState(false);
  //   const [imageSelected, setImageSelected] = useState(false);

  const twoColsWidgetRef = useRef(null);
  const twoColsImageRef = useRef(null);

  const handleWidgetHover = (event) => {
    if (event.target === twoColsWidgetRef.current) {
      setWidgetHovering(true);
      //   setImageHovering(false);
      console.log("widget");
    } else if (event.target === twoColsImageRef.current) {
      //   setImageHovering(true);
      setWidgetHovering(false);
      console.log("image");
    } else {
      setWidgetHovering(false);
      //   setImageHovering(false);
      console.log("none");
    }
  };

  const handleWidgetExit = (event) => {
    setWidgetHovering(false);
    // setImageHovering(false);
  };

  return (
    <WidgetSelector offsetBorder={true}>
      <div
        className={"two-cols-widget"}
        ref={twoColsWidgetRef}
        onMouseOver={handleWidgetHover}
        onMouseLeave={handleWidgetExit}
      >
        <div className="two-cols-widget__col-left">
          <TextEditor
            value={[
              {
                type: TextEditorBlock.H2,
                children: [{ text: "How to use aromatherapy for stress relief" }],
              },
              {
                type: TextEditorBlock.Paragraph,
                children: [
                  {
                    text:
                      "Stress is a fact of life and we all encounter stressful situations at various points of our lives, but this year has brought new and unique stresses to everyone. It can have long term effects on our minds, bodies and skin, and sometimes finding something that ‘works’ is easier said than done. Enter aromatherapy, a natural and oft-cited way to help reduce stress.",
                  },
                ],
              },
            ]}
          />
        </div>
        <div className="two-cols-widget__col-divider">
          <div className="col-divider__line"></div>
          <div className="col-divider__swapper-container">
            <IconButton
              icon={<Swap style={{ color: "white" }} />}
              isRound
              tooltip={{ content: "Swap columns", position: TooltipPosition.Top }}
              //   theme={ButtonTheme.Dark}
              size={ButtonSize.Medium}
            />
          </div>
        </div>
        <div className="two-cols-widget__col-right">
          {/* <div
            className={classNames("two-cols-image", {
              "two-cols-image--hover": imageHovering,
              "two-cols-image--selected": imageSelected,
            })}
            // onMouseOver={handleWidgetHover}
            // onMouseOut={handleWidgetExit}
          >
          </div> */}
          <ImageWidget
            imageURL="https://images.unsplash.com/photo-1519378058457-4c29a0a2efac?ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&ixlib=rb-1.2.1&auto=format&fit=crop&w=648&q=80"
            width="100%"
            height="auto"
          ></ImageWidget>
        </div>
      </div>
    </WidgetSelector>
  );
};

export default TwoColsWidget;
