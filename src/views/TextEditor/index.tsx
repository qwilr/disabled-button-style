import React, { ElementType, FC, useCallback, useContext, useEffect, useMemo, useRef, useState } from "react";
import { withReact, ReactEditor, Slate, Editable, useSlate } from "slate-react";
import { BaseEditor, createEditor, Descendant, Transforms, Editor, Text, Range, Element as SlateElement } from "slate";
import Toolbar, { ToolbarButton } from "../../components/Toolbar";
import { Bold, H1, H2, Italic, ListBullet, ListNumber } from "kaleidoscope/src/global/icons";
import { EditorContext } from "views/Editor";

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
}

const TextEditor: FC<TextEditorProps> = ({
  allow = OPTIONAL_ELEMENTS,
  value,
  defaultElement: DefaultElement = ParagraphElement,
  placeholder = "Type something...",
  onChange,
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

  const renderElement = useCallback((props) => {
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
  }, []);

  const renderLeaf = useCallback((props) => {
    return <Leaf {...props} />;
  }, []);

  return (
    <Slate editor={editor} value={internalValue} onChange={handleChange}>
      {allow.length > 0 && (
        <TextEditorToolbar>
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
        </TextEditorToolbar>
      )}
      <Editable
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

const TextEditorToolbar: FC = ({ children }) => {
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const editor = useSlate();
  const prevPosition = useRef(position);
  const { selection } = editor;

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
      {children}
    </Toolbar>
  );
};

export default TextEditor;
