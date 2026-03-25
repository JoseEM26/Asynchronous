package com.example.ubication_app_android.data.remote

import com.example.ubication_app_android.data.model.AsistenciaQrRequest
import com.example.ubication_app_android.data.model.AsistenciaResponse
import com.example.ubication_app_android.data.model.LoginRequest
import com.example.ubication_app_android.data.model.LoginResponse
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
}
