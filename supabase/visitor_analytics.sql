-- Visitor Analytics Table & Procedure for Farooqi Online Quran Academy
CREATE TABLE IF NOT EXISTS public.site_analytics (
  id BIGSERIAL PRIMARY KEY,
  visit_date DATE NOT NULL DEFAULT CURRENT_DATE,
  client_hash VARCHAR(64) NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  CONSTRAINT uq_date_client UNIQUE(visit_date, client_hash)
);

CREATE TABLE IF NOT EXISTS public.site_totals (
  id INT PRIMARY KEY DEFAULT 1,
  total_lifetime_visits BIGINT NOT NULL DEFAULT 12500,
  last_updated TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

INSERT INTO public.site_totals (id, total_lifetime_visits)
VALUES (1, 12500)
ON CONFLICT (id) DO NOTHING;

-- RPC Function to record visit atomically
CREATE OR REPLACE FUNCTION public.increment_site_visitor(p_date DATE, p_client_hash VARCHAR(64))
RETURNS JSONB
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
  v_inserted BOOLEAN := FALSE;
  v_today_count BIGINT;
  v_lifetime_count BIGINT;
BEGIN
  BEGIN
    INSERT INTO public.site_analytics (visit_date, client_hash)
    VALUES (p_date, p_client_hash);
    v_inserted := TRUE;

    UPDATE public.site_totals
    SET total_lifetime_visits = total_lifetime_visits + 1,
        last_updated = NOW()
    WHERE id = 1;
  EXCEPTION WHEN unique_violation THEN
    v_inserted := FALSE;
  END;

  SELECT COUNT(*) INTO v_today_count FROM public.site_analytics WHERE visit_date = p_date;
  SELECT total_lifetime_visits INTO v_lifetime_count FROM public.site_totals WHERE id = 1;

  RETURN jsonb_build_object(
    'is_new_today', v_inserted,
    'today_visitors', v_today_count,
    'total_visitors', v_lifetime_count
  );
END;
$$;
