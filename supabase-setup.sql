-- Supabase Database Setup for Biyaf Architecture Studio Website
-- Run this SQL in your Supabase SQL Editor

-- Create the website_content table
CREATE TABLE IF NOT EXISTS public.website_content (
    id BIGSERIAL PRIMARY KEY,
    section TEXT NOT NULL UNIQUE,
    content JSONB NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL
);

-- Create index on section for faster queries
CREATE INDEX IF NOT EXISTS idx_website_content_section ON public.website_content(section);

-- Create index on updated_at for sorting
CREATE INDEX IF NOT EXISTS idx_website_content_updated_at ON public.website_content(updated_at DESC);

-- Enable Row Level Security (RLS)
ALTER TABLE public.website_content ENABLE ROW LEVEL SECURITY;

-- Create policy to allow public read access (for frontend)
CREATE POLICY "Allow public read access" ON public.website_content
    FOR SELECT
    TO public
    USING (true);

-- Create policy to allow public insert/update/delete (for admin dashboard)
-- Note: In production, you should restrict this to authenticated admin users only
CREATE POLICY "Allow public write access" ON public.website_content
    FOR ALL
    TO public
    USING (true)
    WITH CHECK (true);

-- Create function to automatically update updated_at timestamp
CREATE OR REPLACE FUNCTION public.handle_updated_at()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create trigger to call the function before update
DROP TRIGGER IF EXISTS set_updated_at ON public.website_content;
CREATE TRIGGER set_updated_at
    BEFORE UPDATE ON public.website_content
    FOR EACH ROW
    EXECUTE FUNCTION public.handle_updated_at();

-- Grant necessary permissions
GRANT ALL ON public.website_content TO anon;
GRANT ALL ON public.website_content TO authenticated;
GRANT USAGE, SELECT ON SEQUENCE website_content_id_seq TO anon;
GRANT USAGE, SELECT ON SEQUENCE website_content_id_seq TO authenticated;

-- Insert default data (optional - will be added by the app if not present)
-- Uncomment the lines below if you want to pre-populate the database

/*
INSERT INTO public.website_content (section, content) VALUES
('hero', '{"eyebrow":"Biyaf Architecture Studio","title":"We design buildings that <em>hold their ground</em>.","description":"Biyaf is a design-led architecture practice shaping residential, commercial and public buildings across Ethiopia — built on precision, material honesty, and a deep read of site and climate.","image":"images/hero-residence.jpeg","imageAlt":"Luxury modern residence","coordinates":"N 09°02'' E 38°45''","figureLabel":"FIG. 01 — RESIDENCE"}'),
('stats', '[{"number":14,"label":"Years in Practice","suffix":""},{"number":86,"label":"Projects Delivered","suffix":"+"},{"number":12,"label":"Cities Built In","suffix":""},{"number":23,"label":"Team Members","suffix":""}]'),
('projects', '[{"id":1,"title":"Kebena Residence","description":"A terraced concrete home stepping down a ridge in Bale Robe.","category":"residential","year":"2023","projectCode":"PRJ.014","image":"images/project-kebena.jpeg"}]'),
('services', '[{"id":1,"number":"A—01","title":"Architectural Design","description":"Full concept-to-construction design for residential, commercial and institutional buildings."}]'),
('timeline', '[{"year":"2012","title":"Studio Founded","description":"Biyaf opens as a three-person practice in Bole."}]'),
('contact', '{"address":"Wako Gutu Adebabay, Bale Robe","city":"Bale Robe, Ethiopia","phones":["+251 90 008 5951","+251 94 929 2418"],"email":"studio@biyaf.et","emailNote":"Response within 2 business days","hours":"Mon – Fri","hoursDetail":"8:30 AM – 6:00 PM","social":{"instagram":"#","linkedin":"#","telegram":"#"}}')
ON CONFLICT (section) DO NOTHING;
*/

-- Success message
DO $$
BEGIN
    RAISE NOTICE '✅ Supabase database setup complete!';
    RAISE NOTICE 'Table created: website_content';
    RAISE NOTICE 'RLS enabled with public read/write policies';
    RAISE NOTICE 'Indexes created for performance';
    RAISE NOTICE 'Auto-update timestamp trigger configured';
END $$;
