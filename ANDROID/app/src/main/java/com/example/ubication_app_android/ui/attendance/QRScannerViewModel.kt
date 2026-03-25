package com.example.ubication_app_android.ui.attendance

import androidx.lifecycle.ViewModel
import androidx.lifecycle.viewModelScope
import com.example.ubication_app_android.data.model.AsistenciaQrRequest
import com.example.ubication_app_android.data.model.AsistenciaResponse
import com.example.ubication_app_android.data.remote.RetrofitClient
import kotlinx.coroutines.flow.MutableStateFlow
import kotlinx.coroutines.flow.asStateFlow
import kotlinx.coroutines.launch

class QRScannerViewModel : ViewModel() {
    private val _attendanceState = MutableStateFlow<AttendanceResult>(AttendanceResult.Idle)
    val attendanceState = _attendanceState.asStateFlow()

    fun registrarAsistencia(baseUrl: String, request: AsistenciaQrRequest) {
        viewModelScope.launch {
            _attendanceState.value = AttendanceResult.Loading
            try {
                val response = RetrofitClient.getService(baseUrl).registrarConQr(request)
                if (response.isSuccessful) {
                    _attendanceState.value = AttendanceResult.Success(response.body()!!)
                } else {
                    _attendanceState.value = AttendanceResult.Error("Error: ${response.code()} - ${response.message()}")
                }
            } catch (e: Exception) {
                _attendanceState.value = AttendanceResult.Error("Exception: ${e.message}")
            }
        }
    }

    fun resetState() {
        _attendanceState.value = AttendanceResult.Idle
    }
}

sealed class AttendanceResult {
    object Idle : AttendanceResult()
    object Loading : AttendanceResult()
    data class Success(val response: AsistenciaResponse) : AttendanceResult()
    data class Error(val message: String) : AttendanceResult()
}
