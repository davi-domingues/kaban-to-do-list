create table if not exists public.boards (
  id uuid primary key default gen_random_uuid(),
  owner_id uuid not null references auth.users(id) on delete cascade,
  name text not null,
  description text,
  created_at timestamptz not null default now()
);

create table if not exists public.board_columns (
  id uuid primary key default gen_random_uuid(),
  board_id uuid not null references public.boards(id) on delete cascade,
  name text not null,
  order_index integer not null default 0,
  created_at timestamptz not null default now()
);

create table if not exists public.item_types (
  id uuid primary key default gen_random_uuid(),
  board_id uuid not null references public.boards(id) on delete cascade,
  name text not null,
  created_at timestamptz not null default now()
);

create table if not exists public.items (
  id uuid primary key default gen_random_uuid(),
  board_id uuid not null references public.boards(id) on delete cascade,
  column_id uuid references public.board_columns(id) on delete set null,
  parent_id uuid references public.items(id) on delete cascade,
  type_id uuid references public.item_types(id) on delete set null,
  title text not null,
  description text,
  status text not null,
  priority text not null check (priority in ('low', 'medium', 'high')),
  due_date date,
  created_at timestamptz not null default now(),
  completed_at timestamptz,
  order_index integer not null default 0
);

create table if not exists public.tags (
  id uuid primary key default gen_random_uuid(),
  board_id uuid not null references public.boards(id) on delete cascade,
  name text not null,
  color text,
  created_at timestamptz not null default now()
);

create table if not exists public.item_tags (
  item_id uuid not null references public.items(id) on delete cascade,
  tag_id uuid not null references public.tags(id) on delete cascade,
  primary key (item_id, tag_id)
);

alter table public.boards enable row level security;
alter table public.board_columns enable row level security;
alter table public.items enable row level security;
alter table public.tags enable row level security;
alter table public.item_tags enable row level security;
alter table public.item_types enable row level security;

create policy "boards_read" on public.boards
  for select using (auth.uid() = owner_id);
create policy "boards_write" on public.boards
  for all using (auth.uid() = owner_id) with check (auth.uid() = owner_id);

create policy "columns_read" on public.board_columns
  for select using (
    exists (select 1 from public.boards b where b.id = board_id and b.owner_id = auth.uid())
  );
create policy "columns_write" on public.board_columns
  for all using (
    exists (select 1 from public.boards b where b.id = board_id and b.owner_id = auth.uid())
  ) with check (
    exists (select 1 from public.boards b where b.id = board_id and b.owner_id = auth.uid())
  );

create policy "items_read" on public.items
  for select using (
    exists (select 1 from public.boards b where b.id = board_id and b.owner_id = auth.uid())
  );
create policy "items_write" on public.items
  for all using (
    exists (select 1 from public.boards b where b.id = board_id and b.owner_id = auth.uid())
  ) with check (
    exists (select 1 from public.boards b where b.id = board_id and b.owner_id = auth.uid())
  );

create policy "tags_read" on public.tags
  for select using (
    exists (select 1 from public.boards b where b.id = board_id and b.owner_id = auth.uid())
  );
create policy "tags_write" on public.tags
  for all using (
    exists (select 1 from public.boards b where b.id = board_id and b.owner_id = auth.uid())
  ) with check (
    exists (select 1 from public.boards b where b.id = board_id and b.owner_id = auth.uid())
  );

create policy "item_tags_read" on public.item_tags
  for select using (
    exists (
      select 1 from public.items i
      join public.boards b on b.id = i.board_id
      where i.id = item_id and b.owner_id = auth.uid()
    )
  );
create policy "item_tags_write" on public.item_tags
  for all using (
    exists (
      select 1 from public.items i
      join public.boards b on b.id = i.board_id
      where i.id = item_id and b.owner_id = auth.uid()
    )
  ) with check (
    exists (
      select 1 from public.items i
      join public.boards b on b.id = i.board_id
      where i.id = item_id and b.owner_id = auth.uid()
    )
  );

create policy "item_types_read" on public.item_types
  for select using (
    exists (select 1 from public.boards b where b.id = board_id and b.owner_id = auth.uid())
  );
create policy "item_types_write" on public.item_types
  for all using (
    exists (select 1 from public.boards b where b.id = board_id and b.owner_id = auth.uid())
  ) with check (
    exists (select 1 from public.boards b where b.id = board_id and b.owner_id = auth.uid())
  );
