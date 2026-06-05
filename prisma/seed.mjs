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

  // ---- Permissions + role-permission ----
  const permKeys = ["user.approve", "rbac.manage", "payment.gateway.toggle", "payout.approve", "tax.manage", "class.publish"];
  const perms = {};
  for (const key of permKeys) { perms[key] = await prisma.permission.upsert({ where: { key }, update: {}, create: { key } }); }
  async function grant(roleName, key) {
    const roleId = roles[roleName].id, permissionId = perms[key].id;
    await prisma.rolePermission.upsert({ where: { roleId_permissionId: { roleId, permissionId } }, update: {}, create: { roleId, permissionId } });
  }
  for (const k of permKeys) await grant("superadmin", k);
  for (const k of ["user.approve", "payout.approve", "class.publish"]) await grant("admin", k);

  // ---- Pelamar ustadz (PENDING) ----
  async function pendingUstadz(email, name, spec, docs) {
    const u = await prisma.user.upsert({ where: { email }, update: { name }, create: { email, name, passwordHash } });
    await prisma.ustadzProfile.upsert({ where: { userId: u.id }, update: { status: "PENDING", specialization: spec, documents: docs }, create: { userId: u.id, status: "PENDING", specialization: spec, documents: docs, revenueSharePct: 70 } });
  }
  await pendingUstadz("hamzah@santrikalong.com", "Ust. Hamzah Abdul Karim, M.A.", "Sirah & Hadits", { files: ["CV.pdf", "Ijazah.pdf", "Sanad.pdf"], institusi: "Univ. Madinah" });
  await pendingUstadz("aisyah@santrikalong.com", "Ustadzah Aisyah Nuraini", "Tahsin Anak", { files: ["CV.pdf", "Sertifikat.pdf"] });
  await pendingUstadz("bilal@santrikalong.com", "Ust. Bilal Ramadhan, Lc.", "Bahasa Arab", { files: ["CV.pdf", "Ijazah.pdf"], institusi: "LIPIA" });

  // ---- Orders (transaksi) ----
  if ((await prisma.order.count()) === 0) {
    await prisma.order.create({ data: { userId: ahmad.id, itemType: "COURSE", itemId: c1.id, amountIdr: 151500, status: "PAID", gateway: "MIDTRANS", reference: "INV-20260601-001", paidAt: new Date("2026-06-01T03:00:00Z") } });
    await prisma.order.create({ data: { userId: ahmad.id, itemType: "COURSE", itemId: c1.id, amountIdr: 250000, status: "PENDING", gateway: "TRIPAY", reference: "INV-20260601-002" } });
    await prisma.order.create({ data: { userId: ahmad.id, itemType: "COURSE", itemId: c1.id, amountIdr: 99000, status: "WAITING_CONFIRMATION", gateway: "MANUAL", reference: "INV-20260531-118" } });
  }

  // ---- Consent marketing ----
  if ((await prisma.consentRecord.count({ where: { type: "marketing_email" } })) === 0) {
    await prisma.consentRecord.create({ data: { userId: ahmad.id, type: "marketing_email", version: "1.0", granted: true, grantedAt: new Date(), source: "web" } });
    await prisma.consentRecord.create({ data: { userId: ahmad.id, type: "marketing_wa", version: "1.0", granted: true, grantedAt: new Date(), source: "web" } });
  }

  // ---- Wallet + earnings + payout ----
  async function wallet(userId, credits) {
    const w = await prisma.wallet.upsert({ where: { ustadzUserId: userId }, update: {}, create: { ustadzUserId: userId } });
    if ((await prisma.walletEntry.count({ where: { walletId: w.id } })) === 0) {
      for (const amt of credits) await prisma.walletEntry.create({ data: { walletId: w.id, type: "EARNING_CREDIT", amountIdr: amt, refType: "ORDER" } });
    }
  }
  await wallet(abdullah.userId, [4380600, 4318020]);
  await wallet(fatimah.userId, [3200000, 3159250]);
  await prisma.payoutRequest.upsert({ where: { idempotencyKey: "seed-fatimah-jun2026" }, update: {}, create: { ustadzUserId: fatimah.userId, amountIdr: 6405000, taxWithheldIdr: 45750, netIdr: 6359250, idempotencyKey: "seed-fatimah-jun2026", status: "REQUESTED", bankSnapshot: { bank: "BSI", no: "700****567", nama: "Fatimah" } } });

  // ---- Audit log ----
  if ((await prisma.auditLog.count()) === 0) {
    await prisma.auditLog.create({ data: { actorId: admin.id, action: "user.approve", targetType: "UstadzProfile", targetId: "-", meta: { name: "Ust. Yusuf" } } });
    await prisma.auditLog.create({ data: { actorId: admin.id, action: "payment.gateway.toggle", targetType: "PaymentGateway", targetId: "XENDIT", meta: { to: "off" } } });
    await prisma.auditLog.create({ data: { actorId: admin.id, action: "payout.approve", targetType: "PayoutRequest", targetId: "PO-118" } });
  }

  console.log("Seed selesai. Login demo (password semua: '" + DEMO_PASSWORD + "'):");
  console.log("  santri     -> ahmad@mail.com");
  console.log("  ustadz     -> abdullah@santrikalong.com");
  console.log("  superadmin -> admin@santrikalong.com");
}

main().then(() => prisma.$disconnect()).catch((e) => { console.error(e); prisma.$disconnect(); process.exit(1); });
