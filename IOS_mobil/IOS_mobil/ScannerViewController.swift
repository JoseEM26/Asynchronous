import UIKit
import AVFoundation
import CoreLocation

class ScannerViewController: UIViewController, AVCaptureMetadataOutputObjectsDelegate, CLLocationManagerDelegate {

    var usuarioId: Int?
    var captureSession: AVCaptureSession!
    var previewLayer: AVCaptureVideoPreviewLayer!
    var locationManager = CLLocationManager()
    var currentCoordinate: CLLocationCoordinate2D?
    
    private let scannerGuideView: UIView = {
        let v = UIView()
        v.layer.borderColor = UIColor.systemGreen.cgColor
        v.layer.borderWidth = 3
        v.layer.cornerRadius = 12
        v.translatesAutoresizingMaskIntoConstraints = false
        return v
    }()
    
    private let backButton: UIButton = {
        let b = UIButton(type: .system)
        b.setTitle("✕", for: .normal)
        b.titleLabel?.font = .systemFont(ofSize: 24, weight: .bold)
        b.setTitleColor(.white, for: .normal)
        b.backgroundColor = UIColor.black.withAlphaComponent(0.5)
        b.layer.cornerRadius = 25
        b.translatesAutoresizingMaskIntoConstraints = false
        return b
    }()

    override func viewDidLoad() {
        super.viewDidLoad()
        view.backgroundColor = .black
        setupUI()
        setupLocation()
        checkCameraPermissions()
    }
    
    private func setupUI() {
        view.addSubview(scannerGuideView)
        view.addSubview(backButton)
        
        NSLayoutConstraint.activate([
            scannerGuideView.centerXAnchor.constraint(equalTo: view.centerXAnchor),
            scannerGuideView.centerYAnchor.constraint(equalTo: view.centerYAnchor),
            scannerGuideView.widthAnchor.constraint(equalToConstant: 250),
            scannerGuideView.heightAnchor.constraint(equalToConstant: 250),
            
            backButton.topAnchor.constraint(equalTo: view.safeAreaLayoutGuide.topAnchor, constant: 16),
            backButton.leadingAnchor.constraint(equalTo: view.leadingAnchor, constant: 16),
            backButton.widthAnchor.constraint(equalToConstant: 50),
            backButton.heightAnchor.constraint(equalToConstant: 50)
        ])
        
        backButton.addTarget(self, action: #selector(backPressed), for: .touchUpInside)
    }
    
    @objc private func backPressed() {
        navigationController?.popViewController(animated: true)
    }
    
    private func setupLocation() {
        locationManager.delegate = self
        locationManager.desiredAccuracy = kCLLocationAccuracyBest
        locationManager.requestWhenInUseAuthorization()
        locationManager.startUpdatingLocation()
    }
    
    func locationManager(_ manager: CLLocationManager, didUpdateLocations locations: [CLLocation]) {
        currentCoordinate = locations.last?.coordinate
    }

    private func checkCameraPermissions() {
        switch AVCaptureDevice.authorizationStatus(for: .video) {
        case .authorized: setupCaptureSession()
        case .notDetermined:
            AVCaptureDevice.requestAccess(for: .video) { [weak self] granted in
                if granted { DispatchQueue.main.async { self?.setupCaptureSession() } }
            }
        case .denied, .restricted: showPermissionError()
        @unknown default: break
        }
    }

    private func setupCaptureSession() {
        captureSession = AVCaptureSession()
        guard let videoCaptureDevice = AVCaptureDevice.default(for: .video) else { return }
        let videoInput: AVCaptureDeviceInput
        do { videoInput = try AVCaptureDeviceInput(device: videoCaptureDevice) } catch { return }
        if (captureSession.canAddInput(videoInput)) { captureSession.addInput(videoInput) } else { return }
        let metadataOutput = AVCaptureMetadataOutput()
        if (captureSession.canAddOutput(metadataOutput)) {
            captureSession.addOutput(metadataOutput)
            metadataOutput.setMetadataObjectsDelegate(self, queue: DispatchQueue.main)
            metadataOutput.metadataObjectTypes = [.qr]
        } else { return }
        previewLayer = AVCaptureVideoPreviewLayer(session: captureSession)
        previewLayer.videoGravity = .resizeAspectFill
        view.layer.insertSublayer(previewLayer, at: 0)
        DispatchQueue.global(qos: .userInitiated).async { self.captureSession.startRunning() }
    }
    
    override func viewDidLayoutSubviews() {
        super.viewDidLayoutSubviews()
        previewLayer?.frame = view.layer.bounds
    }

    func metadataOutput(_ output: AVCaptureMetadataOutput, didOutput metadataObjects: [AVMetadataObject], from connection: AVCaptureConnection) {
        if let metadataObject = metadataObjects.first {
            guard let readableObject = metadataObject as? AVMetadataMachineReadableCodeObject,
                  let stringValue = readableObject.stringValue else { return }
            
            AudioServicesPlaySystemSound(SystemSoundID(kSystemSoundID_Vibrate))
            captureSession.stopRunning()
            found(code: stringValue)
        }
    }

    func found(code: String) {
        print("QR Detectado: \(code)")
        // Si el QR no contiene ENTRADA/SALIDA, dejamos que el backend decida
        let tipo = code.contains("SALIDA") ? "SALIDA" : (code.contains("ENTRADA") ? "ENTRADA" : "AUTOMATICO")
        guard let id = usuarioId else { return }
        
        let request = AsistenciaQrRequest(
            trabajadorId: id,
            qrToken: code,
            tipo: tipo,
            latitud: currentCoordinate?.latitude ?? 0.0,
            longitud: currentCoordinate?.longitude ?? 0.0
        )
        
        NetworkManager.shared.registrarAsistenciaQR(request: request) { [weak self] result in
            DispatchQueue.main.async {
                switch result {
                case .success: self?.showSuccess(tipo: tipo)
                case .failure(let error): self?.showError(error: error)
                }
            }
        }
    }

    private func showSuccess(tipo: String) {
        let msg = tipo == "AUTOMATICO" ? "Asistencia registrada." : "Registro de \(tipo) completado."
        let alert = UIAlertController(title: "¡Éxito!", message: msg, preferredStyle: .alert)
        alert.addAction(UIAlertAction(title: "OK", style: .default) { _ in self.navigationController?.popViewController(animated: true) })
        present(alert, animated: true)
    }

    private func showError(error: NetworkError) {
        let msg: String
        switch error {
        case .serverError(let detail): msg = detail
        default: msg = "No se pudo registrar. Verifica tu ubicación o el QR."
        }
        let alert = UIAlertController(title: "Error", message: msg, preferredStyle: .alert)
        alert.addAction(UIAlertAction(title: "Reintentar", style: .default) { _ in
            DispatchQueue.global(qos: .userInitiated).async { self.captureSession.startRunning() }
        })
        alert.addAction(UIAlertAction(title: "Cancelar", style: .cancel) { _ in self.navigationController?.popViewController(animated: true) })
        present(alert, animated: true)
    }
    
    private func showPermissionError() {
        let ac = UIAlertController(title: "Permiso denegado", message: "Habilita la cámara y ubicación en los ajustes.", preferredStyle: .alert)
        ac.addAction(UIAlertAction(title: "Ajustes", style: .default) { _ in
            if let url = URL(string: UIApplication.openSettingsURLString) { UIApplication.shared.open(url) }
        })
        present(ac, animated: true)
    }
    override var prefersStatusBarHidden: Bool { return true }
}
