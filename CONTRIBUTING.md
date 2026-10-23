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

## Releasing

Releases are automated with [release-please](https://github.com/googleapis/release-please). Use [Conventional Commits](https://www.conventionalcommits.org): `fix:` bumps the patch version, `feat:` bumps the minor version (while below 1.0), and `feat!:` or a `BREAKING CHANGE:` footer bumps the major version.

On every push to `main`, release-please updates a release PR with the version bump and `CHANGELOG.md`. Merging that PR tags the release, creates the GitHub release and publishes to npm with provenance.

The release PR is opened by `GITHUB_TOKEN`, so CI does not run on it. The publish job runs the tests again before publishing.

### One-time setup

Publishing uses [npm trusted publishing](https://docs.npmjs.com/trusted-publishers) (OIDC), so no npm token is stored in GitHub.

1. GitHub → Settings → Actions → General → Workflow permissions: enable "Allow GitHub Actions to create and approve pull requests".
2. GitHub → Settings → Environments: create an environment named `npm`.
3. A trusted publisher can only be added to a package that already exists, so publish a placeholder once from your machine: `npm login`, then `npm publish --provenance=false` (publishes `0.0.0`).
4. On npmjs.com → package Settings → Trusted Publisher, add GitHub Actions with owner `ericbsantana`, repository `biome-plugin-i18next`, workflow `release.yml` and environment `npm`. The first OIDC publish must happen within 2 days of adding it.
5. In package Settings → Publishing access, select "Require two-factor authentication and disallow tokens".
