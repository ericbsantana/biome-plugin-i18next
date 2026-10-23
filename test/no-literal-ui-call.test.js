import assert from "node:assert/strict";
import { test } from "node:test";
import { linesFlagged } from "./lint.js";

test("no-literal-ui-call flags literal text passed to alert, confirm, prompt and toast", () => {
  assert.deepEqual(linesFlagged("ui-call.ts", "no-literal-ui-call"), [1, 2, 3, 4, 5, 6, 6]);
});
