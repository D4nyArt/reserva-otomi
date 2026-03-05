"use client";

import { useEffect, useMemo, useState } from "react";

type Entry = { es: string; ot: string[] };

function getAdminPw() {
  if (typeof window === "undefined") return "";
  return sessionStorage.getItem("admin_pw") ?? "";
}

export default function DictionaryManagerPanel() {
  const [entries, setEntries] = useState<Entry[]>([]);
  const [loading, setLoading] = useState(false);
  const [msg, setMsg] = useState<string | null>(null);

  const [q, setQ] = useState("");

  const [newEs, setNewEs] = useState("");
  const [newOt, setNewOt] = useState("");

  const [editIndex, setEditIndex] = useState<number | null>(null);
  const [editEs, setEditEs] = useState("");
  const [editOt, setEditOt] = useState("");

  const filtered = useMemo(() => {
    const t = q.trim().toLowerCase();
    if (!t) return entries.map((e, i) => ({ e, i }));
    return entries
      .map((e, i) => ({ e, i }))
      .filter(({ e }) => e.es.toLowerCase().includes(t) || e.ot.join(", ").toLowerCase().includes(t));
  }, [entries, q]);

  async function api(path: string, init?: RequestInit) {
    const pw = getAdminPw();
    const headers = {
      "Content-Type": "application/json",
      "x-admin-password": pw,
      ...(init?.headers ?? {}),
    };
    const res = await fetch(path, { ...init, headers });
    const data = await res.json().catch(() => ({}));
    if (!res.ok) throw new Error(data?.error ?? "Error");
    return data;
  }

  async function load() {
    setLoading(true);
    setMsg(null);
    try {
      const data = await api("/api/admin/dictionary");
      setEntries(data.entries ?? []);
    } catch (e: any) {
      setMsg(e?.message ?? "Error");
    } finally {
      setLoading(false);
    }
  }

  async function addEntry() {
    const es = newEs.trim();
    const ot = newOt.split(",").map((x) => x.trim()).filter(Boolean);
    if (!es || ot.length === 0) return setMsg("Completa Español y al menos una variante en Otomí.");

    setLoading(true);
    setMsg(null);
    try {
      await api("/api/admin/dictionary", { method: "POST", body: JSON.stringify({ es, ot }) });
      setNewEs("");
      setNewOt("");
      await load();
      setMsg("✅ Agregado.");
    } catch (e: any) {
      setMsg(e?.message ?? "Error");
    } finally {
      setLoading(false);
    }
  }

  function startEdit(i: number) {
    setEditIndex(i);
    setEditEs(entries[i].es);
    setEditOt(entries[i].ot.join(", "));
    setMsg(null);
  }

  async function saveEdit() {
    if (editIndex === null) return;
    const es = editEs.trim();
    const ot = editOt.split(",").map((x) => x.trim()).filter(Boolean);
    if (!es || ot.length === 0) return setMsg("Completa Español y al menos una variante en Otomí.");

    setLoading(true);
    setMsg(null);
    try {
      await api("/api/admin/dictionary", {
        method: "PUT",
        body: JSON.stringify({ index: editIndex, es, ot }),
      });
      setEditIndex(null);
      await load();
      setMsg("✅ Guardado.");
    } catch (e: any) {
      setMsg(e?.message ?? "Error");
    } finally {
      setLoading(false);
    }
  }

  async function remove(i: number) {
    if (!confirm("¿Eliminar esta entrada?")) return;
    setLoading(true);
    setMsg(null);
    try {
      await api("/api/admin/dictionary", { method: "DELETE", body: JSON.stringify({ index: i }) });
      await load();
      setMsg("🗑️ Eliminado.");
    } catch (e: any) {
      setMsg(e?.message ?? "Error");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    load();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <div>
      <div className="mb-6 flex items-center justify-between">
        <div>
          <h2 className="font-heading text-lg font-bold text-white">Diccionario Español ↔ Otomí</h2>
          <p className="mt-1 text-xs text-white/40">Editar, agregar o eliminar entradas del archivo.</p>
        </div>
        <button
          onClick={load}
          className="rounded-xl border border-white/15 bg-white/5 px-4 py-2 text-sm font-semibold text-white/70 hover:border-white/30 hover:text-white"
        >
          {loading ? "..." : "Recargar"}
        </button>
      </div>

      {msg && (
        <div className="mb-6 rounded-xl border border-white/10 bg-white/5 px-4 py-3 text-sm text-white/70">
          {msg}
        </div>
      )}

      <div className="grid gap-6 lg:grid-cols-2">
        {/* Add */}
        <div className="rounded-2xl border border-white/10 bg-white/5 p-6">
          <h3 className="font-heading mb-4 text-lg font-bold text-white">Agregar palabra</h3>

          <label className="mb-1 block text-sm text-white/60">Español</label>
          <input
            value={newEs}
            onChange={(e) => setNewEs(e.target.value)}
            className="mb-4 w-full rounded-lg border border-white/15 bg-white/5 px-4 py-2.5 text-sm text-white placeholder-white/30 outline-none focus:border-forest-400"
            placeholder="agua"
          />

          <label className="mb-1 block text-sm text-white/60">Otomí (separado por coma)</label>
          <input
            value={newOt}
            onChange={(e) => setNewOt(e.target.value)}
            className="mb-4 w-full rounded-lg border border-white/15 bg-white/5 px-4 py-2.5 text-sm text-white placeholder-white/30 outline-none focus:border-forest-400"
            placeholder="dehe, ..."
          />

          <button
            onClick={addEntry}
            disabled={loading}
            className="w-full rounded-xl bg-forest-500 py-3 text-sm font-semibold text-white transition-all hover:bg-forest-400 disabled:opacity-50"
          >
            Agregar
          </button>
        </div>

        {/* Search + list */}
        <div className="rounded-2xl border border-white/10 bg-white/5 p-6">
          <div className="mb-3 flex items-center justify-between">
            <h3 className="font-heading text-lg font-bold text-white">Entradas</h3>
            <span className="rounded-full bg-white/10 px-3 py-1 text-xs text-white/50">
              {filtered.length} / {entries.length}
            </span>
          </div>

          <input
            value={q}
            onChange={(e) => setQ(e.target.value)}
            className="mb-4 w-full rounded-lg border border-white/15 bg-white/5 px-4 py-2.5 text-sm text-white placeholder-white/30 outline-none focus:border-forest-400"
            placeholder="Buscar..."
          />

          <div className="max-h-[420px] overflow-auto space-y-2 pr-1">
            {filtered.map(({ e, i }) => (
              <div key={`${e.es}-${i}`} className="rounded-xl border border-white/10 bg-white/5 p-3">
                <div className="text-sm font-semibold text-white">{e.es}</div>
                <div className="mt-1 text-xs text-white/40">{e.ot.join(", ")}</div>
                <div className="mt-3 flex gap-2">
                  <button
                    onClick={() => startEdit(i)}
                    className="rounded-lg border border-white/15 bg-white/5 px-3 py-1 text-xs font-semibold text-white/70 hover:border-white/30 hover:text-white"
                  >
                    Editar
                  </button>
                  <button
                    onClick={() => remove(i)}
                    className="rounded-lg border border-red-500/20 bg-red-500/10 px-3 py-1 text-xs font-semibold text-red-300 hover:border-red-500/40 hover:bg-red-500/20"
                  >
                    Borrar
                  </button>
                </div>
              </div>
            ))}

            {filtered.length === 0 && (
              <div className="rounded-xl border border-dashed border-white/15 p-6 text-center text-sm text-white/40">
                No hay coincidencias.
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Edit modal-ish */}
      {editIndex !== null && (
        <div className="mt-6 rounded-2xl border border-white/10 bg-white/5 p-6">
          <div className="mb-4 flex items-center justify-between">
            <h3 className="font-heading text-lg font-bold text-white">Editar entrada #{editIndex}</h3>
            <button onClick={() => setEditIndex(null)} className="text-sm text-white/50 hover:text-white">
              Cerrar
            </button>
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            <div>
              <label className="mb-1 block text-sm text-white/60">Español</label>
              <input
                value={editEs}
                onChange={(e) => setEditEs(e.target.value)}
                className="w-full rounded-lg border border-white/15 bg-white/5 px-4 py-2.5 text-sm text-white outline-none focus:border-forest-400"
              />
            </div>
            <div>
              <label className="mb-1 block text-sm text-white/60">Otomí (coma)</label>
              <input
                value={editOt}
                onChange={(e) => setEditOt(e.target.value)}
                className="w-full rounded-lg border border-white/15 bg-white/5 px-4 py-2.5 text-sm text-white outline-none focus:border-forest-400"
              />
            </div>
          </div>

          <div className="mt-5 flex gap-2">
            <button
              onClick={saveEdit}
              disabled={loading}
              className="rounded-xl bg-forest-500 px-5 py-2.5 text-sm font-semibold text-white hover:bg-forest-400 disabled:opacity-50"
            >
              Guardar
            </button>
            <button
              onClick={() => setEditIndex(null)}
              className="rounded-xl border border-white/15 bg-white/5 px-5 py-2.5 text-sm font-semibold text-white/70 hover:border-white/30 hover:text-white"
            >
              Cancelar
            </button>
          </div>
        </div>
      )}
    </div>
  );
}