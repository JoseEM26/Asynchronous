package com.example.ubication_app_android.data.remote

import com.example.ubication_app_android.data.model.LoginRequest
import com.example.ubication_app_android.data.model.LoginResponse
import retrofit2.Response
import retrofit2.http.Body
import retrofit2.http.POST

interface ApiService {
    @POST("usuarios/login")
    suspend fun login(@Body request: LoginRequest): Response<LoginResponse>
}
