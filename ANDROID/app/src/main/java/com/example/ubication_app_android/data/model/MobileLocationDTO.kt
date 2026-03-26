package com.example.ubication_app_android.data.model

import java.math.BigDecimal

data class MobileLocationDTO(
    val trabajadorId: Int?,
    val latitud: BigDecimal,
    val longitud: BigDecimal,
    val nombreUbicacion: String? = null
)
