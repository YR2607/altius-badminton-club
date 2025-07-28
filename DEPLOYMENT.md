# Deployment Instructions for Altius Badminton Club

## Environment Variables Setup

### For Vercel Deployment:

1. **Go to Vercel Dashboard**: https://vercel.com/dashboard
2. **Select your project**: `altius-badminton-club`
3. **Navigate to**: Settings → Environment Variables
4. **Add the following variables**:

```
NEXT_PUBLIC_SUPABASE_URL = https://whdfkjsmyolbzlwtaoix.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY = eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6IndoZGZranNteW9sYnpsd3Rhb2l4Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTMzNDUxODksImV4cCI6MjA2ODkyMTE4OX0.wodggEz_ElgvYVWPA4o3gmAg84AWezDmnRaHAkC2Dps
```

5. **Set Environment**: Production, Preview, Development (all three)
6. **Save** and **Redeploy**

### For Local Development:

1. **Copy** `.env.example` to `.env.local`
2. **Replace** placeholder values with actual Supabase credentials
3. **Run** `npm run dev`

## Supabase Database Setup

Execute the following SQL in Supabase SQL Editor:

```sql
-- Add gallery_images field to posts table
ALTER TABLE posts ADD COLUMN IF NOT EXISTS gallery_images TEXT[];

-- Update existing posts with empty gallery_images array
UPDATE posts SET gallery_images = ARRAY[]::TEXT[] WHERE gallery_images IS NULL;
```

## Storage Buckets

Ensure these buckets exist in Supabase Storage:
- `hall-images` (public)
- `post-images` (public)

## Deployment Checklist

- [ ] Environment variables added to Vercel
- [ ] Supabase database schema updated
- [ ] Storage buckets created
- [ ] Build passes locally (`npm run build`)
- [ ] All tests pass
- [ ] Deploy to Vercel

## Troubleshooting

### "placeholder.supabase.co" errors:
- Environment variables not set in Vercel
- Add variables and redeploy

### Build failures:
- Check ESLint and TypeScript errors
- Run `npm run build` locally first

### Database connection issues:
- Verify Supabase URL and key
- Check RLS policies are enabled
