# baka

Личный сайт на [Astro](https://astro.build).

## Разработка

```bash
pnpm install
pnpm dev        # dev-сервер: http://localhost:4321
pnpm build      # статическая сборка в dist/
pnpm preview    # локальный просмотр сборки
pnpm check      # проверка типов (astro check)
```

## Структура

- `src/pages/index.astro` — главная: «рабочий стол» с окнами; блог открывается в новых окнах без перезагрузки страницы.
- `src/components/` — окно (draggable), «рабочий стол», баннеры 88x31, контакты.
- `src/scripts/` — клиентские скрипты без фреймворков (LastFM, webring, age-timer, DVD-режим, окно, открытие постов).
- `content/blog/` — посты `.md`/`.mdx` с фронтматтером (`draft: true` скрывает пост).
- `public/` — статика: баннеры (`88x31/`) и картинки (`static/`).

Пасхалка: `/?dvd` включает «DVD-режим» с летающими баннерами.