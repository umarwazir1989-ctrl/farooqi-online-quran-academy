import { PDFDocument, StandardFonts, rgb } from "pdf-lib";

function clean(value: unknown) {
  return String(value ?? "").replace(/[^\x20-\x7E]/g, " ").trim();
}

export async function buildStudentIdCard(student: any) {
  const pdf = await PDFDocument.create();
  const page = pdf.addPage([324, 204]);
  const regular = await pdf.embedFont(StandardFonts.Helvetica);
  const bold = await pdf.embedFont(StandardFonts.HelveticaBold);

  const deep = rgb(0.02, 0.18, 0.14);
  const gold = rgb(0.78, 0.57, 0.18);
  const muted = rgb(0.38, 0.38, 0.38);

  page.drawRectangle({ x:0, y:0, width:324, height:204, color:rgb(0.98,0.96,0.91) });
  page.drawRectangle({ x:0, y:154, width:324, height:50, color:deep });

  page.drawText("FAROOQI ONLINE QURAN ACADEMY", {
    x:18,y:180,size:11,font:bold,color:rgb(1,1,1)
  });
  page.drawText("STUDENT ID CARD", {
    x:18,y:162,size:8,font:regular,color:gold
  });

  page.drawText(clean(student.full_name) || "Student", {
    x:18,y:126,size:16,font:bold,color:deep
  });

  page.drawText(`Student Code: ${clean(student.student_code) || "-"}`, {
    x:18,y:105,size:9,font:regular,color:muted
  });
  page.drawText(`Course: ${clean(student.course_name) || "-"}`, {
    x:18,y:88,size:9,font:regular,color:muted
  });
  page.drawText(`Teacher: ${clean(student.teacher_name) || "-"}`, {
    x:18,y:71,size:9,font:regular,color:muted
  });
  page.drawText(`Country: ${clean(student.country) || "-"}`, {
    x:18,y:54,size:9,font:regular,color:muted
  });

  page.drawText("Quran • Tajweed • Islamic Studies", {
    x:18,y:20,size:8,font:bold,color:gold
  });

  return pdf.save();
}

export async function buildStudentCertificate(student: any) {
  const pdf = await PDFDocument.create();
  const page = pdf.addPage([841.89, 595.28]);
  const regular = await pdf.embedFont(StandardFonts.Helvetica);
  const bold = await pdf.embedFont(StandardFonts.HelveticaBold);

  const deep = rgb(0.02, 0.18, 0.14);
  const gold = rgb(0.78, 0.57, 0.18);
  const muted = rgb(0.38, 0.38, 0.38);

  page.drawRectangle({
    x:24,y:24,width:793.89,height:547.28,
    borderColor:gold,borderWidth:3
  });
  page.drawRectangle({
    x:34,y:34,width:773.89,height:527.28,
    borderColor:deep,borderWidth:1
  });

  page.drawText("FAROOQI ONLINE QURAN ACADEMY", {
    x:230,y:500,size:20,font:bold,color:deep
  });

  page.drawText("CERTIFICATE OF ACHIEVEMENT", {
    x:270,y:455,size:17,font:bold,color:gold
  });

  page.drawText("This certificate is presented to", {
    x:324,y:405,size:11,font:regular,color:muted
  });

  const name = clean(student.full_name) || "Student";
  const nameWidth = bold.widthOfTextAtSize(name, 30);
  page.drawText(name, {
    x:(841.89-nameWidth)/2,y:350,size:30,font:bold,color:deep
  });

  const course = clean(student.course_name) || "Quran Studies";
  const text = `for participation and progress in ${course}.`;
  const textWidth = regular.widthOfTextAtSize(text, 13);
  page.drawText(text, {
    x:(841.89-textWidth)/2,y:310,size:13,font:regular,color:muted
  });

  page.drawText(`Student Code: ${clean(student.student_code) || "-"}`, {
    x:325,y:250,size:10,font:regular,color:muted
  });

  page.drawText("Academy Administration", {
    x:118,y:115,size:10,font:bold,color:deep
  });

  page.drawLine({
    start:{x:95,y:135},end:{x:260,y:135},thickness:1,color:deep
  });

  page.drawText("Farooqi Online Quran Academy", {
    x:555,y:115,size:10,font:bold,color:deep
  });

  page.drawLine({
    start:{x:535,y:135},end:{x:745,y:135},thickness:1,color:deep
  });

  return pdf.save();
}
