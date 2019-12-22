/** @jsx jsx */
//import styled from "styled-components";
import { jsx, css } from "@emotion/core";
import * as React from "react";
import { DispatchProp } from "react-redux";

import {
  useSpring,
  animated,
  interpolate,
  OpaqueInterpolation
} from "react-spring";
import { useDrag } from "react-use-gesture";

const theme = css`
  width: 50vw;
  height: 50vh;
  display: flex;
  align-items: center;
  justify-content: center;
  background-color: #000;
`;

const body = css`
  width: 80px;
  height: 80px;
  background: hotpink;
  border-radius: 16px;
`;

/*
const Root = styled.div`
  width: 50vw;
  height: 50vh;
  display: flex;
  align-items: center;
  justify-content: center;
  background-color: #000;
`;

const Animated = styled(animated.div)`
  width: 80px;
  height: 80px;
  background: hotpink;
  border-radius: 16px;
`;
*/
function PullRelease(): JSX.Element {
  const [{ x, y }, set] = useSpring(() => ({
    x: 0,
    y: 0
  }));

  // Set the drag hook and define component movement based on gesture data
  const bind = useDrag(({ down, movement: [mx, my] }) => {
    set({
      x: down ? mx : 0,
      y: down ? my : 0
    });
  });
  /*
  const trans: OpaqueInterpolation<string> = xy.interpolate(
    o => `translate3d(${o[0]}px, ${o[1]}px, 0px)`
  );
*/
  // Bind it to a component
  return (
    <animated.div
      css={body}
      {...bind()}
      style={{
        transform: interpolate(
          [x, y],
          (x, y) => `translate3d(${x}px, ${y}px, 0px)`
        )
      }}
    />
  );
}

export const GestureTest: React.FC<{}> = ({}) => {
  return (
    <React.Fragment>
      <div css={theme}>{PullRelease()}</div>
    </React.Fragment>
  );
};
