export const Invalid = () => (
  <div>
    <p>Hello world</p>
    <i>Ünïcode café</i>
    <button type="submit">Save</button>
  </div>
);

export const Valid = () => (
  <div>
    <p>{t("greeting")}</p>
    <Trans>Hello <b>world</b></Trans>
    <Trans i18nKey="k">Nested <b>text</b></Trans>
    <Translation>{(t) => <p>render prop</p>}</Translation>
    <span> </span>
    <b>42</b>
    <b>—</b>
    <b>{count} / {total}</b>
  </div>
);
