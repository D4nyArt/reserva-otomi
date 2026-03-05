import { NextResponse } from "next/server";
import fs from "fs/promises";
import path from "path";

const DICT_PATH = path.join(process.cwd(), "data", "es-oto.txt");

export async function GET() {
  try {
    const raw = await fs.readFile(DICT_PATH, "utf-8");

    return new NextResponse(raw, {
      status: 200,
      headers: {
        "Content-Type": "text/plain; charset=utf-8",
        // opcional: cache en dev no importa, en prod puedes ajustar
        "Cache-Control": "no-store",
      },
    });
  } catch (e: any) {
    // Si no existe el archivo, devuelve 404 claro
    if (e?.code === "ENOENT") {
      return NextResponse.json(
        { error: "No se encontró data/es-oto.txt" },
        { status: 404 }
      );
    }

    return NextResponse.json(
      { error: e?.message ?? "Error leyendo diccionario" },
      { status: 500 }
    );
  }
}