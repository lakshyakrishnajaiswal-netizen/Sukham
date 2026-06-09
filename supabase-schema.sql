create type appointment_status as enum ('Pending', 'Confirmed', 'Completed', 'Cancelled');

create table hero_slides (
  id uuid primary key default gen_random_uuid(),
  eyebrow text,
  title text not null,
  copy text,
  image_url text not null,
  cta_label text,
  cta_href text,
  sort_order int default 0,
  created_at timestamptz default now()
);

create table experts (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  role text,
  bio text,
  image_url text,
  details text[] default '{}',
  sort_order int default 0,
  created_at timestamptz default now()
);

create table certificates (
  id uuid primary key default gen_random_uuid(),
  expert_id uuid references experts(id) on delete cascade,
  title text not null,
  image_url text,
  sort_order int default 0,
  created_at timestamptz default now()
);

create table plans (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  price_label text,
  features text[] default '{}',
  featured boolean default false,
  sort_order int default 0,
  created_at timestamptz default now()
);

create table workshops (
  id uuid primary key default gen_random_uuid(),
  title text not null,
  date_label text,
  time_label text,
  location text,
  description text,
  image_url text,
  created_at timestamptz default now()
);

create table blogs (
  id uuid primary key default gen_random_uuid(),
  title text not null,
  summary text,
  body text,
  image_url text,
  published boolean default false,
  created_at timestamptz default now()
);

create table gallery_images (
  id uuid primary key default gen_random_uuid(),
  image_url text not null,
  alt text,
  sort_order int default 0,
  created_at timestamptz default now()
);

create table reviews (
  id uuid primary key default gen_random_uuid(),
  client_name text not null,
  review text not null,
  rating int check (rating between 1 and 5),
  image_url text,
  created_at timestamptz default now()
);

create table appointments (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  phone_number text not null,
  email text,
  service text not null,
  preferred_date date not null,
  preferred_time time not null,
  message text,
  status appointment_status default 'Pending',
  created_at timestamptz default now()
);

alter table hero_slides enable row level security;
alter table experts enable row level security;
alter table certificates enable row level security;
alter table plans enable row level security;
alter table workshops enable row level security;
alter table blogs enable row level security;
alter table gallery_images enable row level security;
alter table reviews enable row level security;
alter table appointments enable row level security;

create policy "Public can read published site content" on hero_slides for select using (true);
create policy "Public can read experts" on experts for select using (true);
create policy "Public can read certificates" on certificates for select using (true);
create policy "Public can read plans" on plans for select using (true);
create policy "Public can read workshops" on workshops for select using (true);
create policy "Public can read published blogs" on blogs for select using (published = true);
create policy "Public can read gallery" on gallery_images for select using (true);
create policy "Public can read reviews" on reviews for select using (true);
create policy "Public can create appointments" on appointments for insert with check (true);
