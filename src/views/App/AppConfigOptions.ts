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
  showControlsOnHover: {
    type: ConfigType.Toggle,
    value: true,
  },
  showColumnDividerOnHover: {
    type: ConfigType.Toggle,
    value: false,
  },
  // exampleSlider: {
  //   type: ConfigType.Slider,
  //   value: 5,
  //   min: 0,
  //   max: 10,
  // },
  exampleText: {
    type: ConfigType.TextInput,
    value: "Example",
  },
  // exampleNumber: {
  //   type: ConfigType.NumberInput,
  //   value: 1,
  // },
  // exampleSegmentedControl: {
  //   type: ConfigType.SegmentedControl,
  //   value: "S",
  //   options: ["S", "M", "L"],
  // },
};
