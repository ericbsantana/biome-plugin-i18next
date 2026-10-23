import assert from "node:assert/strict";
import { test } from "node:test";
import { lint } from "./lint.js";

test("rules can be suppressed per rule name or for all plugins", () => {
  const plugin = lint("suppression.tsx").filter((d) => d.message.startsWith("[no-literal-ui-call]"));
  assert.deepEqual(plugin.map((d) => d.line), [6]);
});
