# Contributing

```bash
npm install
npm test
```

Each rule in `rules/` has a fixture in `test/fixtures/` and a test asserting the exact flagged lines. `test/recommended.test.js` packs the package, installs it into a temp project and lints through `extends`, which is how users run it.

## GritQL quirks in Biome

- Regexes must match the whole node text. Use `r"(?s).*\p{L}.*"` for "contains a letter", not `r"\p{L}"`.
- Capturing groups in a regex silently prevent any match. Use non-capturing groups: `r"(?:title|alt)"`.
- Plugin compile errors only say "Failed to compile the Grit plugin". Bisect the pattern in a scratch file.
- The plugin file name is the suppression name: `rules/foo.grit` is suppressed with `biome-ignore lint/plugin/foo`.
- Use `biome inspect file <path>` or the playground to find node names like `JsxAttribute` and their fields.
