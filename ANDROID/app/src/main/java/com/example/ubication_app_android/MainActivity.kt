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
import androidx.navigation.compose.NavHost
import androidx.navigation.compose.composable
import androidx.navigation.compose.rememberNavController
import com.example.ubication_app_android.ui.dashboard.DashboardScreen
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
                    onLoginSuccess = { username ->
                        navController.navigate("dashboard/$username") {
                            popUpTo("login") { inclusive = true }
                        }
                    }
                )
            }
            composable("dashboard/{username}") { backStackEntry ->
                val username = backStackEntry.arguments?.getString("username") ?: "Usuario"
                DashboardScreen(
                    username = username,
                    onLogout = {
                        navController.navigate("login") {
                            popUpTo("dashboard/$username") { inclusive = true }
                        }
                    }
                )
            }
        }
    }
}