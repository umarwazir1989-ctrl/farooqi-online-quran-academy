import { PDFDocument, StandardFonts, rgb } from "pdf-lib";
import QRCode from "qrcode";

function clean(value: unknown) {
  return String(value ?? "").replace(/[^\x20-\x7E]/g, " ").trim();
}

export async function buildQrStudentIdCard(student: any, siteUrl: string) {
  const pdf = await PDFDocument.create();
  const page = pdf.addPage([324, 204]);

  const regular = await pdf.embedFont(StandardFonts.Helvetica);
  const bold = await pdf.embedFont(StandardFonts.HelveticaBold);

  const verifyCode = clean(student.verification_code || student.student_code) || "verify";
  const qrUrl = `${siteUrl.replace(/\/$/, "")}/verify/${encodeURIComponent(verifyCode)}`;
  const qrDataUrl = await QRCode.toDataURL(qrUrl, {
    margin: 1,
    width: 220,
  });

  const qrBase64 = qrDataUrl.split(",")[1];
  const qrBytes = Buffer.from(qrBase64, "base64");
  const qrImage = await pdf.embedPng(qrBytes);

  const deep = rgb(0.02, 0.18, 0.14);
  const gold = rgb(0.78, 0.57, 0.18);
  const cream = rgb(0.98, 0.96, 0.91);
  const muted = rgb(0.40, 0.40, 0.40);

  page.drawRectangle({ x: 0, y: 0, width: 324, height: 204, color: cream });
  page.drawRectangle({ x: 0, y: 154, width: 324, height: 50, color: deep });

  page.drawText("FAROOQI ONLINE QURAN ACADEMY", {
    x: 16, y: 180, size: 10.5, font: bold, color: rgb(1, 1, 1)
  });

  page.drawText("VERIFIED STUDENT ID CARD", {
    x: 16, y: 163, size: 8, font: regular, color: gold
  });

  page.drawText(clean(student.full_name) || "Student", {
    x: 16, y: 128, size: 15, font: bold, color: deep
  });

  page.drawText(`Code: ${clean(student.student_code) || "-"}`, {
    x: 16, y: 107, size: 8.5, font: regular, color: muted
  });

  page.drawText(`Course: ${clean(student.course_name) || "-"}`, {
    x: 16, y: 90, size: 8.5, font: regular, color: muted
  });

  page.drawText(`Teacher: ${clean(student.teacher_name) || "-"}`, {
    x: 16, y: 73, size: 8.5, font: regular, color: muted
  });

  page.drawText(`Country: ${clean(student.country) || "-"}`, {
    x: 16, y: 56, size: 8.5, font: regular, color: muted
  });

  page.drawImage(qrImage, {
    x: 238, y: 54, width: 68, height: 68
  });

  page.drawText("Scan to Verify ID", {
    x: 242, y: 40, size: 6.5, font: regular, color: muted
  });

  page.drawText("Quran • Tajweed • Islamic Studies", {
    x: 16, y: 20, size: 7.5, font: bold, color: gold
  });

  return pdf.save();
}
