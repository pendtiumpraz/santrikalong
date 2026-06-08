import { PDFDocument, StandardFonts, rgb, PDFFont, PDFPage, PDFImage } from "pdf-lib";
import QRCode from "qrcode";

const INK = rgb(0.14, 0.13, 0.11);
const SOFT = rgb(0.45, 0.43, 0.4);
const LINE = rgb(0.85, 0.83, 0.8);
const GOLD = rgb(0.79, 0.62, 0.26);
const OK = rgb(0.18, 0.48, 0.39);

// Helvetica = WinAnsi; buang karakter yang tak terdukung agar tidak error.
const t = (s: string) => (s ?? "").replace(/[^\x09\x0A\x0D\x20-\x7E\xA0-\xFF]/g, "");

type Row = { label: string; value: string };
type DocSpec = {
  kind: string; // "INVOICE" | "BUKTI PAYOUT"
  number: string;
  issuedAt: string;
  partyLabel: string; // "Ditagihkan ke" / "Dibayarkan ke"
  partyName: string;
  rows: Row[];
  amountLabel: string;
  amountValue: string;
  statusText: string;
  statusOk: boolean;
  note: string;
  sig: string;
  code: string;
  verifyUrl: string;
};

function renderDoc(page: PDFPage, font: PDFFont, bold: PDFFont, d: DocSpec, qr?: PDFImage) {
  const { width, height } = page.getSize();
  const M = 56;
  let y = height - M;

  // ---- header brand ----
  page.drawText(t("SantriKalong"), { x: M, y: y - 4, size: 22, font: bold, color: INK });
  page.drawText(t("Ilmu adalah cahaya"), { x: M, y: y - 22, size: 9, font, color: SOFT });
  page.drawText(t(d.kind), { x: width - M - bold.widthOfTextAtSize(d.kind, 16), y: y - 4, size: 16, font: bold, color: GOLD });
  page.drawText(t("No. " + d.number), { x: width - M - font.widthOfTextAtSize("No. " + d.number, 9), y: y - 20, size: 9, font, color: SOFT });
  y -= 44;
  page.drawLine({ start: { x: M, y }, end: { x: width - M, y }, thickness: 1, color: LINE });
  y -= 30;

  // ---- meta ----
  page.drawText(t(d.partyLabel), { x: M, y, size: 9, font, color: SOFT });
  page.drawText(t("Tanggal terbit"), { x: width - M - 160, y, size: 9, font, color: SOFT });
  y -= 16;
  page.drawText(t(d.partyName), { x: M, y, size: 12, font: bold, color: INK });
  page.drawText(t(d.issuedAt), { x: width - M - 160, y, size: 11, font, color: INK });
  y -= 34;

  // ---- rows ----
  for (const r of d.rows) {
    page.drawText(t(r.label), { x: M, y, size: 10, font, color: SOFT });
    const vw = font.widthOfTextAtSize(t(r.value), 10);
    page.drawText(t(r.value), { x: width - M - vw, y, size: 10, font: bold, color: INK });
    y -= 8;
    page.drawLine({ start: { x: M, y }, end: { x: width - M, y }, thickness: 0.5, color: LINE });
    y -= 16;
  }

  // ---- amount box ----
  y -= 8;
  page.drawRectangle({ x: M, y: y - 34, width: width - 2 * M, height: 46, color: rgb(0.97, 0.95, 0.9), borderColor: GOLD, borderWidth: 0.5 });
  page.drawText(t(d.amountLabel), { x: M + 16, y: y - 12, size: 11, font, color: SOFT });
  page.drawText(t(d.amountValue), { x: width - M - 16 - bold.widthOfTextAtSize(d.amountValue, 18), y: y - 16, size: 18, font: bold, color: INK });
  y -= 60;

  // ---- status ----
  const sc = d.statusOk ? OK : SOFT;
  page.drawText(t("Status: " + d.statusText), { x: M, y, size: 11, font: bold, color: sc });
  y -= 40;

  // ---- verification block ----
  page.drawLine({ start: { x: M, y }, end: { x: width - M, y }, thickness: 0.5, color: LINE });
  y -= 22;
  page.drawText(t("Keaslian dokumen"), { x: M, y, size: 10, font: bold, color: INK });
  // QR verifikasi di kanan blok
  if (qr) {
    const qsz = 92;
    page.drawImage(qr, { x: width - M - qsz, y: y - qsz + 8, width: qsz, height: qsz });
    page.drawText(t("Scan untuk verifikasi"), { x: width - M - qsz, y: y - qsz, size: 7, font, color: SOFT });
  }
  y -= 16;
  page.drawText(t("Kode verifikasi: " + d.code), { x: M, y, size: 10, font, color: INK });
  y -= 14;
  page.drawText(t("Verifikasi online: " + d.verifyUrl), { x: M, y, size: 8.5, font, color: SOFT });
  y -= 14;
  // tanda tangan dipecah agar muat
  const sigLabel = "Tanda tangan digital (HMAC-SHA256):";
  page.drawText(t(sigLabel), { x: M, y, size: 8, font, color: SOFT });
  y -= 11;
  const chunk = d.sig.match(/.{1,64}/g) ?? [d.sig];
  for (const line of chunk) { page.drawText(t(line), { x: M, y, size: 7.5, font, color: SOFT }); y -= 10; }

  // ---- footer note ----
  page.drawText(t(d.note), { x: M, y: M - 16, size: 7.5, font, color: SOFT });
}

async function newDoc() {
  const pdf = await PDFDocument.create();
  const page = pdf.addPage([595.28, 841.89]); // A4
  const font = await pdf.embedFont(StandardFonts.Helvetica);
  const bold = await pdf.embedFont(StandardFonts.HelveticaBold);
  return { pdf, page, font, bold };
}

async function qrImage(pdf: PDFDocument, url: string): Promise<PDFImage> {
  const png = await QRCode.toBuffer(url, { type: "png", margin: 1, width: 256, errorCorrectionLevel: "M" });
  return pdf.embedPng(png);
}

export type CertSpec = {
  recipient: string;
  courseTitle: string;
  ustadzName: string;
  detail: string; // mis. "12 jam pembelajaran"
  certNo: string;
  code: string;
  verifyUrl: string;
};

export async function buildCertificatePdf(d: CertSpec): Promise<Uint8Array> {
  const pdf = await PDFDocument.create();
  const page = pdf.addPage([841.89, 595.28]); // A4 landscape
  const font = await pdf.embedFont(StandardFonts.Helvetica);
  const bold = await pdf.embedFont(StandardFonts.TimesRomanBold);
  const serif = await pdf.embedFont(StandardFonts.TimesRoman);
  const { width, height } = page.getSize();
  const center = (s: string, f: PDFFont, size: number) => (width - f.widthOfTextAtSize(t(s), size)) / 2;

  // border ganda
  page.drawRectangle({ x: 24, y: 24, width: width - 48, height: height - 48, borderColor: GOLD, borderWidth: 2, color: rgb(1, 1, 1) });
  page.drawRectangle({ x: 32, y: 32, width: width - 64, height: height - 64, borderColor: rgb(0.85, 0.78, 0.6), borderWidth: 0.8 });

  let y = height - 96;
  page.drawText(t("SantriKalong"), { x: center("SantriKalong", bold, 20), y, size: 20, font: bold, color: INK });
  y -= 18;
  page.drawText(t("Ilmu adalah cahaya"), { x: center("Ilmu adalah cahaya", serif, 10), y, size: 10, font: serif, color: SOFT });
  y -= 46;
  page.drawText(t("SERTIFIKAT PENYELESAIAN"), { x: center("SERTIFIKAT PENYELESAIAN", font, 13), y, size: 13, font, color: GOLD });
  y -= 40;
  page.drawText(t("Dengan bangga diberikan kepada"), { x: center("Dengan bangga diberikan kepada", serif, 12), y, size: 12, font: serif, color: SOFT });
  y -= 46;
  page.drawText(t(d.recipient), { x: center(d.recipient, bold, 34), y, size: 34, font: bold, color: INK });
  y -= 22;
  page.drawLine({ start: { x: width / 2 - 60, y }, end: { x: width / 2 + 60, y }, thickness: 1, color: GOLD });
  y -= 30;
  page.drawText(t("telah menyelesaikan kelas"), { x: center("telah menyelesaikan kelas", serif, 12), y, size: 12, font: serif, color: SOFT });
  y -= 30;
  page.drawText(t(d.courseTitle), { x: center(d.courseTitle, bold, 18), y, size: 18, font: bold, color: INK });
  y -= 24;
  page.drawText(t(d.detail), { x: center(d.detail, serif, 11), y, size: 11, font: serif, color: SOFT });

  // tanda tangan kiri
  const sy = 110;
  page.drawLine({ start: { x: 110, y: sy }, end: { x: 290, y: sy }, thickness: 0.8, color: LINE });
  page.drawText(t(d.ustadzName), { x: 110, y: sy - 16, size: 12, font: bold, color: INK });
  page.drawText(t("Pengajar"), { x: 110, y: sy - 30, size: 9, font, color: SOFT });

  // verifikasi kanan + QR
  const qpng = await QRCode.toBuffer(d.verifyUrl, { type: "png", margin: 1, width: 256, errorCorrectionLevel: "M" });
  const qr = await pdf.embedPng(qpng);
  const qsz = 84;
  page.drawImage(qr, { x: width - 110 - qsz, y: sy - 30, width: qsz, height: qsz });
  page.drawText(t("No. " + d.certNo), { x: width - 110 - qsz, y: sy - 44, size: 8, font, color: SOFT });
  page.drawText(t("Kode: " + d.code), { x: width - 110 - qsz, y: sy - 56, size: 8, font, color: SOFT });

  return pdf.save();
}

export async function buildInvoicePdf(d: Omit<DocSpec, "kind" | "partyLabel">): Promise<Uint8Array> {
  const { pdf, page, font, bold } = await newDoc();
  const qr = await qrImage(pdf, d.verifyUrl);
  renderDoc(page, font, bold, { ...d, kind: "INVOICE", partyLabel: "Ditagihkan kepada" }, qr);
  return pdf.save();
}

export async function buildPayoutPdf(d: Omit<DocSpec, "kind" | "partyLabel">): Promise<Uint8Array> {
  const { pdf, page, font, bold } = await newDoc();
  const qr = await qrImage(pdf, d.verifyUrl);
  renderDoc(page, font, bold, { ...d, kind: "BUKTI PAYOUT", partyLabel: "Dibayarkan kepada" }, qr);
  return pdf.save();
}
