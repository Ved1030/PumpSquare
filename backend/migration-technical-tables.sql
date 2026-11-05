-- ============================================================================
-- PUMPSQUARE - Technical Product Content Tables Migration
-- Creates all missing tables for product technical content (reviews, performance, materials)
-- Safe to run: uses IF NOT EXISTS, idempotent operations
-- ============================================================================

-- ============================================================================
-- 1. PRODUCT_REVIEW_TABS
-- Stores tab configuration for product review sections
-- ============================================================================
CREATE TABLE IF NOT EXISTS public.product_review_tabs (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    product_id UUID NOT NULL REFERENCES public.products(id) ON DELETE CASCADE,
    tab_key TEXT NOT NULL,
    enabled BOOLEAN NOT NULL DEFAULT true,
    heading TEXT DEFAULT '',
    intro TEXT DEFAULT '',
    updated_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    UNIQUE (product_id, tab_key)
);

-- Index for fast lookups by product
CREATE INDEX IF NOT EXISTS idx_product_review_tabs_product_id
    ON public.product_review_tabs(product_id);

-- ============================================================================
-- 2. PRODUCT_REVIEW_FEATURES
-- Stores feature bullet points for each review tab
-- ============================================================================
CREATE TABLE IF NOT EXISTS public.product_review_features (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    product_id UUID NOT NULL REFERENCES public.products(id) ON DELETE CASCADE,
    tab_key TEXT NOT NULL,
    label TEXT,
    detail TEXT,
    sort_order INTEGER NOT NULL DEFAULT 0,
    created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Index for fast lookups by product and tab
CREATE INDEX IF NOT EXISTS idx_product_review_features_product_id
    ON public.product_review_features(product_id);

CREATE INDEX IF NOT EXISTS idx_product_review_features_tab_key
    ON public.product_review_features(tab_key);

-- ============================================================================
-- 3. PRODUCT_PERFORMANCE_COLUMNS
-- Stores column definitions for performance tables
-- ============================================================================
CREATE TABLE IF NOT EXISTS public.product_performance_columns (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    product_id UUID NOT NULL REFERENCES public.products(id) ON DELETE CASCADE,
    name TEXT NOT NULL,
    unit TEXT DEFAULT '',
    sort_order INTEGER NOT NULL DEFAULT 0,
    created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Index for fast lookups by product
CREATE INDEX IF NOT EXISTS idx_product_performance_columns_product_id
    ON public.product_performance_columns(product_id);

-- ============================================================================
-- 4. PRODUCT_PERFORMANCE_ROWS
-- Stores row definitions for performance tables
-- ============================================================================
CREATE TABLE IF NOT EXISTS public.product_performance_rows (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    product_id UUID NOT NULL REFERENCES public.products(id) ON DELETE CASCADE,
    sort_order INTEGER NOT NULL DEFAULT 0,
    created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Index for fast lookups by product
CREATE INDEX IF NOT EXISTS idx_product_performance_rows_product_id
    ON public.product_performance_rows(product_id);

-- ============================================================================
-- 5. PRODUCT_PERFORMANCE_CELLS
-- Stores cell values for performance tables (row x column matrix)
-- ============================================================================
CREATE TABLE IF NOT EXISTS public.product_performance_cells (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    row_id UUID NOT NULL REFERENCES public.product_performance_rows(id) ON DELETE CASCADE,
    column_id UUID NOT NULL REFERENCES public.product_performance_columns(id) ON DELETE CASCADE,
    value TEXT NOT NULL DEFAULT '',
    created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    UNIQUE (row_id, column_id)
);

-- Indexes for fast lookups
CREATE INDEX IF NOT EXISTS idx_product_performance_cells_row_id
    ON public.product_performance_cells(row_id);

CREATE INDEX IF NOT EXISTS idx_product_performance_cells_column_id
    ON public.product_performance_cells(column_id);

-- ============================================================================
-- 6. PRODUCT_MATERIALS
-- Stores materials of construction data
-- ============================================================================
CREATE TABLE IF NOT EXISTS public.product_materials (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    product_id UUID NOT NULL REFERENCES public.products(id) ON DELETE CASCADE,
    component TEXT NOT NULL,
    material TEXT NOT NULL,
    specification TEXT DEFAULT '',
    sort_order INTEGER NOT NULL DEFAULT 0,
    created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Index for fast lookups by product
CREATE INDEX IF NOT EXISTS idx_product_materials_product_id
    ON public.product_materials(product_id);

-- ============================================================================
-- 7. PRODUCT_EXPLANATION_PARAGRAPHS
-- Stores technical explanation paragraphs for products
-- ============================================================================
CREATE TABLE IF NOT EXISTS public.product_explanation_paragraphs (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    product_id UUID NOT NULL REFERENCES public.products(id) ON DELETE CASCADE,
    html TEXT NOT NULL DEFAULT '',
    sort_order INTEGER NOT NULL DEFAULT 0,
    created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Index for fast lookups by product
CREATE INDEX IF NOT EXISTS idx_product_explanation_paragraphs_product_id
    ON public.product_explanation_paragraphs(product_id);

-- ============================================================================
-- ROW LEVEL SECURITY (RLS)
-- Enable RLS on all tables
-- ============================================================================

ALTER TABLE public.product_review_tabs ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.product_review_features ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.product_performance_columns ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.product_performance_rows ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.product_performance_cells ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.product_materials ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.product_explanation_paragraphs ENABLE ROW LEVEL SECURITY;

-- ============================================================================
-- RLS POLICIES
-- Admin/service role has full access
-- Anonymous users have NO access (tables only accessible via service role in API)
-- ============================================================================

-- Drop existing policies first (idempotent)
DROP POLICY IF EXISTS "Service role full access - product_review_tabs" ON public.product_review_tabs;
DROP POLICY IF EXISTS "Service role full access - product_review_features" ON public.product_review_features;
DROP POLICY IF EXISTS "Service role full access - product_performance_columns" ON public.product_performance_columns;
DROP POLICY IF EXISTS "Service role full access - product_performance_rows" ON public.product_performance_rows;
DROP POLICY IF EXISTS "Service role full access - product_performance_cells" ON public.product_performance_cells;
DROP POLICY IF EXISTS "Service role full access - product_materials" ON public.product_materials;
DROP POLICY IF EXISTS "Service role full access - product_explanation_paragraphs" ON public.product_explanation_paragraphs;

-- Policy: Service role can do everything
CREATE POLICY "Service role full access - product_review_tabs"
    ON public.product_review_tabs
    FOR ALL
    TO service_role
    USING (true)
    WITH CHECK (true);

CREATE POLICY "Service role full access - product_review_features"
    ON public.product_review_features
    FOR ALL
    TO service_role
    USING (true)
    WITH CHECK (true);

CREATE POLICY "Service role full access - product_performance_columns"
    ON public.product_performance_columns
    FOR ALL
    TO service_role
    USING (true)
    WITH CHECK (true);

CREATE POLICY "Service role full access - product_performance_rows"
    ON public.product_performance_rows
    FOR ALL
    TO service_role
    USING (true)
    WITH CHECK (true);

CREATE POLICY "Service role full access - product_performance_cells"
    ON public.product_performance_cells
    FOR ALL
    TO service_role
    USING (true)
    WITH CHECK (true);

CREATE POLICY "Service role full access - product_materials"
    ON public.product_materials
    FOR ALL
    TO service_role
    USING (true)
    WITH CHECK (true);

CREATE POLICY "Service role full access - product_explanation_paragraphs"
    ON public.product_explanation_paragraphs
    FOR ALL
    TO service_role
    USING (true)
    WITH CHECK (true);

-- No policies for anon/authenticated roles = no access
-- All access goes through the backend API with service role key

-- ============================================================================
-- UPDATED_AT TRIGGERS (optional - for automatic timestamp updates)
-- ============================================================================

-- Function to update updated_at timestamp
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = now();
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Triggers for tables with updated_at
DROP TRIGGER IF EXISTS update_product_review_tabs_updated_at ON public.product_review_tabs;
CREATE TRIGGER update_product_review_tabs_updated_at
    BEFORE UPDATE ON public.product_review_tabs
    FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

DROP TRIGGER IF EXISTS update_product_review_features_updated_at ON public.product_review_features;
CREATE TRIGGER update_product_review_features_updated_at
    BEFORE UPDATE ON public.product_review_features
    FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

DROP TRIGGER IF EXISTS update_product_performance_columns_updated_at ON public.product_performance_columns;
CREATE TRIGGER update_product_performance_columns_updated_at
    BEFORE UPDATE ON public.product_performance_columns
    FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

DROP TRIGGER IF EXISTS update_product_performance_rows_updated_at ON public.product_performance_rows;
CREATE TRIGGER update_product_performance_rows_updated_at
    BEFORE UPDATE ON public.product_performance_rows
    FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

DROP TRIGGER IF EXISTS update_product_performance_cells_updated_at ON public.product_performance_cells;
CREATE TRIGGER update_product_performance_cells_updated_at
    BEFORE UPDATE ON public.product_performance_cells
    FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

DROP TRIGGER IF EXISTS update_product_materials_updated_at ON public.product_materials;
CREATE TRIGGER update_product_materials_updated_at
    BEFORE UPDATE ON public.product_materials
    FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

DROP TRIGGER IF EXISTS update_product_explanation_paragraphs_updated_at ON public.product_explanation_paragraphs;
CREATE TRIGGER update_product_explanation_paragraphs_updated_at
    BEFORE UPDATE ON public.product_explanation_paragraphs
    FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

-- ============================================================================
-- VERIFICATION
-- ============================================================================
-- Verify tables exist
DO $$
BEGIN
    RAISE NOTICE 'Tables created:';
    IF EXISTS (SELECT 1 FROM information_schema.tables WHERE table_name = 'product_review_tabs') THEN
        RAISE NOTICE '  - product_review_tabs ✓';
    END IF;
    IF EXISTS (SELECT 1 FROM information_schema.tables WHERE table_name = 'product_review_features') THEN
        RAISE NOTICE '  - product_review_features ✓';
    END IF;
    IF EXISTS (SELECT 1 FROM information_schema.tables WHERE table_name = 'product_performance_columns') THEN
        RAISE NOTICE '  - product_performance_columns ✓';
    END IF;
    IF EXISTS (SELECT 1 FROM information_schema.tables WHERE table_name = 'product_performance_rows') THEN
        RAISE NOTICE '  - product_performance_rows ✓';
    END IF;
    IF EXISTS (SELECT 1 FROM information_schema.tables WHERE table_name = 'product_performance_cells') THEN
        RAISE NOTICE '  - product_performance_cells ✓';
    END IF;
    IF EXISTS (SELECT 1 FROM information_schema.tables WHERE table_name = 'product_materials') THEN
        RAISE NOTICE '  - product_materials ✓';
    END IF;
    IF EXISTS (SELECT 1 FROM information_schema.tables WHERE table_name = 'product_explanation_paragraphs') THEN
        RAISE NOTICE '  - product_explanation_paragraphs ✓';
    END IF;
END $$;