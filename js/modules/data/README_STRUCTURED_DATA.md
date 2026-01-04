# Structured Data (JSON-LD) - Документация

## 📁 Структура файлов

Структурированные данные для SEO и AI-поиска теперь хранятся в отдельных файлах:

- **`structuredData.js`** - Основной файл с данными (JSON-LD schema)
- **`structuredDataLoader.js`** - Утилита для загрузки и вставки данных в HTML

## 🔧 Как это работает

1. Данные хранятся в `js/modules/data/structuredData.js` как JavaScript объект
2. `structuredDataLoader.js` загружает эти данные и вставляет их в `<head>` как `<script type="application/ld+json">`
3. Инициализация происходит в `main.js` при загрузке страницы

## 📝 Редактирование данных

Чтобы изменить структурированные данные:

1. Откройте `js/modules/data/structuredData.js`
2. Отредактируйте нужные поля
3. Сохраните файл
4. Данные автоматически обновятся при следующей загрузке страницы

## 🎯 Что включено

Структурированные данные включают:

- **MusicGroup** - информация о группе НАТЕ!
- **Person** - информация о Святославе Задерии
- **MusicAlbum** - информация об альбомах (3 альбома)
- **BreadcrumbList** - навигационная структура
- **FAQPage** - часто задаваемые вопросы для AI-поиска

## ⚠️ Важно для SEO

Для лучшей SEO-оптимизации structured data должен быть доступен поисковым системам как можно раньше. Текущая реализация вставляет данные через JavaScript, что может быть не идеально для SEO.

**Рекомендация:** Если вы заметите проблемы с индексацией structured data, рассмотрите возможность:
1. Генерации статического HTML с встроенными данными
2. Использования серверного рендеринга (SSR)
3. Или добавления inline скрипта, который загружает данные синхронно

## 🔍 Проверка

Проверить, что structured data правильно загружается:

1. Откройте страницу в браузере
2. Откройте DevTools → Elements
3. Найдите `<script type="application/ld+json">` в `<head>`
4. Или используйте [Schema.org Validator](https://validator.schema.org/)

## 📚 Дополнительная информация

- [Schema.org Documentation](https://schema.org/)
- [Google Structured Data](https://developers.google.com/search/docs/appearance/structured-data)
- [JSON-LD Specification](https://json-ld.org/)


