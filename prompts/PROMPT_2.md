# PROMPT 2 — Hero, Ticker, Проекты

Скопируй в Claude Code:

---

Прочитай CLAUDE.md, docs/DESIGN.md и docs/PAGE_SPEC.md §2–§4. Этап 2 из 7. Каркас уже готов — используй существующие токены, PButton, SectionTitle, SectionEyebrow, useLang, useScrollMotion. Сделай:

1. `SectionHero.vue` по спеке §2: композиция, акцентные слова H1, кнопки (primary → плавный скролл к #contact через Lenis, secondary → Telegram), строка про два месяца mono. Визуал справа: слот под `public/img/hero-3d.webp` с фолбэком — мягкое красное свечение (radial-gradient, blur) + абстрактная SVG-дуга, лёгкий параллакс по scrub. Появление заголовка построчно
2. `SectionTicker.vue` по §3: бесшовный marquee из `ticker.items` с разделителем ○, пауза на hover, статичный фолбэк при reduced-motion, aria-hidden на дубликате
3. `SectionProjects.vue` по §4: массив partners, карточка партнёра с «браузерным окном», кнопки visit / case (disabled + «Кейс — скоро» при caseUrl null), карточка «Ваш продукт може бути наступним» с плюсом и свечением. Сгенерируй заглушку `public/img/partners/paparazzi-placeholder.webp` кодом (градиент surface→bg, текст-логотип) и пометь TODO(ASSET). Проверь, что раскладка не ломается при 1, 2 и 3 партнёрах (временно продублируй объект, проверь, удали)
4. Подключи секции в index.vue вместо заглушек

Закончи: `npm run build` до чистого билда. Проверь обе локали (укр. строки длиннее — ничего не должно переполняться), 1440/1024/768/390, reduced-motion (hero статичен, ticker статичен), консоль чистая.

Если что-то пошло не так: если marquee дёргается — ширина трека должна считаться после загрузки шрифтов (document.fonts.ready); если параллакс даёт скачок при загрузке — ставь начальные transform в CSS, а не в JS.

---
