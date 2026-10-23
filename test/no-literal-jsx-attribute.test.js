import assert from "node:assert/strict";
import { test } from "node:test";
import { linesFlagged } from "./lint.js";

test("no-literal-jsx-attribute flags literal text in user-facing attributes only", () => {
  assert.deepEqual(linesFlagged("jsx-attribute.tsx", "no-literal-jsx-attribute"), [3, 4, 5, 6, 7, 8, 9, 10, 11]);
});
