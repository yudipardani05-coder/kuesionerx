import { z } from "zod";
import { createRouter, publicQuery } from "../middleware";
import { getDb } from "../queries/connection";
import { respondents, answers } from "@db/schema";
import ExcelJS from "exceljs";
import { Resend } from "resend";
import { env } from "../lib/env";

// Question definitions with dimensions
export const questions = [
  // X1 - Sistem Penggajian (Q1-Q15)
  { num: 1, code: "X1", dimension: "Fungsi yang Terkait", indicator: "Pemisahan Fungsi Kepegawaian", text: "Tugas bagian kepegawaian dalam mengelola data karyawan sudah jelas dan terpisah dari tugas lain." },
  { num: 2, code: "X1", dimension: "Fungsi yang Terkait", indicator: "Pemisahan Fungsi Kepegawaian", text: "Pencatatan kehadiran dan jam kerja saya dilakukan dengan tepat dan akurat." },
  { num: 3, code: "X1", dimension: "Fungsi yang Terkait", indicator: "Pemisahan Fungsi Kepegawaian", text: "Daftar gaji dibuat oleh petugas yang berwenang sesuai prosedur." },
  { num: 4, code: "X1", dimension: "Dokumen yang Digunakan", indicator: "Kartu Jam Hadir", text: "Saya menggunakan kartu jam hadir/finger print setiap hari kerja." },
  { num: 5, code: "X1", dimension: "Dokumen yang Digunakan", indicator: "Kartu Jam Hadir", text: "Daftar hadir digunakan sebagai dasar perhitungan gaji saya." },
  { num: 6, code: "X1", dimension: "Dokumen yang Digunakan", indicator: "Kartu Jam Hadir", text: "Saya menerima slip gaji setiap bulan yang menjelaskan rincian gaji saya." },
  { num: 7, code: "X1", dimension: "Catatan Akuntansi", indicator: "Jurnal Umum", text: "Setiap pembayaran gaji dicatat dalam laporan keuangan perusahaan." },
  { num: 8, code: "X1", dimension: "Catatan Akuntansi", indicator: "Jurnal Umum", text: "Ada catatan penghasilan karyawan yang disimpan perusahaan." },
  { num: 9, code: "X1", dimension: "Catatan Akuntansi", indicator: "Jurnal Umum", text: "Gaji saya merupakan bagian dari biaya operasional perusahaan." },
  { num: 10, code: "X1", dimension: "Prosedur Sistem", indicator: "Prosedur Pencatatan Waktu", text: "Prosedur pencatatan waktu kerja sudah berjalan dengan baik." },
  { num: 11, code: "X1", dimension: "Prosedur Sistem", indicator: "Prosedur Pencatatan Waktu", text: "Distribusi/pembagian gaji dilakukan secara teratur dan tepat waktu." },
  { num: 12, code: "X1", dimension: "Prosedur Sistem", indicator: "Prosedur Pencatatan Waktu", text: "Pembayaran gaji dilakukan sesuai dengan prosedur yang berlaku." },
  { num: 13, code: "X1", dimension: "Unsur Pengendalian", indicator: "Organisasi", text: "Struktur organisasi penggajian sudah jelas dan terorganisir." },
  { num: 14, code: "X1", dimension: "Unsur Pengendalian", indicator: "Organisasi", text: "Prosedur pencatatan penggajian dilakukan dengan teliti." },
  { num: 15, code: "X1", dimension: "Unsur Pengendalian", indicator: "Organisasi", text: "Setiap pembayaran gaji telah mendapat persetujuan dari atasan yang berwenang." },

  // X2 - Pengendalian Internal (Q16-Q30)
  { num: 16, code: "X2", dimension: "Lingkungan Pengendalian", indicator: "Integritas dan Etika", text: "Perusahaan menerapkan nilai integritas dan etika kerja dengan baik." },
  { num: 17, code: "X2", dimension: "Lingkungan Pengendalian", indicator: "Integritas dan Etika", text: "Karyawan di perusahaan ini memiliki kompetensi sesuai bidangnya." },
  { num: 18, code: "X2", dimension: "Lingkungan Pengendalian", indicator: "Integritas dan Etika", text: "Saya memahami struktur organisasi dan garis wewenang di perusahaan ini." },
  { num: 19, code: "X2", dimension: "Penilaian Risiko", indicator: "Identifikasi Risiko Internal", text: "Perusahaan mengenali risiko-risiko yang mungkin terjadi dari dalam." },
  { num: 20, code: "X2", dimension: "Penilaian Risiko", indicator: "Identifikasi Risiko Internal", text: "Perusahaan mengenali risiko-risiko yang mungkin datang dari luar." },
  { num: 21, code: "X2", dimension: "Penilaian Risiko", indicator: "Identifikasi Risiko Internal", text: "Perusahaan menganalisis risiko operasional secara berkala." },
  { num: 22, code: "X2", dimension: "Aktivitas Pengendalian", indicator: "Pemisahan Tugas", text: "Tugas dan tanggung jawab antar bagian sudah dipisah dengan jelas." },
  { num: 23, code: "X2", dimension: "Aktivitas Pengendalian", indicator: "Pemisahan Tugas", text: "Setiap aktivitas kerja didokumentasikan dengan baik." },
  { num: 24, code: "X2", dimension: "Aktivitas Pengendalian", indicator: "Pemisahan Tugas", text: "Aset dan dokumen perusahaan diamankan dengan baik." },
  { num: 25, code: "X2", dimension: "Informasi dan Komunikasi", indicator: "Sistem Informasi Operasional", text: "Informasi operasional disampaikan dengan jelas dan tepat waktu." },
  { num: 26, code: "X2", dimension: "Informasi dan Komunikasi", indicator: "Sistem Informasi Operasional", text: "Laporan keuangan perusahaan disusun secara akurat." },
  { num: 27, code: "X2", dimension: "Informasi dan Komunikasi", indicator: "Sistem Informasi Operasional", text: "Komunikasi antar karyawan dan atasan berjalan dengan baik." },
  { num: 28, code: "X2", dimension: "Pemantauan", indicator: "Evaluasi Berkala", text: "Kinerja karyawan dievaluasi secara berkala." },
  { num: 29, code: "X2", dimension: "Pemantauan", indicator: "Evaluasi Berkala", text: "Sistem pengendalian internal dinilai efektivitasnya secara berkala." },
  { num: 30, code: "X2", dimension: "Pemantauan", indicator: "Evaluasi Berkala", text: "Kekurangan yang ditemukan segera ditindaklanjuti dengan perbaikan." },

  // Y - Kinerja Karyawan (Q31-Q40)
{ num: 31, code: "Y", dimension: "Kualitas Kerja", indicator: "Akurasi Hasil Pekerjaan", text: "Saya merasa/percaya/mengetahui bahwa hasil pekerjaan saya akurat dan bebas dari kesalahan." },
{ num: 32, code: "Y", dimension: "Kualitas Kerja", indicator: "Ketelitian dalam Pelaksanaan Tugas", text: "Saya merasa/percaya/mengetahui bahwa saya melaksanakan tugas dengan teliti dan cermat." },
{ num: 33, code: "Y", dimension: "Kuantitas Kerja", indicator: "Volume Output Sesuai Target", text: "Saya merasa/percaya/mengetahui bahwa volume pekerjaan yang saya hasilkan sesuai dengan target yang ditetapkan." },
{ num: 34, code: "Y", dimension: "Kuantitas Kerja", indicator: "Jumlah Pekerjaan yang Diselesaikan", text: "Saya merasa/percaya/mengetahui bahwa jumlah pekerjaan yang saya selesaikan memenuhi standar yang diharapkan." },
{ num: 35, code: "Y", dimension: "Ketepatan Waktu", indicator: "Penyelesaian Tugas Sesuai Batas Waktu", text: "Saya merasa/percaya/mengetahui bahwa saya selalu menyelesaikan tugas sesuai dengan batas waktu yang ditentukan." },
{ num: 36, code: "Y", dimension: "Ketepatan Waktu", indicator: "Tidak Terjadi Keterlambatan Operasional", text: "Saya merasa/percaya/mengetahui bahwa tidak terjadi keterlambatan dalam pelaksanaan tugas operasional saya." },
{ num: 37, code: "Y", dimension: "Kemampuan Kerja Sama", indicator: "Kolaborasi dengan Rekan Kerja dan Atasan", text: "Saya merasa/percaya/mengetahui bahwa saya mampu bekerja sama dengan baik bersama rekan kerja dan atasan." },
{ num: 38, code: "Y", dimension: "Kemampuan Kerja Sama", indicator: "Partisipasi dalam Pencapaian Tujuan Tim", text: "Saya merasa/percaya/mengetahui bahwa saya aktif berpartisipasi dalam pencapaian tujuan tim." },
{ num: 39, code: "Y", dimension: "Tanggung Jawab", indicator: "Keandalan dalam Menyelesaikan Tugas", text: "Saya merasa/percaya/mengetahui bahwa saya dapat diandalkan dalam menyelesaikan setiap tugas yang diberikan." },
{ num: 40, code: "Y", dimension: "Tanggung Jawab", indicator: "Dedikasi dan Akuntabilitas Pekerjaan", text: "Saya merasa/percaya/mengetahui bahwa saya memiliki dedikasi tinggi dan bertanggung jawab penuh atas pekerjaan saya." },
];

const submitSchema = z.object({
  name: z.string().min(1, "Nama lengkap wajib diisi"),
  department: z.string().min(1, "Bagian wajib diisi"),
  yearsWorked: z.string().min(1, "Lama bekerja wajib diisi"),
  answers: z.record(z.string(), z.number().min(1).max(5)),
});

async function generateExcelBuffer(
  submissions: Array<{
    id: number;
    name: string;
    department: string;
    yearsWorked: string;
    createdAt: Date;
    answers: Record<string, number>;
  }>
) {
  const workbook = new ExcelJS.Workbook();
  const worksheet = workbook.addWorksheet("Data Kuesioner");

  const headers = [
    "No",
    "Nama",
    "Bagian",
    "Lama Bekerja",
    ...Array.from({ length: 48 }, (_, i) => `Q${i + 1}`),
  ];

  worksheet.addRow(headers);
  const headerRow = worksheet.getRow(1);
  headerRow.font = { bold: true, color: { argb: "FFFFFFFF" }, size: 11 };
  headerRow.fill = {
    type: "pattern",
    pattern: "solid",
    fgColor: { argb: "FF4472C4" },
  };
  headerRow.alignment = { horizontal: "center", vertical: "middle" };

  submissions.forEach((sub, idx) => {
    const rowData = [
      idx + 1,
      sub.name,
      sub.department,
      sub.yearsWorked,
      ...Array.from({ length: 48 }, (_, i) => sub.answers[`q${i + 1}`] ?? ""),
    ];
    const row = worksheet.addRow(rowData);
    row.alignment = { horizontal: "center", vertical: "middle" };
    row.getCell(2).alignment = { horizontal: "left", vertical: "middle" };
    row.getCell(3).alignment = { horizontal: "left", vertical: "middle" };
  });

  worksheet.columns.forEach((col, idx) => {
    if (idx === 0) col.width = 6;
    else if (idx === 1) col.width = 30;
    else if (idx === 2) col.width = 20;
    else if (idx === 3) col.width = 15;
    else col.width = 6;
  });

  for (let row = 1; row <= submissions.length + 1; row++) {
    for (let col = 1; col <= headers.length; col++) {
      const cell = worksheet.getCell(row, col);
      cell.border = {
        top: { style: "thin" },
        left: { style: "thin" },
        bottom: { style: "thin" },
        right: { style: "thin" },
      };
    }
  }

  worksheet.views = [{ state: "frozen", ySplit: 1 }];

  return await workbook.xlsx.writeBuffer();
}

async function sendEmailWithAttachment(buffer: ArrayBuffer, filename: string) {
  if (!env.resendApiKey) {
    console.warn("Resend API key not configured, skipping email");
    return { success: false, message: "Resend not configured" };
  }

  const resend = new Resend(env.resendApiKey);

  const { error } = await resend.emails.send({
    from: "Kuesioner Penelitian <onboarding@resend.dev>",
    to: env.smtpToEmail,
    subject: "Hasil Kuesioner Penelitian",
    html: `<p>Terlampir hasil kuesioner terbaru.</p><p>Dikirim: ${new Date().toLocaleString("id-ID")}</p>`,
    attachments: [
      {
        filename,
        content: Buffer.from(buffer as ArrayBufferLike),
      },
    ],
  });

  if (error) {
    console.error("Resend error:", error);
    return { success: false, message: error.message };
  }

  return { success: true };
}

export const kuesionerRouter = createRouter({
  questions: publicQuery.query(() => {
    return questions;
  }),

  submit: publicQuery
    .input(submitSchema)
    .mutation(async ({ input }) => {
      const db = getDb();

      // Insert respondent
      const [{ id: respondentId }] = await db
        .insert(respondents)
        .values({
          name: input.name,
          department: input.department,
          yearsWorked: input.yearsWorked,
        })
        .$returningId();

      // Insert answers
      const answerValues = Object.entries(input.answers).map(([key, value]) => ({
        respondentId,
        questionNumber: parseInt(key.replace("q", "")),
        answerValue: value,
      }));

      if (answerValues.length > 0) {
        await db.insert(answers).values(answerValues);
      }

      // Generate Excel + kirim email di background (tidak block response)
      (async () => {
        try {
          const allRespondents = await db
            .select()
            .from(respondents)
            .orderBy(respondents.id);
          const allAnswers = await db.select().from(answers);

          const submissions = allRespondents.map((r) => {
            const rAnswers = allAnswers.filter((a) => a.respondentId === r.id);
            const answerMap: Record<string, number> = {};
            rAnswers.forEach((a) => {
              answerMap[`q${a.questionNumber}`] = a.answerValue;
            });
            return {
              id: r.id,
              name: r.name,
              department: r.department,
              yearsWorked: r.yearsWorked,
              createdAt: r.createdAt,
              answers: answerMap,
            };
          });

          const excelBuffer = await generateExcelBuffer(submissions);
          const filename = `Kuesioner_Penelitian_${new Date().toISOString().split("T")[0]}.xlsx`;
          const result = await sendEmailWithAttachment(excelBuffer as ArrayBuffer, filename);
          console.log("Email result:", result);
        } catch (err) {
          console.error("Background email error:", err);
        }
      })();

      return {
        success: true,
        respondentId,
        emailSent: true,
        emailMessage: "Data tersimpan, email sedang dikirim",
      };
    }),

  list: publicQuery.query(async () => {
    const db = getDb();
    const allRespondents = await db
      .select()
      .from(respondents)
      .orderBy(respondents.id);
    const allAnswers = await db.select().from(answers);

    return allRespondents.map((r) => {
      const rAnswers = allAnswers.filter((a) => a.respondentId === r.id);
      const answerMap: Record<string, number> = {};
      rAnswers.forEach((a) => {
        answerMap[`q${a.questionNumber}`] = a.answerValue;
      });
      return {
        id: r.id,
        name: r.name,
        department: r.department,
        yearsWorked: r.yearsWorked,
        createdAt: r.createdAt,
        answers: answerMap,
      };
    });
  }),

  export: publicQuery.query(async () => {
    const db = getDb();
    const allRespondents = await db
      .select()
      .from(respondents)
      .orderBy(respondents.id);
    const allAnswers = await db.select().from(answers);

    const submissions = allRespondents.map((r) => {
      const rAnswers = allAnswers.filter((a) => a.respondentId === r.id);
      const answerMap: Record<string, number> = {};
      rAnswers.forEach((a) => {
        answerMap[`q${a.questionNumber}`] = a.answerValue;
      });
      return {
        id: r.id,
        name: r.name,
        department: r.department,
        yearsWorked: r.yearsWorked,
        createdAt: r.createdAt,
        answers: answerMap,
      };
    });

    const excelBuffer = await generateExcelBuffer(submissions);
    const base64 = Buffer.from(excelBuffer as ArrayBuffer).toString("base64");

    return {
      data: base64,
      filename: `Kuesioner_Penelitian_${new Date().toISOString().split("T")[0]}.xlsx`,
      count: submissions.length,
    };
  }),
});