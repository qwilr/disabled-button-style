import React, { ElementType, FC, useCallback, useContext, useEffect, useMemo, useRef, useState } from "react";
import { withReact, ReactEditor, Slate, Editable, useSlate } from "slate-react";
import { BaseEditor, createEditor, Descendant, Transforms, Editor, Range, Element as SlateElement } from "slate";
import Toolbar, { ToolbarButton } from "../../components/Toolbar";
import {
  AlignCenter,
  AlignLeft,
  Bold,
  H1,
  H2,
  Italic,
  ListBullet,
  ListNumber,
  Styles,
} from "kaleidoscope/src/global/icons";
import { ReactComponent as FontSize } from "assets/font-size.svg";
import { EditorContext } from "views/Editor";
import {
  ColorPalette,
  OptionMenu,
  OptionMenuItem,
  Popover,
  PopoverTheme,
  SegmentedControl,
  SegmentedControlTheme,
  SliderInput,
  SliderTheme,
  Tooltip,
} from "kaleidoscope/src";
import { ConfigContext } from "views/App/AppConfig";

export enum TextEditorBlock {
  H1 = "h1",
  H2 = "h2",
  Paragraph = "p",
  ListItem = "li",
  OrderedList = "ol",
  UnorderedList = "ul",
}

export enum TextEditorMark {
  Bold = "bold",
  Italic = "italic",
}

const LIST_TYPES = [TextEditorBlock.OrderedList, TextEditorBlock.UnorderedList];
const OPTIONAL_ELEMENTS = [
  TextEditorBlock.H1,
  TextEditorBlock.H2,
  TextEditorBlock.ListItem,
  TextEditorMark.Bold,
  TextEditorMark.Italic,
  ...LIST_TYPES,
];

interface ElementNode {
  type: TextEditorBlock;
  children: TextContent[];
}

interface TextContent {
  text: string;
  bold?: boolean;
  italic?: boolean;
  color?: string;
}

declare module "slate" {
  interface CustomTypes {
    Editor: BaseEditor & ReactEditor;
    Element: ElementNode;
    Text: TextContent;
  }
}

export const ParagraphElement = ({ attributes, children }) => {
  return <p {...attributes}>{children}</p>;
};

export const H1Element = ({ attributes, children }) => {
  return <h1 {...attributes}>{children}</h1>;
};

export const H2Element = ({ attributes, children }) => {
  return <h2 {...attributes}>{children}</h2>;
};

export const ULElement = ({ attributes, children }) => {
  return <ul {...attributes}>{children}</ul>;
};

export const OLElement = ({ attributes, children }) => {
  return <ol {...attributes}>{children}</ol>;
};

export const LIElement = ({ attributes, children }) => {
  return <li {...attributes}>{children}</li>;
};

const Leaf = ({ attributes, children, leaf }) => {
  const style = {
    fontWeight: leaf.bold ? "bold" : "normal",
    fontStyle: leaf.italic ? "italic" : "normal",
    color: leaf.color,
  };

  return (
    <span {...attributes} style={style} data-placeholder={leaf.placeholder}>
      {children}
    </span>
  );
};

type TextEditorElement = TextEditorMark | TextEditorBlock;

interface TextEditorProps {
  allow?: TextEditorElement[];
  value?: Descendant[];
  placeholder?: string;
  defaultElement?: ElementType;
  onChange?: (newValue: Descendant[]) => void;
  disabledStyle?: boolean;
}

const TextEditor: FC<TextEditorProps> = ({
  allow = OPTIONAL_ELEMENTS,
  value,
  defaultElement: DefaultElement = ParagraphElement,
  placeholder = "Type something...",
  onChange,
  disabledStyle = false,
}) => {
  const { preview } = useContext(EditorContext);
  const editor = useMemo(() => withReact(createEditor()), []);
  const [internalValue, setInternalValue] = useState<Descendant[]>(
    value || [
      {
        type: TextEditorBlock.Paragraph,
        children: [{ text: "" }],
      },
    ],
  );

  const handleChange = (newValue: Descendant[]) => {
    setInternalValue(newValue);
    onChange?.(newValue);
  };

  const renderElement = useCallback(
    (props) => {
      const { type } = props.element;

      const shouldRender = (element: TextEditorBlock) => {
        return type === element && allow.includes(element);
      };

      switch (true) {
        case shouldRender(TextEditorBlock.H1):
          return <H1Element {...props} />;
        case shouldRender(TextEditorBlock.H2):
          return <H2Element {...props} />;
        case shouldRender(TextEditorBlock.OrderedList):
          return <OLElement {...props} />;
        case shouldRender(TextEditorBlock.UnorderedList):
          return <ULElement {...props} />;
        case shouldRender(TextEditorBlock.ListItem):
          return <LIElement {...props} />;
        default:
          return <DefaultElement {...props} />;
      }
    },
    [DefaultElement, allow],
  );

  const renderLeaf = useCallback((props) => {
    return <Leaf {...props} />;
  }, []);

  return (
    <Slate editor={editor} value={internalValue} onChange={handleChange}>
      {allow.length > 0 && <TextEditorToolbar allow={allow} disabledStyle={disabledStyle} />}
      <Editable
        className="proto-text-editor"
        readOnly={preview}
        renderElement={renderElement}
        renderLeaf={renderLeaf}
        placeholder={preview ? undefined : placeholder}
        onKeyDown={(event) => {
          if (!event.ctrlKey && !event.metaKey) {
            return;
          }

          switch (event.key) {
            case "b": {
              event.preventDefault();
              toggleMark(editor, TextEditorMark.Bold);
              break;
            }
            case "i": {
              event.preventDefault();
              toggleMark(editor, TextEditorMark.Italic);
              break;
            }
          }
        }}
      />
    </Slate>
  );
};

const toggleBlock = (editor: Editor, format: TextEditorBlock) => {
  const isActive = isBlockActive(editor, format);
  const isList = LIST_TYPES.includes(format);

  Transforms.unwrapNodes(editor, {
    match: (n) => LIST_TYPES.includes(!Editor.isEditor(n) && SlateElement.isElement(n) && n.type),
    split: true,
  });
  const newProperties: Partial<SlateElement> = {
    type: isActive ? TextEditorBlock.Paragraph : isList ? TextEditorBlock.ListItem : format,
  };
  Transforms.setNodes(editor, newProperties);

  if (!isActive && isList) {
    const block = { type: format, children: [] };
    Transforms.wrapNodes(editor, block);
  }
};

const toggleMark = (editor: Editor, format: TextEditorMark) => {
  const isActive = isMarkActive(editor, format);

  if (isActive) {
    Editor.removeMark(editor, format);
  } else {
    Editor.addMark(editor, format, true);
  }
};

const isBlockActive = (editor: Editor, format: TextEditorBlock) => {
  const [match] = Editor.nodes(editor, {
    match: (n) => !Editor.isEditor(n) && SlateElement.isElement(n) && n.type === format,
  });

  return !!match;
};

const isMarkActive = (editor: Editor, format: TextEditorMark) => {
  const marks = Editor.marks(editor);
  return marks ? marks[format] === true : false;
};

interface TextEditorToolbarProps {
  allow?: TextEditorElement[];
  disabledStyle?: boolean;
}

const TextEditorToolbar: FC<TextEditorToolbarProps> = ({ allow, disabledStyle }) => {
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const editor = useSlate();
  const prevPosition = useRef(position);
  const { selection } = editor;
  const config = useContext(ConfigContext);

  const isHidden =
    !selection ||
    !ReactEditor.isFocused(editor) ||
    Range.isCollapsed(selection) ||
    Editor.string(editor, selection) === "";

  useEffect(() => {
    prevPosition.current = position;
  }, [position]);

  useEffect(() => {
    let animationFrame: number;

    const updatePosition = () => {
      const domSelection = window.getSelection();
      if (!domSelection || domSelection.rangeCount <= 0) return;
      const domRange = domSelection.getRangeAt(0);
      const rect = domRange.getBoundingClientRect();

      setPosition({
        x: rect.x + rect.width / 2,
        y: rect.y,
      });
    };

    const observe = () => {
      updatePosition();
      animationFrame = requestAnimationFrame(observe);
    };

    if (!isHidden) {
      observe();
    } else {
      updatePosition();
    }

    return () => {
      cancelAnimationFrame(animationFrame);
    };
  }, [editor.children, selection, isHidden]);

  return (
    <Toolbar visible={!isHidden} position={isHidden ? prevPosition.current : position} offset={4}>
      {allow.includes(TextEditorBlock.H1) && (
        <ToolbarButton
          icon={<H1 />}
          selected={isBlockActive(editor, TextEditorBlock.H1)}
          onMouseDown={(event) => {
            event.preventDefault();
            toggleBlock(editor, TextEditorBlock.H1);
          }}
        />
      )}
      {allow.includes(TextEditorBlock.H2) && (
        <ToolbarButton
          icon={<H2 />}
          selected={isBlockActive(editor, TextEditorBlock.H2)}
          onMouseDown={(event) => {
            event.preventDefault();
            toggleBlock(editor, TextEditorBlock.H2);
          }}
        />
      )}
      {allow.includes(TextEditorMark.Bold) && (
        <ToolbarButton
          icon={<Bold />}
          selected={isMarkActive(editor, TextEditorMark.Bold)}
          onMouseDown={(event) => {
            event.preventDefault();
            toggleMark(editor, TextEditorMark.Bold);
          }}
        />
      )}
      {allow.includes(TextEditorMark.Italic) && (
        <ToolbarButton
          icon={<Italic />}
          selected={isMarkActive(editor, TextEditorMark.Italic)}
          onMouseDown={(event) => {
            event.preventDefault();
            toggleMark(editor, TextEditorMark.Italic);
          }}
        />
      )}
      {allow.includes(TextEditorBlock.UnorderedList) && (
        <ToolbarButton
          icon={<ListBullet />}
          selected={isBlockActive(editor, TextEditorBlock.UnorderedList)}
          onMouseDown={(event) => {
            event.preventDefault();
            toggleBlock(editor, TextEditorBlock.UnorderedList);
          }}
        />
      )}
      {allow.includes(TextEditorBlock.OrderedList) && (
        <ToolbarButton
          icon={<ListNumber />}
          selected={isBlockActive(editor, TextEditorBlock.OrderedList)}
          onMouseDown={(event) => {
            event.preventDefault();
            toggleBlock(editor, TextEditorBlock.OrderedList);
          }}
        />
      )}
      {/* {config.disabledStyleOption === "1" && (
        <ToolbarButton
          icon={<Styles />}
          onMouseDown={(event) => {
            event.preventDefault();
          }}
          tooltip={{ content: "Custom Styles not available inside accordion" }}
          disabled
          className="style-disabled"
        />
      )} */}
      {!disabledStyle && (
        <div
          onMouseDown={(event) => {
            event.preventDefault();
          }}
        >
          <Popover
            offset={8}
            theme={PopoverTheme.Dark}
            button={(buttonProps) => (
              <ToolbarButton
                icon={<Styles />}
                onMouseDown={(event) => {
                  event.preventDefault();
                }}
                {...buttonProps}
              />
            )}
          >
            <div className={"text-medium-label"}>Paragraph style</div>
            <div className={"text-small-label"}>Text color</div>
            <ColorPalette
              presetColors={[
                {
                  value: "#00A99D",
                  themeIndex: 1,
                },
                {
                  value: "#FFCE53",
                  themeIndex: 2,
                },
                {
                  value: "rgba(129, 162, 178,0.1)",
                  themeIndex: 3,
                },
              ]}
              handleColorChange={(color) => {}}
              selectedThemeIndex={3}
            ></ColorPalette>
            <SliderInput
              initialInputValue={14}
              label={"Font size"}
              handleValueChange={(value) => {}}
              theme={SliderTheme.Dark}
              unit={"px"}
              minimum={14}
            />
            <SegmentedControl
              label={"Alignment"}
              options={[
                { label: "Left", value: "left", icon: <AlignLeft /> },
                { label: "Center", value: "center", icon: <AlignCenter /> },
              ]}
              selectedValue={"left"}
              onClickHandler={() => {}}
              theme={SegmentedControlTheme.Dark}
            />
          </Popover>
        </div>
      )}
      {disabledStyle && (
        <>
          {config.disabledStyleOption === "1" && (
            <div
              onMouseDown={(event) => {
                event.preventDefault();
              }}
            >
              <ToolbarButton
                icon={<Styles />}
                tooltip={{ content: "Styles unavailable" }}
                disabled
                className="style-disabled"
              />
            </div>
          )}
          {config.disabledStyleOption === "2" && (
            <div
              onMouseDown={(event) => {
                event.preventDefault();
              }}
            >
              <Popover
                offset={8}
                theme={PopoverTheme.Dark}
                button={(buttonProps) => (
                  <ToolbarButton
                    icon={<Styles />}
                    onMouseDown={(event) => {
                      event.preventDefault();
                    }}
                    {...buttonProps}
                  />
                )}
              >
                <div className={"text-medium-label"}>Paragraph style</div>
                <Tooltip wrapTarget={true} content={"Cannot change color"}>
                  <div className={"style-disabled"}>
                    <div className={"text-small-label"}>Text color</div>
                    <ColorPalette
                      presetColors={[
                        {
                          value: "#00A99D",
                          themeIndex: 1,
                        },
                        {
                          value: "#FFCE53",
                          themeIndex: 2,
                        },
                        {
                          value: "rgba(129, 162, 178,0.1)",
                          themeIndex: 3,
                        },
                      ]}
                      handleColorChange={(color) => {}}
                      selectedThemeIndex={3}
                    ></ColorPalette>
                  </div>
                </Tooltip>
                <SliderInput
                  initialInputValue={14}
                  label={"Font size"}
                  handleValueChange={(value) => {}}
                  theme={SliderTheme.Dark}
                  unit={"px"}
                  minimum={14}
                />
                <Tooltip wrapTarget={true} content={"Cannot change alignment"}>
                  <div className={"style-disabled"}>
                    <SegmentedControl
                      label={"Alignment"}
                      options={[
                        { label: "Left", value: "left", icon: <AlignLeft /> },
                        { label: "Center", value: "center", icon: <AlignCenter /> },
                      ]}
                      selectedValue={"left"}
                      onClickHandler={() => {}}
                      theme={SegmentedControlTheme.Dark}
                    />
                  </div>
                </Tooltip>
              </Popover>
            </div>
          )}
          {config.disabledStyleOption === "3" && (
            <div
              onMouseDown={(event) => {
                event.preventDefault();
              }}
            >
              <Popover
                offset={8}
                theme={PopoverTheme.Dark}
                button={(buttonProps) => (
                  <ToolbarButton
                    icon={<Styles />}
                    onMouseDown={(event) => {
                      event.preventDefault();
                    }}
                    {...buttonProps}
                  />
                )}
              >
                <div className={"text-medium-label"}>Paragraph style</div>
                <SliderInput
                  initialInputValue={14}
                  label={"Font size"}
                  handleValueChange={(value) => {}}
                  theme={SliderTheme.Dark}
                  unit={"px"}
                  minimum={14}
                />
              </Popover>
            </div>
          )}
        </>
      )}
      {config.disabledStyleOption === "4" && (
        // Not sure why, but the toolbar closes when you click this button
        <OptionMenu
          button={
            <ToolbarButton
              icon={<FontSize />}
              onMouseDown={(event) => {
                event.preventDefault();
              }}
            />
          }
        >
          <OptionMenuItem selected>14</OptionMenuItem>
          <OptionMenuItem>16</OptionMenuItem>
          <OptionMenuItem>20</OptionMenuItem>
          <OptionMenuItem>24</OptionMenuItem>
          <OptionMenuItem>32</OptionMenuItem>
        </OptionMenu>
        // <div
        //   onMouseDown={(event) => {
        //     event.preventDefault();
        //   }}
        // >
        // </div>
      )}
    </Toolbar>
  );
};

export default TextEditor;
