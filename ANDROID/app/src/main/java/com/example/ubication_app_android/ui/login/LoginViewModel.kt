package com.example.ubication_app_android.ui.login

import androidx.lifecycle.ViewModel
import androidx.lifecycle.viewModelScope
import com.example.ubication_app_android.data.model.LoginRequest
import com.example.ubication_app_android.data.model.LoginResponse
import com.example.ubication_app_android.data.remote.RetrofitClient
import kotlinx.coroutines.flow.MutableStateFlow
import kotlinx.coroutines.flow.asStateFlow
import kotlinx.coroutines.launch

class LoginViewModel : ViewModel() {
    private val _loginState = MutableStateFlow<LoginResult>(LoginResult.Idle)
    val loginState = _loginState.asStateFlow()

    fun login(baseUrl: String, request: LoginRequest) {
        viewModelScope.launch {
            _loginState.value = LoginResult.Loading
            try {
                val response = RetrofitClient.getService(baseUrl).login(request)
                if (response.isSuccessful) {
                    _loginState.value = LoginResult.Success(response.body()!!)
                } else {
                    _loginState.value = LoginResult.Error("Error: ${response.code()} - ${response.message()}")
                }
            } catch (e: Exception) {
                _loginState.value = LoginResult.Error("Exception: ${e.message}")
            }
        }
    }
}

sealed class LoginResult {
    object Idle : LoginResult()
    object Loading : LoginResult()
    data class Success(val user: LoginResponse) : LoginResult()
    data class Error(val message: String) : LoginResult()
}
