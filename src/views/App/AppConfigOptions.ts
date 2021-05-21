import { ConfigType } from "./AppConfigReducer";

// Add config options here
export const appConfigOptions = {
  showConfig: {
    type: ConfigType.Toggle,
    value: true,
  },
  showTargetAreas: {
    type: ConfigType.Toggle,
    value: false,
  },
  showResizeHandlesOn: {
    type: ConfigType.SegmentedControl,
    value: "Hover",
    options: ["Hover", "Selection"],
  },
  showColumnsDividerOnWidget: {
    type: ConfigType.SegmentedControl,
    value: "Hover",
    options: ["None", "Hover", "Selection"],
  },
  // showToolbarOn: {
  //   type: ConfigType.SegmentedControl,
  //   value: "Selection",
  //   options: ["Selection", "Focus Within"],
  // },
  // exampleSlider: {
  //   type: ConfigType.Slider,
  //   value: 5,
  //   min: 0,
  //   max: 10,
  // },
  blockColor: {
    type: ConfigType.TextInput,
    value: "#FFFFFF",
  },
  // exampleNumber: {
  //   type: ConfigType.NumberInput,
  //   value: 1,
  // },
};
