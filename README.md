# SehatYuk - Aplikasi Android BMI dan BMR Berbasis Function Kotlin

SehatYuk adalah prototipe aplikasi Android sederhana untuk membantu pengguna memantau indikator kesehatan dasar secara mandiri. Aplikasi ini dibuat untuk studi kasus **Program Berbasiskan Mobile** dengan fokus utama pada penerapan **function Kotlin** yang modular, validasi input, dan perhitungan matematis BMI serta BMR.

Project ini menggunakan **Kotlin**, **Single Activity**, dan **XML Layout** agar sesuai dengan rubrik tugas yang mensyaratkan penggunaan `EditText`, `Button`, dan `TextView`.

## Latar Belakang

Sebuah klinik kesehatan digital bernama **SehatYuk** ingin meluncurkan aplikasi Android sederhana untuk membantu masyarakat menghitung dua indikator kesehatan dasar:

1. **BMI (Body Mass Index)**  
   Digunakan untuk memperkirakan status berat badan berdasarkan berat dan tinggi badan.

2. **BMR (Basal Metabolic Rate)**  
   Digunakan untuk memperkirakan kebutuhan energi basal harian tubuh.

Sebagai Mobile Developer, aplikasi ini dibuat dengan arsitektur kode yang rapi. Logika validasi dan kalkulasi tidak ditumpuk di dalam `onCreate`, melainkan dipisahkan ke function khusus agar mudah dibaca, diuji, dan dirawat.

## Fitur Utama

- Input nama pengguna.
- Input berat badan dalam kilogram.
- Input tinggi badan dalam sentimeter.
- Input umur dalam tahun.
- Tombol **Hitung BMI**.
- Tombol **Hitung BMR**.
- Tombol **Reset form**.
- Validasi input kosong.
- Validasi angka tidak valid.
- Validasi nilai berat, tinggi, dan umur harus lebih dari 0.
- Output hasil perhitungan dalam `TextView`.
- Interpretasi kategori BMI.
- Tampilan UI modern dengan XML Layout.
- Font lokal **Plus Jakarta Sans**.
- Animasi sederhana pada kartu hasil dan progress bar.
- Unit test untuk validasi, BMI, kategori BMI, dan BMR.

## Teknologi yang Digunakan

| Teknologi | Keterangan |
| --- | --- |
| Kotlin | Bahasa utama aplikasi |
| Android Studio | IDE pengembangan |
| XML Layout | Struktur UI utama |
| Android View System | `EditText`, `Button`, `TextView`, `ProgressBar` |
| JUnit | Unit testing function |
| Gradle Kotlin DSL | Konfigurasi build |
| Plus Jakarta Sans | Font lokal aplikasi |

## Struktur Project

```text
UASPBMA/
├── app/
│   ├── src/
│   │   ├── main/
│   │   │   ├── java/com/example/uas_pbm_a/
│   │   │   │   └── MainActivity.kt
│   │   │   ├── res/
│   │   │   │   ├── drawable/
│   │   │   │   ├── font/
│   │   │   │   ├── layout/
│   │   │   │   │   └── activity_main.xml
│   │   │   │   ├── values/
│   │   │   │   └── xml/
│   │   │   └── AndroidManifest.xml
│   │   └── test/java/com/example/uas_pbm_a/
│   │       └── HealthFunctionTest.kt
│   └── build.gradle.kts
├── gradle/
│   └── libs.versions.toml
├── build.gradle.kts
├── settings.gradle.kts
└── README.md
```

## File Penting

| File | Fungsi |
| --- | --- |
| `MainActivity.kt` | Mengatur lifecycle activity, binding view, validasi input, event tombol, animasi hasil, dan function kalkulasi |
| `activity_main.xml` | Layout utama aplikasi berbasis XML |
| `HealthFunctionTest.kt` | Unit test untuk function validasi, BMI, dan BMR |
| `res/drawable/` | Background, card, button, input, warning, dan progress drawable |
| `res/font/` | File font Plus Jakarta Sans |
| `strings.xml` | Nama aplikasi |
| `libs.versions.toml` | Versi dependency Android dan test |

## Desain UI

UI aplikasi dibuat dengan konsep klinik digital modern:

- Warna utama hijau klinis.
- Latar lembut dengan gradient.
- Form input dalam card putih.
- Hasil perhitungan dalam card gelap agar kontras.
- Tombol utama solid untuk BMI.
- Tombol sekunder outline untuk BMR.
- Label dan field menggunakan ID camelCase sesuai rubrik.
- Font menggunakan **Plus Jakarta Sans**, bukan font bawaan template.

Komponen utama di `activity_main.xml`:

| Komponen | ID | Fungsi |
| --- | --- | --- |
| `EditText` | `nameEditText` | Input nama pengguna |
| `EditText` | `weightEditText` | Input berat badan |
| `EditText` | `heightEditText` | Input tinggi badan |
| `EditText` | `ageEditText` | Input umur |
| `Button` | `calculateBmiButton` | Menjalankan perhitungan BMI |
| `Button` | `calculateBmrButton` | Menjalankan perhitungan BMR |
| `Button` | `resetButton` | Mengosongkan form dan hasil |
| `TextView` | `resultTitleTextView` | Judul hasil perhitungan |
| `TextView` | `resultSummaryTextView` | Ringkasan hasil |
| `TextView` | `resultValueTextView` | Nilai utama hasil |
| `TextView` | `resultCategoryTextView` | Kategori atau label hasil |
| `TextView` | `resultInsightTextView` | Interpretasi hasil |
| `ProgressBar` | `healthProgressBar` | Indikator visual hasil |

## Function Wajib

Sesuai instruksi tugas, aplikasi memiliki minimal 3 function utama di luar `onCreate`.

### 1. Function Validasi Input

```kotlin
fun validateInput(name: String, weight: String, height: String, age: String): Boolean {
    return name.isNotBlank() && weight.isNotBlank() && height.isNotBlank() && age.isNotBlank()
}
```

Function ini mengembalikan:

- `true` jika semua input sudah terisi.
- `false` jika salah satu input masih kosong.

Function ini digunakan sebelum proses kalkulasi agar aplikasi tidak crash ketika tombol ditekan saat form belum lengkap.

### 2. Function Perhitungan BMI

```kotlin
fun calculateBMI(weight: Double, height: Double): String {
    val heightInMeters = height / 100
    val bmi = weight / (heightInMeters * heightInMeters)
    val category = bmiCategory(bmi)
    return "BMI Anda: ${formatDecimal(bmi)} ($category)"
}
```

Rumus BMI:

```text
BMI = Berat Badan (kg) / (Tinggi Badan (cm) / 100)^2
```

Kategori BMI:

| Nilai BMI | Kategori |
| --- | --- |
| `< 18.5` | Kurus |
| `18.5 - 24.9` | Normal |
| `>= 25` | Kelebihan Berat Badan |

Contoh output:

```text
BMI Anda: 21.7 (Normal)
```

### 3. Function Perhitungan BMR

```kotlin
fun calculateBMR(weight: Double, height: Double, age: Int): Double {
    return (10 * weight) + (6.25 * height) - (5 * age) + 5
}
```

Rumus BMR yang digunakan adalah formula Mifflin-St Jeor versi standar pria:

```text
BMR = (10 x Berat) + (6.25 x Tinggi) - (5 x Umur) + 5
```

Contoh:

```text
Berat = 59 kg
Tinggi = 165 cm
Umur = 21 tahun

BMR = (10 x 59) + (6.25 x 165) - (5 x 21) + 5
BMR = 1521.25
```

Output pada aplikasi dibulatkan menjadi:

```text
BMR Anda: 1521.3 kkal/hari
```

## Alur Program

1. Pengguna membuka aplikasi.
2. `MainActivity` memuat `activity_main.xml` melalui `setContentView`.
3. `bindViews()` menghubungkan komponen XML ke variabel Kotlin.
4. `setupActions()` memasang event listener pada tombol.
5. Saat tombol BMI atau BMR ditekan:
   - aplikasi mengambil nilai dari `EditText`,
   - menjalankan `validateInput`,
   - memvalidasi format angka,
   - memastikan nilai angka lebih dari 0,
   - memanggil `calculateBMI` atau `calculateBMR`,
   - menampilkan hasil ke `TextView`,
   - menjalankan animasi pada result card dan progress bar.
6. Jika input tidak valid, aplikasi menampilkan pesan validasi dan tidak melakukan kalkulasi.

## Validasi dan Penanganan Crash

Validasi dilakukan di function internal `readInputOrReport()`.

Kondisi yang ditangani:

- Nama kosong.
- Berat badan kosong.
- Tinggi badan kosong.
- Umur kosong.
- Berat, tinggi, atau umur bukan angka.
- Berat, tinggi, atau umur bernilai 0 atau negatif.

Jika validasi gagal:

- field kosong diberi error,
- background field berubah ke style error,
- pesan validasi muncul,
- kalkulasi dihentikan,
- aplikasi tidak force close.

Contoh pesan validasi:

```text
Lengkapi nama, berat badan, tinggi badan, dan umur sebelum menghitung.
```

```text
Pastikan berat, tinggi, dan umur diisi dengan angka yang valid.
```

```text
Nilai berat, tinggi, dan umur harus lebih dari 0.
```

## Contoh Perhitungan

### Contoh BMI

Input:

```text
Nama   = Muhammad Aidil Fitrah
Berat  = 59 kg
Tinggi = 165 cm
Umur   = 21 tahun
```

Perhitungan:

```text
BMI = 59 / (165 / 100)^2
BMI = 59 / 1.65^2
BMI = 59 / 2.7225
BMI = 21.67
```

Output:

```text
BMI Anda: 21.7 (Normal)
```

### Contoh BMR

Input:

```text
Berat  = 59 kg
Tinggi = 165 cm
Umur   = 21 tahun
```

Perhitungan:

```text
BMR = (10 x 59) + (6.25 x 165) - (5 x 21) + 5
BMR = 590 + 1031.25 - 105 + 5
BMR = 1521.25
```

Output:

```text
BMR Anda: 1521.3 kkal/hari
```

## Unit Testing

Unit test berada di:

```text
app/src/test/java/com/example/uas_pbm_a/HealthFunctionTest.kt
```

Skenario test:

| Test | Tujuan |
| --- | --- |
| `validateInput_returnsFalseWhenAnyFieldIsEmpty` | Memastikan validasi gagal jika ada field kosong |
| `validateInput_returnsTrueWhenAllFieldsAreFilled` | Memastikan validasi berhasil jika semua field terisi |
| `calculateBMI_returnsNormalCategoryForHealthyRange` | Memastikan BMI normal dihitung dan dikategorikan benar |
| `calculateBMI_returnsThinCategoryBelowEighteenPointFive` | Memastikan kategori Kurus benar |
| `calculateBMI_returnsOverweightCategoryAtTwentyFiveOrMore` | Memastikan kategori Kelebihan Berat Badan benar |
| `calculateBMR_usesMifflinStJeorMaleFormula` | Memastikan rumus BMR sesuai instruksi |

Menjalankan test:

```powershell
.\gradlew.bat testDebugUnitTest
```

Catatan environment:

Android Gradle Plugin pada project ini membutuhkan JDK 17 atau lebih baru. Jika terminal default masih memakai JDK 11, gunakan JDK bawaan Android Studio:

```powershell
$env:JAVA_HOME='C:\Program Files\Android\Android Studio\jbr'
$env:Path="$env:JAVA_HOME\bin;$env:Path"
.\gradlew.bat testDebugUnitTest
```

## Cara Menjalankan Aplikasi

### Melalui Android Studio

1. Buka project `UASPBMA` di Android Studio.
2. Pastikan device emulator atau HP fisik sudah terdeteksi.
3. Pilih konfigurasi `app`.
4. Klik tombol **Run**.
5. Aplikasi akan terinstall dan terbuka di device.

### Melalui Terminal

Build APK debug:

```powershell
$env:JAVA_HOME='C:\Program Files\Android\Android Studio\jbr'
$env:Path="$env:JAVA_HOME\bin;$env:Path"
.\gradlew.bat assembleDebug
```

Lokasi APK:

```text
app/build/outputs/apk/debug/app-debug.apk
```

## Cara Menggunakan Aplikasi

1. Isi nama pengguna.
2. Isi berat badan dalam kilogram.
3. Isi tinggi badan dalam sentimeter.
4. Isi umur dalam tahun.
5. Tekan **Hitung BMI** untuk menghitung indeks massa tubuh.
6. Tekan **Hitung BMR** untuk menghitung kebutuhan energi basal.
7. Lihat hasil pada kartu hasil di bagian bawah.
8. Tekan **Reset form** untuk mengosongkan seluruh input.

## Kesesuaian dengan Rubrik

| Komponen Penilaian | Bobot | Bukti Pemenuhan |
| --- | --- | --- |
| Desain Layout UI (XML) | 20% | `activity_main.xml` memakai `EditText`, `Button`, `TextView`, dan ID camelCase |
| Penerapan Deklarasi Fungsi | 40% | `validateInput`, `calculateBMI`, dan `calculateBMR` berada di luar `onCreate` |
| Validasi & Penanganan Crash | 20% | Input kosong/invalid ditangani sebelum parsing dan kalkulasi |
| Akurasi Output Matematis | 20% | Rumus BMI dan BMR sesuai instruksi serta diuji dengan unit test |

## Catatan Implementasi

- Project awal menggunakan template Android yang masih membawa dependency Compose.
- Implementasi final UI tugas ini memakai **XML Layout dan Android View System** agar sesuai rubrik.
- Dependency Compose tidak digunakan untuk tampilan utama aplikasi.
- Font Plus Jakarta Sans disimpan sebagai resource lokal di `res/font`.
- UI menggunakan drawable XML untuk background, input, button, warning, dan result card.

## Referensi

- Android Developers. Basic Android Kotlin Compose: Functions.  
  https://developer.android.com/codelabs/basic-android-kotlin-compose-functions?hl=id

- Google Fonts. Plus Jakarta Sans.  
  https://fonts.google.com/specimen/Plus+Jakarta+Sans

- Mifflin, M. D., St Jeor, S. T., Hill, L. A., Scott, B. J., Daugherty, S. A., & Koh, Y. O. (1990). A new predictive equation for resting energy expenditure in healthy individuals. *The American Journal of Clinical Nutrition, 51*(2), 241-247.

