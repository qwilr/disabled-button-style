import { ConfigType } from "./AppConfigReducer";

// Add config options here
export const appConfigOptions = {
  showConfig: {
    type: ConfigType.Toggle,
    value: true,
  },
  // showTargetAreas: {
  //   type: ConfigType.Toggle,
  //   value: false,
  // },
  showResizeHandlesOnHover: {
    type: ConfigType.Toggle,
    value: false,
  },
  showColumnDividerOnHover: {
    type: ConfigType.Toggle,
    value: false,
  },
  // showToolbarOnFocus: {
  //   type: ConfigType.Toggle,
  //   value: false,
  // },
  showToolbarOn: {
    type: ConfigType.SegmentedControl,
    value: "Selection",
    options: ["Selection", "Focus Within"],
  },
  // exampleSlider: {
  //   type: ConfigType.Slider,
  //   value: 5,
  //   min: 0,
  //   max: 10,
  // },
  // exampleText: {
  //   type: ConfigType.TextInput,
  //   value: "Example",
  // },
  // exampleNumber: {
  //   type: ConfigType.NumberInput,
  //   value: 1,
  // },
};
