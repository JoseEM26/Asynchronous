package com.example.ubication_app_android

import android.os.Bundle
import androidx.activity.ComponentActivity
import androidx.activity.compose.setContent
import androidx.activity.enableEdgeToEdge
import androidx.compose.foundation.layout.fillMaxSize
import androidx.compose.foundation.layout.padding
import androidx.compose.material3.Scaffold
import androidx.compose.runtime.Composable
import androidx.compose.ui.Modifier
import androidx.navigation.NavType
import androidx.navigation.compose.NavHost
import androidx.navigation.compose.composable
import androidx.navigation.compose.rememberNavController
import androidx.navigation.navArgument
import com.example.ubication_app_android.ui.admin.AdminScreen
import com.example.ubication_app_android.ui.attendance.QRScannerScreen
import com.example.ubication_app_android.ui.dashboard.DashboardScreen
import com.example.ubication_app_android.ui.history.AttendanceHistoryScreen
import com.example.ubication_app_android.ui.login.LoginScreen
import com.example.ubication_app_android.ui.theme.UBICATION_APP_ANDROIDTheme
import com.example.ubication_app_android.util.Constants
import com.example.ubication_app_android.data.remote.RetrofitClient
import androidx.compose.runtime.rememberCoroutineScope
import kotlinx.coroutines.launch
import android.widget.Toast
import androidx.compose.ui.platform.LocalContext

class MainActivity : ComponentActivity() {
    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)
        enableEdgeToEdge()
        setContent {
            UBICATION_APP_ANDROIDTheme {
                AppNavigation()
            }
        }
    }
}

@Composable
fun AppNavigation() {
    val navController = rememberNavController()
    val context = LocalContext.current
    val scope = rememberCoroutineScope()
    
    Scaffold(modifier = Modifier.fillMaxSize()) { innerPadding ->
        NavHost(
            navController = navController,
            startDestination = "login",
            modifier = Modifier.padding(innerPadding)
        ) {
            composable("login") {
                LoginScreen(
                    onLoginSuccess = { user ->
                        val tId = user.trabajador?.id ?: 0
                        val name = user.trabajador?.nombres ?: user.username
                        val rId = user.rol?.id ?: 2
                        val mId = user.trabajador?.modalidadId ?: 1
                        val esJefe = user.trabajador?.esJefeTerreno ?: false
                        val canChange = user.trabajador?.permitirCambioUbicacion ?: false
                        
                        navController.navigate("dashboard/$tId/$name/$rId/$mId/$esJefe/$canChange") {
                            popUpTo("login") { inclusive = true }
                        }
                    }
                )
            }
            composable(
                "dashboard/{tId}/{name}/{rId}/{mId}/{esJefe}/{canChange}",
                arguments = listOf(
                    navArgument("tId") { type = NavType.IntType },
                    navArgument("name") { type = NavType.StringType },
                    navArgument("rId") { type = NavType.IntType },
                    navArgument("mId") { type = NavType.IntType },
                    navArgument("esJefe") { type = NavType.BoolType },
                    navArgument("canChange") { type = NavType.BoolType }
                )
            ) { backStackEntry ->
                val tId = backStackEntry.arguments?.getInt("tId") ?: 0
                val name = backStackEntry.arguments?.getString("name") ?: "Usuario"
                val rId = backStackEntry.arguments?.getInt("rId") ?: 2
                val mId = backStackEntry.arguments?.getInt("mId") ?: 1
                val esJefe = backStackEntry.arguments?.getBoolean("esJefe") ?: false
                val canChange = backStackEntry.arguments?.getBoolean("canChange") ?: false

                DashboardScreen(
                    username = name,
                    rolId = rId,
                    modalityId = mId,
                    esJefeTerreno = esJefe,
                    permitirCambioUbicacion = canChange,
                    onLogout = {
                        navController.navigate("login") {
                            popUpTo(0) { inclusive = true }
                        }
                    },
                    onNavigateToScanner = { navController.navigate("scanner/$tId") },
                    onNavigateToHistory = { navController.navigate("history/$tId") },
                    onNavigateToAdmin = { navController.navigate("admin") },
                    onSetHomeLocation = {
                        scope.launch {
                            try {
                                val api = RetrofitClient.getService(Constants.BASE_URL)
                                // Mock GPS for simplicity in this demo, usually use FusedLocation
                                val res = api.actualizarUbicacionVirtual(tId, java.math.BigDecimal("-12.046"), java.math.BigDecimal("-77.042"))
                                if(res.isSuccessful) Toast.makeText(context, "Ubicación de Casa Guardada", Toast.LENGTH_SHORT).show()
                            } catch(e: Exception) {
                                Toast.makeText(context, "Error: ${e.message}", Toast.LENGTH_SHORT).show()
                            }
                        }
                    },
                    onSetTerrenoPoint = {
                        scope.launch {
                            try {
                                val api = RetrofitClient.getService(Constants.BASE_URL)
                                val res = api.registrarPuntoTerreno(tId, java.math.BigDecimal("-12.05"), java.math.BigDecimal("-77.06"), "Punto Campo")
                                if(res.isSuccessful) Toast.makeText(context, "Punto de Terreno Establecido", Toast.LENGTH_SHORT).show()
                            } catch(e: Exception) {
                                Toast.makeText(context, "Error: ${e.message}", Toast.LENGTH_SHORT).show()
                            }
                        }
                    }
                )
            }
            composable("admin") {
                AdminScreen(
                    baseUrl = Constants.BASE_URL,
                    onNavigateBack = { navController.popBackStack() }
                )
            }
            composable(
                "scanner/{trabajadorId}?type={type}",
                arguments = listOf(
                    navArgument("trabajadorId") { type = NavType.IntType },
                    navArgument("type") { 
                        type = NavType.StringType
                        nullable = true
                        defaultValue = null
                    }
                )
            ) { backStackEntry ->
                val trabajadorId = backStackEntry.arguments?.getInt("trabajadorId") ?: 0
                val type = backStackEntry.arguments?.getString("type")
                QRScannerScreen(
                    trabajadorId = trabajadorId,
                    defaultType = type,
                    onNavigateBack = { navController.popBackStack() }
                )
            }
            composable(
                "history/{trabajadorId}",
                arguments = listOf(navArgument("trabajadorId") { type = NavType.IntType })
            ) { backStackEntry ->
                val trabajadorId = backStackEntry.arguments?.getInt("trabajadorId") ?: 0
                AttendanceHistoryScreen(
                    trabajadorId = trabajadorId,
                    onNavigateBack = { navController.popBackStack() },
                    onNavigateToScanner = { type ->
                        navController.navigate("scanner/$trabajadorId?type=$type")
                    }
                )
            }
        }
    }
}