import { NextRequest, NextResponse } from "next/server";
import fs from "fs/promises";
import path from "path";

export const runtime = "nodejs"; // importante porque usas fs

type Entry = { es: string; ot: string[] };

const DICT_PATH = path.join(process.cwd(), "data", "es-oto.txt");

function requireAdmin(req: NextRequest) {
  const adminPassword = process.env.ADMIN_PASSWORD;

  if (!adminPassword) {
    return {
      ok: false as const,
      res: NextResponse.json(
        { error: "ADMIN_PASSWORD no configurado" },
        { status: 500 }
      ),
    };
  }

  const sent = req.headers.get("x-admin-password");
  if (sent !== adminPassword) {
    return {
      ok: false as const,
      res: NextResponse.json({ error: "No autorizado" }, { status: 401 }),
    };
  }

  return { ok: true as const };
}

function parseDictionary(raw: string): Entry[] {
  const lines = raw.split(/\r?\n/);
  const out: Entry[] = [];

  for (const line of lines) {
    const t = line.trim();
    if (!t) continue;

    const idx = t.indexOf(":");
    if (idx === -1) continue;

    const es = t.slice(0, idx).trim();
    const right = t.slice(idx + 1).trim();
    if (!es || !right) continue;

    const ot = right
      .split(",")
      .map((x) => x.trim())
      .filter(Boolean);

    if (!ot.length) continue;

    out.push({ es, ot });
  }

  return out;
}

function serializeDictionary(entries: Entry[]): string {
  return (
    entries
      .map(
        (e) =>
          `${e.es.trim()} : ${e.ot.map((x) => x.trim()).filter(Boolean).join(", ")}`
      )
      .join("\n") + "\n"
  );
}

async function readEntries() {
  const raw = await fs.readFile(DICT_PATH, "utf-8");
  return parseDictionary(raw);
}

async function writeEntries(entries: Entry[]) {
  await fs.mkdir(path.dirname(DICT_PATH), { recursive: true });
  await fs.writeFile(DICT_PATH, serializeDictionary(entries), "utf-8");
}

/* ✅ GET /api/admin/dictionary */
export async function GET(req: NextRequest) {
  const auth = requireAdmin(req);
  if (!auth.ok) return auth.res;

  try {
    const entries = await readEntries();
    return NextResponse.json({ entries });
  } catch (e: any) {
    return NextResponse.json(
      { error: e?.message ?? "Error leyendo diccionario" },
      { status: 500 }
    );
  }
}

/* ✅ POST /api/admin/dictionary  body: { es, ot: string[] } */
export async function POST(req: NextRequest) {
  const auth = requireAdmin(req);
  if (!auth.ok) return auth.res;

  try {
    const body = (await req.json()) as Entry;
    const es = body?.es?.trim();
    const ot = Array.isArray(body?.ot)
      ? body.ot.map((x) => String(x).trim()).filter(Boolean)
      : [];

    if (!es || ot.length === 0) {
      return NextResponse.json({ error: "Formato inválido" }, { status: 400 });
    }

    const entries = await readEntries();
    entries.push({ es, ot });
    await writeEntries(entries);

    return NextResponse.json({ success: true });
  } catch (e: any) {
    return NextResponse.json(
      { error: e?.message ?? "Error agregando" },
      { status: 500 }
    );
  }
}

/* ✅ PUT /api/admin/dictionary  body: { index, es, ot: string[] } */
export async function PUT(req: NextRequest) {
  const auth = requireAdmin(req);
  if (!auth.ok) return auth.res;

  try {
    const body = await req.json();
    const index = Number(body?.index);
    const es = String(body?.es ?? "").trim();
    const ot = Array.isArray(body?.ot)
      ? body.ot.map((x: any) => String(x).trim()).filter(Boolean)
      : [];

    if (!Number.isFinite(index) || !es || ot.length === 0) {
      return NextResponse.json({ error: "Formato inválido" }, { status: 400 });
    }

    const entries = await readEntries();
    if (!entries[index]) {
      return NextResponse.json({ error: "Índice fuera de rango" }, { status: 404 });
    }

    entries[index] = { es, ot };
    await writeEntries(entries);

    return NextResponse.json({ success: true });
  } catch (e: any) {
    return NextResponse.json(
      { error: e?.message ?? "Error actualizando" },
      { status: 500 }
    );
  }
}

/* ✅ DELETE /api/admin/dictionary  body: { index } */
export async function DELETE(req: NextRequest) {
  const auth = requireAdmin(req);
  if (!auth.ok) return auth.res;

  try {
    const body = await req.json();
    const index = Number(body?.index);

    if (!Number.isFinite(index)) {
      return NextResponse.json({ error: "Formato inválido" }, { status: 400 });
    }

    const entries = await readEntries();
    if (!entries[index]) {
      return NextResponse.json({ error: "Índice fuera de rango" }, { status: 404 });
    }

    entries.splice(index, 1);
    await writeEntries(entries);

    return NextResponse.json({ success: true });
  } catch (e: any) {
    return NextResponse.json(
      { error: e?.message ?? "Error eliminando" },
      { status: 500 }
    );
  }
}