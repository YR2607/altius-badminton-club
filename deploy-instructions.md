# 🚀 Деплой инструкции для Altius Badminton Club

## После создания GitHub репозитория выполните:

```bash
# Добавить удаленный репозиторий
git remote add origin https://github.com/YR2607/altius-badminton-club.git

# Отправить код в репозиторий
git push -u origin main
```

## 🌐 Варианты деплоя

### 1. Vercel (Рекомендуется)
- Зайдите на https://vercel.com
- Войдите через GitHub
- Нажмите "New Project"
- Выберите репозиторий `altius-badminton-club`
- Vercel автоматически определит Next.js и настроит деплой
- Сайт будет доступен по адресу типа `altius-badminton-club.vercel.app`

### 2. Netlify
- Зайдите на https://netlify.com
- Войдите через GitHub
- Нажмите "New site from Git"
- Выберите репозиторий
- Build command: `npm run build`
- Publish directory: `.next`

### 3. GitHub Pages (статический экспорт)
Если нужен статический сайт, измените `next.config.ts`:
```typescript
const nextConfig: NextConfig = {
  output: 'export',
  trailingSlash: true,
  images: {
    unoptimized: true
  }
};
```

## 🔧 Настройка Supabase

1. Создайте проект на https://supabase.com
2. Выполните SQL из файла `supabase-schema.sql`
3. Добавьте переменные окружения в Vercel:
   - `NEXT_PUBLIC_SUPABASE_URL`
   - `NEXT_PUBLIC_SUPABASE_ANON_KEY`

## 📱 Готовые функции

✅ Адаптивный дизайн
✅ Система бронирования
✅ Админ панель
✅ Галерея медиа
✅ Контактная информация
✅ SEO оптимизация
✅ Брендинг Altius

## 🎨 Цветовая схема Altius

- Синий: #1E40AF
- Лайм: #84CC16  
- Оранжевый: #EA580C
- Черный: #000000
