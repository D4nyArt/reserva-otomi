import { createClient, type SupabaseClient } from "@supabase/supabase-js";

/* ─── Client Initialization ─── */

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL ?? "";
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ?? "";

const isConfigured =
    supabaseUrl.startsWith("https://") && supabaseAnonKey.length > 20;

// Create a real client only when properly configured
export const supabase: SupabaseClient = isConfigured
    ? createClient(supabaseUrl, supabaseAnonKey)
    : (null as unknown as SupabaseClient);

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

export interface HighlightCard {
    id: string;
    section: "raices" | "preservacion";
    title: string;
    description: string;
    image_url: string;
    display_order: number;
    created_at: string;
}

/* ─── Highlight Cards CRUD ─── */

export async function getHighlightCards(
    section: "raices" | "preservacion"
): Promise<HighlightCard[]> {
    if (!isConfigured) return [];

    const { data, error } = await supabase
        .from("highlight_cards")
        .select("*")
        .eq("section", section)
        .order("display_order", { ascending: true });

    if (error) {
        console.error("Error fetching highlight cards:", error);
        return [];
    }

    return data ?? [];
}

export async function addHighlightCard(card: {
    section: "raices" | "preservacion";
    title: string;
    description: string;
    image_url: string;
    display_order?: number;
}): Promise<HighlightCard | null> {
    if (!isConfigured) return null;

    const { data, error } = await supabase
        .from("highlight_cards")
        .insert(card)
        .select()
        .single();

    if (error) {
        console.error("Error adding highlight card:", error);
        return null;
    }

    return data;
}

export async function deleteHighlightCard(id: string): Promise<boolean> {
    if (!isConfigured) return false;

    const { error } = await supabase
        .from("highlight_cards")
        .delete()
        .eq("id", id);

    if (error) {
        console.error("Error deleting highlight card:", error);
        return false;
    }

    return true;
}

export async function uploadHighlightImage(
    file: File
): Promise<string | null> {
    if (!isConfigured) return null;

    const fileExt = file.name.split(".").pop();
    const fileName = `${Date.now()}-${Math.random().toString(36).substring(2, 8)}.${fileExt}`;

    const { error } = await supabase.storage
        .from("highlight-images")
        .upload(fileName, file);

    if (error) {
        console.error("Error uploading image:", error);
        return null;
    }

    const {
        data: { publicUrl },
    } = supabase.storage.from("highlight-images").getPublicUrl(fileName);

    return publicUrl;
}
