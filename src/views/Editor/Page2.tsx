import React, { FC } from "react";
import Block from "./Block";
import TextEditor from "../TextEditor";
import { EditorWrapper } from ".";

const Page: FC = () => {
  return (
    <EditorWrapper title="Example page">
      <Block>
        <h1 style={{ color: "#2980b9" }}>
          <b>Example page</b>
        </h1>
        <p>This page demonstrates having multiple pages</p>
      </Block>
    </EditorWrapper>
  );
};

export default Page;
