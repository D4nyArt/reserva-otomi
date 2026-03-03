"use client";

import { useState, useEffect, useCallback } from "react";
import { getSupabaseUsageStats } from "@/lib/supabase";

/* ─── Helpers ─── */

function formatBytes(bytes: number): string {
    if (bytes === 0) return "0 B";
    const units = ["B", "KB", "MB", "GB"];
    const i = Math.floor(Math.log(bytes) / Math.log(1024));
    const value = bytes / Math.pow(1024, i);
    return `${value.toFixed(value < 10 ? 2 : 1)} ${units[i]}`;
}

/* ─── Inline Storage Bar ─── */

export default function StoragePreviewBar({
    pendingBytes = 0,
}: {
    pendingBytes?: number;
}) {
    const [usedBytes, setUsedBytes] = useState(0);
    const [limitBytes, setLimitBytes] = useState(1 * 1024 * 1024 * 1024);
    const [loading, setLoading] = useState(true);

    const fetchUsage = useCallback(async () => {
        setLoading(true);
        const stats = await getSupabaseUsageStats();
        if (stats) {
            setUsedBytes(stats.storage.totalBytes);
            setLimitBytes(stats.storage.limitBytes);
        }
        setLoading(false);
    }, []);

    useEffect(() => {
        fetchUsage();
    }, [fetchUsage]);

    const usedPct = Math.min((usedBytes / limitBytes) * 100, 100);
    const pendingPct = Math.min((pendingBytes / limitBytes) * 100, 100 - usedPct);
    const totalPct = usedPct + pendingPct;

    const barColorUsed =
        totalPct >= 90 ? "bg-red-500" : totalPct >= 70 ? "bg-amber-500" : "bg-forest-500";

    if (loading) {
        return (
            <div className="flex items-center gap-2 rounded-lg border border-white/10 bg-white/[0.03] px-3 py-2">
                <div className="h-2 flex-1 rounded-full bg-white/10 animate-pulse" />
                <span className="text-[10px] text-white/20">cargando...</span>
            </div>
        );
    }

    return (
        <div className="rounded-lg border border-white/10 bg-white/[0.03] px-3 py-2.5">
            <div className="flex items-center justify-between mb-1.5">
                <div className="flex items-center gap-1.5">
                    <svg className="w-3 h-3 text-white/40" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M20.25 6.375c0 2.278-3.694 4.125-8.25 4.125S3.75 8.653 3.75 6.375m16.5 0c0-2.278-3.694-4.125-8.25-4.125S3.75 4.097 3.75 6.375m16.5 0v11.25c0 2.278-3.694 4.125-8.25 4.125s-8.25-1.847-8.25-4.125V6.375" />
                    </svg>
                    <span className="text-[10px] font-medium text-white/40">Almacenamiento</span>
                </div>
                <div className="flex items-center gap-2 text-[10px]">
                    <span className="text-white/50">
                        {formatBytes(usedBytes)}
                    </span>
                    {pendingBytes > 0 && (
                        <span className="text-sky-400">
                            + {formatBytes(pendingBytes)}
                        </span>
                    )}
                    <span className="text-white/25">
                        / {formatBytes(limitBytes)}
                    </span>
                </div>
            </div>
            <div className="h-2 w-full rounded-full bg-white/10 overflow-hidden flex">
                {/* Used segment */}
                <div
                    className={`h-full ${barColorUsed} transition-all duration-500`}
                    style={{ width: `${Math.max(usedPct, 0.3)}%` }}
                />
                {/* Pending segment */}
                {pendingBytes > 0 && (
                    <div
                        className="h-full bg-sky-400 transition-all duration-500 animate-pulse"
                        style={{ width: `${Math.max(pendingPct, 0.3)}%` }}
                    />
                )}
            </div>
            {/* Legend */}
            {pendingBytes > 0 && (
                <div className="flex items-center gap-3 mt-1.5">
                    <div className="flex items-center gap-1">
                        <div className={`w-2 h-2 rounded-full ${barColorUsed}`} />
                        <span className="text-[9px] text-white/30">En uso</span>
                    </div>
                    <div className="flex items-center gap-1">
                        <div className="w-2 h-2 rounded-full bg-sky-400 animate-pulse" />
                        <span className="text-[9px] text-white/30">Imagen seleccionada</span>
                    </div>
                </div>
            )}
        </div>
    );
}
