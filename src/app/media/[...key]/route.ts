import { NextRequest } from "next/server";
import { getObject } from "@/lib/storage";
import { auth } from "@/auth";

// Streaming media dari blob PRIVAT lewat domain kita: santrikalong.com/media/<key>
// Klien tidak pernah melihat URL/domain blob asli.
//
// TODO(auth): cek sesi + enrollment sebelum mengizinkan akses materi berbayar
//   (lihat docs/backend/03-security-schema.md). Saat ini hanya scaffold streaming.

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function GET(
  _req: NextRequest,
  { params }: { params: Promise<{ key: string[] }> }
) {
  const { key } = await params;
  const objectKey = key.map((k) => decodeURIComponent(k)).join("/");

  // Bukti transfer manual = data sensitif → hanya admin/superadmin.
  if (objectKey.startsWith("manual-proof/")) {
    const session = await auth();
    const roles = ((session?.user as { roles?: string[] })?.roles) ?? [];
    if (!roles.includes("admin") && !roles.includes("superadmin")) return new Response("Forbidden", { status: 403 });
  }

  try {
    const obj = await getObject(objectKey);
    if (!obj.Body) return new Response("Not found", { status: 404 });

    // Body adalah web ReadableStream di runtime Node modern.
    const stream = obj.Body.transformToWebStream();

    return new Response(stream, {
      status: 200,
      headers: {
        "Content-Type": obj.ContentType ?? "application/octet-stream",
        ...(obj.ContentLength ? { "Content-Length": String(obj.ContentLength) } : {}),
        "Cache-Control": "private, no-store",
        "Accept-Ranges": "bytes",
      },
    });
  } catch {
    return new Response("Not found", { status: 404 });
  }
}
