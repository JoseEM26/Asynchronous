package com.example.ubication_app_android.ui.dashboard

import androidx.compose.foundation.layout.*
import androidx.compose.material.icons.Icons
import androidx.compose.material.icons.filled.*
import androidx.compose.material3.*
import androidx.compose.runtime.Composable
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.graphics.vector.ImageVector
import androidx.compose.ui.unit.dp
import androidx.compose.ui.unit.sp

@Composable
fun DashboardScreen(
    username: String,
    rolId: Int,
    modalityId: Int,
    esJefeTerreno: Boolean,
    permitirCambioUbicacion: Boolean,
    onLogout: () -> Unit,
    onNavigateToScanner: () -> Unit,
    onNavigateToHistory: () -> Unit,
    onNavigateToAdmin: () -> Unit,
    onNavigateToProfile: () -> Unit,
    onSetHomeLocation: () -> Unit,
    onSetTerrenoPoint: () -> Unit,
    onNavigateToUpdateOffice: () -> Unit = {},
    onNavigateToUpdateTerreno: () -> Unit = {}
) {
    Column(
        modifier = Modifier
            .fillMaxSize()
            .padding(24.dp),
        horizontalAlignment = Alignment.CenterHorizontally
    ) {
        Text(
            text = "Hola, $username",
            style = MaterialTheme.typography.headlineLarge,
            modifier = Modifier.padding(bottom = 8.dp)
        )
        
        Text(
            text = "Panel de Control",
            style = MaterialTheme.typography.bodyLarge,
            color = MaterialTheme.colorScheme.secondary
        )
        
        Spacer(modifier = Modifier.height(32.dp))
        
        // Basic Actions
        DashboardButton(
            text = "Mi Perfil",
            icon = Icons.Default.Person,
            onClick = onNavigateToProfile,
            containerColor = MaterialTheme.colorScheme.secondaryContainer
        )
        
        Spacer(modifier = Modifier.height(16.dp))
        
        DashboardButton(
            text = "Escanear QR Asistencia",
            icon = Icons.Default.QrCodeScanner,
            onClick = onNavigateToScanner
        )
        
        Spacer(modifier = Modifier.height(16.dp))
        
        DashboardButton(
            text = "Ver Historial",
            icon = Icons.Default.History,
            onClick = onNavigateToHistory
        )
        
        Spacer(modifier = Modifier.height(16.dp))
        
        // Role Specific Actions
        if (rolId == 1) { // ADMIN
            DashboardButton(
                text = "Gestión de Usuarios",
                icon = Icons.Default.People,
                onClick = onNavigateToAdmin,
                containerColor = MaterialTheme.colorScheme.tertiaryContainer
            )
            Spacer(modifier = Modifier.height(16.dp))
            DashboardButton(
                text = "Actualizar Punto Oficina",
                icon = Icons.Default.LocationOn,
                onClick = onNavigateToUpdateOffice,
                containerColor = MaterialTheme.colorScheme.primaryContainer
            )
        }
        
        if (rolId == 3) { // SOLO JEFE TERRENO
            DashboardButton(
                text = "Establecer Punto Terreno",
                icon = Icons.Default.AddLocation,
                onClick = onNavigateToUpdateTerreno,
                containerColor = MaterialTheme.colorScheme.primaryContainer
            )
        }
        
        // Virtual / Hybrid specific
        if (modalityId == 2 || modalityId == 3) {
            if (permitirCambioUbicacion) {
                Spacer(modifier = Modifier.height(16.dp))
                DashboardButton(
                    text = "Mi Ubicación Casa",
                    icon = Icons.Default.Home,
                    onClick = onSetHomeLocation,
                    containerColor = MaterialTheme.colorScheme.secondaryContainer
                )
            }
        }

        Spacer(modifier = Modifier.weight(1f))
        
        TextButton(onClick = onLogout) {
            Text("CERRAR SESIÓN")
        }
    }
}

@Composable
fun DashboardButton(
    text: String,
    icon: ImageVector,
    onClick: () -> Unit,
    containerColor: androidx.compose.ui.graphics.Color = MaterialTheme.colorScheme.surfaceVariant
) {
    Button(
        onClick = onClick,
        modifier = Modifier.fillMaxWidth().height(64.dp),
        shape = androidx.compose.foundation.shape.RoundedCornerShape(16.dp),
        colors = ButtonDefaults.buttonColors(containerColor = containerColor, contentColor = MaterialTheme.colorScheme.onSurfaceVariant)
    ) {
        Row(
            modifier = Modifier.fillMaxWidth(),
            verticalAlignment = Alignment.CenterVertically,
            horizontalArrangement = Arrangement.Start
        ) {
            Icon(icon, contentDescription = null, modifier = Modifier.size(24.dp))
            Spacer(modifier = Modifier.width(16.dp))
            Text(text, fontSize = 16.sp)
        }
    }
}
