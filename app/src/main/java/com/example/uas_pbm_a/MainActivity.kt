package com.example.uas_pbm_a

import android.animation.ObjectAnimator
import android.os.Bundle
import android.view.View
import android.view.animation.DecelerateInterpolator
import android.widget.Button
import android.widget.EditText
import android.widget.LinearLayout
import android.widget.ProgressBar
import android.widget.TextView
import androidx.activity.ComponentActivity
import androidx.activity.enableEdgeToEdge
import androidx.core.view.ViewCompat
import androidx.core.view.WindowInsetsCompat
import androidx.core.view.updatePadding
import java.util.Locale

class MainActivity : ComponentActivity() {
    private lateinit var nameEditText: EditText
    private lateinit var weightEditText: EditText
    private lateinit var heightEditText: EditText
    private lateinit var ageEditText: EditText
    private lateinit var validationContainer: LinearLayout
    private lateinit var validationMessageTextView: TextView
    private lateinit var resultCard: LinearLayout
    private lateinit var resultTitleTextView: TextView
    private lateinit var resultSummaryTextView: TextView
    private lateinit var resultValueTextView: TextView
    private lateinit var resultUnitTextView: TextView
    private lateinit var resultCategoryTextView: TextView
    private lateinit var resultInsightTextView: TextView
    private lateinit var healthProgressBar: ProgressBar

    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)
        enableEdgeToEdge()
        setContentView(R.layout.activity_main)
        bindViews()
        applySystemBarPadding()
        setupActions()
    }

    private fun bindViews() {
        nameEditText = findViewById(R.id.nameEditText)
        weightEditText = findViewById(R.id.weightEditText)
        heightEditText = findViewById(R.id.heightEditText)
        ageEditText = findViewById(R.id.ageEditText)
        validationContainer = findViewById(R.id.validationContainer)
        validationMessageTextView = findViewById(R.id.validationMessageTextView)
        resultCard = findViewById(R.id.resultCard)
        resultTitleTextView = findViewById(R.id.resultTitleTextView)
        resultSummaryTextView = findViewById(R.id.resultSummaryTextView)
        resultValueTextView = findViewById(R.id.resultValueTextView)
        resultUnitTextView = findViewById(R.id.resultUnitTextView)
        resultCategoryTextView = findViewById(R.id.resultCategoryTextView)
        resultInsightTextView = findViewById(R.id.resultInsightTextView)
        healthProgressBar = findViewById(R.id.healthProgressBar)
    }

    private fun applySystemBarPadding() {
        val rootLayout = findViewById<View>(R.id.rootLayout)
        ViewCompat.setOnApplyWindowInsetsListener(rootLayout) { view, insets ->
            val systemBars = insets.getInsets(WindowInsetsCompat.Type.systemBars())
            view.updatePadding(top = systemBars.top + 18.dp(), bottom = systemBars.bottom + 18.dp())
            insets
        }
    }

    private fun setupActions() {
        findViewById<Button>(R.id.calculateBmiButton).setOnClickListener {
            val input = readInputOrReport() ?: return@setOnClickListener
            val bmi = bmiValue(input.weight, input.height)
            val category = bmiCategory(bmi)
            showResult(
                mode = "BMI",
                owner = input.name,
                value = formatDecimal(bmi),
                unit = "kg/m2",
                category = category,
                summary = calculateBMI(input.weight, input.height),
                insight = bmiInsight(category),
                progress = ((bmi / 32) * 100).toInt().coerceIn(8, 100)
            )
        }

        findViewById<Button>(R.id.calculateBmrButton).setOnClickListener {
            val input = readInputOrReport() ?: return@setOnClickListener
            val bmr = calculateBMR(input.weight, input.height, input.age)
            showResult(
                mode = "BMR",
                owner = input.name,
                value = formatDecimal(bmr),
                unit = "kkal/hari",
                category = "Energi basal",
                summary = "BMR Anda: ${formatDecimal(bmr)} kkal/hari",
                insight = "Estimasi energi minimum tubuh saat istirahat sebelum aktivitas harian.",
                progress = ((bmr / 2400) * 100).toInt().coerceIn(12, 100)
            )
        }

        findViewById<Button>(R.id.resetButton).setOnClickListener {
            listOf(nameEditText, weightEditText, heightEditText, ageEditText).forEach { editText ->
                editText.text.clear()
                editText.error = null
                editText.setBackgroundResource(R.drawable.bg_input)
            }
            hideValidation()
            showEmptyResult()
        }
    }

    private fun readInputOrReport(): HealthInput? {
        val name = nameEditText.text.toString()
        val weight = weightEditText.text.toString()
        val height = heightEditText.text.toString()
        val age = ageEditText.text.toString()

        clearInputErrors()

        if (!validateInput(name, weight, height, age)) {
            markEmptyFields()
            showValidation("Lengkapi nama, berat badan, tinggi badan, dan umur sebelum menghitung.")
            return null
        }

        val weightValue = weight.toDoubleOrNull()
        val heightValue = height.toDoubleOrNull()
        val ageValue = age.toIntOrNull()

        if (weightValue == null || heightValue == null || ageValue == null) {
            showValidation("Pastikan berat, tinggi, dan umur diisi dengan angka yang valid.")
            return null
        }

        if (weightValue <= 0.0 || heightValue <= 0.0 || ageValue <= 0) {
            showValidation("Nilai berat, tinggi, dan umur harus lebih dari 0.")
            return null
        }

        hideValidation()
        return HealthInput(
            name = name.trim(),
            weight = weightValue,
            height = heightValue,
            age = ageValue
        )
    }

    private fun markEmptyFields() {
        listOf(
            nameEditText to "Nama wajib diisi",
            weightEditText to "Berat badan wajib diisi",
            heightEditText to "Tinggi badan wajib diisi",
            ageEditText to "Umur wajib diisi"
        ).forEach { (editText, errorMessage) ->
            if (editText.text.isBlank()) {
                editText.error = errorMessage
                editText.setBackgroundResource(R.drawable.bg_input_error)
            }
        }
    }

    private fun clearInputErrors() {
        listOf(nameEditText, weightEditText, heightEditText, ageEditText).forEach { editText ->
            editText.error = null
            editText.setBackgroundResource(R.drawable.bg_input)
        }
    }

    private fun showValidation(message: String) {
        validationMessageTextView.text = message
        if (validationContainer.visibility != View.VISIBLE) {
            validationContainer.alpha = 0f
            validationContainer.translationY = (-8).dp().toFloat()
            validationContainer.visibility = View.VISIBLE
            validationContainer.animate()
                .alpha(1f)
                .translationY(0f)
                .setDuration(180)
                .setInterpolator(DecelerateInterpolator())
                .start()
        }
    }

    private fun hideValidation() {
        validationContainer.visibility = View.GONE
    }

    private fun showEmptyResult() {
        resultTitleTextView.text = "Hasil pemeriksaan akan muncul di sini"
        resultSummaryTextView.text = "Tekan salah satu tombol kalkulasi setelah semua kolom terisi."
        resultValueTextView.text = "--"
        resultUnitTextView.text = "BMI / BMR"
        resultCategoryTextView.text = "Menunggu data"
        resultInsightTextView.text = "Validasi input menjaga aplikasi tetap stabil saat form kosong."
        healthProgressBar.progress = 0
        animateResultCard()
    }

    private fun showResult(
        mode: String,
        owner: String,
        value: String,
        unit: String,
        category: String,
        summary: String,
        insight: String,
        progress: Int
    ) {
        resultTitleTextView.text = "Hasil $mode untuk $owner"
        resultSummaryTextView.text = summary
        resultValueTextView.text = value
        resultUnitTextView.text = unit
        resultCategoryTextView.text = category
        resultInsightTextView.text = insight

        ObjectAnimator.ofInt(healthProgressBar, "progress", healthProgressBar.progress, progress).apply {
            duration = 700
            interpolator = DecelerateInterpolator()
            start()
        }
        animateResultCard()
    }

    private fun animateResultCard() {
        resultCard.alpha = 0f
        resultCard.translationY = 18.dp().toFloat()
        resultCard.animate()
            .alpha(1f)
            .translationY(0f)
            .setDuration(260)
            .setInterpolator(DecelerateInterpolator())
            .start()
    }

    private fun Int.dp(): Int {
        return (this * resources.displayMetrics.density).toInt()
    }
}

fun validateInput(name: String, weight: String, height: String, age: String): Boolean {
    return name.isNotBlank() && weight.isNotBlank() && height.isNotBlank() && age.isNotBlank()
}

fun calculateBMI(weight: Double, height: Double): String {
    val heightInMeters = height / 100
    val bmi = weight / (heightInMeters * heightInMeters)
    val category = bmiCategory(bmi)
    return "BMI Anda: ${formatDecimal(bmi)} ($category)"
}

fun calculateBMR(weight: Double, height: Double, age: Int): Double {
    return (10 * weight) + (6.25 * height) - (5 * age) + 5
}

private fun formatDecimal(value: Double): String {
    return String.format(Locale.US, "%.1f", value)
}

private fun bmiValue(weight: Double, height: Double): Double {
    val heightInMeters = height / 100
    return weight / (heightInMeters * heightInMeters)
}

private fun bmiCategory(value: Double): String {
    return when {
        value < 18.5 -> "Kurus"
        value < 25.0 -> "Normal"
        else -> "Kelebihan Berat Badan"
    }
}

private fun bmiInsight(category: String): String {
    return when (category) {
        "Kurus" -> "Fokus pada pola makan bergizi dan pantau perkembangan berat badan secara bertahap."
        "Normal" -> "Indikator tubuh berada di rentang sehat. Pertahankan pola makan, tidur, dan aktivitas fisik."
        else -> "Mulai evaluasi asupan kalori dan rutinitas gerak harian untuk menjaga risiko kesehatan."
    }
}

private data class HealthInput(
    val name: String,
    val weight: Double,
    val height: Double,
    val age: Int
)
