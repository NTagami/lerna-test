import * as Comlink from "./comlink";

class TestWorker {
  constructor() {
    console.log("OK");
  }
  hoge(): number {
    return 100;
  }
}

Comlink.expose(TestWorker);
/*
// Worker.ts
const ctx: Worker = self as any;

// Post data to parent thread
ctx.postMessage({ foo: "foo" });

// Respond to message from parent thread
ctx.addEventListener("message", event => console.log(event));
*/
