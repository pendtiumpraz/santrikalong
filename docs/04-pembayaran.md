# Strategi Pembayaran & Integrasi Gateway

> Status: **DRAFT** · 2026-06-01

## 1. Tujuan
- Mendukung **banyak gateway**: Midtrans, Tripay, Xendit, dan **Transfer Manual**.
- Superadmin bisa **mengaktifkan/menonaktifkan** tiap gateway dan mengisi kredensialnya dari panel.
- Santri pilih metode bayar yang aktif saat checkout.

## 2. Konfigurasi Gateway di Superadmin

Tiap gateway punya record konfigurasi:

```
PaymentGateway {
  id
  provider        // MIDTRANS | TRIPAY | XENDIT | MANUAL
  isActive        // toggle on/off
  mode            // SANDBOX | PRODUCTION
  credentials     // JSON terenkripsi (server/client key, secret, merchant code, dll)
  displayName     // "Midtrans", "Tripay", dst
  feeNote         // info biaya (opsional)
  sortOrder
}
```

- Kredensial **dienkripsi** di DB (jangan plaintext).
- Hanya gateway `isActive = true` yang muncul di halaman checkout.

## 3. Abstraksi Kode (Payment Adapter)

Interface seragam supaya gampang nambah gateway baru:

```ts
interface PaymentProvider {
  createTransaction(order: Order): Promise<{ redirectUrl?: string; vaNumber?: string; raw: unknown }>;
  verifyWebhook(req: Request): Promise<WebhookResult>;   // cek signature
  getStatus(reference: string): Promise<PaymentStatus>;
}
```

Implementasi: `MidtransProvider`, `TripayProvider`, `XenditProvider`, `ManualProvider`.
Factory pilih provider berdasar metode yang dipilih user + config aktif.

## 4. Alur Pembayaran (Otomatis — Midtrans/Tripay/Xendit)

```
Santri pilih kelas → Checkout → pilih gateway aktif
  → backend buat Order (status: PENDING)
  → provider.createTransaction() → dapat redirect/VA/QRIS
  → santri bayar
  → gateway kirim WEBHOOK ke /api/webhooks/{provider}
  → verifikasi signature → update Order = PAID
  → buat Enrollment (akses kelas terbuka)
  → kirim invoice + notifikasi
```

- **Webhook adalah sumber kebenaran** status bayar (jangan hanya andalkan redirect).
- Idempotent: webhook bisa datang >1x, jangan dobel proses.

## 5. Alur Transfer Manual
```
Santri pilih "Transfer Manual" → tampil rekening tujuan
  → upload bukti transfer
  → status: WAITING_CONFIRMATION
  → Admin verifikasi manual → PAID → Enrollment aktif
```

## 6. Entitas Terkait

- **Order / Transaction**: user, item (kelas/dauroh/langganan), amount, provider, status, reference, timestamps.
- **Invoice**: nomor invoice, detail, bisa di-PDF.
- **Enrollment**: dibuat setelah PAID; menentukan akses materi.
- **Refund** (later): pencatatan & proses pengembalian.

### Status Order
`PENDING → PAID → (REFUNDED)` · `PENDING → EXPIRED/FAILED` · Manual: `WAITING_CONFIRMATION → PAID/REJECTED`

## 7. Model Monetisasi yang Mungkin
- 🟢 Bayar per kelas (one-time)
- 🟡 Dauroh berbayar (event, periode terbatas)
- 🟡 Membership/langganan bulanan (akses banyak kelas)
- 🟡 Kupon/voucher diskon
- 🔵 Bundle kelas
- 🔵 Bagi hasil ustadz (revenue share) + payout otomatis

## 8. Hal Penting
- Simpan **mata uang** (IDR) & format harga konsisten.
- Tangani **expired** transaksi (auto-cancel order).
- Catat semua di audit log keuangan.
- Pisahkan **mode sandbox/production** per gateway.
- Rekonsiliasi: laporan transaksi vs settlement gateway.

## 9. Pertanyaan Terbuka
- Apakah perlu pajak/PPN di invoice?
- Apakah harga bisa beda per region/promo?
- Bagaimana skema payout ke ustadz (jika revenue share)?
