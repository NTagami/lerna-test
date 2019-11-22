/** @jsx jsx */
import * as React from "react";
import { DispatchProp } from "react-redux";

import { jsx } from "@emotion/core";
import { push } from "connected-react-router";
import { makeFCHelper, vertical } from "./CommonStyles";
import { buildGLScene, GLScene, glError, GLError, GLContext } from "./GLScene";
import * as E from "fp-ts/lib/Either";
//import Option, { none, some, fromNullable } from 'fp-ts/lib/Option'
import { pipe } from "fp-ts/lib/pipeable";

type Props = DispatchProp;

function buildScene(canvas: HTMLCanvasElement): E.Either<GLError, GLScene> {
  /*
  const gl =
    canvas.getContext("webgl2", {
      preserveDrawingBuffer: false,
      alpha: false,
      antialias: false
    }) ?? null;*/
  const gl = canvas.getContext("webgl", {}) ?? null;
  //const gl = canvas.getContext("webgl2", {}) ?? null;

  if (gl != null) {
    return pipe(
      buildGLScene(gl),
      E.map(scene => {
        const GL = WebGLRenderingContext;
        //        const GL = WebGL2RenderingContext;
        gl.viewport(0, 0, canvas.width, canvas.height);
        gl.clearColor(1, 0, 0, 1);
        gl.enable(GL.DEPTH_TEST);
        gl.depthFunc(GL.LEQUAL);
        gl.clear(GL.COLOR_BUFFER_BIT | GL.DEPTH_BUFFER_BIT);
        scene.draw();
        return scene;
      })
    );
  } else {
    return E.left(glError("cannot get gl context"));
  }
}

export const GLTest: React.FC<Props> = ({ dispatch }) => {
  const helper = makeFCHelper();
  const canvasRef = React.useRef<HTMLCanvasElement>(null);
  const sceneRef = React.useRef<GLScene | null>(null);

  React.useEffect(() => {
    if (canvasRef.current != null) {
      pipe(
        buildScene(canvasRef.current),
        E.map(s => (sceneRef.current = s))
      );
    }

    return () => {
      let _ = sceneRef.current?.release();
      sceneRef.current = null;
    };
  }, []);

  return (
    <div css={vertical}>
      <div>{helper.button("Main", () => dispatch(push("/")))}</div>
      <div>
        <canvas ref={canvasRef} width={"500px"} height={"300px"} />
      </div>
    </div>
  );
};
