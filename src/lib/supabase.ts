import { createClient } from "@supabase/supabase-js";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

/* ─── Type Definitions ─── */

export interface Event {
    id: string;
    title: string;
    description: string;
    date: string;
    category: string;
    image_url: string | null;
    tags: string[];
    created_at: string;
}

export interface Testimonial {
    id: string;
    author: string;
    content: string;
    event_id: string | null;
    created_at: string;
}
