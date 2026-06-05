// Seed data awal SantriKalong ke Neon. Idempotent (upsert).
// Jalankan: (muat .env.local ke env) lalu `node prisma/seed.mjs`.
import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";

let url = process.env.DATABASE_URL;
if (url && !/[?&]pgbouncer=/.test(url)) url += (url.includes("?") ? "&" : "?") + "pgbouncer=true";
const prisma = new PrismaClient({ datasourceUrl: url });

const DEMO_PASSWORD = "santrikalong";

async function main() {
  const passwordHash = await bcrypt.hash(DEMO_PASSWORD, 10);

  // ---- Roles ----
  const roles = {};
  for (const name of ["superadmin", "admin", "ustadz", "santri"]) {
    roles[name] = await prisma.role.upsert({ where: { name }, update: {}, create: { name, isSystem: true } });
  }
  async function assign(userId, roleName) {
    const roleId = roles[roleName].id;
    await prisma.userRole.upsert({ where: { userId_roleId: { userId, roleId } }, update: {}, create: { userId, roleId } });
  }

  // ---- Kategori ----
  const cat = {};
  for (const [slug, name] of [["bahasa-arab", "Bahasa Arab"], ["tahsin", "Tahsin & Tahfizh"], ["fiqih", "Fiqih & Aqidah"], ["dauroh", "Dauroh"]]) {
    cat[slug] = await prisma.category.upsert({ where: { slug }, update: { name }, create: { slug, name } });
  }

  // ---- Ustadz (user + profile APPROVED + password + role) ----
  async function ustadz(email, name, specialization, bio) {
    const u = await prisma.user.upsert({ where: { email }, update: { name, passwordHash }, create: { email, name, passwordHash } });
    const p = await prisma.ustadzProfile.upsert({
      where: { userId: u.id },
      update: { status: "APPROVED", specialization, bio },
      create: { userId: u.id, status: "APPROVED", specialization, bio, revenueSharePct: 70 },
    });
    await assign(u.id, "ustadz");
    return p;
  }
  const abdullah = await ustadz("abdullah@santrikalong.com", "Ust. Abdullah, Lc.", "Bahasa Arab", "Lulusan LIPIA, 8 tahun mengajar nahwu & shorof.");
  const fatimah = await ustadz("fatimah@santrikalong.com", "Ustadzah Fatimah", "Tahsin", "Pengajar tahsin metode Tilawati.");
  const yusuf = await ustadz("yusuf@santrikalong.com", "Ust. Yusuf", "Fiqih", "Fokus fiqih ibadah sehari-hari.");

  // ---- Admin superuser ----
  const admin = await prisma.user.upsert({ where: { email: "admin@santrikalong.com" }, update: { name: "Superadmin", passwordHash }, create: { email: "admin@santrikalong.com", name: "Superadmin", passwordHash } });
  await assign(admin.id, "superadmin");

  // ---- Kelas ----
  async function course(d) { return prisma.course.upsert({ where: { slug: d.slug }, update: d, create: d }); }
  const c1 = await course({ slug: "bahasa-arab-pemula", title: "Bahasa Arab untuk Pemula: Dasar Nahwu", description: "Fondasi bahasa Arab dari nol: huruf, nahwu dasar, hingga menyusun kalimat.", thumbnailKey: "photo-1609599006353-e629aaabfeae", categoryId: cat["bahasa-arab"].id, ustadzId: abdullah.id, type: "ON_DEMAND", level: "PEMULA", priceIdr: 149000, isFree: false, status: "PUBLISHED" });
  await course({ slug: "tahsin-tilawati", title: "Tahsin Al-Qur'an Metode Tilawati", description: "Perbaiki bacaan Al-Qur'an secara bertahap, dibimbing live tiap Sabtu.", thumbnailKey: "photo-1616422840391-fa670d4b2ae7", categoryId: cat["tahsin"].id, ustadzId: fatimah.id, type: "LIVE", level: "PEMULA", priceIdr: 250000, isFree: false, status: "PUBLISHED" });
  await course({ slug: "fiqih-thaharah", title: "Fiqih Thaharah untuk Sehari-hari", description: "Memahami bersuci sesuai tuntunan untuk ibadah harian.", thumbnailKey: "photo-1542816417-0983c9c9ad53", categoryId: cat["fiqih"].id, ustadzId: yusuf.id, type: "ON_DEMAND", level: "PEMULA", priceIdr: 0, isFree: true, status: "PUBLISHED" });
  await course({ slug: "muhadatsah-praktis", title: "Muhadatsah: Percakapan Arab Praktis", description: "Latihan percakapan Arab untuk kehidupan sehari-hari.", thumbnailKey: "photo-1589462135796-2b46e4bdd7fe", categoryId: cat["bahasa-arab"].id, ustadzId: abdullah.id, type: "ON_DEMAND", level: "MENENGAH", priceIdr: 175000, isFree: false, status: "PUBLISHED" });
  await course({ slug: "tahfizh-juz-30", title: "Program Tahfizh Juz 30 Terbimbing", description: "Hafalan Juz 30 terbimbing dengan setoran rutin.", thumbnailKey: "photo-1587617425953-9075d28b8c46", categoryId: cat["tahsin"].id, ustadzId: fatimah.id, type: "ON_DEMAND", level: "PEMULA", priceIdr: 199000, isFree: false, status: "PUBLISHED" });

  // ---- Modul + materi untuk c1 ----
  const existingMod = await prisma.module.findFirst({ where: { courseId: c1.id, order: 1 } });
  if (!existingMod) {
    const bab1 = await prisma.module.create({ data: { courseId: c1.id, title: "Bab 1 — Pengenalan Huruf", order: 1 } });
    await prisma.lesson.createMany({ data: [
      { moduleId: bab1.id, title: "Mengenal Huruf Hijaiyah", order: 1, contentType: "VIDEO", isPreview: true, durationSec: 750 },
      { moduleId: bab1.id, title: "Tabel Huruf & Latihan Tulis", order: 2, contentType: "PDF", isPreview: true },
      { moduleId: bab1.id, title: "Pelafalan Makhraj", order: 3, contentType: "AUDIO", durationSec: 490 },
      { moduleId: bab1.id, title: "Slide Ringkasan Bab", order: 4, contentType: "HTML_PPT" },
      { moduleId: bab1.id, title: "Kuis Bab 1", order: 5, contentType: "TEXT" },
    ] });
    await prisma.module.create({ data: { courseId: c1.id, title: "Bab 2 — Isim, Fi'il, Harf", order: 2 } });
  }

  // ---- Payment gateway ----
  for (const g of [
    { provider: "MIDTRANS", isActive: true, mode: "PRODUCTION", displayName: "Midtrans", sortOrder: 1 },
    { provider: "TRIPAY", isActive: true, mode: "SANDBOX", displayName: "Tripay", sortOrder: 2 },
    { provider: "XENDIT", isActive: false, mode: "SANDBOX", displayName: "Xendit", sortOrder: 3 },
    { provider: "MANUAL", isActive: true, mode: "PRODUCTION", displayName: "Transfer Manual", sortOrder: 4 },
  ]) {
    await prisma.paymentGateway.upsert({ where: { provider: g.provider }, update: g, create: g });
  }

  // ---- Santri demo + enrollment + progress ----
  const ahmad = await prisma.user.upsert({ where: { email: "ahmad@mail.com" }, update: { name: "Ahmad Ramadhan", passwordHash }, create: { email: "ahmad@mail.com", name: "Ahmad Ramadhan", phone: "081234567890", passwordHash } });
  await assign(ahmad.id, "santri");
  const enr = await prisma.enrollment.upsert({ where: { userId_courseId: { userId: ahmad.id, courseId: c1.id } }, update: {}, create: { userId: ahmad.id, courseId: c1.id, source: "PURCHASE", status: "ACTIVE" } });
  const lessons = await prisma.lesson.findMany({ where: { module: { courseId: c1.id } }, orderBy: { order: "asc" }, take: 2 });
  for (const l of lessons) {
    await prisma.lessonProgress.upsert({ where: { enrollmentId_lessonId: { enrollmentId: enr.id, lessonId: l.id } }, update: { status: "COMPLETED", progressPct: 100 }, create: { enrollmentId: enr.id, lessonId: l.id, status: "COMPLETED", progressPct: 100 } });
  }

  console.log("Seed selesai. Login demo (password semua: '" + DEMO_PASSWORD + "'):");
  console.log("  santri     -> ahmad@mail.com");
  console.log("  ustadz     -> abdullah@santrikalong.com");
  console.log("  superadmin -> admin@santrikalong.com");
}

main().then(() => prisma.$disconnect()).catch((e) => { console.error(e); prisma.$disconnect(); process.exit(1); });
