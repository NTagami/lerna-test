import React from "react";
import { withKnobs, text, boolean, number } from "@storybook/addon-knobs";

//import { Button } from "@storybook/react/demo";
import { TestComponent } from "../packages/test-lib";
export default {
  title: "Storybook Knobs",
  decorators: [withKnobs]
};

export const hello = () => <TestComponent message={text("message", "hello")} />;

//export const withEmoji = () =>
