const FUN_FACTS = [
  "для улучшения качества жизни этот сайт не использует Cookies",
  "этот сайт использует astro.build",
  "этот сайт теперь cодержит больше информации",
  "этот факт я наполняю абсолютно бесполезным текстом, чтобы вы могли  посмотреть, как выглядит длинный текст на странице",
  "⛄",
  "windows сломала мне вход по пинкоду после входа в микрослоп аккаунт...",
  "не все факты здесь — утверждения.",
  "«привет, мир!»",
  "я не умею разговаривать с людьми",
];

const wrappers = document.querySelectorAll<HTMLElement>("[data-funfact]");
wrappers.forEach((wrapper) => {
  const pickFact = (current: string | null) => {
    if (FUN_FACTS.length <= 1) return FUN_FACTS[0];
    let next = current;
    while (next === current) {
      next = FUN_FACTS[Math.floor(Math.random() * FUN_FACTS.length)];
    }
    return next!;
  };

  const text = wrapper.querySelector<HTMLElement>("[data-funfact-text]");
  if (!text) return;
  const FADE_MS = 700;
  let fact = pickFact(null);
  text.classList.add("opacity-100");
  text.textContent = fact;
  let timer: ReturnType<typeof setTimeout> | null = null;

  wrapper.addEventListener("click", () => {
    if (timer) clearTimeout(timer);
    text.classList.remove("opacity-100");
    text.classList.add("opacity-0");
    timer = setTimeout(() => {
      fact = pickFact(fact);
      text.textContent = fact;
      text.classList.remove("opacity-0");
      text.classList.add("opacity-100");
    }, FADE_MS);
  });
});
export {};
