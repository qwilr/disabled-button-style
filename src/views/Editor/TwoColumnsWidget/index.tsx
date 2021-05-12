import React, { useRef, useState } from "react";
import classNames from "classnames";
import ImageWidget from "../ImageWidget";
import TextEditor, { TextEditorBlock } from "views/TextEditor";
import WidgetSelector from "../WidgetSelector";
import { ButtonSize, ButtonTheme, IconButton, Tooltip, TooltipPosition } from "kaleidoscope/src";
import { Swap } from "kaleidoscope/src/global/icons";
import AccordionWidget from "views/Editor/AccordionWidget";

const TwoColsWidget = () => {
  const [isResizingColumns, setIsResizingColumns] = useState(false);

  const twoColsWidgetRef = useRef(null);

  const handleStopPropagation = (event) => {
    event.stopPropagation();
  };

  return (
    <WidgetSelector offsetBorder={true} innerSelect={false} resizeable={true}>
      <div
        className={"two-cols-widget"}
        ref={twoColsWidgetRef}
        // onMouseOver={handleWidgetHover}
        // onMouseLeave={handleWidgetExit}
      >
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
        <div
          className="two-cols-widget__col-divider"
          onMouseOver={handleStopPropagation}
          onMouseDown={() => {
            setIsResizingColumns(true);
            console.log(isResizingColumns);
          }}
          onMouseUp={() => {
            setIsResizingColumns(false);
          }}
        >
          <div className={classNames("col-divider__line", { "col-divider__line-resizing": isResizingColumns })}></div>
          <div className="col-divider__swapper-container" onClick={handleStopPropagation}>
            <IconButton
              icon={<Swap style={{ color: "white" }} />}
              isRound
              tooltip={{ content: "Swap columns", position: TooltipPosition.Top }}
              //   theme={ButtonTheme.Dark}
              size={ButtonSize.Medium}
            />
          </div>
        </div>
        <div className="two-cols-widget__col-left">
          <TextEditor
            value={[
              {
                type: TextEditorBlock.H2,
                children: [{ text: "Learn our process" }],
              },
              {
                type: TextEditorBlock.Paragraph,
                children: [
                  {
                    text:
                      "Our expertise in full service digital solutions, digital marketing and technology solutions as well as our integrated approach towards seamless digital marketing campaigns, and our cutting edge marketing techniques that have been backed by industry best practices have helped many of our clients achieve their marketing objectives.",
                  },
                ],
              },
            ]}
          />
          <div className="accordion-list">
            <AccordionWidget
              headerText="Research"
              bodyText="We will create a customised email marketing playbook based on your customer base providing all the data we have collected and analysed, including segmentation of your lists based on the customer lifecycle stage value of each lead. This will help to shape the tone of our messaging and how frequently we should send out emails to the different segments in your email database."
            >
              <ImageWidget
                imageURL="https://images.unsplash.com/photo-1620681469593-906882d4e218?ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80"
                width="100%"
                aspectRatio="4/3"
              />
            </AccordionWidget>
            <AccordionWidget
              headerText="Housekeeping"
              bodyText="To ensure that emails are getting into your subscriber’s inboxes, we’ll look into cleaning up your existing database. In addition, we’ll work on laying down some basic standard operating procedures to ensure that your emails are whitelisted and delivered properly to your recipients, such as setting up a double opt-in process and setting up a Welcome email workflow to ensure that your clients have all the information they need to add your emails into their address book."
            />
          </div>
        </div>
      </div>
    </WidgetSelector>
  );
};

export default TwoColsWidget;
