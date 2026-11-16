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
  owner text,
  featured_until timestamptz,
  commission numeric,
  created_at timestamptz default now()
);

alter table properties enable row level security;
create policy "read_all" on properties for select using (true);
create policy "insert_all" on properties for insert with check (featured_until is null);
```

> ចំណាំ៖ រូបភាពរក្សាទុកជា data URL ក្នុងជួរ `image` ដើម្បីងាយចាប់ផ្តើម។ ពេលប្រើពិតប្រាកដ គួរប្តូរទៅ Supabase Storage ហើយរក្សាតែ URL។ policy insert ខាងលើបើកឱ្យអ្នកណាក៏ផ្សាយបាន — ពេលបន្ថែមប្រព័ន្ធ Login គួរកែឱ្យតឹងជាងនេះ។

## Deploy លើ Vercel

`vercel.json` ត្រូវបានរៀបចំរួចសម្រាប់ routing។ គ្រាន់តែ import repo ហើយបន្ថែម Environment Variables។

## ចូលគណនី / ចុះឈ្មោះ

- ទំព័រ `/login` និង `/register` (ឈ្មោះអ្នកប្រើ + ពាក្យសម្ងាត់ + លេខកូដអញ្ជើញស្រេចចិត្ត)។ ទំព័រ `/post` តម្រូវឱ្យចូលគណនីជាមុន។
- បើប្រើ Supabase៖ ក្នុង Authentication → Providers → Email ត្រូវបិទ «Confirm email» ព្រោះឈ្មោះអ្នកប្រើត្រូវបម្លែងជា email ក្លែងក្លាយ។ លេខកូដអញ្ជើញរក្សាក្នុង `user_metadata.invitation_code`។
- បើមិនប្រើ Supabase៖ គណនីរក្សាក្នុង localStorage (ពាក្យសម្ងាត់ hash ដោយ SHA-256) សម្រាប់សាកល្បងប៉ុណ្ណោះ មិនមែនសុវត្ថិភាពពិតប្រាកដទេ។

## ផ្សព្វផ្សាយការផ្សាយ (Promote)

ទំព័រ `/promote` ឱ្យម្ចាស់អចលនទ្រព្យជ្រើសកញ្ចប់ ហើយចុចប៊ូតុងទៅបង់ប្រាក់នៅទំព័ររបស់អ្នកផ្តល់សេវាទូទាត់។ កម្មវិធីនេះ **មិនរក្សាសមតុល្យ និងមិនមានការដកប្រាក់ទេ**។

1. បង្កើត Payment Link ក្នុងគណនីអ្នកផ្តល់សេវាទូទាត់ (ABA PayWay, Bakong KHQR, PayPal, Stripe...) ម្នាក់ក្នុងមួយកញ្ចប់ ដោយចំនួនទឹកប្រាក់ត្រូវនឹង `src/config/payments.js`។
2. ដាក់តំណក្នុង Vercel → Settings → Environment Variables៖ `VITE_PAY_URL_7D`, `VITE_PAY_URL_30D`, `VITE_PAY_URL_90D` និង `VITE_SUPPORT_TELEGRAM` រួច Redeploy។
3. ពេលអ្នកប្រើផ្ញើវិក្កយបត្រ ហើយអ្នកបានបញ្ជាក់ការបង់ប្រាក់ក្នុងគណនីអ្នកផ្តល់សេវា សូមបើកការផ្សព្វផ្សាយក្នុង Supabase SQL Editor៖

```sql
update properties
set featured_until = now() + interval '30 days'
where id = 'ដាក់ id នៅទីនេះ';
```

ជួរ `featured_until` ត្រូវបន្ថែមក្នុងតារាងចាស់ដោយ `alter table properties add column featured_until timestamptz;` ហើយ policy insert ត្រូវកែជា `with check (featured_until is null)` ដើម្បីកុំឱ្យអ្នកប្រើកំណត់ខ្លួនឯងជាការផ្សាយពិសេស។ ការផ្សាយដែលនៅ `featured_until` មិនទាន់ផុតកំណត់នឹងបង្ហាញមុនគេ ជាមួយស្លាក «ពិសេស»។

## កម្រៃជើងសារ (Commission) និងការបង់តាម KHQR

- ពេលផ្សាយ អ្នកលក់កំណត់ **កម្រៃជើងសារ (%)** (ដែនកំណត់ និងតម្លៃលំនាំដើមនៅក្នុង `COMMISSION` ក្នុង `src/config/payments.js`) ហើយវាបង្ហាញក្នុងទំព័រលម្អិត។
- ទំព័រ `/commissions`៖ អ្នកលក់កត់ត្រាកិច្ចព្រមព្រៀងដែលបានបញ្ចប់ (តម្លៃកិច្ចព្រមព្រៀង) កម្រៃគណនាដោយស្វ័យប្រវត្តិ ហើយបង់តាម **KHQR ទៅគណនីអាជីវកម្មរបស់អ្នកដោយផ្ទាល់**។ កម្មវិធី **មិនរក្សាសមតុល្យ និងមិនមានការដកប្រាក់ទេ**។
- ស្ថានភាព៖ `pending` (មិនទាន់បង់) → `reported` (អ្នកលក់ចុច «ខ្ញុំបានបង់ហើយ») → `paid` (អ្នកគ្រប់គ្រងបញ្ជាក់ថាទទួលបានប្រាក់ ដោយ SQL ខាងក្រោម)។
- រៀបចំ KHQR៖ ស្នើសុំគណនីអាជីវកម្ម (Merchant) KHQR ពីធនាគារ ដូចជា ABA ឬ ACLEDA ហើយដាក់រូប KHQR ក្នុង `public/khqr.png` និង/ឬដាក់តំណបង់ប្រាក់ក្នុង Vercel Environment Variables `VITE_KHQR_URL` និង `VITE_BUSINESS_NAME` រួច Redeploy។

SQL (Supabase)៖

```sql
alter table properties add column if not exists commission numeric;

create table commissions (
  id uuid primary key default gen_random_uuid(),
  property_id text not null,
  property_title text not null,
  owner text not null,
  deal_amount numeric not null check (deal_amount > 0),
  rate numeric not null,
  amount numeric not null,
  status text not null default 'pending' check (status in ('pending','reported','paid')),
  reference text,
  created_at timestamptz default now(),
  paid_at timestamptz
);

alter table commissions enable row level security;

create policy "own_select" on commissions for select to authenticated
  using (owner = (auth.jwt() -> 'user_metadata' ->> 'username'));
create policy "own_insert" on commissions for insert to authenticated
  with check (owner = (auth.jwt() -> 'user_metadata' ->> 'username') and status = 'pending');
create policy "own_report" on commissions for update to authenticated
  using (owner = (auth.jwt() -> 'user_metadata' ->> 'username') and status = 'pending')
  with check (owner = (auth.jwt() -> 'user_metadata' ->> 'username') and status in ('pending','reported'));

-- អ្នកប្រើកែបានតែជួរ status ប៉ុណ្ណោះ
revoke update on commissions from authenticated;
grant update (status) on commissions to authenticated;
```

បញ្ជាក់ថាបានទទួលប្រាក់ (អ្នកគ្រប់គ្រងដំណើរការក្នុង SQL Editor)៖

```sql
update commissions set status = 'paid', paid_at = now() where reference = 'HM-C-XXXXXX';
```

ចំណាំ៖ `user_metadata` ក្នុង Supabase Auth អ្នកប្រើអាចកែបាន ដូច្នេះ policy ខាងលើមិនមែនជាការការពារគ្រប់ជ្រុងទេ។ សូមផ្ទៀងផ្ទាត់តម្លៃកិច្ចព្រមព្រៀង និងការទទួលប្រាក់ដោយដៃមុនកំណត់ថា `paid`។ ត្រូវប្រាប់អ្នកលក់ឱ្យច្បាស់ពីអត្រាកម្រៃ និងលក្ខខណ្ឌជាមុន ហើយចំណូលនេះអាចត្រូវបង់ពន្ធ ដូច្នេះគួរពិគ្រោះអ្នកគណនេយ្យ ឬអគ្គនាយកដ្ឋានពន្ធដារ។
