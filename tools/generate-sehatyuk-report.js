const fs = require("fs");
const path = require("path");
const {
  AlignmentType,
  BorderStyle,
  Document,
  Footer,
  HeadingLevel,
  ImageRun,
  Packer,
  PageBreak,
  PageNumber,
  Paragraph,
  ShadingType,
  Table,
  TableCell,
  TableLayoutType,
  TableRow,
  TextRun,
  VerticalAlign,
  WidthType,
} = require("docx");

const outputPath = "C:\\Users\\Lenovo\\Downloads\\Laporan_SehatYuk_TugasMobileFunction_Rapi_APA.docx";
const imagePaths = [
  "C:\\Users\\Lenovo\\AppData\\Local\\Temp\\codex-clipboard-0269f2ae-61d9-42e3-bc03-7055440284e0.png",
  "C:\\Users\\Lenovo\\AppData\\Local\\Temp\\codex-clipboard-1cfb4bec-eeb2-4dd8-ab4c-60889e12bb45.png",
  "C:\\Users\\Lenovo\\AppData\\Local\\Temp\\codex-clipboard-46bd66b7-a05d-4f16-b7fe-bb401f005ecc.png",
];

const cm = (value) => Math.round(value * 567);
const pt = (value) => value * 2;

const page = {
  width: 11906,
  height: 16838,
  margin: {
    top: cm(3),
    bottom: cm(3),
    left: cm(4),
    right: cm(3),
  },
};

const borders = {
  top: { style: BorderStyle.SINGLE, size: 4, color: "9DB9AE" },
  bottom: { style: BorderStyle.SINGLE, size: 4, color: "9DB9AE" },
  left: { style: BorderStyle.SINGLE, size: 4, color: "9DB9AE" },
  right: { style: BorderStyle.SINGLE, size: 4, color: "9DB9AE" },
  insideHorizontal: { style: BorderStyle.SINGLE, size: 4, color: "9DB9AE" },
  insideVertical: { style: BorderStyle.SINGLE, size: 4, color: "9DB9AE" },
};

const noBorders = {
  top: { style: BorderStyle.NONE, size: 0, color: "FFFFFF" },
  bottom: { style: BorderStyle.NONE, size: 0, color: "FFFFFF" },
  left: { style: BorderStyle.NONE, size: 0, color: "FFFFFF" },
  right: { style: BorderStyle.NONE, size: 0, color: "FFFFFF" },
  insideHorizontal: { style: BorderStyle.NONE, size: 0, color: "FFFFFF" },
  insideVertical: { style: BorderStyle.NONE, size: 0, color: "FFFFFF" },
};

function textRun(text, options = {}) {
  return new TextRun({
    text,
    font: options.font || "Times New Roman",
    size: pt(options.size || 12),
    bold: options.bold || false,
    italics: options.italics || false,
    color: options.color || "000000",
    break: options.break || 0,
  });
}

function paragraph(text, options = {}) {
  return new Paragraph({
    children: [textRun(text, options)],
    alignment: options.alignment || AlignmentType.JUSTIFIED,
    spacing: {
      before: options.before ?? 0,
      after: options.after ?? 120,
      line: options.line ?? 360,
    },
    indent: options.indent === false ? undefined : { firstLine: options.firstLine ?? cm(0.75) },
    keepNext: options.keepNext || false,
  });
}

function center(text, options = {}) {
  return paragraph(text, {
    ...options,
    alignment: AlignmentType.CENTER,
    indent: false,
    after: options.after ?? 160,
  });
}

function heading1(text) {
  return new Paragraph({
    text,
    heading: HeadingLevel.HEADING_1,
    alignment: AlignmentType.CENTER,
    spacing: { before: 240, after: 160 },
    keepNext: true,
  });
}

function heading2(text) {
  return new Paragraph({
    children: [textRun(text, { bold: true, size: 12 })],
    alignment: AlignmentType.LEFT,
    spacing: { before: 160, after: 80 },
    keepNext: true,
  });
}

function plainLine(text, options = {}) {
  return new Paragraph({
    children: [textRun(text, options)],
    alignment: options.alignment || AlignmentType.LEFT,
    spacing: { before: 0, after: options.after ?? 60, line: 300 },
    indent: options.indent ? { left: options.indent } : undefined,
  });
}

function numbered(items) {
  return items.map((item, index) =>
    new Paragraph({
      children: [
        textRun(`${index + 1}. `, { size: 12 }),
        textRun(item, { size: 12 }),
      ],
      alignment: AlignmentType.JUSTIFIED,
      spacing: { before: 0, after: 60, line: 330 },
      indent: { left: cm(0.75), hanging: cm(0.45) },
    })
  );
}

function reference(text) {
  return new Paragraph({
    children: [textRun(text, { size: 12 })],
    alignment: AlignmentType.JUSTIFIED,
    spacing: { before: 0, after: 120, line: 360 },
    indent: { left: cm(1), hanging: cm(1) },
  });
}

function codeBlock(code) {
  return new Paragraph({
    children: [
      new TextRun({
        text: code,
        font: "Consolas",
        size: pt(8.5),
      }),
    ],
    spacing: { before: 40, after: 120, line: 260 },
    shading: { type: ShadingType.CLEAR, fill: "F4F7F6" },
    border: {
      top: { color: "C8D8D2", space: 1, style: BorderStyle.SINGLE, size: 4 },
      bottom: { color: "C8D8D2", space: 1, style: BorderStyle.SINGLE, size: 4 },
      left: { color: "C8D8D2", space: 1, style: BorderStyle.SINGLE, size: 4 },
      right: { color: "C8D8D2", space: 1, style: BorderStyle.SINGLE, size: 4 },
    },
  });
}

function cell(content, width, options = {}) {
  const children = Array.isArray(content)
    ? content
    : [
        new Paragraph({
          children: [textRun(content, { size: options.size || 10, bold: options.bold })],
          alignment: options.alignment || AlignmentType.LEFT,
          spacing: { before: 0, after: 40, line: 280 },
        }),
      ];

  return new TableCell({
    width: { size: width, type: WidthType.DXA },
    margins: { top: 90, bottom: 90, left: 90, right: 90 },
    verticalAlign: VerticalAlign.TOP,
    shading: options.fill ? { type: ShadingType.CLEAR, fill: options.fill } : undefined,
    children,
  });
}

function table(headers, rows, widths) {
  return new Table({
    width: { size: cm(14), type: WidthType.DXA },
    layout: TableLayoutType.FIXED,
    alignment: WD_TABLE_ALIGNMENT_CENTER,
    borders,
    rows: [
      new TableRow({
        tableHeader: true,
        children: headers.map((header, index) =>
          cell(header, widths[index], { bold: true, fill: "EAF4EF", size: 10 })
        ),
      }),
      ...rows.map(
        (row) =>
          new TableRow({
            children: row.map((value, index) => cell(value, widths[index], { size: 10 })),
          })
      ),
    ],
  });
}

const WD_TABLE_ALIGNMENT_CENTER = AlignmentType.CENTER;

function tocTable(rows) {
  return new Table({
    width: { size: cm(11), type: WidthType.DXA },
    alignment: AlignmentType.CENTER,
    borders: noBorders,
    rows: rows.map(
      ([title, pageNo]) =>
        new TableRow({
          children: [
            cell(title, cm(9.5), { size: 12 }),
            cell(pageNo, cm(1.5), { size: 12, alignment: AlignmentType.RIGHT }),
          ],
        })
    ),
  });
}

function imageParagraph(imagePath, widthPx, heightPx) {
  if (!fs.existsSync(imagePath)) {
    return new Paragraph({
      children: [textRun("[Placeholder gambar]", { italics: true, size: 10 })],
      alignment: AlignmentType.CENTER,
      spacing: { after: 80 },
    });
  }
  return new Paragraph({
    children: [
      new ImageRun({
        data: fs.readFileSync(imagePath),
        type: "png",
        transformation: { width: widthPx, height: heightPx },
      }),
    ],
    alignment: AlignmentType.CENTER,
    spacing: { after: 80 },
  });
}

function imageWithCaption(imagePath, caption) {
  return [
    imageParagraph(imagePath, 185, 350),
    new Paragraph({
      children: [textRun(caption, { italics: true, size: 10 })],
      alignment: AlignmentType.CENTER,
      spacing: { after: 120, line: 260 },
    }),
  ];
}

const children = [];

children.push(
  center("LAPORAN TUGAS AKHIR", { bold: true, size: 14, after: 160 }),
  center("PROGRAM BERBASISKAN MOBILE", { bold: true, size: 14, after: 160 }),
  center("Studi Kasus: Membuat Aplikasi Android SehatYuk Menggunakan Function Kotlin", {
    bold: true,
    size: 12,
    after: 500,
  }),
  center("Disusun untuk memenuhi tugas pembuatan aplikasi Android sederhana dengan penerapan function, validasi input, perhitungan BMI, dan perhitungan BMR.", {
    size: 12,
    after: 900,
  }),
  center("Disusun oleh:", { size: 12, after: 80 }),
  center("Nama  : [Nama Lengkap]", { size: 12, after: 60 }),
  center("NIM   : [NIM]", { size: 12, after: 60 }),
  center("Kelas : [Kelas]", { size: 12, after: 900 }),
  center("PROGRAM STUDI [Nama Program Studi]", { bold: true, size: 12, after: 60 }),
  center("[Nama Kampus/Universitas]", { bold: true, size: 12, after: 60 }),
  center("2026", { bold: true, size: 12, after: 60 }),
  new Paragraph({ children: [new PageBreak()] })
);

children.push(
  heading1("RINGKASAN"),
  paragraph("Aplikasi SehatYuk merupakan prototipe Android berbasis Kotlin yang membantu pengguna memantau dua indikator kesehatan dasar, yaitu Body Mass Index (BMI) dan Basal Metabolic Rate (BMR). Aplikasi dibuat dengan konsep Single Activity dan menggunakan layout XML agar sesuai dengan rubrik penilaian yang mensyaratkan komponen EditText, Button, dan TextView. Logika utama tidak ditumpuk di dalam onCreate, melainkan dipisahkan ke dalam function modular seperti validateInput, calculateBMI, dan calculateBMR."),
  paragraph("Laporan ini menjelaskan latar belakang, kebutuhan sistem, rancangan UI, struktur kode, implementasi function, validasi input, pengujian matematis, serta dokumentasi tampilan aplikasi. Hasil implementasi menunjukkan bahwa aplikasi dapat menerima data nama, berat badan, tinggi badan, dan umur, kemudian menampilkan hasil BMI atau BMR secara dinamis tanpa menyebabkan crash saat input kosong."),
  paragraph("Kata kunci: Android, Kotlin, XML Layout, Function, BMI, BMR, Validasi Input.", {
    italics: true,
    indent: false,
  }),
  heading1("DAFTAR ISI"),
  tocTable([
    ["Ringkasan", "2"],
    ["BAB I Pendahuluan", "2"],
    ["BAB II Analisis Kebutuhan", "3"],
    ["BAB III Perancangan Sistem", "4"],
    ["BAB IV Implementasi Program", "5"],
    ["BAB V Pengujian dan Hasil", "7"],
    ["BAB VI Penutup", "9"],
    ["Lampiran", "9"],
  ])
);

children.push(
  heading1("BAB I PENDAHULUAN"),
  heading2("1.1 Latar Belakang"),
  paragraph("Perkembangan layanan kesehatan digital mendorong kebutuhan aplikasi yang sederhana, mudah digunakan, dan mampu memberikan informasi dasar kepada pengguna. Klinik kesehatan digital SehatYuk dirancang sebagai prototipe aplikasi Android untuk membantu masyarakat melakukan pemantauan awal terhadap kondisi tubuh secara mandiri. Dua parameter yang digunakan adalah BMI untuk melihat status berat badan relatif terhadap tinggi badan, serta BMR untuk memperkirakan kebutuhan energi basal harian."),
  paragraph("Dalam pengembangan aplikasi mobile, struktur kode yang rapi menjadi aspek penting. Logika validasi dan kalkulasi sebaiknya tidak ditumpuk di dalam onCreate karena dapat membuat program sulit dibaca, sulit diuji, dan berisiko mengalami duplikasi kode. Oleh karena itu, aplikasi ini menerapkan function Kotlin yang modular untuk memisahkan tanggung jawab setiap bagian program."),
  heading2("1.2 Rumusan Masalah"),
  ...numbered([
    "Bagaimana merancang aplikasi Android Single Activity untuk menghitung BMI dan BMR?",
    "Bagaimana menerapkan minimal tiga function wajib di luar onCreate?",
    "Bagaimana mencegah crash ketika tombol kalkulasi ditekan pada kondisi input kosong?",
    "Bagaimana memastikan hasil perhitungan BMI dan BMR akurat secara matematis?",
  ]),
  heading2("1.3 Tujuan"),
  ...numbered([
    "Membangun prototipe aplikasi Android SehatYuk dengan Kotlin dan XML Layout.",
    "Menerapkan function validateInput, calculateBMI, dan calculateBMR secara modular.",
    "Menampilkan hasil kalkulasi pada TextView secara dinamis beserta interpretasi kategori.",
    "Menyediakan validasi input agar aplikasi tidak mengalami force close.",
  ])
);

children.push(
  heading1("BAB II ANALISIS KEBUTUHAN"),
  heading2("2.1 Kebutuhan Fungsional"),
  table(
    ["No", "Kebutuhan", "Implementasi"],
    [
      ["1", "Input nama pengguna", "EditText dengan id nameEditText dan inputType textPersonName."],
      ["2", "Input berat badan dalam kg", "EditText dengan id weightEditText dan inputType numberDecimal."],
      ["3", "Input tinggi badan dalam cm", "EditText dengan id heightEditText dan inputType numberDecimal."],
      ["4", "Input umur dalam tahun", "EditText dengan id ageEditText dan inputType number."],
      ["5", "Tombol Hitung BMI dan BMR", "Button calculateBmiButton dan calculateBmrButton."],
      ["6", "Output hasil", "TextView resultTitleTextView, resultSummaryTextView, resultValueTextView, resultCategoryTextView, dan resultInsightTextView."],
    ],
    [cm(1.0), cm(4.0), cm(9.0)]
  ),
  heading2("2.2 Kebutuhan Nonfungsional"),
  ...numbered([
    "Maintainability: logika program dipisahkan ke beberapa function agar mudah dirawat.",
    "Reliability: validasi input mencegah crash akibat nilai kosong atau format angka tidak valid.",
    "Usability: tampilan dibuat modern, ringkas, dan mudah dipahami pada layar ponsel.",
    "Compatibility: aplikasi menggunakan Android Studio, Kotlin, Single Activity, dan XML Layout.",
  ]),
  heading2("2.3 Kesesuaian dengan Rubrik Penilaian"),
  table(
    ["Komponen Penilaian", "Bobot", "Bukti Pemenuhan"],
    [
      ["Desain Layout UI (XML)", "20%", "activity_main.xml memakai EditText, Button, TextView, ID camelCase, dan komponen tidak melewati area layar."],
      ["Penerapan Deklarasi Fungsi", "40%", "validateInput, calculateBMI, dan calculateBMR dideklarasikan di luar onCreate dengan parameter jelas."],
      ["Validasi & Penanganan Crash", "20%", "readInputOrReport memeriksa input kosong, angka invalid, dan nilai <= 0 sebelum kalkulasi."],
      ["Akurasi Output Matematis", "20%", "Unit test memverifikasi kategori BMI dan formula BMR Mifflin-St Jeor."],
    ],
    [cm(4.0), cm(1.6), cm(8.4)]
  )
);

children.push(
  heading1("BAB III PERANCANGAN SISTEM"),
  heading2("3.1 Arsitektur Aplikasi"),
  paragraph("Aplikasi menggunakan konsep Single Activity. MainActivity bertugas memuat activity_main.xml, menghubungkan view melalui findViewById, memasang listener pada tombol, dan menampilkan hasil. Logika inti perhitungan tetap berada pada function terpisah sehingga alur program lebih mudah dibaca dan tidak menumpuk di onCreate."),
  table(
    ["Lapisan", "Tanggung Jawab"],
    [
      ["Layout XML", "Mendefinisikan struktur UI: ScrollView, LinearLayout, EditText, Button, TextView, dan ProgressBar."],
      ["MainActivity", "Menghubungkan komponen UI, menangani klik tombol, menjalankan validasi, dan mengubah isi TextView."],
      ["Function Kalkulasi", "Memproses validasi, BMI, kategori BMI, dan BMR agar logika dapat diuji."],
      ["Unit Test", "Memastikan output function sesuai rumus dan kategori yang ditentukan."],
    ],
    [cm(4), cm(10)]
  ),
  heading2("3.2 Rancangan Antarmuka"),
  paragraph("UI dibuat dengan gaya klinik digital modern menggunakan warna hijau klinis, latar lembut, card putih untuk form, dan card gelap untuk hasil. Seluruh teks pada aplikasi menggunakan font Plus Jakarta Sans yang dibundel pada folder res/font. Desain ini tetap mematuhi instruksi XML karena komponen input dan output menggunakan EditText, Button, dan TextView."),
  table(
    ["Elemen UI", "ID Komponen", "Fungsi"],
    [
      ["Nama", "nameEditText", "Menerima nama pengguna."],
      ["Berat badan", "weightEditText", "Menerima berat badan dalam kilogram."],
      ["Tinggi badan", "heightEditText", "Menerima tinggi badan dalam sentimeter."],
      ["Umur", "ageEditText", "Menerima umur dalam tahun."],
      ["Hitung BMI", "calculateBmiButton", "Memanggil validasi dan function calculateBMI."],
      ["Hitung BMR", "calculateBmrButton", "Memanggil validasi dan function calculateBMR."],
      ["Hasil", "resultValueTextView dan resultCategoryTextView", "Menampilkan nilai dan interpretasi hasil."],
    ],
    [cm(3), cm(4.5), cm(6.5)]
  )
);

children.push(
  heading1("BAB IV IMPLEMENTASI PROGRAM"),
  heading2("4.1 Implementasi Layout XML"),
  paragraph("Layout utama dibuat pada file activity_main.xml. Struktur root menggunakan ScrollView agar seluruh konten tetap dapat diakses pada layar kecil. Komponen form memakai EditText dengan tipe input yang sesuai, yaitu textPersonName untuk nama, numberDecimal untuk berat dan tinggi, serta number untuk umur. Tombol kalkulasi dibuat menggunakan Button, sedangkan seluruh hasil perhitungan ditampilkan melalui TextView."),
  heading2("4.2 Implementasi Function Validasi Input"),
  paragraph("Function validateInput bertugas memastikan seluruh field wajib tidak kosong sebelum proses perhitungan dijalankan. Function ini mengembalikan Boolean sehingga mudah digunakan pada kondisi if."),
  codeBlock(`fun validateInput(name: String, weight: String, height: String, age: String): Boolean {
    return name.isNotBlank() && weight.isNotBlank() && height.isNotBlank() && age.isNotBlank()
}`),
  heading2("4.3 Implementasi Function Perhitungan BMI"),
  paragraph("BMI dihitung dengan rumus berat badan dibagi kuadrat tinggi badan dalam meter. Setelah nilai BMI diperoleh, hasil dikategorikan menjadi Kurus, Normal, atau Kelebihan Berat Badan."),
  codeBlock(`fun calculateBMI(weight: Double, height: Double): String {
    val heightInMeters = height / 100
    val bmi = weight / (heightInMeters * heightInMeters)
    val category = bmiCategory(bmi)
    return "BMI Anda: \${formatDecimal(bmi)} ($category)"
}`),
  heading2("4.4 Implementasi Function Perhitungan BMR"),
  paragraph("BMR dihitung menggunakan formula Mifflin-St Jeor versi standar pria sesuai instruksi soal. Function mengembalikan nilai Double murni agar hasil dapat diformat sesuai kebutuhan tampilan."),
  codeBlock(`fun calculateBMR(weight: Double, height: Double, age: Int): Double {
    return (10 * weight) + (6.25 * height) - (5 * age) + 5
}`),
  heading2("4.5 Pemanggilan Function dari Tombol"),
  paragraph("Tombol Hitung BMI dan Hitung BMR sama-sama memanggil readInputOrReport terlebih dahulu. Jika input tidak valid, function tersebut mengembalikan null sehingga proses kalkulasi dihentikan. Jika input valid, program baru memanggil calculateBMI atau calculateBMR, kemudian menampilkan hasil ke TextView.")
);

children.push(
  heading1("BAB V PENGUJIAN DAN HASIL"),
  heading2("5.1 Skenario Pengujian"),
  table(
    ["No", "Skenario", "Input", "Hasil yang Diharapkan"],
    [
      ["1", "Validasi field kosong", "Salah satu field kosong", "Aplikasi menampilkan pesan validasi dan tidak crash."],
      ["2", "Hitung BMI normal", "Berat 70, tinggi 170", "BMI 24.2 dengan kategori Normal."],
      ["3", "Hitung BMI kurus", "Berat 50, tinggi 170", "BMI 17.3 dengan kategori Kurus."],
      ["4", "Hitung BMI kelebihan berat", "Berat 80, tinggi 170", "BMI 27.7 dengan kategori Kelebihan Berat Badan."],
      ["5", "Hitung BMR", "Berat 70, tinggi 170, umur 20", "BMR 1667.5 kkal/hari."],
    ],
    [cm(1), cm(3.2), cm(3), cm(6.8)]
  ),
  heading2("5.2 Hasil Unit Test"),
  paragraph("Pengujian function dilakukan melalui HealthFunctionTest. Test memeriksa validateInput, kategori BMI, dan formula BMR. Berdasarkan proses build terakhir, perintah Gradle testDebugUnitTest berhasil dijalankan dan seluruh pengujian lulus."),
  heading2("5.3 Hasil Tampilan Aplikasi"),
  paragraph("Berikut dokumentasi tampilan aplikasi dari perangkat Android. Gambar pertama menunjukkan form input, gambar kedua menunjukkan hasil BMI, dan gambar ketiga menunjukkan hasil BMR."),
  ...imageWithCaption(imagePaths[0], "Gambar 1. Tampilan form input pengguna"),
  ...imageWithCaption(imagePaths[1], "Gambar 2. Tampilan hasil perhitungan BMI"),
  ...imageWithCaption(imagePaths[2], "Gambar 3. Tampilan hasil perhitungan BMR")
);

children.push(
  heading1("BAB VI PENUTUP"),
  heading2("6.1 Kesimpulan"),
  paragraph("Aplikasi SehatYuk berhasil dibuat sebagai prototipe Android Single Activity menggunakan Kotlin dan XML Layout. Aplikasi memenuhi instruksi utama karena menyediakan form input nama, berat badan, tinggi badan, dan umur; tombol Hitung BMI dan Hitung BMR; serta area hasil yang menampilkan nilai dan interpretasi secara dinamis. Logika perhitungan dipisahkan ke dalam function sehingga struktur program lebih rapi dan mudah diuji."),
  paragraph("Validasi input juga telah diterapkan untuk mencegah force close saat tombol ditekan dalam kondisi data kosong atau tidak valid. Dari sisi akurasi, function BMI dan BMR telah diuji melalui unit test sehingga output matematis dapat dipertanggungjawabkan."),
  heading2("6.2 Saran"),
  ...numbered([
    "Menambahkan pilihan jenis kelamin agar formula BMR dapat menyesuaikan pengguna pria dan wanita.",
    "Menambahkan penyimpanan riwayat hasil pemeriksaan menggunakan database lokal.",
    "Menambahkan rekomendasi aktivitas atau pola makan berdasarkan kategori BMI dan nilai BMR.",
  ]),
  heading1("DAFTAR PUSTAKA"),
  reference("Android Developers. (n.d.). Basic Android Kotlin Compose: Functions. Android Developers. Diakses pada 24 Juni 2026, dari https://developer.android.com/codelabs/basic-android-kotlin-compose-functions?hl=id"),
  reference("Google Fonts. (n.d.). Plus Jakarta Sans. Google Fonts. Diakses pada 24 Juni 2026, dari https://fonts.google.com/specimen/Plus+Jakarta+Sans"),
  reference("Mifflin, M. D., St Jeor, S. T., Hill, L. A., Scott, B. J., Daugherty, S. A., & Koh, Y. O. (1990). A new predictive equation for resting energy expenditure in healthy individuals. The American Journal of Clinical Nutrition, 51(2), 241-247. https://doi.org/10.1093/ajcn/51.2.241"),
  heading1("LAMPIRAN"),
  paragraph("Lampiran berisi screenshot tampilan aplikasi dan bukti pengujian yang dapat dilengkapi kembali secara manual apabila diperlukan oleh dosen pengampu. Placeholder identitas pada cover juga dapat diganti dengan NIM, nama lengkap, kelas, dan nama kampus yang sesuai.")
);

const doc = new Document({
  styles: {
    default: {
      document: {
        run: { font: "Times New Roman", size: pt(12) },
        paragraph: {
          alignment: AlignmentType.JUSTIFIED,
          spacing: { line: 360, after: 120 },
        },
      },
    },
    paragraphStyles: [
      {
        id: "Heading1",
        name: "Heading 1",
        basedOn: "Normal",
        next: "Normal",
        quickFormat: true,
        run: { bold: true, size: pt(12), font: "Times New Roman" },
        paragraph: { alignment: AlignmentType.CENTER, spacing: { before: 240, after: 160 } },
      },
      {
        id: "Heading2",
        name: "Heading 2",
        basedOn: "Normal",
        next: "Normal",
        quickFormat: true,
        run: { bold: true, size: pt(12), font: "Times New Roman" },
        paragraph: { spacing: { before: 160, after: 80 } },
      },
    ],
  },
  sections: [
    {
      properties: {
        page: {
          size: { width: page.width, height: page.height },
          margin: page.margin,
        },
      },
      footers: {
        default: new Footer({
          children: [
            new Paragraph({
              alignment: AlignmentType.CENTER,
              children: [textRun("", { size: 10 }), new TextRun({ children: [PageNumber.CURRENT], size: pt(10) })],
            }),
          ],
        }),
      },
      children,
    },
  ],
});

fs.mkdirSync(path.dirname(outputPath), { recursive: true });
Packer.toBuffer(doc).then((buffer) => {
  fs.writeFileSync(outputPath, buffer);
  console.log(outputPath);
});
