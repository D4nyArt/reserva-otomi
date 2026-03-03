"use client";

import { useState, useEffect, useCallback } from "react";
import {
    getSupabaseUsageStats,
    type SupabaseUsageStats,
} from "@/lib/supabase";

/* ─── Helpers ─── */

function formatBytes(bytes: number): string {
    if (bytes === 0) return "0 B";
    const units = ["B", "KB", "MB", "GB"];
    const i = Math.floor(Math.log(bytes) / Math.log(1024));
    const value = bytes / Math.pow(1024, i);
    return `${value.toFixed(value < 10 ? 2 : 1)} ${units[i]}`;
}

function pct(used: number, limit: number): number {
    if (limit === 0) return 0;
    return Math.min((used / limit) * 100, 100);
}

function barColor(percent: number): string {
    if (percent >= 90) return "bg-red-500";
    if (percent >= 70) return "bg-amber-500";
    return "bg-forest-500";
}

const TABLE_LABELS: Record<string, string> = {
    events: "Eventos",
    highlight_cards: "Tarjetas Destacadas",
    otomi_scenarios: "Escenarios Otomí",
    otomi_elements: "Elementos Otomí",
};

const BUCKET_LABELS: Record<string, string> = {
    "highlight-images": "Imágenes Tarjetas",
    "otomi-element-images": "Imágenes Otomí",
};

/* ─── Progress Bar ─── */

function UsageBar({
    label,
    used,
    limit,
    detail,
}: {
    label: string;
    used: number;
    limit: number;
    detail: string;
}) {
    const percent = pct(used, limit);
    return (
        <div>
            <div className="flex items-center justify-between mb-1">
                <span className="text-xs font-medium text-white/70">{label}</span>
                <span className="text-xs text-white/40">{detail}</span>
            </div>
            <div className="h-2.5 w-full rounded-full bg-white/10 overflow-hidden">
                <div
                    className={`h-full rounded-full transition-all duration-700 ease-out ${barColor(percent)}`}
                    style={{ width: `${Math.max(percent, 0.5)}%` }}
                />
            </div>
            <p className="mt-0.5 text-right text-[10px] text-white/30">
                {percent.toFixed(1)}%
            </p>
        </div>
    );
}

/* ─── Main Component ─── */

export default function UsagePanel() {
    const [stats, setStats] = useState<SupabaseUsageStats | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(false);

    const fetchStats = useCallback(async () => {
        setLoading(true);
        setError(false);
        try {
            const data = await getSupabaseUsageStats();
            setStats(data);
        } catch {
            setError(true);
        } finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => {
        fetchStats();
    }, [fetchStats]);

    if (loading) {
        return (
            <div className="rounded-2xl border border-white/10 bg-white/5 p-6">
                <div className="flex items-center gap-3 mb-4">
                    <div className="w-5 h-5 rounded-full bg-white/10 animate-pulse" />
                    <div className="h-4 w-40 bg-white/10 rounded animate-pulse" />
                </div>
                <div className="space-y-4">
                    {Array.from({ length: 2 }).map((_, i) => (
                        <div key={i} className="space-y-2">
                            <div className="h-3 w-24 bg-white/10 rounded animate-pulse" />
                            <div className="h-2.5 w-full bg-white/10 rounded-full animate-pulse" />
                        </div>
                    ))}
                </div>
            </div>
        );
    }

    if (error || !stats) {
        return (
            <div className="rounded-2xl border border-white/10 bg-white/5 p-6 text-center">
                <p className="text-sm text-white/40">
                    No se pudo obtener el uso de Supabase.
                </p>
                <button
                    onClick={fetchStats}
                    className="mt-2 text-xs text-forest-400 hover:text-forest-300 transition-colors"
                >
                    Reintentar
                </button>
            </div>
        );
    }

    const storagePct = pct(stats.storage.totalBytes, stats.storage.limitBytes);
    const dbPercent = pct(stats.storage.totalBytes, stats.database.limitBytes); // rough estimate

    return (
        <div className="rounded-2xl border border-white/10 bg-white/5 p-6">
            {/* Header */}
            <div className="flex items-center justify-between mb-5">
                <div className="flex items-center gap-2.5">
                    <div className="w-8 h-8 rounded-lg bg-forest-500/20 flex items-center justify-center">
                        <svg className="w-4 h-4 text-forest-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                            <path strokeLinecap="round" strokeLinejoin="round" d="M20.25 6.375c0 2.278-3.694 4.125-8.25 4.125S3.75 8.653 3.75 6.375m16.5 0c0-2.278-3.694-4.125-8.25-4.125S3.75 4.097 3.75 6.375m16.5 0v11.25c0 2.278-3.694 4.125-8.25 4.125s-8.25-1.847-8.25-4.125V6.375m16.5 0v3.75m-16.5-3.75v3.75m16.5 0v3.75C20.25 16.153 16.556 18 12 18s-8.25-1.847-8.25-4.125v-3.75m16.5 0c0 2.278-3.694 4.125-8.25 4.125s-8.25-1.847-8.25-4.125" />
                        </svg>
                    </div>
                    <h3 className="font-heading text-sm font-bold text-white">
                        Uso de Supabase
                    </h3>
                </div>
                <button
                    onClick={fetchStats}
                    className="p-1.5 rounded-lg bg-white/5 hover:bg-white/10 text-white/40 hover:text-white/60 transition-all"
                    title="Actualizar"
                >
                    <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M16.023 9.348h4.992v-.001M2.985 19.644v-4.992m0 0h4.992m-4.993 0l3.181 3.183a8.25 8.25 0 0013.803-3.7M4.031 9.865a8.25 8.25 0 0113.803-3.7l3.181 3.182" />
                    </svg>
                </button>
            </div>

            {/* Storage Section */}
            <div className="mb-6">
                <div className="flex items-center gap-2 mb-3">
                    <svg className="w-3.5 h-3.5 text-amber-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 15.75l5.159-5.159a2.25 2.25 0 013.182 0l5.159 5.159m-1.5-1.5l1.409-1.41a2.25 2.25 0 013.182 0l2.909 2.91M8.25 21h8a2.25 2.25 0 002.25-2.25V5.25A2.25 2.25 0 0016.5 3h-8a2.25 2.25 0 00-2.25 2.25v13.5A2.25 2.25 0 008.25 21z" />
                    </svg>
                    <h4 className="text-xs font-semibold text-white/60 uppercase tracking-wider">
                        Almacenamiento
                    </h4>
                    <span className="ml-auto text-xs text-white/30">
                        Límite: 1 GB
                    </span>
                </div>

                <UsageBar
                    label="Total"
                    used={stats.storage.totalBytes}
                    limit={stats.storage.limitBytes}
                    detail={`${formatBytes(stats.storage.totalBytes)} / ${formatBytes(stats.storage.limitBytes)}`}
                />

                {/* Per-bucket breakdown */}
                <div className="mt-3 space-y-2 pl-3 border-l-2 border-white/10">
                    {stats.storage.buckets.map((bucket) => (
                        <div key={bucket.name} className="flex items-center justify-between">
                            <span className="text-xs text-white/50">
                                {BUCKET_LABELS[bucket.name] ?? bucket.name}
                            </span>
                            <span className="text-xs text-white/40">
                                {bucket.fileCount} {bucket.fileCount === 1 ? "archivo" : "archivos"} · {formatBytes(bucket.totalBytes)}
                            </span>
                        </div>
                    ))}
                </div>
            </div>

            {/* Database Section */}
            <div>
                <div className="flex items-center gap-2 mb-3">
                    <svg className="w-3.5 h-3.5 text-water-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M3.375 19.5h17.25m-17.25 0a1.125 1.125 0 01-1.125-1.125M3.375 19.5h7.5c.621 0 1.125-.504 1.125-1.125m-9.75 0V5.625m0 12.75v-1.5c0-.621.504-1.125 1.125-1.125m18.375 2.625V5.625m0 12.75c0 .621-.504 1.125-1.125 1.125m1.125-1.125v-1.5c0-.621-.504-1.125-1.125-1.125m0 3.75h-7.5A1.125 1.125 0 0112 18.375m9.75-12.75c0-.621-.504-1.125-1.125-1.125H3.375c-.621 0-1.125.504-1.125 1.125m19.5 0v1.5c0 .621-.504 1.125-1.125 1.125M2.25 5.625v1.5c0 .621.504 1.125 1.125 1.125m0 0h17.25m-17.25 0h7.5c.621 0 1.125.504 1.125 1.125M3.375 8.25c-.621 0-1.125.504-1.125 1.125v1.5c0 .621.504 1.125 1.125 1.125m17.25-3.75h-7.5c-.621 0-1.125.504-1.125 1.125m8.625-1.125c.621 0 1.125.504 1.125 1.125v1.5c0 .621-.504 1.125-1.125 1.125m-17.25 0h7.5m-7.5 0c-.621 0-1.125.504-1.125 1.125v1.5c0 .621.504 1.125 1.125 1.125M12 10.875v-1.5m0 1.5c0 .621-.504 1.125-1.125 1.125M12 10.875c0 .621.504 1.125 1.125 1.125m-2.25 0c.621 0 1.125.504 1.125 1.125M13.125 12h7.5m-7.5 0c-.621 0-1.125.504-1.125 1.125M20.625 12c.621 0 1.125.504 1.125 1.125v1.5c0 .621-.504 1.125-1.125 1.125m-17.25 0h7.5M12 14.625v-1.5m0 1.5c0 .621-.504 1.125-1.125 1.125M12 14.625c0 .621.504 1.125 1.125 1.125m-2.25 0c.621 0 1.125.504 1.125 1.125m0 0v1.5c0 .621-.504 1.125-1.125 1.125" />
                    </svg>
                    <h4 className="text-xs font-semibold text-white/60 uppercase tracking-wider">
                        Base de Datos
                    </h4>
                    <span className="ml-auto text-xs text-white/30">
                        Límite: 500 MB
                    </span>
                </div>

                {/* Row counts summary */}
                <div className="rounded-xl border border-white/10 bg-white/[0.03] overflow-hidden">
                    {stats.database.tables.map((table, i) => (
                        <div
                            key={table.name}
                            className={`flex items-center justify-between px-3 py-2.5 ${i < stats.database.tables.length - 1 ? "border-b border-white/5" : ""}`}
                        >
                            <span className="text-xs text-white/60">
                                {TABLE_LABELS[table.name] ?? table.name}
                            </span>
                            <div className="flex items-center gap-2">
                                <span className="text-xs font-semibold text-white/80">
                                    {table.rowCount.toLocaleString()}
                                </span>
                                <span className="text-[10px] text-white/30">registros</span>
                            </div>
                        </div>
                    ))}
                    {/* Total row */}
                    <div className="flex items-center justify-between px-3 py-2.5 bg-white/5 border-t border-white/10">
                        <span className="text-xs font-semibold text-white/70">Total</span>
                        <div className="flex items-center gap-2">
                            <span className="text-xs font-bold text-amber-400">
                                {stats.database.totalRows.toLocaleString()}
                            </span>
                            <span className="text-[10px] text-white/30">registros</span>
                        </div>
                    </div>
                </div>
            </div>

            {/* Footer note */}
            <p className="mt-4 text-[10px] text-white/20 text-center">
                Datos estimados · Plan gratuito de Supabase
            </p>
        </div>
    );
}
