// Pembentuk payload kanonik untuk tanda tangan dokumen.
// Dipakai BERSAMA oleh route penerbit PDF dan halaman /verifikasi agar
// tanda tangan dihitung dari field yang persis sama (anti drift).
import type { Order, PayoutRequest, Enrollment, Course, User } from "@prisma/client";

export function invoicePayload(order: Order): Record<string, string | number | null> {
  return {
    doc: "invoice",
    id: order.id,
    amount: order.amountIdr,
    user: order.userId,
    item: order.itemId,
    status: order.status,
    paidAt: order.paidAt ? order.paidAt.toISOString() : null,
  };
}

export function certPayload(enrollment: Enrollment, user: User, course: Course): Record<string, string | number | null> {
  return {
    doc: "sertifikat",
    id: enrollment.id,
    user: user.id,
    name: user.name,
    course: course.id,
    title: course.title,
  };
}

export function payoutPayload(po: PayoutRequest): Record<string, string | number | null> {
  return {
    doc: "payout",
    id: po.id,
    key: po.idempotencyKey,
    amount: po.amountIdr,
    tax: po.taxWithheldIdr,
    net: po.netIdr,
    user: po.ustadzUserId,
    status: po.status,
    requestedAt: po.requestedAt.toISOString(),
    processedAt: po.processedAt ? po.processedAt.toISOString() : null,
  };
}
