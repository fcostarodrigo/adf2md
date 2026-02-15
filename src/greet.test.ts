import { describe, expect, it } from "bun:test";
import { greet } from "./greet";

describe(greet, () => {
  it("should greet the world", () => {
    expect(greet("World")).toBe("Hello, World!");
  });
});
