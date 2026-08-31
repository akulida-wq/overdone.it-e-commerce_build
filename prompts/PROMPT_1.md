# PROMPT 1 — Каркас проекта

Скопируй в Claude Code (рекомендуется Opus):

---

Прочитай CLAUDE.md и все файлы в docs/ (CONTEXT, DESIGN, PAGE_SPEC, CONTENT_SOURCE, CONTENT_ADDITIONS). Это этап 1 из 7 — каркас. Сделай:

1. Инициализируй Nuxt 4 проект в корне (SSR, JavaScript, без TypeScript). Установи только: sass, gsap, lenis
2. Собери SCSS-базу по DESIGN.md: `_variables.scss` (шрифты, шкала размеров, spacing, radius, breakpoints, миксин respond), `_theme.scss` (все CSS custom properties цветов), `_mixins.scss`, `main.scss` (reset, базовая типографика, container, utility-классы reveal)
3. Подключи шрифты: IBM Plex Mono (latin+cyrillic) локальными файлами в assets/fonts; для display-шрифта создай `$font-display` с fallback-стеком (см. DESIGN §2, оставь TODO(FONT) про SF Pro с прода)
4. Создай `composables/useLang.js` и `locales/en.json`, `locales/ua.json`. Перенеси в локали ВСЕ тексты из CONTENT_SOURCE.md и CONTENT_ADDITIONS.md дословно, со структурой ключей из PAGE_SPEC. Ничего не сокращать
5. Создай `composables/useScrollMotion.js`: инициализация Lenis + GSAP ScrollTrigger, синхронизация, глобальный флаг prefers-reduced-motion, хелпер reveal(el, opts)
6. UI-компоненты: PButton (primary/secondary/ghost, слот иконки-стрелки), SectionEyebrow, SectionTitle (парсит `[акцент]` в красный span), PAccordionItem
7. Layout: PHeader и PFooter по PAGE_SPEC §1 и §15 (включая переключатель языка в футере и поведение шапки при скролле), LangModal по §0
8. pages/index.vue: шапка, пустые секции-заглушки в правильном порядке с id, футер, модалка

Закончи: `npm run build`, исправь всё до чистого билда. Затем `npm run dev` и проверь: модалка появляется один раз и запоминает выбор, свитчер в футере переключает язык без перезагрузки, шапка скрывается/появляется, reduced-motion отключает Lenis.

Если что-то пошло не так: не переустанавливай проект заново — читай текст ошибки, чини точечно; при конфликте версий Nuxt/GSAP зафиксируй последние стабильные; если Lenis конфликтует со ScrollTrigger — проверь, что используется `lenis.on('scroll', ScrollTrigger.update)` и один rAF-цикл.

---
