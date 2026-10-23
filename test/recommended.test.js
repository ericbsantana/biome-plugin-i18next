import assert from "node:assert/strict";
import { execFileSync } from "node:child_process";
import { mkdirSync, mkdtempSync, rmSync, writeFileSync } from "node:fs";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { after, before, test } from "node:test";
import { root, runBiome } from "./lint.js";

const tempDirs = [];
let tarball;

function tempDir(prefix) {
  const dir = mkdtempSync(join(tmpdir(), prefix));
  tempDirs.push(dir);
  return dir;
}

after(() => {
  for (const dir of tempDirs) rmSync(dir, { recursive: true, force: true });
});

before(() => {
  const dir = tempDir("biome-i18next-pack-");
  const name = execFileSync("npm", ["pack", "--silent", "--pack-destination", dir], {
    cwd: root,
    encoding: "utf8",
  }).trim();
  tarball = join(dir, name);
});

function lintConsumer(biomeConfig, files) {
  const project = tempDir("biome-i18next-");
  writeFileSync(join(project, "package.json"), JSON.stringify({ name: "consumer", private: true }));
  execFileSync("npm", ["install", "--silent", "--no-audit", "--no-fund", "--legacy-peer-deps", tarball], {
    cwd: project,
  });
  writeFileSync(join(project, "biome.json"), JSON.stringify({ root: true, ...biomeConfig }));
  for (const [path, content] of Object.entries(files)) {
    mkdirSync(join(project, path, ".."), { recursive: true });
    writeFileSync(join(project, path), content);
  }

  return runBiome("src", project)
    .filter((d) => d.category === "plugin")
    .map((d) => `${d.location.path}:${d.message.match(/^\[(.+?)\]/)[1]}`)
    .sort();
}

const app = 'export const App = () => <p title="Hello">Welcome</p>;\nalert("Oops");\n';
const allRules = [
  "src/App.tsx:no-literal-jsx-attribute",
  "src/App.tsx:no-literal-jsx-text",
  "src/App.tsx:no-literal-ui-call",
];

test("recommended config works through extends after a real npm install", () => {
  const found = lintConsumer(
    { extends: ["biome-plugin-i18next/configs/recommended"] },
    { "src/App.tsx": app, "src/App.test.tsx": "export const T = () => <p>Test text</p>;\n" },
  );
  assert.deepEqual(found, allRules);
});

test("the 1.0.0 extends path keeps working", () => {
  const found = lintConsumer({ extends: ["biome-plugin-i18next/recommended"] }, { "src/App.tsx": app });
  assert.deepEqual(found, allRules);
});

test("recommended preset enables every rule", () => {
  const found = lintConsumer({ plugins: ["biome-plugin-i18next/presets/recommended"] }, { "src/App.tsx": app });
  assert.deepEqual(found, allRules);
});

test("a single rule can be enabled by name", () => {
  const found = lintConsumer({ plugins: ["biome-plugin-i18next/no-literal-jsx-text"] }, { "src/App.tsx": app });
  assert.deepEqual(found, ["src/App.tsx:no-literal-jsx-text"]);
});

test("suppression uses the package-qualified rule name with every setup", () => {
  const files = {
    "src/a.ts": '// biome-ignore lint/plugin/biome-plugin-i18next/no-literal-ui-call: brand\nalert("Acme");\nalert("Flagged");\n',
  };
  for (const config of [
    { extends: ["biome-plugin-i18next/configs/recommended"] },
    { plugins: ["biome-plugin-i18next/presets/recommended"] },
    { plugins: ["biome-plugin-i18next/no-literal-ui-call"] },
  ]) {
    assert.deepEqual(lintConsumer(config, files), ["src/a.ts:no-literal-ui-call"], JSON.stringify(config));
  }
});
