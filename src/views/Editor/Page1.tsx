import React, { FC, useState } from "react";
import Block from "./Block";
import TextEditor, { TextEditorBlock } from "../TextEditor";
import { EditorWrapper } from ".";
import { Descendant } from "slate";
import ImageWidget from "./ImageWidget";
import TwoColumnsWidget from "./TwoColumnsWidget";

const Page: FC = () => {
  return (
    <EditorWrapper title="Project title">
      {/* <Block
        textAlign="center"
        backgroundImage="https://images.unsplash.com/photo-1502758775495-0ec4a639aa64?q=80&fm=jpg&crop=entropy&w=1080&fit=max"
        theme="dark"
        overlayOpacity={0.5}
      >
        <img
          src="https://d2cankni8sodj9.cloudfront.net/snz42Nd30EUx6fjucJ3D4gLHwxrqUOZPULWxKw.png"
          alt=""
          style={{ width: "25%" }}
        />
        <TextEditor
          value={[
            {
              type: TextEditorBlock.H1,
              children: [{ text: "Sales Proposal", bold: true }],
            },
            {
              type: TextEditorBlock.Paragraph,
              children: [{ text: "Prepared for [Add your client name]" }],
            },
            {
              type: TextEditorBlock.Paragraph,
              children: [{ text: "by [Add your name] — [Add your email address]" }],
            },
          ]}
        />
      </Block> */}
      <Block>
        <TextEditor
          value={[
            {
              type: TextEditorBlock.H1,
              children: [{ text: "Project outline—", bold: true, color: "#2980b9" }],
            },
            {
              type: TextEditorBlock.H2,
              children: [{ text: "Breaking down requirements" }],
            },
            {
              type: TextEditorBlock.Paragraph,
              children: [
                {
                  text:
                    "The project description is an opportunity to demonstrate to your potential client that you have fully internalised what their business and their brand is about.",
                },
              ],
            },
            {
              type: TextEditorBlock.Paragraph,
              children: [
                {
                  text:
                    "Successful sales is about establishing trust between parties. Your sales material, as an extension of you, the salespersons, should demonstrate that you have listened attentively to your client and researched their commercial space, tailoring your sales material and your pitch for this particular business. Luckily with Qwilr, the tailoring part if quick and easy.",
                },
              ],
            },
          ]}
        />
        <TwoColumnsWidget />
        <ImageWidget
          imageURL="https://images.unsplash.com/photo-1519378058457-4c29a0a2efac?ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&ixlib=rb-1.2.1&auto=format&fit=crop&w=648&q=80"
          width="100%"
          height="auto"
        ></ImageWidget>
      </Block>
      <Block theme="dark" backgroundColor="#34495e" textAlign="center">
        <TextEditor
          value={[
            {
              type: TextEditorBlock.H1,
              children: [{ text: "Contact us", bold: true }],
            },
            {
              type: TextEditorBlock.H2,
              children: [{ text: "Ready to take the next step?", italic: true }],
            },
            {
              type: TextEditorBlock.Paragraph,
              children: [{ text: "Email: help@qwilr.com / Web: https://qwilr.com" }],
            },
          ]}
        />
      </Block>
    </EditorWrapper>
  );
};

export default Page;
