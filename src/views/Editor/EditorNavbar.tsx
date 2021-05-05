import React, { FC, useContext } from "react";
import Navbar, { NavbarActions, NavbarDetails, NavbarLogo, NavbarProfile, NavbarTitle } from "components/Navbar";
import { Button, ButtonType, IconButton, Toggle, Tooltip, TooltipPosition } from "kaleidoscope/src";
import { Download, OptionsVertical, Preview, Sidebar, Team } from "kaleidoscope/src/global/icons";
import { Helmet } from "react-helmet";
import { EditorContext } from ".";

interface EditorNavbarProps {
  title?: string;
}

const EditorNavbar: FC<EditorNavbarProps> = ({ title = "Project name" }) => {
  const { preview, setPreview } = useContext(EditorContext);

  return (
    <Navbar>
      <Helmet>
        <title>{title}</title>
      </Helmet>
      <NavbarDetails>
        <Tooltip content="Back to dashboard" position={TooltipPosition.Bottom}>
          <NavbarLogo />
        </Tooltip>
        {!preview && (
          <IconButton
            className="proto-editor-navbar__sidebar-toggle"
            icon={<Sidebar />}
            tooltip={{ content: "Sidebar", position: TooltipPosition.Bottom }}
          />
        )}
        <NavbarTitle>{preview ? `Previewing: ${title}` : title}</NavbarTitle>
      </NavbarDetails>
      {!preview && (
        <>
          <NavbarActions>
            <IconButton
              icon={<Preview />}
              tooltip={{ content: "Preview", position: TooltipPosition.Bottom }}
              onClick={() => setPreview(!preview)}
            />
            <IconButton icon={<Team />} tooltip={{ content: "Share", position: TooltipPosition.Bottom }} />
            <IconButton icon={<Download />} tooltip={{ content: "Print", position: TooltipPosition.Bottom }} />
            <IconButton icon={<OptionsVertical />} tooltip={{ content: "More", position: TooltipPosition.Bottom }} />
          </NavbarActions>
          <NavbarActions space="m">
            <Toggle value={true} label="Live" />
            <Button type={ButtonType.Primary}>Share</Button>
          </NavbarActions>
        </>
      )}
      {preview && (
        <NavbarActions>
          <Button type={ButtonType.Primary} onClick={() => setPreview(false)}>
            Exit preview
          </Button>
        </NavbarActions>
      )}
      <NavbarProfile />
    </Navbar>
  );
};

export default EditorNavbar;
