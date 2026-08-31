# HANDOFF — E-commerce Partnership Landing (V2 + круг правок R3)

Актуально на 2026-08-29, после V2-P1…P10 и R3-P1…P6 (см. SESSION_CONTEXT.md — полная
история). Страница пересобрана по Figma-макету `B7eubDYEf5ZMeSu0soVmfT`, нода `887:48938`
(карта: docs/FIGMA_MAP.md). Приоритет доков: CHANGES_R3.md (лежит уровнем выше, в
«Overdone site/») > BUILD_V2.md > старые docs/. Исследование больших десктопов —
docs/BIG_DESKTOP.md.

## 1. Перенос в основной сайт overdone.it

Самодостаточный Nuxt 4 проект (SSR, plain JS). Переносить:
- `components/` (sections + ui + layout; `_legacy/` НЕ переносить — архив v1)
- `composables/useLang.js`, `composables/useScrollMotion.js`
- `locales/en.json`, `locales/ua.json` (блок `v2.*` — тексты новой версии; старые ключи
  оставлены для кейс-страницы и истории)
- `assets/` (scss-токены, шрифты, icons/), `public/` (img, og-image.jpg, favicon)
- `pages/index.vue`, `pages/projects/paparazzi.vue` (кейс из v1 — до отдельного редизайна)
- `nuxt.config.js`: инлайн pre-paint скрипт (`js`/`od-preload` классы + `?nointro`),
  components ignore `_legacy`, nitro compressPublicAssets
- Зависимости: gsap, lenis, sass

## 2. Архитектура моушена

- `useScrollMotion`: init (Lenis+ScrollTrigger, один rAF), `sectionReveal(root)` —
  единый вход секций (маски заголовков `.v2-mask` + контент `.v2-reveal`), scrollTo,
  reducedMotion. Pre-hide в main.scss под `html.js` + no-preference (SSR не мигает).
- Прелоадер (S0): `html.od-preload` ставится pre-paint; проценты по реальной загрузке
  (fonts + hero webp), min 1.2s / max 2.5s; hero-каскад стартует по гейту
  `useState('od-preloader-active')`. Показ раз за сессию; reduce и `?nointro` — без него.
- Пины (все ≥1025px + no-preference, ниже — статичные фолбэки):
  S2 (+180%: рамка тянется → горизонтальный скролл трека), S3 (+220%: наклон в изометрию
  → разъезд слоёв → подписи), S8 (+250%: карусель карточек с blur, синхронный текст).
- Известные грабли GSAP/Vue задокументированы в SESSION_CONTEXT (clearProps возвращает
  CSS pre-hide; yPercent затягивает CSS-сдвиг в px-кэш — обнулять y; классы от gsap
  стираются Vue-ререндером — писать inline/classList; замеры только после синхронного
  classList.add('is-motion')).

## 3. Lighthouse (mobile, локальный прод-билд, --throttling-method=devtools)

После R3-P6 (2026-08-29):
- Повторный визит (`?nointro=1`): **Perf 96 / A11y 96**, LCP 1.6s, CLS 0.002, TBT 130ms
- Первый визит (с прелоадером): **Perf 95 / A11y 96**, LCP 1.6s, TBT 80ms
- CLS полного скролл-прохода (замер руками): 0.0006. ВАЖНО: не вешать overflow:hidden
  на пинящиеся секции — Chrome считает это layout-shift 1.0 на входе/выходе пина
  (найдено и исправлено в R3-P6; клип — на внутренней обёртке, как у S2)
- Мерить ТОЛЬКО devtools-методом (simulated на localhost даёт ложный FCP)
- SSR-HTML не жмётся node-сервером — на проде поставить gzip/brotli на инфре
  (nginx/CDN). PSlider рендерит тики client-only (SSR-заглушка) — иначе +110KB HTML.

## 4. TODO — заказчик

| Что | Детали |
|---|---|
| TODO(UA-REVIEW) — вычитка всех новых UA-строк | локали `v2.*`: hero_title_l1/l2, hero_note («від запуску до реальних продажів» — R3), projects_title, website, details, next_desc; layers_p1/p2 + имена/описания 7 слоёв; statement_l1/l2 + statement_cap_left/right; compare_lead, classic_sub, partner_sub, included_title; calc_lead, calc_chips; contact_p, contact_p2, tab_has, tab_no, f_company, f_contact; cta.how; НОВОЕ R3: included.items — 12 услуг |
| Кол-во карточек S4 | в кадре макета 4 карточки (обе крайние срезаны краями) — построены ВСЕ 12 из списка R3.4.3; если нужно меньше — убрать хвост списка |
| Направление ленты S4 | лента едет влево при скролле вниз (взгляд идёт по списку 1→12, прогресс растёт); буквальное «карточки слева направо» = флип одной строкой в SectionIncluded (x: → положительное) |
| Диапазоны отображения слайдеров | непрерывные (R3.9); показ интерполируется: volume EN $5k–500k / UA 50 тис–12 млн ₴, AOV EN $50–2500 / UA 500–25 тис ₴, маржа 5–80%, форма EN $5k–150k / UA 50 тис–3 млн ₴ — подтвердить с экономикой (useSliderFormat.js + SectionCalc/SectionContact) |
| Сабтайтлы карточек S6 | в макете заглушка — поставлены «You pay a fixed budget before launch» / «We get paid a percentage of real sales» (v2.classic_sub/partner_sub) — подтвердить |
| Теги шагов S8 03–05 | в макете только observation/planning — придуманы agreement/development/growth (v2.steps_tags) |
| Ends слайдеров S9 | подписи краёв взяты из прежних ступеней (Low…High / Under $10k…$400k+ / Under $100…$2k+ / 1…10) — подтвердить |
| Лейблы строк S6 | в макете разнобой между карточками — взяты по левой («Motivation of the performer», «Post-launch», «Decision») |
| Скрины админки кейса | `public/img/case-paparazzi/admin-orders.webp`, `admin-products.webp` → `pages/projects/paparazzi.vue` (TODO(USER)) |

## 5. TODO — техника

| Что | Где |
|---|---|
| TODO(API): endpoint формы | `SectionContact.vue` onSubmit (mock: console + success) |
| TODO(FAKE): формула калькулятора | `SectionCalc.vue` estimateRange — согласовать с экономикой (с R3 принимает непрерывные позиции 0..100) |
| TODO(ASSET-3D): настоящее 3D вращение фигур | сейчас плоские webp/svg (rotateZ); нужен GLB или секвенция кадров — hero, прелоадер, форма |
| Контраст кнопок | белый на брендовом красном #F12625 = 4.2:1 (не проходит 4.5 при 20px) — единственный contrast-фейл A11y; лечится затемнением красного ≈#D92322, решение за брендом |
| Кейс-страница /projects/paparazzi | остаётся в визуале v1 до отдельного редизайна (BUILD_V2 §S2) |
| bf-cache | страница не восстанавливается из bfcache (Lenis/unload) — минорно |

## 6. Тестовые рычаги

- `?nointro=1` — пропустить прелоадер (QA/Lighthouse repeat-view)
- сессия: `sessionStorage.od_intro` — прелоадер раз за сессию
- reduced-motion: полный статичный вариант всех секций (без пинов/лупов/прелоадера)
