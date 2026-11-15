# ទីផ្សារផ្ទះ (home-market-app)

Vite + React + Tailwind CSS (v3) + React Router។

## ចាប់ផ្តើម

```bash
npm install
npm run dev
```

បើមិនទាន់កំណត់ Supabase កម្មវិធីប្រើទិន្នន័យគំរូ (`src/data/sampleProperties.js`) ហើយរក្សាទុកអចលនទ្រព្យដែលអ្នកផ្សាយក្នុង localStorage។

## ភ្ជាប់ Supabase (ជម្រើស)

1. ចម្លង `.env.example` ទៅ `.env` ហើយបំពេញ `VITE_SUPABASE_URL` និង `VITE_SUPABASE_ANON_KEY`
2. ដំណើរការ SQL នេះក្នុង Supabase SQL Editor៖

```sql
create table properties (
  id uuid primary key default gen_random_uuid(),
  title text not null,
  purpose text not null,
  type text not null,
  price numeric not null,
  location text not null,
  bedrooms int default 0,
  bathrooms int default 0,
  area numeric not null,
  phone text not null,
  description text not null,
  image text not null,
  created_at timestamptz default now()
);

alter table properties enable row level security;
create policy "read_all" on properties for select using (true);
create policy "insert_all" on properties for insert with check (true);
```

> ចំណាំ៖ រូបភាពរក្សាទុកជា data URL ក្នុងជួរ `image` ដើម្បីងាយចាប់ផ្តើម។ ពេលប្រើពិតប្រាកដ គួរប្តូរទៅ Supabase Storage ហើយរក្សាតែ URL។ policy insert ខាងលើបើកឱ្យអ្នកណាក៏ផ្សាយបាន — ពេលបន្ថែមប្រព័ន្ធ Login គួរកែឱ្យតឹងជាងនេះ។

## Deploy លើ Vercel

`vercel.json` ត្រូវបានរៀបចំរួចសម្រាប់ routing។ គ្រាន់តែ import repo ហើយបន្ថែម Environment Variables។

## ចូលគណនី / ចុះឈ្មោះ

- ទំព័រ `/login` និង `/register` (ឈ្មោះអ្នកប្រើ + ពាក្យសម្ងាត់ + លេខកូដអញ្ជើញស្រេចចិត្ត)។ ទំព័រ `/post` តម្រូវឱ្យចូលគណនីជាមុន។
- បើប្រើ Supabase៖ ក្នុង Authentication → Providers → Email ត្រូវបិទ «Confirm email» ព្រោះឈ្មោះអ្នកប្រើត្រូវបម្លែងជា email ក្លែងក្លាយ។ លេខកូដអញ្ជើញរក្សាក្នុង `user_metadata.invitation_code`។
- បើមិនប្រើ Supabase៖ គណនីរក្សាក្នុង localStorage (ពាក្យសម្ងាត់ hash ដោយ SHA-256) សម្រាប់សាកល្បងប៉ុណ្ណោះ មិនមែនសុវត្ថិភាពពិតប្រាកដទេ។
