# biome-plugin-i18next

Catch untranslated, user-facing strings in React code with [Biome](https://biomejs.dev). It does the job of `eslint-plugin-i18next`'s `no-literal-string` without ESLint.

```bash
npm i -D biome-plugin-i18next
```

```json
{
  "extends": ["biome-plugin-i18next/configs/recommended"]
}
```

Diagnostics show up in `biome lint`, `biome check`, your editor and CI. Requires Biome 2.6.2 or newer.

## Rules

| Rule | Flags | Ignores |
| --- | --- | --- |
| `no-literal-jsx-text` | `<p>Hello</p>` | text inside `<Trans>` and `<Translation>`, text without letters (`42`, `—`, whitespace) |
| `no-literal-jsx-attribute` | `placeholder`, `title`, `alt`, `label`, `aria-label`, `aria-description`, `aria-placeholder`, `aria-roledescription`, `aria-valuetext` set to literal text | every other attribute (`className`, `href`, `data-*`, …), values without letters |
| `no-literal-ui-call` | literal text passed to `alert`, `confirm`, `prompt` (also on `window`), `toast(...)` and `toast.*(...)` | `t(...)` calls, variables, `console.*`, `throw new Error(...)` |

Template literals are flagged when their static parts contain letters: `` `Hello ${name}` `` is flagged, `` `${count}` `` is not.

The recommended config skips `*.test.*`, `*.spec.*`, `*.stories.*`, `__tests__/` and `__mocks__/`.

## Suppressing

```tsx
// biome-ignore lint/plugin/biome-plugin-i18next/no-literal-jsx-text: brand name
<span>Acme</span>
```

`lint/plugin` without a rule name suppresses all plugins on the next line.

## Customizing

Biome plugins don't take options, but you can choose which rules run and on which files. Use the preset or individual rules instead of the config:

```json
{
  "plugins": [
    {
      "path": "biome-plugin-i18next/presets/recommended",
      "includes": ["src/**", "!src/admin/**"]
    }
  ]
}
```

```json
{
  "plugins": ["biome-plugin-i18next/no-literal-jsx-text", "biome-plugin-i18next/no-literal-jsx-attribute"]
}
```

## Known limitations

- Strings inside expressions are not checked: `placeholder={isNew ? "Create" : "Edit"}`, `alert(ok ? "Yes" : "No")`.
- Translation calls are recognized by name (`t`, `<Trans>`, `<Translation>`), not by import.
- Missing or unused translation keys are not checked, because a Biome plugin sees one file at a time.
