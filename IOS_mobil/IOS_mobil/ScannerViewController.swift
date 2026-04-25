import UIKit
import AVFoundation

class ScannerViewController: UIViewController, AVCaptureMetadataOutputObjectsDelegate {

    var usuarioId: Int?
    var captureSession: AVCaptureSession!
    var previewLayer: AVCaptureVideoPreviewLayer!

    override func viewDidLoad() {
        super.viewDidLoad()
        view.backgroundColor = .black
        checkCameraPermissions()
    }
    
    private func checkCameraPermissions() {
        switch AVCaptureDevice.authorizationStatus(for: .video) {
        case .authorized:
            setupCaptureSession()
        case .notDetermined:
            AVCaptureDevice.requestAccess(for: .video) { [weak self] granted in
                if granted {
                    DispatchQueue.main.async {
                        self?.setupCaptureSession()
                    }
                }
            }
        case .denied, .restricted:
            showPermissionError()
        @unknown default:
            break
        }
    }

    private func setupCaptureSession() {
        captureSession = AVCaptureSession()

        guard let videoCaptureDevice = AVCaptureDevice.default(for: .video) else { 
            failed()
            return 
        }
        
        let videoInput: AVCaptureDeviceInput

        do {
            videoInput = try AVCaptureDeviceInput(device: videoCaptureDevice)
        } catch {
            failed()
            return
        }

        if (captureSession.canAddInput(videoInput)) {
            captureSession.addInput(videoInput)
        } else {
            failed()
            return
        }

        let metadataOutput = AVCaptureMetadataOutput()

        if (captureSession.canAddOutput(metadataOutput)) {
            captureSession.addOutput(metadataOutput)

            metadataOutput.setMetadataObjectsDelegate(self, queue: DispatchQueue.main)
            metadataOutput.metadataObjectTypes = [.qr]
        } else {
            failed()
            return
        }

        previewLayer = AVCaptureVideoPreviewLayer(session: captureSession)
        previewLayer.frame = view.layer.bounds
        previewLayer.videoGravity = .resizeAspectFill
        view.layer.addSublayer(previewLayer)

        // Ejecutar en hilo de fondo para no bloquear la UI
        DispatchQueue.global(qos: .userInitiated).async {
            self.captureSession.startRunning()
        }
    }
    
    override func viewDidLayoutSubviews() {
        super.viewDidLayoutSubviews()
        // Asegurar que el layer tenga el tamaño correcto cuando la vista ya se acomodó
        if let previewLayer = previewLayer {
            previewLayer.frame = view.bounds
        }
    }

    func failed() {
        let ac = UIAlertController(title: "Error", message: "No se pudo iniciar la cámara.", preferredStyle: .alert)
        ac.addAction(UIAlertAction(title: "OK", style: .default))
        present(ac, animated: true)
        captureSession = nil
    }
    
    func showPermissionError() {
        let ac = UIAlertController(title: "Permiso denegado", message: "Necesitas habilitar la cámara en los ajustes para escanear el QR.", preferredStyle: .alert)
        ac.addAction(UIAlertAction(title: "Ir a Ajustes", style: .default) { _ in
            if let settingsUrl = URL(string: UIApplication.openSettingsURLString) {
                UIApplication.shared.open(settingsUrl)
            }
        })
        ac.addAction(UIAlertAction(title: "Cancelar", style: .cancel))
        present(ac, animated: true)
    }

    override func viewWillAppear(_ animated: Bool) {
        super.viewWillAppear(animated)
        if (captureSession?.isRunning == false) {
            DispatchQueue.global(qos: .userInitiated).async {
                self.captureSession.startRunning()
            }
        }
    }

    override func viewWillDisappear(_ animated: Bool) {
        super.viewWillDisappear(animated)
        if (captureSession?.isRunning == true) {
            captureSession.stopRunning()
        }
    }

    func metadataOutput(_ output: AVCaptureMetadataOutput, didOutput metadataObjects: [AVMetadataObject], from connection: AVCaptureConnection) {
        if let metadataObject = metadataObjects.first {
            guard let readableObject = metadataObject as? AVMetadataMachineReadableCodeObject else { return }
            guard let stringValue = readableObject.stringValue else { return }
            
            captureSession.stopRunning()
            AudioServicesPlaySystemSound(SystemSoundID(kSystemSoundID_Vibrate))
            found(code: stringValue)
        }
    }

    func found(code: String) {
        let tipo = code.contains("SALIDA") ? "SALIDA" : "ENTRADA"
        guard let id = usuarioId else { return }
        
        let request = AsistenciaQrRequest(
            trabajadorId: id,
            qrToken: code,
            tipo: tipo,
            latitud: 0.0,
            longitud: 0.0
        )
        
        NetworkManager.shared.registrarAsistenciaQR(request: request) { [weak self] result in
            DispatchQueue.main.async {
                switch result {
                case .success:
                    self?.showSuccess(tipo: tipo)
                case .failure(let error):
                    self?.showError(error: error)
                }
            }
        }
    }

    private func showSuccess(tipo: String) {
        let alert = UIAlertController(title: "¡Éxito!", message: "Se ha registrado tu \(tipo) correctamente.", preferredStyle: .alert)
        alert.addAction(UIAlertAction(title: "OK", style: .default) { _ in
            self.navigationController?.popViewController(animated: true)
        })
        present(alert, animated: true)
    }

    private func showError(error: NetworkError) {
        let alert = UIAlertController(title: "Error", message: "No se pudo registrar la asistencia.", preferredStyle: .alert)
        alert.addAction(UIAlertAction(title: "Reintentar", style: .default) { _ in
            DispatchQueue.global(qos: .userInitiated).async {
                self.captureSession.startRunning()
            }
        })
        alert.addAction(UIAlertAction(title: "Cancelar", style: .cancel) { _ in
            self.navigationController?.popViewController(animated: true)
        })
        present(alert, animated: true)
    }

    override var prefersStatusBarHidden: Bool { return true }
    override var supportedInterfaceOrientations: UIInterfaceOrientationMask { return .portrait }
}
