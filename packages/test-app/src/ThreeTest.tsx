import * as React from "react";
import { DispatchProp } from "react-redux";

import { useButtonHelper } from "./CommonStyles";
import { push } from "connected-react-router";
import * as Three from "three";
import { Canvas, useFrame, ReactThreeFiber } from "react-three-fiber";

type mesh = ReactThreeFiber.Object3DNode<Three.Mesh, typeof Three.Mesh>;
type boxBufferGeometry = ReactThreeFiber.BufferGeometryNode<
  Three.BoxBufferGeometry,
  typeof Three.BoxBufferGeometry
>;
type meshNormalMaterial = ReactThreeFiber.MaterialNode<
  Three.MeshNormalMaterial,
  [Three.MeshNormalMaterialParameters]
>;

interface Node {
  rotation?: Three.Euler;
}

const Thing: React.FC = () => {
  const ref = React.useRef<Node>(null);

  useFrame(() => {
    const current: Node | null = ref.current;

    if (current != null && current.rotation != null) {
      current.rotation.x = current.rotation.y += 0.01;
    }
  });

  return (
    <mesh
      ref={ref}
      onClick={e => console.log("click")}
      onPointerOver={e => console.log("hover")}
      onPointerOut={e => console.log("unhover")}
    >
      <boxBufferGeometry attach="geometry" args={[1, 1, 1]} />
      <meshNormalMaterial attach="material" />
    </mesh>
  );
};

export const ThreeTest: React.FC<DispatchProp> = ({ dispatch }) => {
  const button = useButtonHelper();
  return (
    <>
      <Canvas>
        <Thing />
      </Canvas>
      <div>{button("Main", () => dispatch(push("/")))}</div>
    </>
  );
};
