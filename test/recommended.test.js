import assert from "node:assert/strict";
import { execFileSync } from "node:child_process";
import { mkdtempSync, writeFileSync, mkdirSync } from "node:fs";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { test } from "node:test";
import { fileURLToPath } from "node:url";

const root = fileURLToPath(new URL("..", import.meta.url));

test("recommended shared config works after a real npm install", () => {
  const project = mkdtempSync(join(tmpdir(), "biome-i18next-"));
  const packed = execFileSync("npm", ["pack", "--silent", "--pack-destination", project], {
    cwd: root,
    encoding: "utf8",
  }).trim();

  writeFileSync(join(project, "package.json"), JSON.stringify({ name: "consumer", private: true }));
  execFileSync("npm", ["install", "--silent", "--no-audit", "--no-fund", "--legacy-peer-deps", join(project, packed)], { cwd: project });

  writeFileSync(
    join(project, "biome.json"),
    JSON.stringify({ root: true, extends: ["biome-plugin-i18next/recommended"] }),
  );
  mkdirSync(join(project, "src"));
  writeFileSync(
    join(project, "src", "App.tsx"),
    'export const App = () => <p title="Hello">Welcome</p>;\nalert("Oops");\n',
  );
  writeFileSync(join(project, "src", "App.test.tsx"), "export const T = () => <p>Test text</p>;\n");

  let stdout;
  try {
    stdout = execFileSync(
      join(root, "node_modules", ".bin", "biome"),
      ["lint", "--reporter=json", "src"],
      { cwd: project, encoding: "utf8", stdio: ["ignore", "pipe", "ignore"] },
    );
  } catch (error) {
    stdout = error.stdout;
  }

  const diagnostics = JSON.parse(stdout).diagnostics.filter((d) => d.category === "plugin");
  const found = diagnostics.map((d) => `${d.location.path}:${d.message.match(/^\[(.+?)\]/)[1]}`).sort();
  assert.deepEqual(found, [
    "src/App.tsx:no-literal-jsx-attribute",
    "src/App.tsx:no-literal-jsx-text",
    "src/App.tsx:no-literal-ui-call",
  ]);
});
