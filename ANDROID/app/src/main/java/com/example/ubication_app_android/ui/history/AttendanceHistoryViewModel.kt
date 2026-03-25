package com.example.ubication_app_android.ui.history

import androidx.lifecycle.ViewModel
import androidx.lifecycle.viewModelScope
import com.example.ubication_app_android.data.model.AsistenciaResponse
import com.example.ubication_app_android.data.remote.RetrofitClient
import com.example.ubication_app_android.util.Constants
import kotlinx.coroutines.flow.MutableStateFlow
import kotlinx.coroutines.flow.asStateFlow
import kotlinx.coroutines.launch

class AttendanceHistoryViewModel : ViewModel() {
    private val _historyState = MutableStateFlow<HistoryState>(HistoryState.Loading)
    val historyState = _historyState.asStateFlow()

    fun fetchHistory(trabajadorId: Int) {
        viewModelScope.launch {
            _historyState.value = HistoryState.Loading
            try {
                val response = RetrofitClient.getService(Constants.BASE_URL).listarPorTrabajador(trabajadorId)
                if (response.isSuccessful) {
                    _historyState.value = HistoryState.Success(response.body() ?: emptyList())
                } else {
                    val errorBody = response.errorBody()?.string() ?: "Sin detalles adicionales"
                    _historyState.value = HistoryState.Error("Error de Servidor: ${response.code()}", errorBody)
                }
            } catch (e: Exception) {
                _historyState.value = HistoryState.Error("Excepción de Red", e.message ?: "Error desconocido")
            }
        }
    }
}

sealed class HistoryState {
    object Loading : HistoryState()
    data class Success(val data: List<AsistenciaResponse>) : HistoryState()
    data class Error(val message: String, val errorDetails: String? = null) : HistoryState()
}
