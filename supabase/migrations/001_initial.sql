-- Ezer Auto — Initial Schema
-- Run this in your Supabase SQL Editor

-- Enable UUID extension
create extension if not exists "uuid-ossp";

-- Vehicles table
create table if not exists vehicles (
  id uuid primary key default uuid_generate_v4(),
  make text not null,
  model text not null,
  year integer not null,
  mileage integer not null default 0,
  price numeric(10,2) not null,
  description text,
  images text[] default '{}',
  available boolean not null default true,
  created_at timestamptz not null default now()
);

-- Service bookings table
create table if not exists service_bookings (
  id uuid primary key default uuid_generate_v4(),
  user_id uuid references auth.users(id) on delete set null,
  name text not null,
  phone text not null,
  email text not null,
  vehicle_info text not null,
  service_type text not null,
  preferred_date date not null,
  status text not null default 'pending' check (status in ('pending','confirmed','completed','cancelled')),
  created_at timestamptz not null default now()
);

-- Contact submissions table
create table if not exists contact_submissions (
  id uuid primary key default uuid_generate_v4(),
  name text not null,
  email text not null,
  message text not null,
  created_at timestamptz not null default now()
);

-- Saved vehicles table
create table if not exists saved_vehicles (
  id uuid primary key default uuid_generate_v4(),
  user_id uuid not null references auth.users(id) on delete cascade,
  vehicle_id uuid not null references vehicles(id) on delete cascade,
  created_at timestamptz not null default now(),
  unique(user_id, vehicle_id)
);

-- Row Level Security
alter table vehicles enable row level security;
alter table service_bookings enable row level security;
alter table contact_submissions enable row level security;
alter table saved_vehicles enable row level security;

-- Vehicles: public read, no public write
create policy "Vehicles are publicly readable" on vehicles
  for select using (true);

-- Service bookings: anyone can insert (guest or auth), users can read their own
create policy "Anyone can book a service" on service_bookings
  for insert with check (true);
create policy "Users can view own bookings" on service_bookings
  for select using (auth.uid() = user_id or user_id is null);

-- Contact submissions: insert only
create policy "Anyone can submit contact form" on contact_submissions
  for insert with check (true);

-- Saved vehicles: authenticated users only
create policy "Users can manage their saved vehicles" on saved_vehicles
  for all using (auth.uid() = user_id);

-- Seed sample vehicles
insert into vehicles (make, model, year, mileage, price, description, images, available) values
  ('Toyota', 'Camry', 2020, 42000, 22500, 'Clean title, excellent condition. Well-maintained Toyota Camry with full service history. Great fuel economy and reliability.', '{}', true),
  ('Honda', 'CR-V', 2019, 55000, 24900, 'AWD, one owner. Honda CR-V in great shape with all-wheel drive and backup camera. Perfect for Nebraska winters.', '{}', true),
  ('Ford', 'F-150', 2021, 38000, 34500, 'XLT trim, tow package. Low mileage Ford F-150 with towing package. Ready to work.', '{}', true),
  ('Chevrolet', 'Equinox', 2020, 47000, 21000, 'FWD, loaded. Chevy Equinox with heated seats, Apple CarPlay, and remote start.', '{}', true),
  ('Nissan', 'Altima', 2021, 31000, 19900, 'SR trim, sporty. Nissan Altima with sport package and upgraded wheels.', '{}', true),
  ('Jeep', 'Grand Cherokee', 2019, 62000, 28500, '4WD, leather interior. Jeep Grand Cherokee with leather seats and sunroof.', '{}', true);
