import { spawnSync } from "node:child_process";
import { fileURLToPath } from "node:url";

export const root = fileURLToPath(new URL("..", import.meta.url));
const biome = `${root}node_modules/.bin/biome`;

export function runBiome(path, cwd) {
  const result = spawnSync(biome, ["lint", "--reporter=json", "--max-diagnostics=none", path], {
    cwd,
    encoding: "utf8",
  });
  try {
    return JSON.parse(result.stdout).diagnostics;
  } catch {
    throw new Error(`Biome did not produce a report (exit ${result.status}):\n${result.stderr}${result.stdout}`);
  }
}

export function lint(fixture) {
  return runBiome(`fixtures/${fixture}`, `${root}test`).map((d) => ({
    line: d.location.start.line,
    message: d.message,
  }));
}

export function linesFlagged(fixture, rule) {
  return lint(fixture)
    .filter((d) => d.message.startsWith(`[${rule}]`))
    .map((d) => d.line);
}
