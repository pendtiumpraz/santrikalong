# Keamanan Payout & Dokumen Bukti (Anti-Fraud)

> Status: **DRAFT** · 2026-06-01
> Pelengkap `08-penggajian-ustadz-pajak.md`. Fokus: mencegah ustadz mengakali sistem (klaim ganda) + dokumen PDF yang sah & tak bisa dipalsukan. Detail tabel/constraint final mengikuti ERD di `docs/backend/`.

## 1. Ancaman yang Dicegah
- Ustadz **klaim gaji berkali-kali** untuk saldo yang sama (double-claim).
- **Double-submit** karena klik berulang / retry jaringan.
- **Race condition** dua request klaim berbarengan.
- Klaim **uang yang nanti di-refund/chargeback** (saldo "menguap").
- **Manipulasi nominal** dari sisi klien.
- **Pengalihan dana** lewat ganti rekening mendadak (account takeover).
- **Pemalsuan dokumen** bukti pembayaran/pengajuan.

## 2. Prinsip Inti: Wallet Berbasis Ledger
Jangan simpan saldo sebagai angka yang bisa ditambah/kurang langsung. Pakai **buku besar append-only** (double-entry):

```
WalletEntry (append-only, immutable)
  id, ustadzId
  type            // EARNING_CREDIT | PAYOUT_DEBIT | PAYOUT_HOLD | HOLD_RELEASE | REVERSAL | ADJUSTMENT
  amount          // + masuk, - keluar
  refType, refId  // orderId / payoutId / earningId
  createdAt
```
- **Saldo = SUM(amount)**. Saldo tersedia = SUM kecuali yang berstatus HOLD.
- Tiap **EARNING_CREDIT terikat `orderId` UNIK** (unique constraint) → satu penjualan tidak mungkin jadi pemasukan dua kali.
- Semua perubahan punya jejak → audit & rekonsiliasi mudah.

## 3. Aturan Klaim (Anti Double-Claim)
1. **Atomic + lock**: proses klaim di dalam DB transaction, kunci baris wallet (`SELECT … FOR UPDATE`). Cek `jumlah ≤ saldoTersedia` **di dalam transaksi**.
2. **Idempotency key**: setiap request klaim bawa key unik (UUID). Unique constraint → submit ganda tidak membuat 2 klaim.
3. **Satu klaim aktif** per ustadz: unique partial index pada `(ustadzId)` untuk status ∈ {REQUESTED, PROCESSING}. Tidak bisa numpuk klaim.
4. **Reserve/HOLD**: saat klaim dibuat → buat entri `PAYOUT_HOLD` (saldo tersedia turun). Ditolak → `HOLD_RELEASE` (dikembalikan). Dibayar → `PAYOUT_DEBIT` final.
5. **Nominal dihitung server** dari ledger; klien tak pernah dipercaya kirim nominal.
6. **State machine** PayoutRequest: `REQUESTED → PROCESSING → PAID` atau `→ REJECTED`. Transisi sekali jalan, tercatat.

## 4. Earning Matang & Clawback
- Earning baru **claimable** setelah: (a) lewat **refund window** (mis. 7–14 hari), dan (b) order benar-benar **settle** di gateway (bukan sekadar "paid").
- **Refund/chargeback** setelah earning masuk → `REVERSAL` (debit). Jika sudah terlanjur dibayar → saldo bisa **minus (clawback)**, ditagih dari earning berikutnya.

## 5. Gerbang Verifikasi Sebelum Cair
- Rekening bank **terverifikasi** (nama pemilik cocok), NPWP/NIK ada.
- **Minimum payout** & rate limit (maks sekian klaim/periode).
- **Ganti rekening → tahan payout X hari** (anti account takeover).
- Approval admin (atau rule otomatis untuk nominal kecil & ustadz tepercaya).

## 6. Disbursement & Rekonsiliasi
- Transfer via gateway (Xendit/Flip/Midtrans Payout) dengan **idempotency reference** → tidak terkirim dobel. Simpan `disbursementId` & status callback.
- **Rekonsiliasi harian (otomatis)**: `SUM(ledger) == SUM(payout) + saldo == laporan settlement gateway`. Selisih → alarm + bekukan payout.
- **Audit log immutable** untuk semua aksi keuangan.

## 7. Dokumen PDF (Sah & Tamper-Evident)
Semua **di-generate server-side**, **bernomor urut tanpa gap**, punya **reference unik + `verifyCode` + QR**, dan **hash konten disimpan**.

| Dokumen | Dibuat saat | Isi inti |
|---------|-------------|----------|
| **Invoice** | santri membayar | item, total, metode, status LUNAS, no. invoice |
| **Bukti Pengajuan Payout** | ustadz mengajukan klaim | ID klaim, jumlah, rincian pajak, rekening tujuan, waktu, status REQUESTED, QR |
| **Bukti Terima Gaji / Pembayaran** | payout PAID | nominal bruto/bersih, pajak dipotong, ref disbursement, tanggal, cap/QR |
| **Bukti Potong Pajak** (kepatuhan) | payout PAID | dasar pengenaan, tarif, jumlah dipotong, periode, NPWP |

**Verifikasi keaslian:** endpoint publik `verify/{verifyCode}` menampilkan status asli dari DB. PDF yang diedit/dipalsukan tidak cocok dengan data server → ketahuan. Nomor dokumen berurutan untuk audit.

## 8. Entitas Tambahan (ringkas; final di ERD)
```
PayoutRequest
  id, ustadzId, amount, taxWithheld, netAmount
  idempotencyKey (unique), status, bankSnapshot(JSON)
  disbursementRef, requestedAt, processedAt, rejectionReason

WalletEntry            // lihat §2 (append-only)

DocumentRecord         // untuk semua PDF
  id, type(INVOICE|PAYOUT_REQUEST|PAYOUT_RECEIPT|TAX_SLIP)
  number(seq, unique), refType, refId, fileKey, verifyCode(unique), contentHash, issuedAt
```

## 9. Pertanyaan Terbuka
- Panjang refund window final?
- Payout otomatis (tanpa approval) untuk kondisi apa?
- Format & kewajiban bukti potong pajak (integrasi e-Bupot?).
- Kebijakan saldo minus/clawback bila ustadz keburu nonaktif.
