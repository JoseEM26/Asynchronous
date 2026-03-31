package com.example.ubication_app_android.ui.attendance

import android.Manifest
import android.content.pm.PackageManager
import android.util.Log
import androidx.activity.compose.rememberLauncherForActivityResult
import androidx.activity.result.contract.ActivityResultContracts
import androidx.camera.core.*
import androidx.camera.lifecycle.ProcessCameraProvider
import androidx.camera.view.PreviewView
import androidx.compose.foundation.layout.*
import androidx.compose.material.icons.Icons
import androidx.compose.material.icons.filled.ArrowBack
import androidx.compose.material3.*
import androidx.compose.runtime.*
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.platform.LocalContext
import androidx.compose.ui.platform.LocalLifecycleOwner
import androidx.compose.ui.unit.dp
import androidx.compose.ui.viewinterop.AndroidView
import androidx.core.content.ContextCompat
import androidx.lifecycle.viewmodel.compose.viewModel
import com.example.ubication_app_android.data.model.AsistenciaQrRequest
import com.example.ubication_app_android.util.Constants
import com.google.mlkit.vision.barcode.BarcodeScannerOptions
import com.google.mlkit.vision.barcode.BarcodeScanning
import com.google.mlkit.vision.barcode.common.Barcode
import com.google.mlkit.vision.common.InputImage
import java.util.concurrent.Executors

@OptIn(ExperimentalMaterial3Api::class)
@Composable
fun QRScannerScreen(
    trabajadorId: Int,
    defaultType: String? = null,
    viewModel: QRScannerViewModel = viewModel(),
    onNavigateBack: () -> Unit
) {
    val context = LocalContext.current
    val lifecycleOwner = LocalLifecycleOwner.current
    val attendanceState by viewModel.attendanceState.collectAsState()
    
    var hasCameraPermission by remember {
        mutableStateOf(
            ContextCompat.checkSelfPermission(context, Manifest.permission.CAMERA) == PackageManager.PERMISSION_GRANTED
        )
    }
    
    val launcher = rememberLauncherForActivityResult(
        contract = ActivityResultContracts.RequestPermission(),
        onResult = { granted -> hasCameraPermission = granted }
    )
    
    LaunchedEffect(Unit) {
        if (!hasCameraPermission) {
            launcher.launch(Manifest.permission.CAMERA)
        }
    }

    Scaffold(
        topBar = {
            TopAppBar(
                title = { Text("Escanear QR") },
                navigationIcon = {
                    IconButton(onClick = onNavigateBack) {
                        Icon(Icons.Default.ArrowBack, contentDescription = "Atrás")
                    }
                }
            )
        }
    ) { padding ->
        if (hasCameraPermission) {
            Box(modifier = Modifier.padding(padding).fillMaxSize()) {
                CameraPreview(
                    onBarcodeDetected = { qrToken ->
                        // Handled inside CameraPreview for now to maintain state
                    },
                    viewModel = viewModel,
                    trabajadorId = trabajadorId,
                    defaultType = defaultType
                )
                
                AttendanceStatusOverlay(
                    state = attendanceState,
                    onDismiss = { 
                        viewModel.resetState()
                        if (attendanceState is AttendanceResult.Success) onNavigateBack()
                    },
                    onNavigateBack = onNavigateBack
                )
            }
        } else {
            Box(modifier = Modifier.fillMaxSize(), contentAlignment = Alignment.Center) {
                Text("Se requiere permiso de cámara para escanear QR")
            }
        }
    }
}

@Composable
fun CameraPreview(
    onBarcodeDetected: (String) -> Unit,
    viewModel: QRScannerViewModel,
    trabajadorId: Int,
    defaultType: String? = null
) {
    val context = LocalContext.current
    val lifecycleOwner = LocalLifecycleOwner.current
    val cameraExecutor = remember { Executors.newSingleThreadExecutor() }
    
    var isScanningEnabled by remember { mutableStateOf(true) }
    var showTypeSelection by remember { mutableStateOf<String?>(null) } // token

    if (showTypeSelection != null) {
        AlertDialog(
            onDismissRequest = { 
                showTypeSelection = null 
                isScanningEnabled = true
            },
            title = { Text("Registrar Asistencia") },
            text = { Text("Seleccione el tipo de registro para el código escaneado.") },
            confirmButton = {
                Button(onClick = {
                    viewModel.registrarAsistencia(
                        Constants.BASE_URL,
                        AsistenciaQrRequest(
                            trabajadorId = trabajadorId,
                            qrToken = showTypeSelection!!,
                            tipo = "ENTRADA",
                            latitud = 0.0,
                            longitud = 0.0
                        )
                    )
                    showTypeSelection = null
                }) { Text("Entrada") }
            },
            dismissButton = {
                Button(onClick = {
                    viewModel.registrarAsistencia(
                        Constants.BASE_URL,
                        AsistenciaQrRequest(
                            trabajadorId = trabajadorId,
                            qrToken = showTypeSelection!!,
                            tipo = "SALIDA",
                            latitud = 0.0,
                            longitud = 0.0
                        )
                    )
                    showTypeSelection = null
                }) { Text("Salida") }
            }
        )
    }

    AndroidView(
        factory = { ctx ->
            PreviewView(ctx).apply {
                val cameraProviderFuture = ProcessCameraProvider.getInstance(ctx)
                cameraProviderFuture.addListener({
                    val cameraProvider = cameraProviderFuture.get()
                    val preview = Preview.Builder().build().also {
                        it.setSurfaceProvider(surfaceProvider)
                    }
                    
                    val imageAnalysis = ImageAnalysis.Builder()
                        .setBackpressureStrategy(ImageAnalysis.STRATEGY_KEEP_ONLY_LATEST)
                        .build()
                    
                    val scanner = BarcodeScanning.getClient()
                    
                    imageAnalysis.setAnalyzer(cameraExecutor) { imageProxy ->
                        val mediaImage = imageProxy.image
                        if (mediaImage != null && isScanningEnabled) {
                            val image = InputImage.fromMediaImage(mediaImage, imageProxy.imageInfo.rotationDegrees)
                            scanner.process(image)
                                .addOnSuccessListener { barcodes ->
                                    for (barcode in barcodes) {
                                        if (barcode.format == Barcode.FORMAT_QR_CODE) {
                                            barcode.rawValue?.let { token ->
                                                isScanningEnabled = false
                                                if (defaultType != null) {
                                                    // Process immediately with defaultType
                                                    viewModel.registrarAsistencia(
                                                        Constants.BASE_URL,
                                                        AsistenciaQrRequest(
                                                            trabajadorId = trabajadorId,
                                                            qrToken = token,
                                                            tipo = defaultType,
                                                            latitud = 0.0,
                                                            longitud = 0.0
                                                        )
                                                    )
                                                } else {
                                                    // Show dialog
                                                    showTypeSelection = token
                                                }
                                            }
                                        }
                                    }
                                }
                                .addOnCompleteListener {
                                    imageProxy.close()
                                }
                        } else {
                            imageProxy.close()
                        }
                    }

                    try {
                        cameraProvider.unbindAll()
                        cameraProvider.bindToLifecycle(
                            lifecycleOwner,
                            CameraSelector.DEFAULT_BACK_CAMERA,
                            preview,
                            imageAnalysis
                        )
                    } catch (e: Exception) {
                        Log.e("CameraPreview", "Binding failed", e)
                    }
                }, ContextCompat.getMainExecutor(ctx))
            }
        },
        modifier = Modifier.fillMaxSize()
    )
}

@Composable
fun AttendanceStatusOverlay(
    state: AttendanceResult,
    onDismiss: () -> Unit,
    onNavigateBack: (() -> Unit)? = null
) {
    when (state) {
        is AttendanceResult.Loading -> {
            Box(modifier = Modifier.fillMaxSize(), contentAlignment = Alignment.Center) {
                CircularProgressIndicator()
            }
        }
        is AttendanceResult.Success -> {
            AlertDialog(
                onDismissRequest = onDismiss,
                title = { Text("¡Éxito!") },
                text = { Text("Asistencia registrada correctamente.\n\nFecha: ${state.response.fecha}\nTipo: ${state.response.tipo}") },
                confirmButton = {
                    Button(onClick = onDismiss) { Text("Aceptar") }
                }
            )
        }
        is AttendanceResult.Error -> {
            com.example.ubication_app_android.ui.components.DetailedErrorDialog(
                message = state.message,
                errorDetails = state.errorDetails,
                onDismiss = onDismiss,
                onNavigateBack = onNavigateBack
            )
        }
        else -> {}
    }
}

@androidx.compose.ui.tooling.preview.Preview(showBackground = true)
@Composable
fun QRScannerScreenPreview() {
    com.example.ubication_app_android.ui.theme.UBICATION_APP_ANDROIDTheme {
        QRScannerScreen(
            trabajadorId = 1,
            onNavigateBack = {}
        )
    }
}
