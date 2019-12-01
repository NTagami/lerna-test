import React from "react";
import ReactDOM from "react-dom";
import "./index.css";
import App from "./App";
import * as serviceWorker from "./serviceWorker";
//import "./custom";

import TestWorker from "worker-loader!./test.worker"; // eslint-disable-line import/no-webpack-loader-syntax

import * as Comlink from "./comlink";
/*const worker = new Worker();

worker.postMessage({ a: 1 });
worker.onmessage = event => {};

worker.addEventListener("message", event => {
  console.log(event);
});
*/

interface ITestWorker {
  new (): Promise<ITestWorker>;
  hoge(): Promise<number>;
}

const Facade: ITestWorker = Comlink.wrap(new TestWorker()) as any;
/*
const Facade = Comlink.proxy<typeof TestWorker>(new TestWorker() as any);
//const Facade = Comlink.proxy(new TestWorker());
*/
async function test() {
  const p = await new Facade();
  const n = await p.hoge();
  console.log(n);
}
test();
//test().then(o => console.log("done"));

ReactDOM.render(<App />, document.getElementById("root"));

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://bit.ly/CRA-PWA
serviceWorker.unregister();
