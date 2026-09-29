-- InternGuide profile + CV data
-- Run in Supabase SQL Editor after enabling Auth.

create table if not exists public.profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  full_name text,
  phone text,
  university text,
  major text,
  year_of_study text,
  expected_graduation text,
  location text,
  career_roles text,
  preferred_industry text,
  preferred_location text,
  internship_type text,
  skills text,
  languages text,
  bio text,
  avatar_url text,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

alter table public.profiles enable row level security;

create table if not exists public.profile_cvs (
    id uuid primary key default gen_random_uuid(),
    user_id uuid not null references auth.users(id) on delete cascade,
    storage_path text not null,
    file_name text not null,
    file_size bigint not null check (file_size > 0),
    file_type text not null check (file_type in ('PDF', 'DOC', 'DOCX')),
    created_at timestamptz not null default now(),
    updated_at timestamptz not null default now()
);

alter table public.profile_cvs enable row level security;

drop policy if exists "Users can view their own profile CVs" on public.profile_cvs;
create policy "Users can view their own profile CVs"
on public.profile_cvs for select to authenticated
using ((select auth.uid()) = user_id);

drop policy if exists "Users can insert their own profile CVs" on public.profile_cvs;
create policy "Users can insert their own profile CVs"
on public.profile_cvs for insert to authenticated
with check ((select auth.uid()) = user_id);

drop policy if exists "Users can delete their own profile CVs" on public.profile_cvs;
create policy "Users can delete their own profile CVs"
on public.profile_cvs for delete to authenticated
using ((select auth.uid()) = user_id);

create index if not exists profile_cvs_user_created_idx
on public.profile_cvs (user_id, created_at desc);

create or replace function public.is_admin()
returns boolean
language sql
stable
as $$
  select exists (
    select 1
    from public.profiles p
    where p.id = auth.uid()
      and p.role = 'admin'
  );
$$;

drop policy if exists "Admins can view all profile CVs" on public.profile_cvs;
create policy "Admins can view all profile CVs"
on public.profile_cvs for select to authenticated
using (public.is_admin());

create policy "Users can view their own profile"
on public.profiles for select to authenticated
using ((select auth.uid()) = id);

create policy "Users can insert their own profile"
on public.profiles for insert to authenticated
with check ((select auth.uid()) = id);

create policy "Users can update their own profile"
on public.profiles for update to authenticated
using ((select auth.uid()) = id)
with check ((select auth.uid()) = id);

create table if not exists public.user_cvs (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  name text not null,
  cv_type text not null check (cv_type in ('uploaded','builder')),
  storage_path text,
  file_name text,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

alter table public.user_cvs enable row level security;

create policy "Users can view their own CVs"
on public.user_cvs for select to authenticated
using ((select auth.uid()) = user_id);

create policy "Users can insert their own CVs"
on public.user_cvs for insert to authenticated
with check ((select auth.uid()) = user_id);

create policy "Users can update their own CVs"
on public.user_cvs for update to authenticated
using ((select auth.uid()) = user_id)
with check ((select auth.uid()) = user_id);

create policy "Users can delete their own CVs"
on public.user_cvs for delete to authenticated
using ((select auth.uid()) = user_id);

-- Allow users to view their own avatar and admins to preview all avatars.
drop policy if exists "Users can view own profile avatars"
on storage.objects;

create policy "Users can view own profile avatars"
on storage.objects for select to authenticated
using (
    bucket_id = 'avatars'
    and (storage.foldername(name))[1] = (select auth.uid())::text
);

drop policy if exists "Admins can view profile avatars"
on storage.objects;

create policy "Admins can view profile avatars"
on storage.objects for select to authenticated
using (
    bucket_id = 'avatars'
    and public.is_admin()
);

-- Expose only approved testimonial authors' avatar paths to public pages.
do $do$
begin
    if to_regclass('public.testimonials') is not null then
        execute $view$
            create or replace view public.testimonial_public_profiles
            with (security_invoker = false)
            as
            select distinct p.id, p.avatar_url
            from public.profiles p
            join public.testimonials t on t.user_id = p.id
            where t.status = 'approved'
                and p.avatar_url is not null
        $view$;

        execute 'grant select on public.testimonial_public_profiles to anon, authenticated';
        execute 'drop policy if exists "Public can view approved testimonial avatars" on storage.objects';
        execute $policy$
            create policy "Public can view approved testimonial avatars"
            on storage.objects for select to anon, authenticated
            using (
                bucket_id = 'avatars'
                and exists (
                    select 1
                    from public.testimonial_public_profiles p
                    where p.avatar_url = storage.objects.name
                )
            )
        $policy$;
    end if;
end
$do$;

notify pgrst, 'reload schema';

-- For permanent uploaded CV files, create a private Storage bucket named:
-- cv-files
insert into storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
values (
    'cv-files',
    'cv-files',
    false,
    10485760,
    array[
        'application/pdf',
        'application/msword',
        'application/vnd.openxmlformats-officedocument.wordprocessingml.document'
    ]
)
on conflict (id) do update set
    public = false,
    file_size_limit = excluded.file_size_limit,
    allowed_mime_types = excluded.allowed_mime_types;

drop policy if exists "Users can view own CV files" on storage.objects;
create policy "Users can view own CV files"
on storage.objects for select to authenticated
using (
    bucket_id = 'cv-files'
    and (storage.foldername(name))[1] = (select auth.uid())::text
);

drop policy if exists "Users can upload own CV files" on storage.objects;
create policy "Users can upload own CV files"
on storage.objects for insert to authenticated
with check (
    bucket_id = 'cv-files'
    and (storage.foldername(name))[1] = (select auth.uid())::text
);

drop policy if exists "Users can delete own CV files" on storage.objects;
create policy "Users can delete own CV files"
on storage.objects for delete to authenticated
using (
    bucket_id = 'cv-files'
    and (storage.foldername(name))[1] = (select auth.uid())::text
);

drop policy if exists "Admins can view CV files" on storage.objects;
create policy "Admins can view CV files"
on storage.objects for select to authenticated
using (bucket_id = 'cv-files' and public.is_admin());

-- Add role to profiles
alter table public.profiles
add column if not exists role text
default 'student'
check (role in ('student', 'admin'));

-- ==========================================
-- CONTACT MESSAGES
-- ==========================================

create table if not exists public.contact_messages (
  id uuid primary key default gen_random_uuid(),
  full_name text not null,
  email text not null,
  subject text not null default '',
  message text not null,
  status text not null default 'new' check (status in ('new', 'read', 'replied', 'archived')),
  is_read boolean not null default false,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

alter table public.contact_messages enable row level security;

drop policy if exists "Anyone can submit contact messages" on public.contact_messages;

create policy "Anyone can submit contact messages"
on public.contact_messages for insert
to anon, authenticated
with check (
  full_name is not null
  and trim(full_name) <> ''
  and email is not null
  and trim(email) <> ''
  and subject is not null
  and trim(subject) <> ''
  and message is not null
  and trim(message) <> ''
  and status in ('new', 'read', 'replied', 'archived')
  and is_read is not null
);

create policy "Admins can view contact messages"
on public.contact_messages for select
to authenticated
using (public.is_admin());

create policy "Admins can update contact messages"
on public.contact_messages for update
to authenticated
using (public.is_admin())
with check (public.is_admin());

create policy "Admins can delete contact messages"
on public.contact_messages for delete
to authenticated
using (public.is_admin());

create index if not exists contact_messages_status_idx
on public.contact_messages(status);

create index if not exists contact_messages_created_at_idx
on public.contact_messages(created_at desc);


-- ==========================================
-- INTERNGUIDE INTERNSHIPS RLS
-- ==========================================

-- Enable Row Level Security
alter table public.internships
enable row level security;


-- ==========================================
-- STUDENTS / PUBLIC USERS
-- Can view active internships
-- ==========================================

drop policy if exists
"Anyone can view active internships"
on public.internships;

create policy
"Anyone can view active internships"

on public.internships

for select

to anon, authenticated

using (
    status in ('active', 'approved')
);


-- ==========================================
-- ADMINS
-- Can SELECT / INSERT / UPDATE / DELETE
-- ==========================================

drop policy if exists
"Admins can manage internships"
on public.internships;

create policy
"Admins can manage internships"

on public.internships

for all

to authenticated

using (
    public.is_admin()
)

with check (
    public.is_admin()
);


-- ==========================================
-- INDEXES
-- ==========================================

create index if not exists
internships_status_idx
on public.internships(status);

create index if not exists
internships_category_id_idx
on public.internships(category_id);

create index if not exists
internships_company_id_idx
on public.internships(company_id);

create index if not exists
internships_deadline_idx
on public.internships(deadline);


-- ==========================================
-- INTERNGUIDE CAREER GUIDES
-- ==========================================

create table if not exists public.career_guides (

    id bigint generated by default as identity
        primary key,

    title varchar(255) not null,

    category varchar(100),

    description text,

    skills text,

    qualifications text,

    career_path text,

    related_internships text,

    content text,

    status varchar(20)
        not null
        default 'draft'
        check (
            status in (
                'published',
                'draft'
            )
        ),

    created_at timestamptz
        not null
        default now(),

    updated_at timestamptz
        not null
        default now()
);


-- ==========================================
-- ENABLE RLS
-- ==========================================

alter table public.career_guides
enable row level security;


-- ==========================================
-- PUBLIC USERS
-- Anyone can view published guides
-- ==========================================

drop policy if exists
"Anyone can view published career guides"
on public.career_guides;

create policy
"Anyone can view published career guides"

on public.career_guides

for select

to anon, authenticated

using (
    status = 'published'
);


-- ==========================================
-- ADMIN MANAGEMENT
-- ==========================================

drop policy if exists
"Admins can manage career guides"
on public.career_guides;

create policy
"Admins can manage career guides"

on public.career_guides

for all

to authenticated

using (
    public.is_admin()
)

with check (
    public.is_admin()
);


-- ==========================================
-- UPDATED_AT FUNCTION
-- ==========================================

create or replace function
public.set_career_guides_updated_at()

returns trigger

language plpgsql

as $$

begin

    new.updated_at = now();

    return new;

end;

$$;


-- ==========================================
-- UPDATED_AT TRIGGER
-- ==========================================

drop trigger if exists
career_guides_updated_at
on public.career_guides;


create trigger
career_guides_updated_at

before update
on public.career_guides

for each row

execute function
public.set_career_guides_updated_at();


-- ==========================================
-- INDEXES
-- ==========================================

create index if not exists
career_guides_status_idx
on public.career_guides(status);

create index if not exists
career_guides_category_idx
on public.career_guides(category);

-- Applications are provisioned separately in existing projects.
do $$
begin
    if to_regclass('public.applications') is not null then
        execute 'drop policy if exists "Users can delete their own applications" on public.applications';
        execute 'create policy "Users can delete their own applications" on public.applications for delete to authenticated using ((select auth.uid()) = user_id)';
    end if;
end
$$;