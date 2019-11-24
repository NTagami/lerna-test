import * as React from "react";
import { DispatchProp } from "react-redux";

import { makeFCHelper } from "./CommonStyles";
import { push } from "connected-react-router";

type Props = DispatchProp;

export const MapTest: React.FC<Props> = ({ dispatch }) => {
  const helper = makeFCHelper();
  return <div>{helper.staticButton("Main", () => dispatch(push("/")))}</div>;
};
