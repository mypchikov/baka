const el = document.querySelector<HTMLElement>("[data-age]");
if (el) {
  const birthDate = Date.UTC(2009, 10, 10, 0, 0, 0);
  const update = () => {
    const diffYears = (Date.now() - birthDate) / (1000 * 60 * 60 * 24 * 365.25);
    el.textContent = diffYears.toFixed(8);
  };
  update();
  setInterval(update, 100);
}
export {};
