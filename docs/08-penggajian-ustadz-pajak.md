# Sistem Penggajian (Payroll) Ustadz & Perhitungan Pajak

> Status: **DRAFT** · 2026-06-01
> ⚠️ **Disclaimer pajak**: Dokumen ini rangkuman regulasi publik, **bukan nasihat pajak**. Wajib dikonfirmasi ke konsultan pajak sebelum produksi. Tarif & skema dibuat **configurable** di panel superadmin.

## 1. Tujuan

Ustadz mendapat **bagi hasil (revenue share)** dari penjualan kelasnya. Sistem menghitung pendapatan ustadz per bulan, memotong pajak & biaya, dan mengelola **saldo + klaim (payout)**.

Prinsip:
- Pendapatan ustadz dihitung **berbasis pembeli/penjualan kelasnya**.
- Direkap **bulanan**.
- Ustadz bisa **klaim (withdraw)** saldonya tiap bulan. Kalau tidak diklaim → **tetap jadi saldo** (akumulasi), bisa diklaim kapan saja.

## 2. Alur Perhitungan Pendapatan

```
Penjualan kelas (Order PAID)
  → hitung pendapatan kotor ustadz = harga × revenue_share%
  → kurangi biaya platform / payment gateway fee (sesuai kebijakan)
  → masuk ke "Earning" ustadz (status: PENDING → AVAILABLE setelah periode aman/refund window)
  → akumulasi ke Saldo (Wallet) ustadz
```

### Komponen perhitungan
| Komponen | Keterangan |
|----------|------------|
| Harga kelas (bruto) | Harga jual ke santri |
| Revenue share ustadz | mis. 70% (configurable per ustadz/kelas/global) |
| Potongan platform | sisanya untuk platform |
| Biaya gateway | opsional dibebankan ke siapa (platform/ustadz) — configurable |
| **Pajak** | dipotong saat earning/payout (lihat bagian 4) |
| **Nominal bersih (net)** | yang masuk saldo / dibayarkan |

### Refund window
Earning baru jadi **AVAILABLE** setelah lewat masa refund (mis. 7–14 hari) untuk hindari bayar lalu refund.

## 3. Saldo (Wallet) & Klaim (Payout)

```
Wallet Ustadz
  saldoTersedia (available), saldoTertahan (pending/refund window)

Klaim/Payout
  ustadz ajukan klaim → status REQUESTED
  → admin verifikasi (atau auto) → PROCESSING
  → transfer ke rekening ustadz → PAID
  → (atau REJECTED dengan alasan)
```

- **Minimum payout** (mis. Rp50.000) — configurable.
- **Jadwal**: bisa diklaim kapan saja, atau dibatasi tanggal tertentu tiap bulan — configurable.
- **Tidak diklaim → tetap saldo** (carry over, tidak hangus).
- Butuh **data rekening bank** ustadz (terverifikasi).
- Catatan: payout massal bisa pakai fitur disbursement gateway (Xendit/Midtrans Payouts/Flip).

## 4. Perhitungan Pajak (Configurable)

> Berdasarkan regulasi yang berlaku ~Juni 2026. **Konfirmasi ke konsultan pajak.**

### Konteks penting (hasil riset 2026)
- **PP 20/2026** (diundangkan 22 April 2026): tarif **PPh Final UMKM 0,5%** kini **tanpa batas waktu** untuk **Orang Pribadi**, Perseroan Perorangan, Koperasi, selama **omzet ≤ Rp4,8 miliar/tahun**. (PT/CV/firma tidak lagi berhak.)
- **Omzet ≤ Rp500 juta/tahun → tidak kena PPh** (Orang Pribadi UMKM).
- **Profesi dikecualikan** dari 0,5%: tenaga ahli (dokter, pengacara, akuntan, konsultan) & pekerja seni/influencer → skema normal. ⚠️ Status "ustadz/pengajar" perlu dipastikan.
- **PPh 21 Bukan Pegawai** (PMK 168/2023): **Tarif Pasal 17 × (50% × penghasilan bruto)**, rumus tunggal, tidak akumulatif. Dipakai jika ustadz diperlakukan sebagai penerima honorarium/bukan pegawai.
- **NIK = NPWP** berlaku penuh 2026 → wajib data NPWP/NIK. **Tanpa NPWP: tarif 20% lebih tinggi** (faktor 120%).

### Skema pajak yang didukung sistem (pilih per kebijakan)
Sistem menyediakan beberapa **mode pajak** yang bisa dipilih superadmin (global, atau override per ustadz):

| Mode | Rumus dasar | Kapan dipakai |
|------|-------------|---------------|
| `NONE` | tanpa potong (ustadz lapor mandiri) | platform tidak memotong |
| `UMKM_FINAL_05` | `0,5% × bruto` (dgn ambang bebas ≤500jt/th) | ustadz punya Suket PP 23/PP 20, status UMKM |
| `PPH21_BUKAN_PEGAWAI` | `Tarif Ps.17 × (50% × bruto)` | ustadz = honorarium/bukan pegawai |
| `CUSTOM_FLAT` | `x% × bruto` (admin set) | fleksibel / aturan baru |

- Faktor **non-NPWP** (mis. ×1,2) bisa diaktifkan per mode.
- Tarif Pasal 17 (progresif) disimpan sebagai **tabel configurable** (bracket).
- Sistem mencatat **bukti potong** & rekap untuk pelaporan.

### Pengaturan pajak (di superadmin)
```
TaxSetting
  mode                 // NONE | UMKM_FINAL_05 | PPH21_BUKAN_PEGAWAI | CUSTOM_FLAT
  finalRatePct         // mis. 0.5
  customRatePct
  nonNpwpSurchargePct  // mis. 20 (faktor 1.2)
  pkpThresholdYearly   // mis. 500_000_000 (bebas pajak UMKM)
  brutoCapYearly       // 4_800_000_000
  article17Brackets    // JSON tabel progresif
  effectiveDate
  note
```

## 5. Urutan Potongan (contoh)

```
Bruto ustadz (dari revenue share)
  − biaya platform (jika dibebankan ke ustadz)
  − pajak (sesuai mode)
  = Net masuk saldo
```

> Catatan: PPh final UMKM dihitung dari **omzet/peredaran bruto**, sedangkan PPh 21 dari penghasilan. Penempatan urutan & dasar pengenaan WAJIB sesuai skema yang dipilih → makanya dibuat modular.

## 6. Entitas Tambahan (lihat juga `05-data-model.md`)

```
UstadzPayoutProfile
  userId, bankName, accountNumber, accountHolder, npwp, nik
  taxModeOverride(opsional), revenueSharePctOverride(opsional)
  npwpVerified, bankVerified

Earning
  id, ustadzId, orderId, courseId
  grossAmount, platformFee, gatewayFee
  taxMode, taxableBase, taxAmount, netAmount
  status            // PENDING | AVAILABLE | PAID_OUT | REVERSED(refund)
  availableAt, createdAt

Wallet
  ustadzId, availableBalance, pendingBalance, currency

PayoutRequest
  id, ustadzId, amount, bankSnapshot(JSON)
  status            // REQUESTED | PROCESSING | PAID | REJECTED
  taxWithheldTotal, requestedAt, processedAt, proofRef, note

TaxSetting (global) + TaxBracket (Pasal 17)

TaxWithholdingRecord  // bukti potong per earning/payout
  id, earningId/payoutId, mode, base, rate, amount, period, npwp
```

## 7. Laporan
- **Per ustadz**: pendapatan bulanan, pajak dipotong, saldo, riwayat klaim.
- **Superadmin**: total payout, total pajak dipotong (untuk pelaporan SPT/bukti potong), rekonsiliasi.
- Export CSV/PDF untuk keperluan pajak.

## 8. Pertanyaan Terbuka (pajak & payroll)
1. Ustadz diperlakukan sebagai **UMKM (0,5% final)** atau **bukan pegawai (PPh 21)**? (beda dasar hukum & rumus)
2. Apakah platform berperan sebagai **pemotong/pemungut** (withholding) — termasuk cek aturan **pemungutan PPh oleh marketplace/PMSE**?
3. **Revenue share default** berapa %? Bisa beda per ustadz/kelas?
4. **Biaya gateway** dibebankan ke platform atau ustadz?
5. **Minimum payout** & jadwal klaim?
6. Perlu **bukti potong otomatis** & integrasi e-Bupot?
