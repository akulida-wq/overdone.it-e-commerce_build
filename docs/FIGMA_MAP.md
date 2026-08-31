# FIGMA_MAP — карта макета V2

Файл: `B7eubDYEf5ZMeSu0soVmfT` («\<OD\> Overdone.it»), страница «Page » (`826:2681`),
корневая секция: **«E-commerce page sections - ready»** `887:48938` (6560×11742).

Правило чтения: **правый столбец (x=5020) — финальные версии секций**, фреймы левее —
дополнительные состояния (стейты для анимаций). Подтверждено скриншотами всех 21 фреймов.

## Соответствие секций BUILD_V2 ↔ фреймы макета

| S | Секция (BUILD_V2) | Финальный фрейм | node-id | Доп. состояния (node-id, x) |
|---|---|---|---|---|
| S0 | Прелоадер | loading screen | `892:53734` | — (единственный; x=3480) |
| S1 | Hero | First section | `887:49936` | — |
| S2 | Проекты «Businesses growing with us» | Second section | `887:49994` | «Second section (full)» `887:52786` (x=2954, **w=1966**) — полная раскладка обеих карточек |
| S3 | «The website is only the visible part» (pin-слои) | Section 3 - fully opened | `887:50019` | Section 3 - initial state `887:49901` (x=3480) — сложенная карточка сайта |
| S4 | Карточки-компоненты (produx) | Section 4 | `887:50288` | — |
| S5 | Statement | Section 5 | `887:50819` | — |
| S6 | Two ways to build | Section 6 | `887:50833` | — |
| S7 | What we handle (аккордеон-строки) | Section 7 | `887:51505` | hover-стейт строки нарисован ВНУТРИ этого же фрейма (строка UX/UI Design открыта) |
| S8 | How the partnership begins (pin-карусель) | Section 8 - basic state | `887:51573` | intermediate state 3 `887:48939` (x=3480), intermediate state 4 `887:49102` (x=1940) |
| S9 | Калькулятор «Terms are tailored…» | «Section 9 - We earn when the product earns» | `887:51605` | ⚠️ ИМЯ ФРЕЙМА СБИТО: содержимое = калькулятор |
| S10 | «We earn when the product earns» (4 карточки) | «Section 10» | `887:50770` | ⚠️ ИМЯ ФРЕЙМА СБИТО: содержимое = We earn |
| S11 | FAQ | Section 10 - FAQ | `887:52451` | «faq v2» `887:49265` (x=3175) — лист открытых/hover состояний на светлой подложке |
| S12 | Форма + футер | Form + footer **s2** `903:53800` (таб «I'm selling online soon») | + **s1** `903:54647` (x=3480, таб «I already sell online») — оба нужны (2 таба) | «…s1 - v2» `887:49315` (x=100), «…s2 -v2» `887:52501` (x=1640) — считаем устаревшими (см. вопрос №1) |

## Экспортированные ассеты (V2-P1)

| Ассет | Источник (node) | Файл в проекте |
|---|---|---|
| Hero 3D-корзина (прозрачный фон, 2560w) | `887:49937` → rawImage 4096×2272 c альфой | `public/img/v2/hero-3d.webp` (116KB) |
| Фигура прелоадера = большое лого S5 (один и тот же вектор) | `892:53793` / `887:50820` | `assets/icons/loader-figure.svg`, `assets/icons/logo-mark-big.svg` (идентичны) |
| 3D-фон формы (прозрачный) | `903:53801` | `public/img/v2/form-3d.webp` (130KB) |
| Обложка Paparazzi | уже в проекте с прошлой версии | `public/img/partners/paparazzi-og.webp` |
| SVG-иконки секций (S4/S6/S8/S10) | вытягиваются при вёрстке своих секций (P3/P4) через design context + download_assets | `assets/icons/` |

Экспорт узла hero (`download_assets` export) отдаёт запечённый чёрный фон — прозрачная
версия только в rawImages (4096×2272, alpha). Для ретины взято 2560w.

## Ответы заказчика (2026-08-28)

1. **Форма:** финальные — правые тёмные `s1` `903:54647` + `s2` `903:53800` (два таба). Фреймы «-v2» устарели.
2. **S2:** финальный фрейм = стартовый стейт (2 карточки). При скролле СТРОУК карточки растягивается на всю высоту; секция пинится, внутри — горизонтальный скролл как на референсе trionn (selected works).
3. **S8:** intermediate-фреймы — только визуальный ориентир; анимация берётся с референса daoism.
4. **FAQ:** финал — «Section 10 - FAQ» `887:52451`.

## Замечания

- Тексты макета EN: statement S5, интро формы, табы («I already sell online» / «I'm selling
  online soon»), футер-колонка Services = «E-commerce Build» — новые относительно локалей.
- S3 использует карточки-слои в стиле «Layer 16:9 v3» (Website / CRM / Payment service /
  Inventory Tracking / Delivery Integration / Notifications / Analytics) — тексты варианта А.
- Нумерация фреймов «Section 9/10» в макете сбита относительно BUILD_V2 — в карте выше
  соответствие установлено ПО СОДЕРЖИМОМУ (скриншоты), не по именам.
