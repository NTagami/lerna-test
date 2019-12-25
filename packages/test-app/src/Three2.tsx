/** @jsx jsx */
import * as React from "react";
import { CSSProperties } from "react";

import { jsx, css } from "@emotion/core";

import * as Three from "three";
import { Canvas, useThree } from "react-three-fiber";
import { useDrag, useHover } from "react-use-gesture";
import { useSpring } from "react-spring";
import { a } from "react-spring/three";

const theme = css`
  width: 50vw;
  height: 50vh;
`;
/*
type Merge<A, B> = { [K in keyof A]: K extends keyof B ? B[K] : A[K] } & B;
type OverwriteKeys<A, B> = { [K in keyof A]: K extends keyof B ? B[K] : A[K] };
function useSpring2<DS extends object>(
  getProps: () => UseSpringProps<Merge<DS, CSSProperties>>
): [
  AnimatedValue<ForwardedProps<OverwriteKeys<DS, CSSProperties>>>,
  SetUpdateFn<OverwriteKeys<DS, CSSProperties>>
] {
  return useSpring(getProps);
}
*/
function Dodecahedron() {
  const { size, viewport } = useThree();
  const aspect = size.width / viewport.width;

  const [spring, set] = useSpring(() => ({
    scale: [1, 1, 1],
    position: [0, 0, 0],
    rotation: [0, 0, 0],
    config: { mass: 3, friction: 40, tension: 800 }
  }));

  const bindDrag = useDrag(
    ({ offset: [x, y], vxvy: [vx, vy], down, ...props }) =>
      set({
        position: [x / aspect, -y / aspect, 0],
        rotation: [y / aspect, x / aspect, 0]
      }),
    { pointerEvents: true }
  );

  const bindHover = useHover(
    ({ hovering }) => set({ scale: hovering ? [1.2, 1.2, 1.2] : [1, 1, 1] }),
    {
      pointerEvents: true
    }
  );

  //  const position = spring.threePosition;
  //const scale = spring.threeScale;
  /*</mesh>
    <a.mesh
      {...spring}
      {...{ position: position, scale: scale }}
      //  {...bindDrag()}
      //{...bindHover()}
      castShadow
    >*/

  return (
    <a.mesh {...spring} {...bindDrag()} {...bindHover()} castShadow>
      <dodecahedronBufferGeometry attach="geometry" args={[1.4, 0]} />
      <meshNormalMaterial attach="material" />
    </a.mesh>
  );
}

export const Three2: React.FC = () => {
  return (
    <div css={theme}>
      <Canvas
        style={{ background: "lightblue" }}
        shadowMap
        camera={{ position: [0, 0, 5] }}
      >
        <ambientLight intensity={0.5} />
        <spotLight
          intensity={0.6}
          position={[20, 10, 10]}
          angle={0.2}
          penumbra={1}
          shadow-mapSize-width={2048}
          shadow-mapSize-height={2048}
          castShadow
        />
        <mesh receiveShadow>
          <planeBufferGeometry attach="geometry" args={[1000, 1000]} />
          <meshPhongMaterial attach="material" color="#272727" />
        </mesh>
        <Dodecahedron />
      </Canvas>
    </div>
  );
};
