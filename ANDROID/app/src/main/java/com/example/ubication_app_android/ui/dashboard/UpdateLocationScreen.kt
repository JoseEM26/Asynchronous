package com.example.ubication_app_android.ui.dashboard

import androidx.compose.foundation.layout.*
import androidx.compose.material3.*
import androidx.compose.runtime.*
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.unit.dp
import androidx.compose.material.icons.Icons
import androidx.compose.material.icons.filled.MyLocation
import com.example.ubication_app_android.data.model.MobileLocationDTO
import com.example.ubication_app_android.data.remote.RetrofitClient
import com.example.ubication_app_android.util.Constants
import com.google.accompanist.permissions.ExperimentalPermissionsApi
import com.google.accompanist.permissions.isGranted
import com.google.accompanist.permissions.rememberPermissionState
import com.google.android.gms.location.LocationServices
import kotlinx.coroutines.launch
import java.math.BigDecimal

@OptIn(ExperimentalPermissionsApi::class)
@Composable
fun UpdateLocationScreen(
    trabajadorId: Int,
    isOffice: Boolean,
    onBack: () -> Unit
) {
    var lat by remember { mutableStateOf("") }
    var lng by remember { mutableStateOf("") }
    var nombreUbicacion by remember { mutableStateOf("") }
    var isLoading by remember { mutableStateOf(false) }
    var message by remember { mutableStateOf<String?>(null) }
    
    val scope = rememberCoroutineScope()
    val context = androidx.compose.ui.platform.LocalContext.current
    val fusedLocationClient = remember { LocationServices.getFusedLocationProviderClient(context) }
    
    // Permission state
    val locationPermissionState = rememberPermissionState(
        android.Manifest.permission.ACCESS_FINE_LOCATION
    )
    
    Column(
        modifier = Modifier
            .fillMaxSize()
            .padding(16.dp),
        horizontalAlignment = Alignment.CenterHorizontally
    ) {
        Text(
            text = if (isOffice) "Actualizar Oficina" else "Actualizar Punto Terreno",
            style = MaterialTheme.typography.headlineMedium
        )
        
        Spacer(modifier = Modifier.height(24.dp))
        
        // GPS Button
        Button(
            onClick = {
                if (locationPermissionState.status.isGranted) {
                    isLoading = true
                    try {
                        fusedLocationClient.lastLocation.addOnSuccessListener { location ->
                            if (location != null) {
                                lat = location.latitude.toString()
                                lng = location.longitude.toString()
                                message = "Ubicación obtenida con éxito"
                            } else {
                                message = "No se pudo obtener la ubicación (activa el GPS)"
                            }
                            isLoading = false
                        }
                    } catch (e: SecurityException) {
                        message = "Error de permisos: ${e.message}"
                        isLoading = false
                    }
                } else {
                    locationPermissionState.launchPermissionRequest()
                }
            },
            modifier = Modifier.fillMaxWidth(),
            colors = ButtonDefaults.buttonColors(containerColor = MaterialTheme.colorScheme.secondary)
        ) {
            Icon(Icons.Default.MyLocation, contentDescription = null)
            Spacer(modifier = Modifier.width(8.dp))
            Text("USAR MI UBICACIÓN ACTUAL")
        }
        
        Spacer(modifier = Modifier.height(24.dp))
        
        OutlinedTextField(
            value = lat,
            onValueChange = { lat = it },
            label = { Text("Latitud") },
            modifier = Modifier.fillMaxWidth()
        )
        
        Spacer(modifier = Modifier.height(16.dp))
        
        OutlinedTextField(
            value = lng,
            onValueChange = { lng = it },
            label = { Text("Longitud") },
            modifier = Modifier.fillMaxWidth()
        )
        
        if (!isOffice) {
            Spacer(modifier = Modifier.height(16.dp))
            OutlinedTextField(
                value = nombreUbicacion,
                onValueChange = { nombreUbicacion = it },
                label = { Text("Nombre Ubicación (Opcional)") },
                modifier = Modifier.fillMaxWidth()
            )
        }
        
        if (message != null) {
            Text(
                text = message!!,
                color = if (message!!.contains("Error")) MaterialTheme.colorScheme.error else MaterialTheme.colorScheme.primary,
                modifier = Modifier.padding(top = 16.dp)
            )
        }
        
        Spacer(modifier = Modifier.height(32.dp))
        
        Button(
            onClick = {
                scope.launch {
                    try {
                        isLoading = true
                        val latVal = BigDecimal(lat)
                        val lngVal = BigDecimal(lng)
                        val request = MobileLocationDTO(
                            trabajadorId = if (isOffice) null else trabajadorId,
                            latitud = latVal,
                            longitud = lngVal,
                            nombreUbicacion = if (nombreUbicacion.isEmpty()) null else nombreUbicacion
                        )
                        
                        val service = RetrofitClient.getService(Constants.BASE_URL)
                        
                        val response = if (isOffice) {
                            service.actualizarPuntoOficina(request)
                        } else {
                            service.registrarPuntoTerrenoMobile(request)
                        }
                        
                        if (response.isSuccessful) {
                            message = "Actualizado con éxito"
                        } else {
                            message = "Error: ${response.code()}"
                        }
                    } catch (e: Exception) {
                        message = "Error: ${e.message}"
                    } finally {
                        isLoading = false
                    }
                }
            },
            modifier = Modifier.fillMaxWidth(),
            enabled = !isLoading && lat.isNotEmpty() && lng.isNotEmpty()
        ) {
            if (isLoading) CircularProgressIndicator(modifier = Modifier.size(24.dp))
            else Text("Actualizar")
        }
        
        TextButton(onClick = onBack) {
            Text("Volver")
        }
    }
}
