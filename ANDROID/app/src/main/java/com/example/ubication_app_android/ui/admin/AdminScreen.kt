package com.example.ubication_app_android.ui.admin

import androidx.compose.foundation.layout.*
import androidx.compose.foundation.lazy.LazyColumn
import androidx.compose.foundation.lazy.items
import androidx.compose.material.icons.Icons
import androidx.compose.material.icons.filled.ArrowBack
import androidx.compose.material.icons.filled.People
import androidx.compose.material.icons.filled.Refresh
import androidx.compose.material3.*
import androidx.compose.runtime.*
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.graphics.Color
import androidx.compose.ui.text.font.FontWeight
import androidx.compose.ui.unit.dp
import androidx.compose.ui.unit.sp
import androidx.lifecycle.ViewModel
import androidx.lifecycle.viewModelScope
import androidx.lifecycle.viewmodel.compose.viewModel
import com.example.ubication_app_android.data.model.TrabajadorResponse
import com.example.ubication_app_android.data.remote.RetrofitClient
import kotlinx.coroutines.flow.MutableStateFlow
import kotlinx.coroutines.flow.StateFlow
import kotlinx.coroutines.launch

class AdminViewModel : ViewModel() {
    private val _uiState = MutableStateFlow<AdminUiState>(AdminUiState.Loading)
    val uiState: StateFlow<AdminUiState> = _uiState

    fun loadTrabajadores(baseUrl: String) {
        viewModelScope.launch {
            _uiState.value = AdminUiState.Loading
            try {
                val api = RetrofitClient.getService(baseUrl)
                val response = api.listarTrabajadores()
                if (response.isSuccessful) {
                    _uiState.value = AdminUiState.Success(response.body() ?: emptyList())
            } else {
                val errorBody = response.errorBody()?.string() ?: "Sin detalles adicionales"
                _uiState.value = AdminUiState.Error("Error: ${response.code()}", errorBody)
            }
        } catch (e: Exception) {
            _uiState.value = AdminUiState.Error("Error de Red", e.message ?: "Error desconocido")
        }
        }
    }

    fun togglePermiso(baseUrl: String, id: Int, permitir: Boolean) {
        viewModelScope.launch {
            try {
                val api = RetrofitClient.getService(baseUrl)
                api.permitirCambioUbicacion(id, permitir)
                loadTrabajadores(baseUrl)
            } catch (e: Exception) {
                // Handle error
            }
        }
    }
}

sealed class AdminUiState {
    object Loading : AdminUiState()
    data class Success(val list: List<TrabajadorResponse>) : AdminUiState()
    data class Error(val message: String, val errorDetails: String? = null) : AdminUiState()
}

@OptIn(ExperimentalMaterial3Api::class)
@Composable
fun AdminScreen(
    baseUrl: String,
    viewModel: AdminViewModel = viewModel(),
    onNavigateBack: () -> Unit
) {
    val state by viewModel.uiState.collectAsState()

    LaunchedEffect(Unit) {
        viewModel.loadTrabajadores(baseUrl)
    }

    Scaffold(
        topBar = {
            TopAppBar(
                title = { Text("Gestión de Personal") },
                navigationIcon = {
                    IconButton(onClick = onNavigateBack) {
                        Icon(Icons.Default.ArrowBack, contentDescription = "Atrás")
                    }
                },
                actions = {
                    IconButton(onClick = { viewModel.loadTrabajadores(baseUrl) }) {
                        Icon(Icons.Default.Refresh, contentDescription = "Refrescar")
                    }
                }
            )
        }
    ) { padding ->
        Column(modifier = Modifier.padding(padding).fillMaxSize()) {
            when (state) {
                is AdminUiState.Loading -> {
                    Box(modifier = Modifier.fillMaxSize(), contentAlignment = Alignment.Center) {
                        CircularProgressIndicator()
                    }
                }
                is AdminUiState.Error -> {
                    com.example.ubication_app_android.ui.components.DetailedErrorDialog(
                        message = (state as AdminUiState.Error).message,
                        errorDetails = (state as AdminUiState.Error).errorDetails,
                        onDismiss = { viewModel.loadTrabajadores(baseUrl) },
                        onNavigateBack = onNavigateBack
                    )
                }
                is AdminUiState.Success -> {
                    val trabajadores = (state as AdminUiState.Success).list
                    if (trabajadores.isEmpty()) {
                        EmptyAdminView()
                    } else {
                        LazyColumn(modifier = Modifier.fillMaxSize().padding(16.dp)) {
                            items(trabajadores) { t ->
                                TrabajadorAdminCard(
                                    trabajador = t,
                                    onToggle = { permitir ->
                                        viewModel.togglePermiso(baseUrl, t.id, permitir)
                                    }
                                )
                                Spacer(modifier = Modifier.height(12.dp))
                            }
                        }
                    }
                }
            }
        }
    }
}

@Composable
fun TrabajadorAdminCard(
    trabajador: TrabajadorResponse,
    onToggle: (Boolean) -> Unit
) {
    Card(
        modifier = Modifier.fillMaxWidth(),
        elevation = CardDefaults.cardElevation(defaultElevation = 2.dp)
    ) {
        Row(
            modifier = Modifier.padding(16.dp).fillMaxWidth(),
            verticalAlignment = Alignment.CenterVertically,
            horizontalArrangement = Arrangement.SpaceBetween
        ) {
            Column(modifier = Modifier.weight(1f)) {
                Text(
                    "${trabajador.nombres} ${trabajador.apellidos}",
                    fontWeight = FontWeight.Bold,
                    fontSize = 16.sp
                )
                Text("DNI: ${trabajador.dni}", fontSize = 12.sp, color = Color.Gray)
                Text(
                    "Modalidad: ${getModalityName(trabajador.modalidadId)}",
                    fontSize = 12.sp,
                    color = Color.Blue
                )
            }
            
            Column(horizontalAlignment = Alignment.CenterHorizontally) {
                Text("¿Habilitar Cambio?", fontSize = 10.sp)
                Switch(
                    checked = trabajador.permitirCambioUbicacion == true,
                    onCheckedChange = { onToggle(it) }
                )
            }
        }
    }
}

@Composable
fun EmptyAdminView() {
    Column(
        modifier = Modifier.fillMaxSize(),
        verticalArrangement = Arrangement.Center,
        horizontalAlignment = Alignment.CenterHorizontally
    ) {
        Icon(
            imageVector = Icons.Default.People,
            contentDescription = null,
            modifier = Modifier.size(80.dp),
            tint = Color.Gray.copy(alpha = 0.3f)
        )
        Spacer(modifier = Modifier.height(16.dp))
        Text(
            "No hay trabajadores registrados.",
            color = Color.Gray,
            fontSize = 18.sp
        )
    }
}

fun getModalityName(id: Int?): String = when(id) {
    1 -> "Presencial"
    2 -> "Virtual"
    3 -> "Híbrido"
    4 -> "Terreno"
    else -> "N/A"
}
