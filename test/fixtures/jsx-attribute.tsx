export const Invalid = () => (
  <form>
    <input placeholder="Search" />
    <img alt="Company logo" />
    <a title="Open in new tab" href="/x" />
    <button aria-label="Close dialog" />
    <div aria-description="Shows totals" />
    <option label="First option" />
    <input placeholder={"Email address"} />
    <input placeholder={`Your name`} />
    <input placeholder={`Hello ${name}`} />
  </form>
);

export const Valid = () => (
  <form className="flex items-center" data-testid="search-form">
    <input placeholder={t("search")} type="text" name="query" />
    <img alt="" src="/logo.png" />
    <a title={t("open")} href="https://example.com" rel="noopener" />
    <button aria-label={label} id="close-button" />
    <span title="—" />
    <input placeholder={`${prefix}`} />
    <section aria-labelledby="heading-id" />
    <Icon titleId="iconTitle" />
    <input placeholder={tagged`Search`} />
  </form>
);
