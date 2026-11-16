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
  deposit numeric,
  reserved boolean default false,
  created_at timestamptz default now()
);

alter table properties enable row level security;
create policy "read_all" on properties for select using (true);
create policy "insert_all" on properties for insert with check (featured_until is null and coalesce(reserved, false) = false);
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

ជួរ `featured_until` ត្រូវបន្ថែមក្នុងតារាងចាស់ដោយ `alter table properties add column featured_until timestamptz;` ហើយ policy insert ត្រូវកែជា `with check (featured_until is null and coalesce(reserved, false) = false)` ដើម្បីកុំឱ្យអ្នកប្រើកំណត់ខ្លួនឯងជាការផ្សាយពិសេស។ ការផ្សាយដែលនៅ `featured_until` មិនទាន់ផុតកំណត់នឹងបង្ហាញមុនគេ ជាមួយស្លាក «ពិសេស»។

## កម្រៃជើងសារ (Commission) និងការបង់តាម KHQR

- ពេលផ្សាយ អ្នកលក់កំណត់ **កម្រៃជើងសារ (%)** (ដែនកំណត់ និងតម្លៃលំនាំដើមនៅក្នុង `COMMISSION` ក្នុង `src/config/payments.js`) ហើយវាបង្ហាញក្នុងទំព័រលម្អិត។
- ទំព័រ `/commissions`៖ អ្នកលក់កត់ត្រាកិច្ចព្រមព្រៀងដែលបានបញ្ចប់ (តម្លៃកិច្ចព្រមព្រៀង) កម្រៃគណនាដោយស្វ័យប្រវត្តិ ហើយបង់តាម **KHQR ទៅគណនីអាជីវកម្មរបស់អ្នកដោយផ្ទាល់**។ កម្មវិធី **មិនរក្សាសមតុល្យ និងមិនមានការដកប្រាក់ទេ**។
- ស្ថានភាព៖ `pending` (មិនទាន់បង់) → `reported` (អ្នកលក់ចុច «ខ្ញុំបានបង់ហើយ») → `paid` (អ្នកគ្រប់គ្រងបញ្ជាក់ថាទទួលបានប្រាក់ ដោយ SQL ខាងក្រោម)។
- រៀបចំ KHQR៖ ស្នើសុំគណនីអាជីវកម្ម (Merchant) KHQR ពីធនាគារ ដូចជា ABA ឬ ACLEDA ហើយដាក់រូប KHQR ក្នុង `public/khqr.png` និង/ឬដាក់តំណបង់ប្រាក់ក្នុង Vercel Environment Variables `VITE_KHQR_URL` និង `VITE_BUSINESS_NAME` រួច Redeploy។

SQL (Supabase)៖

```sql
-- ជំនួយ៖ លេខទូរស័ព្ទអ្នកប្រើ (យកពី email ក្នុង JWT ដែលអ្នកប្រើកែមិនបានដោយ user_metadata) និងពិនិត្យ Admin
create or replace function public.current_phone() returns text
language sql stable as $$ select split_part(coalesce(auth.jwt() ->> 'email', ''), '@', 1) $$;

create or replace function public.is_admin() returns boolean
language sql stable as $$ select coalesce(auth.jwt() -> 'app_metadata' ->> 'role', '') = 'admin' $$;

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
  using (owner = public.current_phone());
create policy "own_insert" on commissions for insert to authenticated
  with check (owner = public.current_phone() and status = 'pending');
create policy "own_report" on commissions for update to authenticated
  using (owner = public.current_phone() and status = 'pending')
  with check (owner = public.current_phone() and status in ('pending','reported'));

-- អ្នកប្រើកែបានតែជួរ status ប៉ុណ្ណោះ
revoke update on commissions from authenticated;
grant update (status) on commissions to authenticated;
```

បញ្ជាក់ថាបានទទួលប្រាក់ (អ្នកគ្រប់គ្រងដំណើរការក្នុង SQL Editor)៖

```sql
update commissions set status = 'paid', paid_at = now() where reference = 'HM-C-XXXXXX';
```

ចំណាំ៖ `user_metadata` ក្នុង Supabase Auth អ្នកប្រើអាចកែបាន ដូច្នេះ policy ខាងលើមិនមែនជាការការពារគ្រប់ជ្រុងទេ។ សូមផ្ទៀងផ្ទាត់តម្លៃកិច្ចព្រមព្រៀង និងការទទួលប្រាក់ដោយដៃមុនកំណត់ថា `paid`។ ត្រូវប្រាប់អ្នកលក់ឱ្យច្បាស់ពីអត្រាកម្រៃ និងលក្ខខណ្ឌជាមុន ហើយចំណូលនេះអាចត្រូវបង់ពន្ធ ដូច្នេះគួរពិគ្រោះអ្នកគណនេយ្យ ឬអគ្គនាយកដ្ឋានពន្ធដារ។

## កក់ប្រាក់មុន (Booking deposit)

- ពេលផ្សាយ ម្ចាស់អាចដាក់ **ប្រាក់កក់ ($)** (ស្រេចចិត្ត)។ ក្នុងទំព័រលម្អិត អ្នកទិញចុច «កក់អចលនទ្រព្យនេះ» បំពេញឈ្មោះ និងលេខទូរស័ព្ទ ដើម្បីផ្ញើសំណើ (មិនបាច់ចូលគណនី)។
- **ប្រាក់កក់បង់ត្រង់ពីអ្នកទិញទៅម្ចាស់** តាមវិធីដែលពួកគេព្រមព្រៀងគ្នា។ កម្មវិធី **មិនទទួល មិនរក្សា និងមិនបញ្ជូនលុយទេ**។ ទំព័រ `/reservations` (ចូលពី «ខ្ញុំ») ឱ្យម្ចាស់មើលសំណើ ទូរស័ព្ទទៅអ្នកទិញ ហើយចុច «កត់ថាបានទទួលប្រាក់កក់» ដែលនឹងដាក់ស្លាក «បានកក់» លើការផ្សាយ។
- សារព្រមានសុវត្ថិភាពបង្ហាញជានិច្ចជាមួយប៊ូតុងកក់ ព្រោះការបោកប្រាស់ប្រាក់កក់ជារឿងធម្មតា។
- បើចង់ឱ្យមានភាគីទីបីរក្សាប្រាក់កក់ (escrow) ត្រូវប្រើធនាគារ ឬក្រុមហ៊ុនដែលមានអាជ្ញាប័ណ្ណ មិនមែនកម្មវិធីនេះទេ។

SQL (Supabase)៖

```sql
alter table properties add column if not exists deposit numeric;
alter table properties add column if not exists reserved boolean default false;

create table reservations (
  id uuid primary key default gen_random_uuid(),
  property_id text not null,
  property_title text not null,
  owner text,
  buyer_name text not null,
  buyer_phone text not null,
  message text,
  amount numeric,
  status text not null default 'new' check (status in ('new','received','cancelled')),
  created_at timestamptz default now()
);

alter table reservations enable row level security;

create policy "anyone_request" on reservations for insert to anon, authenticated
  with check (status = 'new');
create policy "owner_select" on reservations for select to authenticated
  using (owner = public.current_phone());
create policy "owner_update" on reservations for update to authenticated
  using (owner = public.current_phone())
  with check (owner = public.current_phone());
revoke update on reservations from authenticated;
grant update (status) on reservations to authenticated;

-- ម្ចាស់កែបានតែជួរ reserved លើការផ្សាយរបស់ខ្លួន
create policy "owner_reserve" on properties for update to authenticated
  using (owner = public.current_phone())
  with check (owner = public.current_phone());
revoke update on properties from authenticated;
grant update (reserved) on properties to authenticated;
```

ចំណាំ៖ ទម្រង់កក់បើកឱ្យអ្នកណាក៏ផ្ញើបាន ដូច្នេះអាចមាន spam។ សូមបើក rate limit ឬ CAPTCHA ពេលមានអ្នកប្រើច្រើន។

## Admin និងភ្នាក់ងារ (Agency)

ទំព័រ `/admin` (សម្រាប់អ្នកគ្រប់គ្រង) និង `/agency` (សម្រាប់ភ្នាក់ងារ)។

**របៀបដំណើរការ**
1. Admin បង្កើតភ្នាក់ងារ (ឈ្មោះ លេខទូរស័ព្ទ ចំណែក %) ហើយកម្មវិធីបង្កើត **លេខកូដអញ្ជើញ ៤ ខ្ទង់** មិនជាន់គ្នា។
2. ភ្នាក់ងារឱ្យអ្នកលក់ដែលខ្លួននាំចូល ប្រើលេខកូដនោះពេលចុះឈ្មោះ។ ការផ្សាយ និងកម្រៃរបស់អ្នកលក់នោះនឹងភ្ជាប់ជាមួយលេខកូដ។
3. ពេលអ្នកលក់បង់កម្រៃតាម KHQR ហើយ Admin ចុច «បញ្ជាក់ថាបានទទួលប្រាក់» ចំណែកភ្នាក់ងារ (% នៃកម្រៃដែលបានទទួលពិត) ត្រូវបានកត់ជាចំណូល។
4. ភ្នាក់ងារឃើញចំណូល និងអាច «ស្នើសុំបើកប្រាក់»។ Admin ផ្ទេរប្រាក់ទៅគណនីភ្នាក់ងារ **ពីគណនីធនាគាររបស់ខ្លួននៅខាងក្រៅកម្មវិធី** ហើយកត់ «បានបើក» ជាមួយលេខយោង។

**ក្បួនសុវត្ថិភាពនៃប្រព័ន្ធ (កុំកែបំបាក់)**
- ចំណូលភ្នាក់ងារមកតែពីកម្រៃលើកិច្ចព្រមព្រៀងអចលនទ្រព្យពិតប្រាកដ ដែលបានបង់ និង Admin បានបញ្ជាក់។ **មិនមានចំណូលពីការចុះឈ្មោះ ការដាក់ប្រាក់ ឬការនាំមនុស្សចូល**។
- មានតែ ១ កម្រិត៖ ភ្នាក់ងារមិនអាចមានភ្នាក់ងារក្រោមខ្លួនទេ។ ចំណែកអតិបរមាកំណត់ក្នុង `src/config/agency.js`។
- កម្មវិធីមិនរក្សាប្រាក់អ្នកប្រើ មិនមានការដាក់ប្រាក់ ហើយ «ការបើកប្រាក់» គឺជាសំណើទៅ Admin ដែលបង់ពីប្រាក់ចំណូលរបស់ខ្លួន។
- ភ្នាក់ងារត្រូវដឹងពីលក្ខខណ្ឌ និងអត្រាចំណែកជាមុន ហើយចំណូលនេះអាចត្រូវបង់ពន្ធ។

**កំណត់ Admin ក្នុង Supabase** (ត្រូវចុះឈ្មោះគណនីជាមុន ហើយចូលគណនីឡើងវិញក្រោយដំណើរការ)៖

```sql
update auth.users
set raw_app_meta_data = coalesce(raw_app_meta_data, '{}'::jsonb) || '{"role":"admin"}'
where email = '012345678@users.home-market.app';  -- ជំនួសដោយលេខទូរស័ព្ទ Admin
```

**SQL តារាងភ្នាក់ងារ** (ដំណើរការក្រោយផ្នែកកម្រៃជើងសារ)៖

```sql
alter table properties add column if not exists agency_code text;
alter table commissions add column if not exists agency_code text;
alter table commissions add column if not exists agency_share numeric;

create table agencies (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  phone text not null unique,
  code text not null unique check (code ~ '^[0-9]{4}$'),
  rate numeric not null default 20 check (rate >= 0 and rate <= 50),
  active boolean not null default true,
  created_at timestamptz default now()
);

create table payouts (
  id uuid primary key default gen_random_uuid(),
  agency_id uuid not null references agencies(id),
  amount numeric not null check (amount > 0),
  status text not null default 'requested' check (status in ('requested','paid','rejected')),
  reference text,
  created_at timestamptz default now(),
  paid_at timestamptz
);

alter table agencies enable row level security;
alter table payouts enable row level security;

create policy "admin_all_agencies" on agencies for all to authenticated
  using (public.is_admin()) with check (public.is_admin());
create policy "agency_self" on agencies for select to authenticated
  using (phone = public.current_phone());

create policy "admin_all_payouts" on payouts for all to authenticated
  using (public.is_admin()) with check (public.is_admin());
create policy "agency_payouts_select" on payouts for select to authenticated
  using (exists (select 1 from agencies a where a.id = agency_id and a.phone = public.current_phone()));
create policy "agency_payouts_request" on payouts for insert to authenticated
  with check (status = 'requested' and exists (
    select 1 from agencies a where a.id = agency_id and a.phone = public.current_phone() and a.active));

-- Admin មើលកម្រៃទាំងអស់ ហើយភ្នាក់ងារមើលកម្រៃរបស់ខ្លួន
create policy "admin_select_commissions" on commissions for select to authenticated
  using (public.is_admin());
create policy "agency_select_commissions" on commissions for select to authenticated
  using (agency_code in (select code from agencies where phone = public.current_phone()));

-- Admin បញ្ជាក់កម្រៃបានទទួល៖ គណនាចំណែកភ្នាក់ងារនៅ server (មិនទុកចិត្ត client)
create or replace function public.admin_confirm_commission(p_id uuid) returns void
language plpgsql security definer set search_path = public as $$
declare c commissions; a agencies;
begin
  if not public.is_admin() then raise exception 'forbidden'; end if;
  select * into c from commissions where id = p_id for update;
  if not found then raise exception 'not found'; end if;
  if c.status = 'paid' then return; end if;
  select * into a from agencies where code = c.agency_code and active;
  update commissions
     set status = 'paid', paid_at = now(),
         agency_share = case when a.id is null then 0 else round(c.amount * a.rate) / 100 end
   where id = p_id;
end $$;
revoke all on function public.admin_confirm_commission(uuid) from public;
grant execute on function public.admin_confirm_commission(uuid) to authenticated;
```

**ចំណាំសំខាន់**
- សិទ្ធិ Admin ក្នុង UI (`RequireAdmin`) គ្រាន់តែលាក់ទំព័រ។ សុវត្ថិភាពពិតមកពី policy `is_admin()` ខាងលើ។
- ខ្ញុំបានប្តូរ policy ទាំងអស់ពី `user_metadata` (អ្នកប្រើកែបាន) ទៅ `public.current_phone()` (យកពី email ក្នុង JWT) ដូច្នេះសូមដំណើរការ SQL ឡើងវិញ បើបានដំណើរការកំណែចាស់។ ការពារឱ្យពិតប្រាកដ គួរបិទការប្តូរ email ដោយខ្លួនឯងក្នុង Supabase Auth ហើយពិនិត្យដោយអ្នកជំនាញសុវត្ថិភាពមុនប្រើជាមួយលុយពិត។
- ភ្នាក់ងារឃើញកម្រៃដែលបានបង់ពីអ្នកលក់ដែលនាំចូល (ឈ្មោះការផ្សាយ និងចំណែក) ។ លេខកូដភ្ជាប់ការផ្សាយអាចត្រូវបានអ្នកលក់ជ្រើស ដូច្នេះ Admin គួរពិនិត្យមុនបញ្ជាក់ និងមុនបើកប្រាក់។
- ម៉ូដសាកល្បង (គ្មាន Supabase)៖ ដាក់លេខទូរស័ព្ទ Admin ក្នុង `VITE_ADMIN_PHONES`។ ទិន្នន័យនៅក្នុង localStorage ក្នុង browser តែមួយ មិនសមសម្រាប់ប្រើពិតទេ។

## អតិថិជនបង់ឱ្យអ្នកលក់ដោយផ្ទាល់ (Pay the seller)

- ពេលផ្សាយ អ្នកលក់អាចដាក់ព័ត៌មានទទួលប្រាក់ **គណនីផ្ទាល់ខ្លួន** (ឈ្មោះម្ចាស់គណនី លេខគណនី/Bakong ID និងរូប KHQR) ។
- អ្នកទិញចុច «កក់» ហើយបន្ទាប់ពីផ្ញើសំណើ ទើបឃើញព័ត៌មាននោះ ជាមួយ **លេខយោង** ដើម្បីដាក់ក្នុងចំណាំនៃការបង់។ ម្ចាស់ឃើញលេខយោងដដែលក្នុង `/reservations` ដើម្បីផ្គូផ្គងប្រាក់ដែលបានទទួល រួចចុច «កត់ថាបានទទួលប្រាក់កក់»។
- ប្រាក់ទៅគណនីអ្នកលក់ដោយផ្ទាល់ (ធនាគារ/KHQR)។ **កម្មវិធីមិនប៉ះ មិនរក្សា និងមិនបញ្ជូនលុយទេ**។
- ក្នុង Supabase ព័ត៌មានទទួលប្រាក់ត្រូវរក្សាក្នុងតារាងដាច់ដោយឡែក ហើយបង្ហាញតាម RPC ដែលពិនិត្យលេខយោងនៅ server (មិនបើកជាសាធារណៈ)។

```sql
alter table reservations add column if not exists reference text;
create unique index if not exists reservations_reference_key on reservations(reference);

create table seller_payment (
  property_id text primary key,
  owner text not null,
  pay_name text not null,
  pay_info text,
  pay_qr text
);
alter table seller_payment enable row level security;

create policy "owner_manage_payment" on seller_payment for all to authenticated
  using (owner = public.current_phone()) with check (owner = public.current_phone());

create or replace function public.get_payment_details(p_property_id text, p_reference text)
returns table (pay_name text, pay_info text, pay_qr text)
language sql stable security definer set search_path = public as $$
  select sp.pay_name, sp.pay_info, sp.pay_qr
  from seller_payment sp
  join reservations r on r.property_id = sp.property_id
  where sp.property_id = p_property_id
    and r.reference = p_reference
    and r.status <> 'cancelled'
  limit 1
$$;
revoke all on function public.get_payment_details(text, text) from public;
grant execute on function public.get_payment_details(text, text) to anon, authenticated;
```

**ហានិភ័យដែលត្រូវដឹង**៖ ការបោកប្រាស់ប្រាក់កក់ (ការផ្សាយក្លែងក្លាយដែលប្រមូលប្រាក់) ជារឿងធម្មតា ហើយកម្មវិធីមិនផ្ទៀងផ្ទាត់ម្ចាស់ទេ។ ដូច្នេះសារព្រមានសុវត្ថិភាពនៅក្បែរប៊ូតុងកក់ត្រូវរក្សាជានិច្ច ហើយបើអាច គួរបន្ថែមការផ្ទៀងផ្ទាត់ម្ចាស់ (អត្តសញ្ញាណប័ណ្ណ ឬប្លង់ដី) មុនបង្ហាញស្លាក «បានផ្ទៀងផ្ទាត់»។ ឈ្មោះគណនីត្រូវដូចឈ្មោះម្ចាស់ផ្ទះ។

## ស្លាក «ម្ចាស់បានផ្ទៀងផ្ទាត់» (Verified owner)

1. អ្នកលក់ចូល `/verify` (ពីប៊ូតុង «ការផ្ទៀងផ្ទាត់» ក្នុងផ្ទាំងគ្រប់គ្រង) បំពេញឈ្មោះពេញ និងប្រភេទឯកសារ (អត្តសញ្ញាណប័ណ្ណ/ប្លង់ដី/លិខិតឆ្លងដែន) ហើយទទួលបាន **លេខយោង**។
2. អ្នកលក់ផ្ញើរូបថតឯកសារ ជាមួយលេខយោង ទៅ Admin តាម Telegram (`VITE_SUPPORT_TELEGRAM`)។ **កម្មវិធីមិនរក្សារូបថតឯកសារទេ** ដើម្បីកាត់បន្ថយហានិភ័យទិន្នន័យផ្ទាល់ខ្លួន។ ពេលពិនិត្យរួច សូមលុបរូបថតពីឧបករណ៍/ជាតិ Telegram របស់អ្នក។
3. Admin ចូល `/admin` → ផ្ទាំង «ការផ្ទៀងផ្ទាត់» ផ្ទៀងផ្ទាត់ឈ្មោះ និងឯកសារ រួចចុច «អនុម័ត» ឬ «បដិសេធ»។ ការអនុម័តដាក់ស្លាកលើការផ្សាយទាំងអស់របស់ម្ចាស់នោះ។ អាច «ដកស្លាក» បានពេលក្រោយ។
4. គួរផ្ទៀងផ្ទាត់ថា ឈ្មោះក្នុងឯកសារ ត្រូវនឹងឈ្មោះម្ចាស់គណនីទទួលប្រាក់ និងម្ចាស់អចលនទ្រព្យពិតប្រាកដ (ពិនិត្យប្លង់ដី)។ ស្លាកនេះមិនមែនជាការធានាស្របច្បាប់ទេ។
5. ការរក្សាទិន្នន័យអត្តសញ្ញាណត្រូវអនុវត្តតាមច្បាប់ការពារទិន្នន័យ។ បើចង់ឱ្យកម្មវិធីរក្សារូបឯកសារ ត្រូវប្រើ Supabase Storage ជា bucket **ឯកជន** និងកំណត់ពេលលុប។

SQL (Supabase)៖

```sql
create table verification_requests (
  id uuid primary key default gen_random_uuid(),
  owner text not null,
  full_name text not null,
  doc_type text not null check (doc_type in ('id','title','passport')),
  note text,
  reference text not null,
  status text not null default 'pending' check (status in ('pending','approved','rejected')),
  created_at timestamptz default now(),
  reviewed_at timestamptz
);

create table verified_owners (
  owner text primary key,
  full_name text,
  verified_at timestamptz default now()
);

alter table verification_requests enable row level security;
alter table verified_owners enable row level security;

create policy "own_request_insert" on verification_requests for insert to authenticated
  with check (owner = public.current_phone() and status = 'pending');
create policy "own_request_select" on verification_requests for select to authenticated
  using (owner = public.current_phone());
create policy "admin_request_select" on verification_requests for select to authenticated
  using (public.is_admin());

-- សាធារណៈមើលបានតែជួរ owner (ឈ្មោះពេញមិនបើកទេ)
create policy "public_verified_select" on verified_owners for select to anon, authenticated using (true);
revoke select on verified_owners from anon, authenticated;
grant select (owner) on verified_owners to anon, authenticated;

create or replace function public.admin_review_verification(p_id uuid, p_approve boolean) returns void
language plpgsql security definer set search_path = public as $$
declare r verification_requests;
begin
  if not public.is_admin() then raise exception 'forbidden'; end if;
  select * into r from verification_requests where id = p_id for update;
  if not found then raise exception 'not found'; end if;
  update verification_requests
     set status = case when p_approve then 'approved' else 'rejected' end, reviewed_at = now()
   where id = p_id;
  if p_approve then
    insert into verified_owners (owner, full_name) values (r.owner, r.full_name)
    on conflict (owner) do update set full_name = excluded.full_name, verified_at = now();
  end if;
end $$;

create or replace function public.admin_revoke_verification(p_owner text) returns void
language plpgsql security definer set search_path = public as $$
begin
  if not public.is_admin() then raise exception 'forbidden'; end if;
  delete from verified_owners where owner = p_owner;
  update verification_requests set status = 'rejected' where owner = p_owner and status = 'approved';
end $$;

revoke all on function public.admin_review_verification(uuid, boolean) from public;
revoke all on function public.admin_revoke_verification(text) from public;
grant execute on function public.admin_review_verification(uuid, boolean) to authenticated;
grant execute on function public.admin_revoke_verification(text) to authenticated;
```
