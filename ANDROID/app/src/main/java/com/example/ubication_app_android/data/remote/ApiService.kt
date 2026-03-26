package com.example.ubication_app_android.data.remote

import com.example.ubication_app_android.data.model.AsistenciaQrRequest
import com.example.ubication_app_android.data.model.AsistenciaResponse
import com.example.ubication_app_android.data.model.LoginRequest
import com.example.ubication_app_android.data.model.LoginResponse
import com.example.ubication_app_android.data.model.TrabajadorResponse
import com.example.ubication_app_android.data.model.MobileLocationDTO
import retrofit2.Response
import retrofit2.http.Body
import retrofit2.http.POST

interface ApiService {
    @POST("usuarios/login")
    suspend fun login(@Body request: LoginRequest): Response<LoginResponse>

    @POST("asistencias/registrar-qr")
    suspend fun registrarConQr(@Body request: AsistenciaQrRequest): Response<AsistenciaResponse>

    @retrofit2.http.GET("asistencias/trabajador/{id}")
    suspend fun listarPorTrabajador(@retrofit2.http.Path("id") id: Int): Response<List<AsistenciaResponse>>

    @retrofit2.http.GET("trabajadores")
    suspend fun listarTrabajadores(): Response<List<TrabajadorResponse>>

    @retrofit2.http.GET("trabajadores/{id}")
    suspend fun getTrabajador(@retrofit2.http.Path("id") id: Int): Response<TrabajadorResponse>

    @retrofit2.http.PUT("trabajadores/{id}/permitir-cambio-ubicacion")
    suspend fun permitirCambioUbicacion(
        @retrofit2.http.Path("id") id: Int,
        @retrofit2.http.Query("permitir") permitir: Boolean
    ): Response<Unit>

    @retrofit2.http.PUT("trabajadores/{id}/ubicacion-virtual")
    suspend fun actualizarUbicacionVirtual(
        @retrofit2.http.Path("id") id: Int,
        @retrofit2.http.Query("lat") lat: java.math.BigDecimal,
        @retrofit2.http.Query("lng") lng: java.math.BigDecimal
    ): Response<Unit>

    @retrofit2.http.POST("trabajadores/puntos-terreno")
    suspend fun registrarPuntoTerreno(
        @retrofit2.http.Query("jefeId") jefeId: Int,
        @retrofit2.http.Query("lat") lat: java.math.BigDecimal,
        @retrofit2.http.Query("lng") lng: java.math.BigDecimal,
        @retrofit2.http.Query("nombre") nombre: String?
    ): Response<Unit>

    // Nuevos endpoints para Admin y Jefe Terreno
    @POST("mobile/puntos/terreno")
    suspend fun registrarPuntoTerrenoMobile(@Body request: MobileLocationDTO): Response<Unit>

    @POST("mobile/puntos/oficina")
    suspend fun actualizarPuntoOficina(@Body request: MobileLocationDTO): Response<Unit>
}
