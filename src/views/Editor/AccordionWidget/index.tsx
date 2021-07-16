import { ButtonSize, IconButton } from "kaleidoscope/src";
// import { ReactComponent as NewAccordion } from "./";
// import { ReactComponent as H3 } from "assets/h3.svg";
import { ReactComponent as MarkerArrowRight } from "assets/marker-arrow-right.svg";
import { ReactComponent as MarkerArrowDown } from "assets/marker-arrow-down.svg";
import React, { FC, useRef, useState } from "react";
import classNames from "classnames";
import { CSSTransition } from "react-transition-group";
import { AnimationDuration } from "kaleidoscope/src/styles/Animations";
import forceReflow from "kaleidoscope/src/utils/forceReflow";
import TextEditor, { TextEditorBlock, TextEditorMark } from "views/TextEditor";
import WidgetSelector from "views/Editor/WidgetSelector";

interface AccordionWidgetProps {
  // id: string;
  // addAccordion: () => void;
  // removeAccordion: () => void;
  headerText?: string;
  bodyText?: string;
}

const AccordionWidget: FC<AccordionWidgetProps> = ({ children, headerText, bodyText }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [bodyEntered, setBodyEntered] = useState(false);
  const [bodyHeight, setBodyHeight] = useState(0);

  const accordionRef = useRef<HTMLDivElement>();
  const accordionBodyRef = useRef<HTMLDivElement>();
  const accordionBodyWrapperRef = useRef<HTMLDivElement>();

  const toggleContent = (event) => {
    if (isOpen === false) {
      setIsOpen(true);
    } else {
      setIsOpen(false);
      setBodyEntered(false);
      setBodyHeight(accordionBodyRef.current.offsetHeight);
    }
  };

  const handleBodyEnter = (element: HTMLElement) => {
    setBodyHeight(element.offsetHeight);
  };

  return (
    <WidgetSelector innerSelect={false} offsetBorder={true} offsetValue={8}>
      <div className="accordion-card-widget" tabIndex={0} ref={accordionRef}>
        {/* Accordion header */}
        <div className="accordion-card-widget__header">
          {/* Accordion header button */}
          <div className="accordion-card-widget__header-content">
            <div className="accordion-card-widget__header-button">
              <IconButton
                size={ButtonSize.Small}
                icon={
                  isOpen ? (
                    <MarkerArrowDown style={{ color: "white" }} />
                  ) : (
                    <MarkerArrowRight style={{ color: "white" }} />
                  )
                }
                aria-label={isOpen ? "Collapse" : "Expand"}
                onClick={toggleContent}
              />
            </div>
            <div className="accordion-card-widget__header-text">
              <TextEditor
                allow={[
                  TextEditorBlock.H1,
                  TextEditorBlock.H2,
                  TextEditorBlock.Paragraph,
                  TextEditorMark.Bold,
                  TextEditorMark.Italic,
                ]}
                placeholder="Add a heading"
                value={[
                  {
                    type: TextEditorBlock.Paragraph,
                    children: [{ text: `${headerText}` }],
                  },
                ]}
                disabledStyle
              />
            </div>
          </div>
        </div>

        <div
          className="accordion-card-widget__body-transition-wrapper"
          style={{ height: bodyEntered ? "auto" : bodyHeight }}
          ref={accordionBodyWrapperRef}
        >
          <CSSTransition
            timeout={AnimationDuration.Long}
            classNames="accordion-card-widget__body-"
            in={isOpen}
            onEnter={handleBodyEnter}
            onEntered={() => setBodyEntered(true)}
            onExit={() => {
              setBodyHeight(0);
              // forceReflow is a KL thing to force the component to update it's styles
              forceReflow(accordionBodyWrapperRef.current);
            }}
          >
            {/* Accordion body */}
            <div className="accordion-card-widget__body" ref={accordionBodyRef}>
              <TextEditor
                placeholder="Add content here"
                value={[
                  {
                    type: TextEditorBlock.Paragraph,
                    children: [
                      {
                        text: `${bodyText}`,
                      },
                    ],
                  },
                ]}
              />
              {children}
            </div>
          </CSSTransition>
        </div>
      </div>
    </WidgetSelector>
  );
};

export default AccordionWidget;
