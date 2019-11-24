import fc from "fast-check";

const contains = (text: string, pattern: string) => text.indexOf(pattern) >= 0;

describe("TEST", () => {
  it("should always contain itself", () => {
    fc.assert(fc.property(fc.string(), text => contains(text, text)));
  });
  it("should always contain its substrings", () => {
    fc.assert(
      fc.property(fc.string(), fc.string(), fc.string(), (a, b, c) =>
        contains(a + b + c, b)
      )
    );
  });

  it("TEST", () => {
    expect(true).toBeTruthy();
  });
});
