package com.example.ubication_app_android.data.remote

import retrofit2.Retrofit
import retrofit2.converter.gson.GsonConverterFactory

object RetrofitClient {
    private var instance: ApiService? = null
    private var currentBaseUrl: String? = null

    fun getService(baseUrl: String): ApiService {
        if (instance == null || currentBaseUrl != baseUrl) {
            currentBaseUrl = baseUrl
            val retrofit = Retrofit.Builder()
                .baseUrl(baseUrl)
                .addConverterFactory(GsonConverterFactory.create())
                .build()
            instance = retrofit.create(ApiService::class.java)
        }
        return instance!!
    }
}
