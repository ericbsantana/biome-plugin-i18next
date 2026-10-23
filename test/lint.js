import { execFileSync } from "node:child_process";
import { fileURLToPath } from "node:url";

const root = fileURLToPath(new URL("..", import.meta.url));
const biome = `${root}node_modules/.bin/biome`;

export function lint(fixture, cwd = `${root}test`) {
  let stdout;
  try {
    stdout = execFileSync(
      biome,
      ["lint", "--reporter=json", "--max-diagnostics=none", `fixtures/${fixture}`],
      { cwd, encoding: "utf8", stdio: ["ignore", "pipe", "ignore"] },
    );
  } catch (error) {
    stdout = error.stdout;
  }
  return JSON.parse(stdout).diagnostics.map((d) => ({
    line: d.location.start.line,
    message: d.message,
  }));
}

export function linesFlagged(fixture, rule) {
  return lint(fixture)
    .filter((d) => d.message.startsWith(`[${rule}]`))
    .map((d) => d.line);
}
