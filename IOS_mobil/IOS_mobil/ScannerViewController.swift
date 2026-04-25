import UIKit
import AVFoundation
import CoreLocation

class ScannerViewController: UIViewController, AVCaptureMetadataOutputObjectsDelegate, CLLocationManagerDelegate {

    var usuarioId: Int?
    var captureSession: AVCaptureSession!
    var previewLayer: AVCaptureVideoPreviewLayer!
    var locationManager = CLLocationManager()
    var currentCoordinate: CLLocationCoordinate2D?
    var selectedTipo: String = "ENTRADA" // Default
    
    private let scannerGuideView: UIView = {
        let v = UIView()
        v.layer.borderColor = UIColor.systemOrange.cgColor
        v.layer.borderWidth = 3
        v.layer.cornerRadius = 16
        v.translatesAutoresizingMaskIntoConstraints = false
        return v
    }()
    
    private let backButton: UIButton = {
        let b = UIButton(type: .system)
        b.setTitle("✕", for: .normal)
        b.titleLabel?.font = .systemFont(ofSize: 24, weight: .bold)
        b.setTitleColor(.white, for: .normal)
        b.backgroundColor = UIColor.black.withAlphaComponent(0.6)
        b.layer.cornerRadius = 25
        b.translatesAutoresizingMaskIntoConstraints = false
        return b
    }()
    
    private let instructionLabel: UILabel = {
        let lbl = UILabel()
        lbl.text = "Apunta al código QR"
        lbl.font = .systemFont(ofSize: 16, weight: .medium)
        lbl.textColor = .white
        lbl.textAlignment = .center
        lbl.backgroundColor = UIColor.black.withAlphaComponent(0.5)
        lbl.layer.cornerRadius = 12
        lbl.clipsToBounds = true
        lbl.translatesAutoresizingMaskIntoConstraints = false
        return lbl
    }()
    
    private let tipoSelector: UISegmentedControl = {
        let sc = UISegmentedControl(items: ["🟢 ENTRADA", "🔴 SALIDA"])
        sc.selectedSegmentIndex = 0
        sc.backgroundColor = UIColor.black.withAlphaComponent(0.6)
        sc.selectedSegmentTintColor = .systemOrange
        sc.setTitleTextAttributes([.foregroundColor: UIColor.white, .font: UIFont.boldSystemFont(ofSize: 15)], for: .selected)
        sc.setTitleTextAttributes([.foregroundColor: UIColor.lightGray, .font: UIFont.systemFont(ofSize: 15)], for: .normal)
        sc.translatesAutoresizingMaskIntoConstraints = false
        return sc
    }()

    override func viewDidLoad() {
        super.viewDidLoad()
        view.backgroundColor = .black
        setupLocation()
        checkCameraPermissions()
        setupUI()
    }
    
    private func setupUI() {
        view.addSubview(scannerGuideView)
        view.addSubview(backButton)
        view.addSubview(instructionLabel)
        view.addSubview(tipoSelector)
        
        NSLayoutConstraint.activate([
            // Guía del scanner
            scannerGuideView.centerXAnchor.constraint(equalTo: view.centerXAnchor),
            scannerGuideView.centerYAnchor.constraint(equalTo: view.centerYAnchor, constant: -30),
            scannerGuideView.widthAnchor.constraint(equalToConstant: 260),
            scannerGuideView.heightAnchor.constraint(equalToConstant: 260),
            
            // Botón cerrar
            backButton.topAnchor.constraint(equalTo: view.safeAreaLayoutGuide.topAnchor, constant: 16),
            backButton.leadingAnchor.constraint(equalTo: view.leadingAnchor, constant: 16),
            backButton.widthAnchor.constraint(equalToConstant: 50),
            backButton.heightAnchor.constraint(equalToConstant: 50),
            
            // Selector ENTRADA/SALIDA
            tipoSelector.topAnchor.constraint(equalTo: view.safeAreaLayoutGuide.topAnchor, constant: 20),
            tipoSelector.centerXAnchor.constraint(equalTo: view.centerXAnchor),
            tipoSelector.widthAnchor.constraint(equalToConstant: 240),
            tipoSelector.heightAnchor.constraint(equalToConstant: 40),
            
            // Instrucción
            instructionLabel.topAnchor.constraint(equalTo: scannerGuideView.bottomAnchor, constant: 24),
            instructionLabel.centerXAnchor.constraint(equalTo: view.centerXAnchor),
            instructionLabel.widthAnchor.constraint(equalToConstant: 260),
            instructionLabel.heightAnchor.constraint(equalToConstant: 40),
        ])
        
        backButton.addTarget(self, action: #selector(backPressed), for: .touchUpInside)
        tipoSelector.addTarget(self, action: #selector(tipoChanged), for: .valueChanged)
    }
    
    @objc private func backPressed() {
        captureSession?.stopRunning()
        if let nav = navigationController {
            nav.popViewController(animated: true)
        } else {
            dismiss(animated: true)
        }
    }
    
    @objc private func tipoChanged(_ sender: UISegmentedControl) {
        selectedTipo = sender.selectedSegmentIndex == 0 ? "ENTRADA" : "SALIDA"
        scannerGuideView.layer.borderColor = sender.selectedSegmentIndex == 0
            ? UIColor.systemGreen.cgColor
            : UIColor.systemRed.cgColor
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
        guard let id = usuarioId else { return }
        
        let request = AsistenciaQrRequest(
            trabajadorId: id,
            qrToken: code,
            tipo: selectedTipo,
            latitud: currentCoordinate?.latitude ?? 0.0,
            longitud: currentCoordinate?.longitude ?? 0.0
        )
        
        // Mostrar indicador de carga
        instructionLabel.text = "⏳ Registrando..."
        
        NetworkManager.shared.registrarAsistenciaQR(request: request) { [weak self] result in
            DispatchQueue.main.async {
                switch result {
                case .success(let asistencia):
                    self?.showSuccess(asistencia: asistencia)
                case .failure(let error):
                    print("Error en registro QR: \(error)")
                    self?.showError(error: error)
                }
            }
        }
    }

    private func showSuccess(asistencia: AsistenciaResponse) {
        let tipo = asistencia.tipo ?? selectedTipo
        let alert = UIAlertController(
            title: "✅ ¡Registro Exitoso!",
            message: "\(tipo) registrada correctamente.\n\nModalidad: \(asistencia.modalidad?.nombre ?? "N/A")",
            preferredStyle: .alert
        )
        alert.addAction(UIAlertAction(title: "OK", style: .default) { [weak self] _ in
            if let nav = self?.navigationController {
                nav.popViewController(animated: true)
            } else {
                self?.dismiss(animated: true)
            }
        })
        present(alert, animated: true)
    }

    private func showError(error: NetworkError) {
        let msg: String
        switch error {
        case .serverError(let detail): msg = detail
        default: msg = "No se pudo registrar. Verifica tu ubicación o el QR."
        }
        let alert = UIAlertController(title: "⚠️ Error", message: msg, preferredStyle: .alert)
        alert.addAction(UIAlertAction(title: "Reintentar", style: .default) { [weak self] _ in
            self?.instructionLabel.text = "Apunta al código QR"
            DispatchQueue.global(qos: .userInitiated).async { self?.captureSession.startRunning() }
        })
        alert.addAction(UIAlertAction(title: "Cancelar", style: .cancel) { [weak self] _ in
            if let nav = self?.navigationController {
                nav.popViewController(animated: true)
            } else {
                self?.dismiss(animated: true)
            }
        })
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
