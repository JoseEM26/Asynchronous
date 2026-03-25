package com.example.ubication_app_android.data.model

import java.math.BigDecimal

data class AsistenciaQrRequest(
    val trabajadorId: Int,
    val qrToken: String,
    val tipo: String, // ENTRADA or SALIDA
    val latitud: Double,
    val longitud: Double
)

data class AsistenciaResponse(
    val id: Int,
    val fecha: String,
    val tipo: String,
    val trabajadorNombre: String? = null
)
