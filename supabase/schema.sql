-- Zero Hour: Supabase PostgreSQL Schema with RBAC & RLS

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "pgcrypto";

-- Enum for Role-Based Access Control (RBAC)
DO $$ BEGIN
    CREATE TYPE user_role AS ENUM ('software_owner', 'business_admin', 'employee');
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;

-- Enum for Email Status
DO $$ BEGIN
    CREATE TYPE email_status AS ENUM ('queued', 'sent', 'delivered', 'failed', 'simulated');
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;

-- 1. Profiles Table (Extends Supabase auth.users)
CREATE TABLE IF NOT EXISTS public.profiles (
    id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
    email TEXT NOT NULL UNIQUE,
    full_name TEXT,
    avatar_url TEXT,
    role user_role NOT NULL DEFAULT 'employee',
    business_id UUID,
    created_at TIMESTAMPTZ DEFAULT TIMEZONE('utc', NOW()) NOT NULL,
    updated_at TIMESTAMPTZ DEFAULT TIMEZONE('utc', NOW()) NOT NULL
);

-- 2. Organizations / Businesses
CREATE TABLE IF NOT EXISTS public.businesses (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name TEXT NOT NULL,
    owner_id UUID REFERENCES public.profiles(id),
    created_at TIMESTAMPTZ DEFAULT TIMEZONE('utc', NOW()) NOT NULL
);

-- 3. Contacts / Customers Table
CREATE TABLE IF NOT EXISTS public.contacts (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    business_id UUID REFERENCES public.businesses(id) ON DELETE CASCADE,
    name TEXT NOT NULL,
    email TEXT NOT NULL,
    company TEXT,
    phone TEXT,
    status TEXT NOT NULL DEFAULT 'contact', -- 'contact' or 'customer'
    tags TEXT[] DEFAULT '{}',
    created_by UUID REFERENCES public.profiles(id),
    created_at TIMESTAMPTZ DEFAULT TIMEZONE('utc', NOW()) NOT NULL,
    updated_at TIMESTAMPTZ DEFAULT TIMEZONE('utc', NOW()) NOT NULL
);

-- 4. Email Templates Table
CREATE TABLE IF NOT EXISTS public.email_templates (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    business_id UUID REFERENCES public.businesses(id) ON DELETE CASCADE,
    name TEXT NOT NULL,
    subject TEXT NOT NULL,
    header_text TEXT,
    body_content TEXT NOT NULL,
    cta_text TEXT,
    cta_url TEXT,
    is_active BOOLEAN DEFAULT true,
    created_by UUID REFERENCES public.profiles(id),
    created_at TIMESTAMPTZ DEFAULT TIMEZONE('utc', NOW()) NOT NULL,
    updated_at TIMESTAMPTZ DEFAULT TIMEZONE('utc', NOW()) NOT NULL
);

-- 5. Email Logs Table (Append-Only Audit Log)
CREATE TABLE IF NOT EXISTS public.email_logs (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    business_id UUID REFERENCES public.businesses(id) ON DELETE SET NULL,
    sender_id UUID REFERENCES public.profiles(id),
    recipient_email TEXT NOT NULL,
    recipient_name TEXT,
    template_id UUID REFERENCES public.email_templates(id) ON DELETE SET NULL,
    subject TEXT NOT NULL,
    status email_status NOT NULL DEFAULT 'queued',
    external_message_id TEXT,
    encrypted_payload TEXT, -- AES-256-GCM encrypted payload at rest
    error_message TEXT,
    metadata JSONB DEFAULT '{}'::jsonb,
    created_at TIMESTAMPTZ DEFAULT TIMEZONE('utc', NOW()) NOT NULL
);

-- 6. Analytics Events Table
CREATE TABLE IF NOT EXISTS public.analytics_events (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    business_id UUID REFERENCES public.businesses(id) ON DELETE CASCADE,
    user_id UUID REFERENCES public.profiles(id),
    event_type TEXT NOT NULL,
    event_data JSONB DEFAULT '{}'::jsonb,
    created_at TIMESTAMPTZ DEFAULT TIMEZONE('utc', NOW()) NOT NULL
);

-- Indexes for performance
CREATE INDEX IF NOT EXISTS idx_contacts_business ON public.contacts(business_id);
CREATE INDEX IF NOT EXISTS idx_contacts_status ON public.contacts(status);
CREATE INDEX IF NOT EXISTS idx_email_logs_business ON public.email_logs(business_id);
CREATE INDEX IF NOT EXISTS idx_email_logs_status ON public.email_logs(status);
CREATE INDEX IF NOT EXISTS idx_email_logs_created_at ON public.email_logs(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_profiles_role ON public.profiles(role);

-- Enable Row Level Security (RLS)
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.businesses ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.contacts ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.email_templates ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.email_logs ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.analytics_events ENABLE ROW LEVEL SECURITY;

-- Helper function to check role
CREATE OR REPLACE FUNCTION public.get_current_role()
RETURNS user_role AS $$
    SELECT role FROM public.profiles WHERE id = auth.uid();
$$ LANGUAGE sql SECURITY DEFINER;

-- RLS POLICIES:
-- Level 1: software_owner has full access to all tables
CREATE POLICY "Owner has full access to profiles" ON public.profiles
    FOR ALL USING (public.get_current_role() = 'software_owner');

CREATE POLICY "Owner has full access to businesses" ON public.businesses
    FOR ALL USING (public.get_current_role() = 'software_owner');

CREATE POLICY "Owner has full access to contacts" ON public.contacts
    FOR ALL USING (public.get_current_role() = 'software_owner');

CREATE POLICY "Owner has full access to templates" ON public.email_templates
    FOR ALL USING (public.get_current_role() = 'software_owner');

CREATE POLICY "Owner has full access to email_logs" ON public.email_logs
    FOR ALL USING (public.get_current_role() = 'software_owner');

-- Level 2: business_admin has access to their own business data
CREATE POLICY "Admin manages own business contacts" ON public.contacts
    FOR ALL USING (
        business_id IN (SELECT business_id FROM public.profiles WHERE id = auth.uid())
        AND public.get_current_role() = 'business_admin'
    );

CREATE POLICY "Admin manages own templates" ON public.email_templates
    FOR ALL USING (
        business_id IN (SELECT business_id FROM public.profiles WHERE id = auth.uid())
        AND public.get_current_role() = 'business_admin'
    );

CREATE POLICY "Admin views own email logs" ON public.email_logs
    FOR SELECT USING (
        business_id IN (SELECT business_id FROM public.profiles WHERE id = auth.uid())
        AND public.get_current_role() = 'business_admin'
    );

-- Level 3: employee can view and insert contacts, view logs
CREATE POLICY "Employee views contacts" ON public.contacts
    FOR SELECT USING (
        business_id IN (SELECT business_id FROM public.profiles WHERE id = auth.uid())
    );

CREATE POLICY "Employee inserts contacts" ON public.contacts
    FOR INSERT WITH CHECK (
        business_id IN (SELECT business_id FROM public.profiles WHERE id = auth.uid())
        AND public.get_current_role() = 'employee'
    );

CREATE POLICY "Employee views email logs" ON public.email_logs
    FOR SELECT USING (
        business_id IN (SELECT business_id FROM public.profiles WHERE id = auth.uid())
        AND public.get_current_role() = 'employee'
    );
