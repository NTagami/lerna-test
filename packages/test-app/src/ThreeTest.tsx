/** @jsx jsx */
import * as React from "react";
import { DispatchProp } from "react-redux";

import { jsx, css } from "@emotion/core";

import { useButtonHelper } from "./CommonStyles";
import { push } from "connected-react-router";
import * as Three from "three";
import {
  Canvas,
  useFrame,
  useLoader,
  ReactThreeFiber
} from "react-three-fiber";

import { PCDLoader } from "three/examples/jsm/loaders/PCDLoader";

const theme = css`
  width: 50vw;
  height: 50vh;
  background-color: #000;
`;
/*
type mesh = ReactThreeFiber.Object3DNode<Three.Mesh, typeof Three.Mesh>;
type boxBufferGeometry = ReactThreeFiber.BufferGeometryNode<
  Three.BoxBufferGeometry,
  typeof Three.BoxBufferGeometry
>;
type meshNormalMaterial = ReactThreeFiber.MaterialNode<
  Three.MeshNormalMaterial,
  [Three.MeshNormalMaterialParameters]
>;
*/
interface Node {
  rotation?: Three.Euler;
}

//const Thing = React.memo(() => {
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

const Test = React.memo(() => {
  //const Test: React.FC = () => {
  const ref = React.useRef<Node>(null);

  useFrame(() => {
    const current: Node | null = ref.current;

    if (current != null && current.rotation != null) {
      current.rotation.y += 0.01;
    }
  });

  const points = useLoader(
    PCDLoader,
    "/Zaghetto.pcd"
    //"http://localhost:3000/pcd/mrdoob/three.js/raw/dev/examples/models/pcd/binary/Zaghetto.pcd"
    //"/pcd/mrdoob/three.js/raw/dev/examples/models/pcd/binary/Zaghetto.pcd"
    //"https://github.com/mrdoob/three.js/raw/dev/examples/models/pcd/binary/Zaghetto.pcd"
    //"http://github.com/mrdoob/three.js/raw/dev/examples/models/pcd/binary/Zaghetto.pcd"
  );
  //React.Suspense

  return (
    <mesh ref={ref} position={[0, 0, 3]}>
      <arrowHelper
        attach="dir"
        args={[new Three.Vector3(0, 1, 0)]}
      ></arrowHelper>
      <arrowHelper
        attach="dir"
        args={[new Three.Vector3(1, 0, 0)]}
      ></arrowHelper>
      <arrowHelper
        attach="dir"
        args={[new Three.Vector3(0, 0, 1)]}
      ></arrowHelper>
      <mesh scale={[6, -6, 6]} position={[-2, 3.2, -3]}>
        <primitive object={points} />
      </mesh>
    </mesh>
  );
  //  return <div></div>;
});

export const ThreeTest: React.FC<DispatchProp> = ({ dispatch }) => {
  const button = useButtonHelper();
  return (
    <>
      <div css={theme}>
        <Canvas
          onCreated={({ gl, camera }) => {
            camera.lookAt(new Three.Vector3(0, 1, 0));

            /*
            gl.clippingPlanes.push(
              new Three.Plane(new Three.Vector3(0, -1, 0), 0)
            );*/
          }}
          camera={{
            fov: 75,
            position: [0, -0.5, 5],
            near: 0.1,
            far: 1000
          }}
        >
          <React.Suspense fallback={null}>
            <Test />
          </React.Suspense>
        </Canvas>
      </div>
      <div>{button("Main", () => dispatch(push("/")))}</div>
    </>
  );
};
