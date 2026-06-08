import { auth } from "@/auth";
import { prisma } from "@/lib/db";
import { signDoc, shortCode } from "@/lib/docsign";
import { certPayload } from "@/lib/docpayload";
import { buildCertificatePdf } from "@/lib/pdf";

export const runtime = "nodejs";

const appUrl = () => (process.env.NEXT_PUBLIC_APP_URL ?? "http://localhost:3000").replace(/\/$/, "");

export async function GET(_req: Request, { params }: { params: Promise<{ enrollmentId: string }> }) {
  const { enrollmentId } = await params;
  const session = await auth();
  if (!session?.user) return new Response("Unauthorized", { status: 401 });
  const uid = (session.user as { id: string }).id;
  const roles = ((session.user as { roles?: string[] }).roles) ?? [];
  const isAdmin = roles.includes("admin") || roles.includes("superadmin");

  const en = await prisma.enrollment.findUnique({
    where: { id: enrollmentId },
    include: { user: true, progress: true, course: { include: { ustadz: { include: { user: true } }, modules: { include: { lessons: true } } } } },
  });
  if (!en) return new Response("Tidak ditemukan", { status: 404 });
  if (en.userId !== uid && !isAdmin) return new Response("Forbidden", { status: 403 });

  const lessons = en.course.modules.flatMap((m) => m.lessons);
  const total = lessons.length;
  const done = en.progress.filter((p) => p.status === "COMPLETED").length;
  if (total === 0 || done < total) return new Response("Kelas belum selesai", { status: 409 });

  const sig = signDoc(certPayload(en, en.user, en.course));
  const hours = Math.round(lessons.reduce((n, l) => n + (l.durationSec ?? 0), 0) / 3600);
  const detail = hours > 0 ? `${hours} jam pembelajaran - ${total} materi` : `${total} materi`;

  const bytes = await buildCertificatePdf({
    recipient: en.user.name,
    courseTitle: en.course.title,
    ustadzName: en.course.ustadz?.user?.name ?? "Pengajar SantriKalong",
    detail,
    certNo: "SK-2026-" + en.id.slice(-5).toUpperCase(),
    code: shortCode(sig),
    verifyUrl: `${appUrl()}/verifikasi?d=sertifikat&id=${en.id}&sig=${sig}`,
  });

  return new Response(Buffer.from(bytes), {
    headers: {
      "Content-Type": "application/pdf",
      "Content-Disposition": `inline; filename="sertifikat-${en.id.slice(-6)}.pdf"`,
      "Cache-Control": "private, no-store",
    },
  });
}
