package com.example.uas_pbm_a

import org.junit.Assert.assertEquals
import org.junit.Assert.assertFalse
import org.junit.Assert.assertTrue
import org.junit.Test

class HealthFunctionTest {
    @Test
    fun validateInput_returnsFalseWhenAnyFieldIsEmpty() {
        assertFalse(validateInput("", "70", "170", "20"))
        assertFalse(validateInput("Aulia", "", "170", "20"))
        assertFalse(validateInput("Aulia", "70", "", "20"))
        assertFalse(validateInput("Aulia", "70", "170", ""))
    }

    @Test
    fun validateInput_returnsTrueWhenAllFieldsAreFilled() {
        assertTrue(validateInput("Aulia", "70", "170", "20"))
    }

    @Test
    fun calculateBMI_returnsNormalCategoryForHealthyRange() {
        assertEquals("BMI Anda: 24.2 (Normal)", calculateBMI(70.0, 170.0))
    }

    @Test
    fun calculateBMI_returnsThinCategoryBelowEighteenPointFive() {
        assertEquals("BMI Anda: 17.3 (Kurus)", calculateBMI(50.0, 170.0))
    }

    @Test
    fun calculateBMI_returnsOverweightCategoryAtTwentyFiveOrMore() {
        assertEquals("BMI Anda: 27.7 (Kelebihan Berat Badan)", calculateBMI(80.0, 170.0))
    }

    @Test
    fun calculateBMR_usesMifflinStJeorMaleFormula() {
        assertEquals(1667.5, calculateBMR(70.0, 170.0, 20), 0.0)
    }
}
