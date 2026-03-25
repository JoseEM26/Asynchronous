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
import com.example.ubication_app_android.ui.attendance.QRScannerScreen
import com.example.ubication_app_android.ui.dashboard.DashboardScreen
import com.example.ubication_app_android.ui.history.AttendanceHistoryScreen
import com.example.ubication_app_android.ui.login.LoginScreen
import com.example.ubication_app_android.ui.theme.UBICATION_APP_ANDROIDTheme

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
    
    Scaffold(modifier = Modifier.fillMaxSize()) { innerPadding ->
        NavHost(
            navController = navController,
            startDestination = "login",
            modifier = Modifier.padding(innerPadding)
        ) {
            composable("login") {
                LoginScreen(
                    onLoginSuccess = { user ->
                        val trabajadorId = user.trabajador?.id ?: 0
                        val username = user.trabajador?.nombres ?: user.username
                        navController.navigate("dashboard/$trabajadorId/$username") {
                            popUpTo("login") { inclusive = true }
                        }
                    }
                )
            }
            composable(
                "dashboard/{trabajadorId}/{username}",
                arguments = listOf(
                    navArgument("trabajadorId") { type = NavType.IntType },
                    navArgument("username") { type = NavType.StringType }
                )
            ) { backStackEntry ->
                val trabajadorId = backStackEntry.arguments?.getInt("trabajadorId") ?: 0
                val username = backStackEntry.arguments?.getString("username") ?: "Usuario"
                DashboardScreen(
                    username = username,
                    onLogout = {
                        navController.navigate("login") {
                            popUpTo("dashboard/$trabajadorId/$username") { inclusive = true }
                        }
                    },
                    onNavigateToScanner = {
                        navController.navigate("scanner/$trabajadorId")
                    },
                    onNavigateToHistory = {
                        navController.navigate("history/$trabajadorId")
                    }
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
                    onNavigateBack = {
                        navController.popBackStack()
                    }
                )
            }
            composable(
                "history/{trabajadorId}",
                arguments = listOf(navArgument("trabajadorId") { type = NavType.IntType })
            ) { backStackEntry ->
                val trabajadorId = backStackEntry.arguments?.getInt("trabajadorId") ?: 0
                AttendanceHistoryScreen(
                    trabajadorId = trabajadorId,
                    onNavigateBack = {
                        navController.popBackStack()
                    },
                    onNavigateToScanner = { type ->
                        navController.navigate("scanner/$trabajadorId?type=$type")
                    }
                )
            }
        }
    }
}