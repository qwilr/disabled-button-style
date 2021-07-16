import { ConfigType } from "./AppConfigReducer";

// Add config options here
export const appConfigOptions = {
  showConfig: {
    type: ConfigType.Toggle,
    value: true,
  },
  disabledStyleOption: {
    type: ConfigType.SegmentedControl,
    value: "1",
    options: ["1", "2", "3", "4"],
  },
};
