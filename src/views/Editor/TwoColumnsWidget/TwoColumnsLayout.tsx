import React, { createContext, FC, useContext, useEffect, useRef, useState } from "react";
import classNames from "classnames";
import ImageWidget from "../ImageWidget";
import TextEditor, { TextEditorBlock } from "../../TextEditor";
import WidgetSelector, { ResizeHandleType } from "../WidgetSelector";
import { ButtonSize, IconButton, Tooltip, TooltipPosition } from "kaleidoscope/src";
import { Swap } from "kaleidoscope/src/global/icons";
import AccordionWidget from "../../Editor/AccordionWidget";
import { ConfigContext } from "../../App/AppConfig";
import { CSSTransition } from "react-transition-group";
import { AnimationDuration } from "kaleidoscope/src/styles/Animations";
import { useWidgetSelectorContext } from "../WidgetSelector/index";

const TwoColsLayout = () => {
  const config = useContext(ConfigContext);

  const { isSelected, isHovering, isHoveringClickable } = useWidgetSelectorContext();

  useEffect(() => {
    if (
      (config.showColumnsDividerOnWidget === "Hover" && (isHovering || (isHoveringClickable && !isSelected))) ||
      (config.showColumnsDividerOnWidget === "Selection" && isSelected)
    ) {
      setIsLineVisible(true);
    } else {
      setIsLineVisible(false);
    }
  }, [isSelected, isHovering, isHoveringClickable]);

  const [isHoveringDivider, setIsHoveringDivider] = useState(false);
  const [isLineHovering, setIsLineHovering] = useState(false);
  const [isLineVisible, setIsLineVisible] = useState(false);
  const [isResizingColumns, setIsResizingColumns] = useState(false);

  const twoColsLayoutRef = useRef(null);
  const swapButtonRef = useRef(null);

  const handleLineHovering = (event) => {
    event.stopPropagation();

    if (swapButtonRef.current.contains(event.target)) {
      setIsLineHovering(false);
      setIsLineVisible(true);
    } else if (!swapButtonRef.current.contains(event.target)) {
      console.log(isSelected + "hoveerr??");
      setIsLineHovering(true);
    }
  };

  const handleMouseOutDivider = () => {
    setIsHoveringDivider(false);
    setIsLineHovering(false);
    setIsLineVisible(false);
  };

  const handleMouseDownDivider = (event) => {
    if (!swapButtonRef.current.contains(event.target)) {
      setIsResizingColumns(true);
    } else if (swapButtonRef.current.contains(event.target)) {
      setIsResizingColumns(false);
    }
  };

  const handleMouseOverDivider = (event) => {
    setIsHoveringDivider(true);
    event.stopPropagation();
  };

  return (
    <div className={"two-cols-widget"} ref={twoColsLayoutRef}>
      <div className="two-cols-widget__col-right">
        <ImageWidget
          imageURL="https://images.unsplash.com/photo-1519378058457-4c29a0a2efac?ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&ixlib=rb-1.2.1&auto=format&fit=crop&w=648&q=80"
          width="100%"
          height="auto"
        ></ImageWidget>
      </div>
      <div
        className={classNames(
          "two-cols-widget__col-divider",
          {
            "two-cols-widget__col-divider--hover": isHoveringDivider,
          },
          { "two-cols-widget__col-divider--target-area": config.showTargetAreas },
        )}
        onMouseOver={handleMouseOverDivider}
        onMouseOut={handleMouseOutDivider}
        onPointerMove={handleLineHovering}
        onMouseDown={handleMouseDownDivider}
        onMouseUp={() => {
          setIsResizingColumns(false);
        }}
      >
        <CSSTransition
          in={isHoveringDivider && !isResizingColumns}
          mountOnEnter
          unmountOnExit
          timeout={AnimationDuration.Short}
          classNames="col-divider__swapper-container-"
        >
          <div
            className={classNames("col-divider__swapper-container", {
              "col-divider__swapper-container--target-area": config.showTargetAreas,
            })}
            ref={swapButtonRef}
          >
            <IconButton
              icon={<Swap style={{ color: "white" }} />}
              isRound
              tooltip={{ content: "Swap columns", position: TooltipPosition.Top }}
              //   theme={ButtonTheme.Dark}
              size={ButtonSize.Medium}
            />
          </div>
        </CSSTransition>
        <div
          className={classNames("col-divider__line", {
            "col-divider__line--hover": isLineHovering,
            "col-divider__line--resizing": isResizingColumns,
            "col-divider__line--visible": isLineVisible,
          })}
        />
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
  );
};

export default TwoColsLayout;
