# CONTENT_ADDITIONS — тексты новых блоков (UA / EN)

Дополнение к CONTENT_SOURCE.md. Написано в том же тоне. Черновик — заказчик вычитает; в код переносить дословно. Всё, что помечено TODO(FAKE), — временные значения.

---

## 1. Ticker (`ticker.items`)

UA:
1. Без оплати розробки на старті
2. Відсоток — лише з реальних продажів
3. Запуск — до двох місяців
4. Одна система: сайт, CRM, платежі, склад, доставка, аналітика

EN:
1. No upfront development fee
2. We earn a percentage of real sales only
3. Launch within two months
4. One system: website, CRM, payments, inventory, delivery, analytics

Разделитель между пунктами: `○`

## 2. Подписи слоёв (§5, `layers.*`)

Формат: mono-название + одна строка. Порядок сверху вниз.

| key | UA | EN |
|---|---|---|
| layer_store | Сайт — Каталог, товар, оплата — те, що бачить покупець | Website — Catalogue, product page, checkout — what the customer sees |
| layer_crm | CRM — Замовлення одразу потрапляє до менеджера | CRM — The order reaches a manager instantly |
| layer_pay | Оплата — Платіж зафіксовано та збережено | Payments — The payment is recorded and stored |
| layer_stock | Склад — Залишки оновлюються автоматично | Inventory — Stock levels update automatically |
| layer_delivery | Доставка — Відправлення оформлюється без ручних дій | Delivery — Shipping is arranged without manual steps |
| layer_notify | Повідомлення — Клієнт бачить статус замовлення | Notifications — The customer sees the order status |
| layer_analytics | Аналітика — Власник бачить, що відбувається з продажами | Analytics — The owner sees what is happening with sales |

(Слоёв с подписями 6 после верхнего «Сайт» — если в вёрстке тесно, layer_notify можно объединить с layer_delivery, решение за этапом сборки.)

## 3. Сравнение моделей (§7, `compare.*`)

Заголовок: UA «Дві моделі розробки» / EN «Two ways to build»
Бейдж на втором блоке: UA «Наша модель» / EN «Our model»

**Блок 1 — UA «Класична розробка» / EN «Classic development»**

| Критерий (UA / EN) | UA | EN |
|---|---|---|
| Оплата / Payment | Фіксований бюджет до запуску | A fixed budget paid before launch |
| Ризик / Risk | Повністю на боці бізнесу | Carried entirely by the business |
| Мотивація виконавця / Contractor’s motivation | Завершити погоджений обсяг робіт | To complete the agreed scope of work |
| Після запуску / After launch | Підтримка — за окремим договором | Support under a separate contract |
| Рішення / Decisions | Кожна зміна — додатковий кошторис | Every change means an additional estimate |

**Блок 2 — UA «Партнерська модель» / EN «Partnership model»**

| Критерий | UA | EN |
|---|---|---|
| Оплата / Payment | Відсоток від продажів після запуску | A percentage of sales after launch |
| Ризик / Risk | Розподілений між сторонами | Shared between both sides |
| Мотивація виконавця / Contractor’s motivation | Система, яка стабільно продає | A system that keeps selling |
| Після запуску / After launch | Розвиток продукту — частина моделі | Ongoing development is part of the model |
| Рішення / Decisions | Зміни, які збільшують продажі, вигідні обом | Changes that grow sales benefit both sides |

## 4. Калькулятор (§11, `calc.*`)

- `calc.card_title`: UA «Орієнтовний розрахунок» / EN «A rough estimate»
- `calc.margin_label`: UA «Маржинальність» / EN «Margins»; ступени: UA «Низька · Помірна · Середня · Висока» / EN «Low · Moderate · Medium · High»
- `calc.volume_label`: UA «Обсяг онлайн-продажів на місяць» / EN «Monthly online sales volume»; ступени: UA «до 100 тис ₴ · 100–500 тис ₴ · 0,5–2 млн ₴ · 2–10 млн ₴ · 10+ млн ₴» / EN «under ₴100K · ₴100–500K · ₴0.5–2M · ₴2–10M · ₴10M+»
- `calc.aov_label`: UA «Середній чек» / EN «Average order value»; ступени: UA «до 1 тис ₴ · 1–5 тис ₴ · 5–20 тис ₴ · 20+ тис ₴» / EN «under ₴1K · ₴1–5K · ₴5–20K · ₴20K+»
- `calc.integrations_label`: UA «Кількість інтеграцій» / EN «Number of integrations» (значение — число 1–10)
- `calc.result_label`: UA «Орієнтовний діапазон» / EN «Indicative range» → «3–5% від продажів» / «3–5% of sales» (числа считает формула, TODO(FAKE) — эвристика, не бизнес-логика)
- `calc.disclaimer`: UA «Це не оферта. Точний відсоток ми розраховуємо після аналізу бізнесу — на нього також впливають стан процесів, обсяг розробки та формат підтримки після запуску.» / EN «This is not an offer. We calculate the exact percentage after reviewing the business — it also depends on the state of current processes, the development scope and the level of support after launch.»

## 5. Карточки блока «Ми заробляємо…» (§12, `align.card_*`)

Разбивка второго абзаца исходника на 4 карточки:

| key | UA | EN |
|---|---|---|
| card_1 | Система залишається стабільною | The system stays stable |
| card_2 | Замовлення проходять без помилок | Orders move through without errors |
| card_3 | Команда витрачає менше часу на ручні операції | The team spends less time on manual work |
| card_4 | Клієнтам зручно здійснювати покупки | Purchases stay convenient for customers |

## 6. Форма и UI-строки

### Табы и поля (`form.*`)

| key | UA | EN |
|---|---|---|
| tab_has | Вже є магазин | I already sell online |
| tab_no | Магазину ще немає | Not selling online yet |
| name | Ім’я | Name |
| company | Компанія | Company |
| contact | Контакт для зв’язку | Preferred contact |
| contact_hint | Телефон, Telegram, email або посилання — будь-який зручний спосіб | Phone, Telegram, email or a link — whatever works for you |
| site | Посилання на магазин або продукт | Link to your store or product |
| selling | Що ви продаєте | What you sell |
| selling_plan | Що плануєте продавати | What you plan to sell |
| volume | Обсяг онлайн-продажів на місяць | Monthly online sales volume |
| volume_expected | Очікуваний обсяг продажів | Expected sales volume |
| orders_label | Як зараз обробляються замовлення | How orders are processed today |
| orders_manual / orders_crm / orders_sheets / orders_other | Вручну · CRM · Таблиці · Інше | Manually · CRM · Spreadsheets · Other |
| channels_label | Де продаєте зараз | Where you sell today |
| channels_social / channels_marketplace / channels_offline / channels_none | Instagram і соцмережі · Маркетплейси · Офлайн · Ще не продаємо | Instagram and social media · Marketplaces · Offline · Not selling yet |
| submit | Обговорити проєкт | Discuss your project |
| success_title | Дякуємо | Thank you |
| success_text | Ми вивчимо інформацію та повернемося з відповіддю протягом одного-двох робочих днів. | We will review the details and get back to you within one or two business days. |
| err_required | Заповніть це поле | This field is required |
| err_url | Схоже, посилання некоректне | This link does not look right |

Ступени слайдера объёма = `calc.volume_*` (один список).

### Кнопки и навигация (`cta.*`, `nav.*`)

| key | UA | EN |
|---|---|---|
| cta.discuss | Обговорити проєкт | Discuss your project |
| cta.telegram | Написати в Telegram | Message us on Telegram |
| nav.contact | Контакт | Contact |
| nav.book_call | Book a call | Book a call |
| projects.visit | Відвідати сайт | Visit website |
| projects.case | Дивитися кейс | View case study |
| projects.case_soon | Кейс — скоро | Case study — soon |
| projects.paparazzi_desc | Магазин фото- та відеотехніки | Photo and video equipment retailer |
| projects.next_title | Ваш продукт може бути наступним | Your product could be next |
| footer.back_top | Догори | Back to top |

### Языковая модалка (`lang_modal.*`)

- `title`: «Оберіть мову / Choose your language» (двуязычный заголовок в обеих локалях)
- Кнопки: «Українська» / «English» (не переводить)
- `note`: UA «Мову можна змінити внизу сторінки» / EN «You can change the language at the bottom of the page»

### Eyebrow-ярлыки секций (не переводятся, всегда EN mono)

HERO: `○ E-COMMERCE PARTNERSHIP` · §4 `○ PROJECTS` · §5 `○ BEHIND THE STOREFRONT` · §6 `○ ONE SYSTEM` · §7 `○ TWO MODELS` · §8 `○ THE MODEL` · §9 `○ SCOPE` · §10 `○ PROCESS` · §11 `○ TERMS` · §12 `○ ALIGNMENT` · §13 `○ FAQ` · §14 `○ CONTACT`
