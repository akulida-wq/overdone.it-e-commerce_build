# CLAUDE.md — Overdone Partnership Landing

Ты собираешь одну страницу — лендинг услуги **E-commerce Partnership** для overdone.it.
Страница делается как отдельный Nuxt-проект и позже переносится разработчиком в основной сайт overdone.it (тоже Nuxt). Поэтому всё должно быть самодостаточным и переносимым.

## Перед началом любой работы прочитай

1. `docs/CONTEXT.md` — что это за услуга и зачем страница
2. `docs/DESIGN.md` — визуальная система (токены, шрифты, компоненты, моушен)
3. `docs/PAGE_SPEC.md` — спецификация всех секций
4. `docs/CONTENT_SOURCE.md` + `docs/CONTENT_ADDITIONS.md` — весь текст UA/EN

Не начинай кодить, пока не прочитал все четыре.

## Стек (не менять)

- Nuxt 4 (SSR), Vue 3 Composition API, только `<script setup>`
- Обычный JavaScript — **без TypeScript**
- SCSS: токены в `assets/scss/_variables.scss`, цвета через CSS custom properties в `assets/scss/_theme.scss`
- **Без Tailwind, без UI-библиотек**
- Анимации: GSAP + ScrollTrigger, плавный скролл — Lenis
- Иконки: SVG-компоненты, stroke 1.5px, единый стиль. Никаких эмодзи вместо иконок
- Импорты через алиас `@/`

## Структура

```
components/
  layout/     PHeader.vue, PFooter.vue, LangModal.vue
  sections/   SectionHero.vue, SectionTicker.vue, SectionProjects.vue, ...
  ui/         PButton.vue, PInput.vue, PSelect.vue, PSlider.vue, PChips.vue,
              PAccordionItem.vue, SectionEyebrow.vue, SectionTitle.vue
composables/  useLang.js, useScrollMotion.js
locales/      en.json, ua.json
pages/        index.vue (единственная страница)
assets/scss/  _variables.scss, _theme.scss, _mixins.scss, main.scss
public/img/   партнёрские логотипы/скрины (заглушки с TODO)
```

Компоненты переиспользуй: одна кнопка `PButton` со всеми вариантами, один аккордеон, один слайдер. Не плоди дубликаты под каждую секцию.

## Правила кода

- Цвета ТОЛЬКО через `var(--color-*)`. Размеры/отступы через `$spacing-*`, `$radius-*`. Хардкод hex/px в компонентах запрещён (исключение: 1px бордеры и уникальная геометрия SVG)
- Заголовки секций только через `SectionTitle` (умеет красное акцентное слово), подписи-ярлыки через `SectionEyebrow` (mono)
- `@click.prevent.stop` внутри кликабельных карточек с вложенными кнопками
- Все тексты только из locale-файлов через `t('key')`. Ни одной строки текста в шаблонах. Тексты копируются из docs/CONTENT_* **дословно** — не редактируй, не сокращай, не «улучшай» формулировки
- Формы: видимые label, ошибка под полем, aria-атрибуты, состояние loading на кнопке при отправке
- Отправка формы — mock (console + локальный success), с комментарием `// TODO(API): endpoint`
- Каждая scroll-анимация обязана иметь фолбэк для `prefers-reduced-motion: reduce` (статичная версия, без pin/scrub) и для мобильных, где pin-секции упрощаются
- Никаких layout shift: резервируй место под изображения/анимации (aspect-ratio)

## i18n

- Два языка: `en` (по умолчанию) и `ua`
- Свой composable `useLang()`: реактивная локаль, `t(key)`, сохранение в `localStorage('od_lang')`, обновление `<html lang>`
- Первый визит без сохранённого выбора → модалка выбора языка (см. PAGE_SPEC §0). Закрыл без выбора → остаётся en, модалку больше не показываем
- Свитчер языка в футере
- Eyebrow-ярлыки секций остаются на английском в обеих локалях (дизайн-элемент, как на главной overdone.it)

## Definition of Done для каждого этапа

1. `npm run build` проходит без ошибок и warnings
2. Проверены обе локали (en/ua) — ничего не переполняется, укр. строки длиннее
3. Проверен вид на 1440 / 1024 / 768 / 390
4. `prefers-reduced-motion` — страница читабельна и полна без анимаций
5. Консоль браузера чистая

## Чего НЕ делать

- Не менять стек и не добавлять зависимости сверх GSAP/Lenis без явного указания
- Не переписывать тексты из docs
- Не выдумывать метрики/цифры, которых нет в контенте. Все временные цифры помечены TODO(FAKE) в CONTENT_ADDITIONS — переноси их вместе с пометкой в комментарии кода
- Не делать светлую тему — страница только тёмная
- Не трогать файлы в docs/ и prompts/
