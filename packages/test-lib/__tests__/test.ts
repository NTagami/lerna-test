import fc from "fast-check";
import { sort } from "../lib/sort";

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

test("should contain the same items", () => {
  const count = (tab: number[], element: number) =>
    tab.filter(v => v === element).length;
  fc.assert(
    fc.property(fc.array(fc.integer()), data => {
      const sorted = sort(data);
      expect(sorted.length).toEqual(data.length);
      for (const item of data) {
        expect(count(sorted, item)).toEqual(count(data, item));
      }
    })
  );
});

test("should produce ordered array", () => {
  fc.assert(
    fc.property(fc.array(fc.integer()), data => {
      const sorted = sort(data);
      for (let idx = 1; idx < sorted.length; ++idx) {
        expect(sorted[idx - 1]).toBeLessThanOrEqual(sorted[idx]);
      }
    })
  );
});
