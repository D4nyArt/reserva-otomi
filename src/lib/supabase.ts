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
    registration_link?: string | null; // optional URL where users can register
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
    category: string | null;
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
    category?: string | null;
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

// update an existing highlight card (title/description/category/image_url/display_order)
export async function updateHighlightCard(
    id: string,
    updates: Partial<
        Omit<HighlightCard, "id" | "created_at" | "section">
    >
): Promise<HighlightCard | null> {
    if (!isConfigured) return null;

    const { data, error } = await supabase
        .from("highlight_cards")
        .update(updates)
        .eq("id", id)
        .select()
        .single();

    if (error) {
        console.error("Error updating highlight card:", error);
        return null;
    }

    return data;
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

/* ─── Events CRUD ─── */

export async function getEvents(category?: string): Promise<Event[]> {
    if (!isConfigured) return [];

    let query = supabase
        .from("events")
        .select("*")
        .order("date", { ascending: true });

    if (category) {
        query = query.eq("category", category);
    }

    const { data, error } = await query;

    if (error) {
        console.error("Error fetching events:", error);
        return [];
    }

    return data ?? [];
}

export async function addEvent(event: {
    title: string;
    description: string;
    date: string;
    category: string;
    tags: string[];
    image_url?: string | null;
    registration_link?: string | null; //La agrego para el link de registro
}): Promise<Event | null> {
    if (!isConfigured) return null;

    const { data, error } = await supabase
        .from("events")
        .insert(event)
        .select()
        .single();

    if (error) {
        console.error("Error adding event:", error);
        return null;
    }

    return data;
}

export async function deleteEvent(id: string): Promise<boolean> {
    if (!isConfigured) return false;

    const { error } = await supabase
        .from("events")
        .delete()
        .eq("id", id);

    if (error) {
        console.error("Error deleting event:", error);
        return false;
    }

    return true;
}

// allow updating existing event fields
export async function updateEvent(
    id: string,
    updates: Partial<Omit<Event, "id" | "created_at">>
): Promise<Event | null> {
    if (!isConfigured) return null;

    const { data, error } = await supabase
        .from("events")
        .update(updates)
        .eq("id", id)
        .select()
        .single();

    if (error) {
        console.error("Error updating event:", error);
        return null;
    }

    return data;
}

/* ─── Otomi Learning Tool Types ─── */

export interface OtomiScenario {
    id: string;
    title: string;
    subtitle: string;
    bg_gradient: string;
    bg_image_url: string | null;
    bg_emoji: string;
    display_order: number;
    created_at: string;
}

export interface OtomiElement {
    id: string;
    scenario_id: string;
    otomi_word: string;
    spanish_word: string;
    image_url: string | null;
    emoji: string;
    position_x: number;
    position_y: number;
    display_order: number;
    created_at: string;
}

/* ─── Otomi Scenarios CRUD ─── */

export async function getOtomiScenarios(): Promise<OtomiScenario[]> {
    if (!isConfigured) return [];

    const { data, error } = await supabase
        .from("otomi_scenarios")
        .select("*")
        .order("display_order", { ascending: true });

    if (error) {
        console.error("Error fetching otomi scenarios:", error);
        return [];
    }

    return data ?? [];
}

export async function addOtomiScenario(scenario: {
    title: string;
    subtitle: string;
    bg_gradient: string;
    bg_image_url?: string | null;
    bg_emoji: string;
    display_order?: number;
}): Promise<OtomiScenario | null> {
    if (!isConfigured) return null;

    const { data, error } = await supabase
        .from("otomi_scenarios")
        .insert(scenario)
        .select()
        .single();

    if (error) {
        console.error("Error adding otomi scenario:", error);
        return null;
    }

    return data;
}

export async function updateOtomiScenario(
    id: string,
    updates: Partial<Omit<OtomiScenario, "id" | "created_at">>
): Promise<boolean> {
    if (!isConfigured) return false;

    const { error } = await supabase
        .from("otomi_scenarios")
        .update(updates)
        .eq("id", id);

    if (error) {
        console.error("Error updating otomi scenario:", error);
        return false;
    }

    return true;
}

export async function deleteOtomiScenario(id: string): Promise<boolean> {
    if (!isConfigured) return false;

    const { error } = await supabase
        .from("otomi_scenarios")
        .delete()
        .eq("id", id);

    if (error) {
        console.error("Error deleting otomi scenario:", error);
        return false;
    }

    return true;
}

/* ─── Otomi Elements CRUD ─── */

export async function getOtomiElements(scenarioId: string): Promise<OtomiElement[]> {
    if (!isConfigured) return [];

    const { data, error } = await supabase
        .from("otomi_elements")
        .select("*")
        .eq("scenario_id", scenarioId)
        .order("display_order", { ascending: true });

    if (error) {
        console.error("Error fetching otomi elements:", error);
        return [];
    }

    return data ?? [];
}

export async function addOtomiElement(element: {
    scenario_id: string;
    otomi_word: string;
    spanish_word: string;
    emoji: string;
    image_url?: string | null;
    position_x: number;
    position_y: number;
    display_order?: number;
}): Promise<OtomiElement | null> {
    if (!isConfigured) return null;

    const { data, error } = await supabase
        .from("otomi_elements")
        .insert(element)
        .select()
        .single();

    if (error) {
        console.error("Error adding otomi element:", error);
        return null;
    }

    return data;
}

export async function updateOtomiElement(
    id: string,
    updates: Partial<Omit<OtomiElement, "id" | "scenario_id" | "created_at">>
): Promise<boolean> {
    if (!isConfigured) return false;

    const { error } = await supabase
        .from("otomi_elements")
        .update(updates)
        .eq("id", id);

    if (error) {
        console.error("Error updating otomi element:", error);
        return false;
    }

    return true;
}

export async function deleteOtomiElement(id: string): Promise<boolean> {
    if (!isConfigured) return false;

    const { error } = await supabase
        .from("otomi_elements")
        .delete()
        .eq("id", id);

    if (error) {
        console.error("Error deleting otomi element:", error);
        return false;
    }

    return true;
}

export async function uploadOtomiElementImage(
    file: File
): Promise<string | null> {
    if (!isConfigured) return null;

    const fileExt = file.name.split(".").pop();
    const fileName = `${Date.now()}-${Math.random().toString(36).substring(2, 8)}.${fileExt}`;

    const { error } = await supabase.storage
        .from("otomi-element-images")
        .upload(fileName, file);

    if (error) {
        console.error("Error uploading otomi element image:", error);
        return null;
    }

    const {
        data: { publicUrl },
    } = supabase.storage.from("otomi-element-images").getPublicUrl(fileName);

    return publicUrl;
}

export async function uploadOtomiScenarioBgImage(
    file: File
): Promise<string | null> {
    if (!isConfigured) return null;

    const fileExt = file.name.split(".").pop();
    const fileName = `bg-${Date.now()}-${Math.random().toString(36).substring(2, 8)}.${fileExt}`;

    const { error } = await supabase.storage
        .from("otomi-element-images")
        .upload(fileName, file);

    if (error) {
        console.error("Error uploading scenario background image:", error);
        return null;
    }

    const {
        data: { publicUrl },
    } = supabase.storage.from("otomi-element-images").getPublicUrl(fileName);

    return publicUrl;
}

/* ─── Supabase Usage Stats ─── */

export interface BucketUsage {
    name: string;
    fileCount: number;
    totalBytes: number;
}

export interface TableUsage {
    name: string;
    rowCount: number;
}

export interface SupabaseUsageStats {
    storage: {
        buckets: BucketUsage[];
        totalBytes: number;
        limitBytes: number; // 1 GB free tier
    };
    database: {
        tables: TableUsage[];
        totalRows: number;
        limitBytes: number; // 500 MB free tier
    };
}

async function getBucketUsage(bucketName: string): Promise<BucketUsage> {
    try {
        const { data, error } = await supabase.storage
            .from(bucketName)
            .list("", { limit: 1000 });

        if (error || !data) return { name: bucketName, fileCount: 0, totalBytes: 0 };

        const files = data.filter((item) => item.id);
        const totalBytes = files.reduce(
            (sum, file) => sum + (file.metadata?.size ?? 0),
            0
        );

        return { name: bucketName, fileCount: files.length, totalBytes };
    } catch {
        return { name: bucketName, fileCount: 0, totalBytes: 0 };
    }
}

async function getTableRowCount(tableName: string): Promise<TableUsage> {
    try {
        const { count, error } = await supabase
            .from(tableName)
            .select("*", { count: "exact", head: true });

        if (error) return { name: tableName, rowCount: 0 };

        return { name: tableName, rowCount: count ?? 0 };
    } catch {
        return { name: tableName, rowCount: 0 };
    }
}

export async function getSupabaseUsageStats(): Promise<SupabaseUsageStats | null> {
    if (!isConfigured) return null;

    const STORAGE_BUCKETS = ["highlight-images", "otomi-element-images"];
    const DB_TABLES = ["events", "highlight_cards", "otomi_scenarios", "otomi_elements"];

    const [buckets, tables] = await Promise.all([
        Promise.all(STORAGE_BUCKETS.map(getBucketUsage)),
        Promise.all(DB_TABLES.map(getTableRowCount)),
    ]);

    return {
        storage: {
            buckets,
            totalBytes: buckets.reduce((sum, b) => sum + b.totalBytes, 0),
            limitBytes: 1 * 1024 * 1024 * 1024, // 1 GB
        },
        database: {
            tables,
            totalRows: tables.reduce((sum, t) => sum + t.rowCount, 0),
            limitBytes: 500 * 1024 * 1024, // 500 MB
        },
    };
}
