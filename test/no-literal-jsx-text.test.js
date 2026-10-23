import assert from "node:assert/strict";
import { test } from "node:test";
import { linesFlagged } from "./lint.js";

test("no-literal-jsx-text flags only untranslated text with letters", () => {
  assert.deepEqual(linesFlagged("jsx-text.tsx", "no-literal-jsx-text"), [3, 4, 5]);
});
