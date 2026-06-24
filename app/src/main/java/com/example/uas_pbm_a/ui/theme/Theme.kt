package com.example.uas_pbm_a.ui.theme

import android.os.Build
import androidx.compose.foundation.isSystemInDarkTheme
import androidx.compose.material3.MaterialTheme
import androidx.compose.material3.darkColorScheme
import androidx.compose.material3.dynamicDarkColorScheme
import androidx.compose.material3.dynamicLightColorScheme
import androidx.compose.material3.lightColorScheme
import androidx.compose.runtime.Composable
import androidx.compose.ui.graphics.Color
import androidx.compose.ui.platform.LocalContext

private val DarkColorScheme = darkColorScheme(
    primary = SehatGreenDark,
    onPrimary = SehatNavyDark,
    secondary = Color(0xFFBFD8CE),
    tertiary = SehatCoral,
    background = Color(0xFF071211),
    onBackground = Color(0xFFE7F0ED),
    surface = Color(0xFF10201E),
    onSurface = Color(0xFFEAF4EF),
    surfaceVariant = Color(0xFF243B36),
    onSurfaceVariant = Color(0xFFC0D0CB),
    error = Color(0xFFFFB4A8)
)

private val LightColorScheme = lightColorScheme(
    primary = SehatGreen,
    onPrimary = Color.White,
    secondary = SehatNavy,
    onSecondary = Color.White,
    tertiary = SehatCoral,
    background = Color(0xFFF7FBF8),
    onBackground = SehatInk,
    surface = Color.White,
    onSurface = SehatInk,
    surfaceVariant = SehatSage,
    onSurfaceVariant = SehatMuted,
    error = Color(0xFFB94E3D)
)

@Composable
fun UASPBMATheme(
    darkTheme: Boolean = isSystemInDarkTheme(),
    dynamicColor: Boolean = false,
    content: @Composable () -> Unit
) {
    val colorScheme = when {
        dynamicColor && Build.VERSION.SDK_INT >= Build.VERSION_CODES.S -> {
            val context = LocalContext.current
            if (darkTheme) dynamicDarkColorScheme(context) else dynamicLightColorScheme(context)
        }

        darkTheme -> DarkColorScheme
        else -> LightColorScheme
    }

    MaterialTheme(
        colorScheme = colorScheme,
        typography = Typography,
        content = content
    )
}
