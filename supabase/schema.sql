create extension if not exists "pgcrypto";

create table if not exists public.users (
  id uuid primary key references auth.users (id) on delete cascade,
  email text unique not null,
  display_name text,
  weight_unit text not null default 'kg' check (weight_unit in ('kg', 'lb')),
  created_at timestamptz not null default now()
);

create table if not exists public.exercises (
  id uuid primary key default gen_random_uuid(),
  key text unique not null,
  name_en text not null,
  name_zh text not null,
  category text not null,
  primary_muscle_group text not null,
  created_at timestamptz not null default now()
);

create table if not exists public.food_items (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references public.users (id) on delete cascade,
  name text not null,
  default_unit text not null default 'g',
  calories_per_100g numeric(8,2),
  protein_per_100g numeric(8,2),
  carbs_per_100g numeric(8,2),
  fat_per_100g numeric(8,2),
  created_at timestamptz not null default now()
);

create table if not exists public.daily_logs (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references public.users (id) on delete cascade,
  log_date date not null,
  training_status text not null check (training_status in ('trained', 'rest', 'dance', 'recovery')),
  readiness_score integer check (readiness_score between 0 and 100),
  sleep_hours numeric(4,2),
  sleep_quality integer check (sleep_quality between 1 and 5),
  mood integer check (mood between 1 and 5),
  fatigue integer check (fatigue between 1 and 5),
  stress integer check (stress between 1 and 5),
  hunger integer check (hunger between 1 and 5),
  appetite text,
  digestion text,
  soreness_areas text[] not null default '{}',
  pain_areas text[] not null default '{}',
  pain_level integer check (pain_level between 1 and 10),
  body_weight numeric(6,2),
  menstrual_status text,
  note text,
  bedtime time,
  wake_time time,
  created_at timestamptz not null default now(),
  unique (user_id, log_date)
);

create table if not exists public.sleep_logs (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references public.users (id) on delete cascade,
  daily_log_id uuid references public.daily_logs (id) on delete cascade,
  log_date date not null,
  sleep_hours numeric(4,2) not null,
  bedtime time,
  wake_time time,
  sleep_quality integer not null check (sleep_quality between 1 and 5),
  created_at timestamptz not null default now()
);

create table if not exists public.mood_logs (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references public.users (id) on delete cascade,
  daily_log_id uuid references public.daily_logs (id) on delete cascade,
  log_date date not null,
  mood integer not null check (mood between 1 and 5),
  stress integer not null check (stress between 1 and 5),
  fatigue integer not null check (fatigue between 1 and 5),
  hunger integer check (hunger between 1 and 5),
  appetite text,
  digestion text,
  note text,
  created_at timestamptz not null default now()
);

create table if not exists public.pain_logs (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references public.users (id) on delete cascade,
  daily_log_id uuid references public.daily_logs (id) on delete cascade,
  log_date date not null,
  pain_areas text[] not null default '{}',
  soreness_areas text[] not null default '{}',
  pain_level integer not null check (pain_level between 1 and 10),
  note text,
  created_at timestamptz not null default now()
);

create table if not exists public.workouts (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references public.users (id) on delete cascade,
  workout_date date not null,
  workout_type text not null check (workout_type in ('chest_shoulders_core', 'back_core', 'legs_circuit', 'dance', 'cardio', 'rest', 'recovery')),
  focus text not null check (focus in ('strength', 'volume', 'conditioning', 'skill')),
  duration_minutes integer not null,
  rpe integer not null check (rpe between 1 and 10),
  energy_level integer not null check (energy_level between 1 and 5),
  has_pain boolean not null default false,
  pain_areas text[] not null default '{}',
  note text,
  dance_style text,
  practiced_basics boolean,
  practiced_choreography boolean,
  created_at timestamptz not null default now()
);

create table if not exists public.workout_exercises (
  id uuid primary key default gen_random_uuid(),
  workout_id uuid not null references public.workouts (id) on delete cascade,
  exercise_id uuid not null references public.exercises (id) on delete restrict,
  sort_order integer not null default 0,
  note text,
  created_at timestamptz not null default now()
);

create table if not exists public.workout_sets (
  id uuid primary key default gen_random_uuid(),
  workout_exercise_id uuid not null references public.workout_exercises (id) on delete cascade,
  set_number integer not null,
  weight numeric(8,2) not null default 0,
  reps integer not null default 0,
  rpe integer check (rpe between 1 and 10),
  tempo text,
  is_pr boolean not null default false,
  note text,
  created_at timestamptz not null default now()
);

create table if not exists public.meals (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references public.users (id) on delete cascade,
  meal_date date not null,
  meal_type text not null check (meal_type in ('breakfast', 'lunch', 'dinner', 'snack', 'pre_workout', 'post_workout', 'before_bed')),
  calories numeric(8,2) not null default 0,
  protein numeric(8,2) not null default 0,
  carbs numeric(8,2) not null default 0,
  fat numeric(8,2) not null default 0,
  markdown_summary text,
  note text,
  created_at timestamptz not null default now()
);

create table if not exists public.meal_items (
  id uuid primary key default gen_random_uuid(),
  meal_id uuid not null references public.meals (id) on delete cascade,
  food_item_id uuid references public.food_items (id) on delete set null,
  food_name text not null,
  amount_text text not null,
  grams numeric(8,2),
  created_at timestamptz not null default now()
);

create table if not exists public.body_metrics (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references public.users (id) on delete cascade,
  metric_date date not null,
  weight numeric(6,2),
  waist numeric(6,2),
  hips numeric(6,2),
  chest numeric(6,2),
  shoulders numeric(6,2),
  photo_url text,
  physique_note text,
  created_at timestamptz not null default now(),
  unique (user_id, metric_date)
);

create table if not exists public.workout_templates (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references public.users (id) on delete cascade,
  name text not null,
  workout_type text not null,
  focus text not null,
  description text,
  created_at timestamptz not null default now()
);

create table if not exists public.template_exercises (
  id uuid primary key default gen_random_uuid(),
  template_id uuid not null references public.workout_templates (id) on delete cascade,
  exercise_id uuid not null references public.exercises (id) on delete restrict,
  sort_order integer not null default 0,
  default_sets integer,
  default_reps integer,
  note text
);

create table if not exists public.apple_health_daily_metrics (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references public.users (id) on delete cascade,
  external_id text not null,
  metric_type text not null,
  value numeric(12,4) not null,
  unit text not null,
  start_date timestamptz not null,
  end_date timestamptz not null,
  source_name text,
  source_bundle_identifier text,
  created_at timestamptz not null default now(),
  unique (user_id, external_id)
);

create table if not exists public.apple_health_workouts (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references public.users (id) on delete cascade,
  external_id text not null,
  workout_type text not null,
  duration_seconds numeric(12,2) not null,
  total_energy_burned numeric(12,2),
  total_distance numeric(12,2),
  start_date timestamptz not null,
  end_date timestamptz not null,
  source_name text,
  source_bundle_identifier text,
  created_at timestamptz not null default now(),
  unique (user_id, external_id)
);

create table if not exists public.apple_health_sleep_samples (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references public.users (id) on delete cascade,
  external_id text not null,
  category_value integer not null,
  start_date timestamptz not null,
  end_date timestamptz not null,
  source_name text,
  source_bundle_identifier text,
  created_at timestamptz not null default now(),
  unique (user_id, external_id)
);

alter table public.users enable row level security;
alter table public.exercises enable row level security;
alter table public.food_items enable row level security;
alter table public.daily_logs enable row level security;
alter table public.sleep_logs enable row level security;
alter table public.mood_logs enable row level security;
alter table public.pain_logs enable row level security;
alter table public.workouts enable row level security;
alter table public.workout_exercises enable row level security;
alter table public.workout_sets enable row level security;
alter table public.meals enable row level security;
alter table public.meal_items enable row level security;
alter table public.body_metrics enable row level security;
alter table public.workout_templates enable row level security;
alter table public.template_exercises enable row level security;
alter table public.apple_health_daily_metrics enable row level security;
alter table public.apple_health_workouts enable row level security;
alter table public.apple_health_sleep_samples enable row level security;

create policy "users can read own profile" on public.users
  for select using (auth.uid() = id);
create policy "users can update own profile" on public.users
  for update using (auth.uid() = id);

create policy "authenticated users can read exercises" on public.exercises
  for select to authenticated using (true);

create policy "users manage own food_items" on public.food_items
  for all using (auth.uid() = user_id) with check (auth.uid() = user_id);
create policy "users manage own daily_logs" on public.daily_logs
  for all using (auth.uid() = user_id) with check (auth.uid() = user_id);
create policy "users manage own sleep_logs" on public.sleep_logs
  for all using (auth.uid() = user_id) with check (auth.uid() = user_id);
create policy "users manage own mood_logs" on public.mood_logs
  for all using (auth.uid() = user_id) with check (auth.uid() = user_id);
create policy "users manage own pain_logs" on public.pain_logs
  for all using (auth.uid() = user_id) with check (auth.uid() = user_id);
create policy "users manage own workouts" on public.workouts
  for all using (auth.uid() = user_id) with check (auth.uid() = user_id);
create policy "users manage own meals" on public.meals
  for all using (auth.uid() = user_id) with check (auth.uid() = user_id);
create policy "users manage own body_metrics" on public.body_metrics
  for all using (auth.uid() = user_id) with check (auth.uid() = user_id);
create policy "users manage own templates" on public.workout_templates
  for all using (auth.uid() = user_id) with check (auth.uid() = user_id);
create policy "users manage own apple health daily metrics" on public.apple_health_daily_metrics
  for all using (auth.uid() = user_id) with check (auth.uid() = user_id);
create policy "users manage own apple health workouts" on public.apple_health_workouts
  for all using (auth.uid() = user_id) with check (auth.uid() = user_id);
create policy "users manage own apple health sleep samples" on public.apple_health_sleep_samples
  for all using (auth.uid() = user_id) with check (auth.uid() = user_id);

create policy "users manage related workout_exercises" on public.workout_exercises
  for all using (
    exists (
      select 1 from public.workouts w
      where w.id = workout_id and w.user_id = auth.uid()
    )
  ) with check (
    exists (
      select 1 from public.workouts w
      where w.id = workout_id and w.user_id = auth.uid()
    )
  );

create policy "users manage related workout_sets" on public.workout_sets
  for all using (
    exists (
      select 1
      from public.workout_exercises we
      join public.workouts w on w.id = we.workout_id
      where we.id = workout_exercise_id and w.user_id = auth.uid()
    )
  ) with check (
    exists (
      select 1
      from public.workout_exercises we
      join public.workouts w on w.id = we.workout_id
      where we.id = workout_exercise_id and w.user_id = auth.uid()
    )
  );

create policy "users manage related meal_items" on public.meal_items
  for all using (
    exists (
      select 1 from public.meals m
      where m.id = meal_id and m.user_id = auth.uid()
    )
  ) with check (
    exists (
      select 1 from public.meals m
      where m.id = meal_id and m.user_id = auth.uid()
    )
  );

create policy "users manage related template_exercises" on public.template_exercises
  for all using (
    exists (
      select 1 from public.workout_templates wt
      where wt.id = template_id and wt.user_id = auth.uid()
    )
  ) with check (
    exists (
      select 1 from public.workout_templates wt
      where wt.id = template_id and wt.user_id = auth.uid()
    )
  );
