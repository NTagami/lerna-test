import * as E from "fp-ts/lib/Either";
import * as SE from "./StateEither";
import * as ES from "./EitherState";
import { array } from "fp-ts/lib/Array";
import { pipe, pipeable } from "fp-ts/lib/pipeable";
import * as StateT from "fp-ts/lib/StateT";
import * as glMatrix from "gl-matrix";
import { sequenceS } from "fp-ts/lib/Apply";
import { dummyAction } from "./action";

export type GLContext = WebGLRenderingContext;
//export type GLContext = WebGL2RenderingContext;

const VERTEX_SHADER_SOURCE = `
attribute vec3 aVertexPosition;

uniform mat4 uMVMatrix;
uniform mat4 uPMatrix;

void main(void) {
  gl_Position = uPMatrix * uMVMatrix * vec4(aVertexPosition, 1.0);
}
`;

const FRAGMENT_SHADER_SOURCE = `void main(void) {
  gl_FragColor = vec4(1.0, 0.0, 1.0, 1.0);
}`;

const GL = WebGLRenderingContext;
//const GL = WebGL2RenderingContext;

export interface GLError {
  type: "GLError";
  message: string;
}

export function glError(message: string): GLError {
  return { type: "GLError", message };
}

function loadShader(
  gl: GLContext,
  shaderType: number,
  source: string
): E.Either<GLError, WebGLShader> {
  let shader = gl.createShader(shaderType);
  if (shader != null) {
    gl.shaderSource(shader, source);
    gl.compileShader(shader);
    if (gl.getShaderParameter(shader, GL.COMPILE_STATUS) as boolean) {
      return E.right(shader);
    } else {
      return E.left(glError(`compile shader error ${shaderType}`));
    }
  } else {
    return E.left(glError("cannot create shader"));
  }
}

function createProgram(
  gl: GLContext,
  vertexShader: WebGLShader,
  fragmentShader: WebGLShader
): E.Either<GLError, WebGLProgram> {
  let program = gl.createProgram();
  if (program != null) {
    gl.attachShader(program, vertexShader);
    gl.attachShader(program, fragmentShader);
    gl.linkProgram(program);
    if (gl.getProgramParameter(program, GL.LINK_STATUS) as boolean) {
      gl.useProgram(program);
      return E.right(program);
    } else {
      return E.left(glError("link program failed"));
    }
  } else {
    return E.left(glError("cannot create gl program"));
  }
}

interface GLAttributes {
  vertexPos: number;
  projectionMatrix: WebGLUniformLocation | null;
  modelViewMatrix: WebGLUniformLocation | null;
}

function initAttr(
  gl: GLContext,
  program: WebGLProgram
): E.Either<GLError, GLAttributes> {
  const n = gl.getAttribLocation(program, "aVertexPosition");
  gl.enableVertexAttribArray(n);

  const m1 = gl.getUniformLocation(program, "uPMatrix");
  const m2 = gl.getUniformLocation(program, "uMVMatrix");

  return pipe(
    sequenceS(E.either)({
      projectionMatrix: E.fromNullable(glError("no projection matrix"))(m1),
      modelViewMatrix: E.fromNullable(glError("no model view matrix"))(m2)
    }),
    E.map(x => ({ ...x, vertexPos: n }))
  );

  //  return E.right({ vertexPos: n, projectionMatrix: m1, modelViewMatrix: m2 });
}
var horizAspect = 480.0 / 640.0;

function initBuffers(gl: GLContext): E.Either<GLError, WebGLBuffer> {
  const b = gl.createBuffer();
  if (b != null) {
    gl.bindBuffer(gl.ARRAY_BUFFER, b);

    var vertices = [
      1.0,
      1.0,
      0.0,
      -1.0,
      1.0,
      0.0,
      1.0,
      -1.0,
      0.0,
      -1.0,
      -1.0,
      0.0
    ];

    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(vertices), gl.STATIC_DRAW);
    return E.right(b);
  } else {
    return E.left(glError("cannot create gl buffer"));
  }
}

export class GLScene {
  private gl: GLContext;
  private program: WebGLProgram;
  private vertex: WebGLShader;
  private fragment: WebGLShader;
  private attr: GLAttributes;
  private buffer: WebGLBuffer;
  constructor(
    gl: GLContext,
    pg: WebGLProgram,
    vertex: WebGLShader,
    fragment: WebGLShader,
    buffer: WebGLBuffer,
    attr: GLAttributes
  ) {
    this.gl = gl;
    this.program = pg;
    this.vertex = vertex;
    this.fragment = fragment;
    this.attr = attr; //initAttr(gl, pg);
    this.buffer = buffer;
  }
  public release() {
    this.gl.deleteProgram(this.program);
    this.gl.deleteShader(this.vertex);
    this.gl.deleteShader(this.fragment);
    this.gl.deleteBuffer(this.buffer);
  }

  public draw() {
    this.gl.clearColor(0.0, 0.0, 0.0, 1.0); // Clear to black, fully opaque
    this.gl.clearDepth(1.0); // Clear everything
    this.gl.enable(GL.DEPTH_TEST); // Enable depth testing
    this.gl.depthFunc(GL.LEQUAL); // Near things obscure far things

    // Clear the canvas before we start drawing on it.

    this.gl.clear(GL.COLOR_BUFFER_BIT | GL.DEPTH_BUFFER_BIT);

    const p = glMatrix.mat4.create();
    glMatrix.mat4.ortho(p, -2.0, 2.0, -2.0, 2.0, 0.1, 1000);
    //glMatrix.mat4.perspective(p, (45 * Math.PI) / 180, 1.0, 0.1, 1000);
    this.gl.uniformMatrix4fv(this.attr.projectionMatrix, false, p);

    const p2 = glMatrix.mat4.create();
    glMatrix.mat4.translate(p2, p2, [0, 0, -6]);
    this.gl.uniformMatrix4fv(this.attr.modelViewMatrix, false, p2);

    this.gl.bindBuffer(GL.ARRAY_BUFFER, this.buffer);
    this.gl.vertexAttribPointer(this.attr.vertexPos, 3, GL.FLOAT, false, 0, 0);
    this.gl.drawArrays(GL.TRIANGLE_STRIP, 0, 4);
  }
}

/*
function dummy(): SE.StateEither<WebGLShader, GLError, WebGLShader> {
  return pipe(SE.get());
  //  return SE.left(glError(""));
}
*/
interface GLBuilder {
  vertexShader: WebGLShader | null;
}

interface DummyState {
  st: number;
}

export function buildGLScene(gl: GLContext): E.Either<GLError, GLScene> {
  let vertexShader: WebGLShader | null = null;
  let fragmentShader: WebGLShader | null = null;
  let program: WebGLProgram | null = null;
  let buffer: WebGLBuffer | null = null;

  /*
  pipe(
    E.right(0),
    E.chain(o => E.right(2)),
    E.chain(o => E.left(""))
  );
*/
  /*
  let state = { st: 0 };

  let c = pipe(
    ES.fromEither<DummyState, string, number>(E.right(1)),
    ES.chain(x => ES.modify(o => ({ ...o, st: x }))),
    ES.chain(o => s => [E.right(3), s]),
    //ES.chain(x => ES.fromEither(E.left("ERROR"))),
    ES.chain(x => ES.modify(o => ({ ...o, st: x })))
  );

  let ret = ES.run<DummyState, string, any>(c, state);

  let eRet = ret[0];
  //  let o = pipe(eRet, E.mapLeft(e => e), E.map(o => o));

  E.fold<string, any, any>(
    x => x,
    e => e
  )(eRet);

  if (E.isLeft(eRet)) {
    console.log(eRet.left);
  } else {
  }

  console.log(ret[0], ret[1]);
*/
  /*
  let builder = { vertexShader: null };

  const c = pipe(
    ES.fromEither<GLBuilder, GLError, WebGLShader>(
      loadShader(gl, GL.VERTEX_SHADER, VERTEX_SHADER_SOURCE)
    ),
    ES.chain(o => ES.modify(x => ({ ...x, vertexShader: o })))
  );
  const ret = ES.run(c, builder);
*/
  /*
  let builder = { vertexShader: null };

  const c = pipe(
    SE.fromEither<GLBuilder, GLError, WebGLShader>(
      loadShader(gl, GL.VERTEX_SHADER, VERTEX_SHADER_SOURCE)
    ),
    SE.chain(o => SE.modify(x => ({ ...x, vertexShader: o }))),
    SE.chain(o => s =>
      pipe(
        loadShader(gl, GL.FRAGMENT_SHADER, FRAGMENT_SHADER_SOURCE),
        E.mapLeft(e => e),
        E.map(x => [x, s])
      )
    )
    //SE.chain(x => s => E.left(glError("")))
  );

  const ret = SE.run(c, { vertexShader: null });
*/ return pipe(
    loadShader(gl, GL.VERTEX_SHADER, VERTEX_SHADER_SOURCE),
    E.chain(x => {
      vertexShader = x;
      return pipe(
        loadShader(gl, GL.FRAGMENT_SHADER, FRAGMENT_SHADER_SOURCE),
        E.chain(y => {
          fragmentShader = y;
          return pipe(
            createProgram(gl, x, y),
            E.chain(p => {
              program = p;
              return pipe(
                initBuffers(gl),
                E.chain(b => {
                  buffer = b;
                  return pipe(
                    initAttr(gl, p),
                    E.map(a => new GLScene(gl, p, x, y, b, a))
                  );
                })
              );
            })
          );
        })
      );
    }),
    E.mapLeft(e => {
      console.log(e);
      gl.deleteShader(vertexShader);
      gl.deleteShader(fragmentShader);
      gl.deleteProgram(program);
      gl.deleteBuffer(buffer);
      return e;
    })
  );
}
