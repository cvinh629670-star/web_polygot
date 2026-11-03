create table if not exists public.user_app_data (
  user_id uuid not null references auth.users (id) on delete cascade,
  key text not null check (key ~ '^polyglot_[a-zA-Z0-9_]+$'),
  value text not null,
  updated_at timestamptz not null default now(),
  deleted boolean not null default false,
  primary key (user_id, key)
);

alter table public.user_app_data enable row level security;

create policy "Users can read their own learning data"
  on public.user_app_data for select
  using (auth.uid() = user_id);

create policy "Users can insert their own learning data"
  on public.user_app_data for insert
  with check (auth.uid() = user_id);

create policy "Users can update their own learning data"
  on public.user_app_data for update
  using (auth.uid() = user_id)
  with check (auth.uid() = user_id);

create policy "Users can delete their own learning data"
  on public.user_app_data for delete
  using (auth.uid() = user_id);
