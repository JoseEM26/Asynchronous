import UIKit
import CoreLocation

class AdminSettingsViewController: UIViewController, CLLocationManagerDelegate {

    private let locationManager = CLLocationManager()
    private var currentCoordinate: CLLocationCoordinate2D?
    private var selectedRadius: Int = 20
    
    private let statusLabel: UILabel = {
        let l = UILabel()
        l.text = "Configuración de Oficina"
        l.font = .boldSystemFont(ofSize: 22)
        l.textAlignment = .center
        l.translatesAutoresizingMaskIntoConstraints = false
        return l
    }()
    
    private let coordsLabel: UILabel = {
        let l = UILabel()
        l.text = "Lat: -, Lng: -"
        l.font = .monospacedSystemFont(ofSize: 14, weight: .regular)
        l.textAlignment = .center
        l.numberOfLines = 0
        l.translatesAutoresizingMaskIntoConstraints = false
        return l
    }()
    
    private let radiusSegment: UISegmentedControl = {
        let sc = UISegmentedControl(items: ["10m", "20m", "50m"])
        sc.selectedSegmentIndex = 1
        sc.translatesAutoresizingMaskIntoConstraints = false
        return sc
    }()
    
    private let captureButton: UIButton = {
        let b = UIButton(type: .system)
        b.setTitle("📍 Capturar Mi Ubicación Actual", for: .normal)
        b.backgroundColor = .systemBlue
        b.setTitleColor(.white, for: .normal)
        b.layer.cornerRadius = 12
        b.translatesAutoresizingMaskIntoConstraints = false
        return b
    }()
    
    private let saveButton: UIButton = {
        let b = UIButton(type: .system)
        b.setTitle("Guardar Cambios", for: .normal)
        b.backgroundColor = .systemGreen
        b.setTitleColor(.white, for: .normal)
        b.layer.cornerRadius = 12
        b.translatesAutoresizingMaskIntoConstraints = false
        return b
    }()

    override func viewDidLoad() {
        super.viewDidLoad()
        view.backgroundColor = .systemGroupedBackground
        title = "Admin Tools"
        setupUI()
        setupLocation()
    }
    
    private func setupUI() {
        view.addSubview(statusLabel)
        view.addSubview(coordsLabel)
        view.addSubview(radiusSegment)
        view.addSubview(captureButton)
        view.addSubview(saveButton)
        
        NSLayoutConstraint.activate([
            statusLabel.topAnchor.constraint(equalTo: view.safeAreaLayoutGuide.topAnchor, constant: 40),
            statusLabel.leadingAnchor.constraint(equalTo: view.leadingAnchor, constant: 20),
            statusLabel.trailingAnchor.constraint(equalTo: view.trailingAnchor, constant: -20),
            
            captureButton.topAnchor.constraint(equalTo: statusLabel.bottomAnchor, constant: 40),
            captureButton.leadingAnchor.constraint(equalTo: view.leadingAnchor, constant: 40),
            captureButton.trailingAnchor.constraint(equalTo: view.trailingAnchor, constant: -40),
            captureButton.heightAnchor.constraint(equalToConstant: 50),
            
            coordsLabel.topAnchor.constraint(equalTo: captureButton.bottomAnchor, constant: 10),
            coordsLabel.leadingAnchor.constraint(equalTo: view.leadingAnchor, constant: 20),
            coordsLabel.trailingAnchor.constraint(equalTo: view.trailingAnchor, constant: -20),
            
            radiusSegment.topAnchor.constraint(equalTo: coordsLabel.bottomAnchor, constant: 40),
            radiusSegment.leadingAnchor.constraint(equalTo: view.leadingAnchor, constant: 40),
            radiusSegment.trailingAnchor.constraint(equalTo: view.trailingAnchor, constant: -40),
            
            saveButton.bottomAnchor.constraint(equalTo: view.safeAreaLayoutGuide.bottomAnchor, constant: -40),
            saveButton.leadingAnchor.constraint(equalTo: view.leadingAnchor, constant: 40),
            saveButton.trailingAnchor.constraint(equalTo: view.trailingAnchor, constant: -40),
            saveButton.heightAnchor.constraint(equalToConstant: 55)
        ])
        
        captureButton.addTarget(self, action: #selector(capturePressed), for: .touchUpInside)
        saveButton.addTarget(self, action: #selector(savePressed), for: .touchUpInside)
        radiusSegment.addTarget(self, action: #selector(radiusChanged), for: .valueChanged)
    }
    
    private func setupLocation() {
        locationManager.delegate = self
        locationManager.requestWhenInUseAuthorization()
    }
    
    @objc private func capturePressed() {
        locationManager.startUpdatingLocation()
        captureButton.setTitle("Obteniendo GPS...", for: .normal)
        captureButton.isEnabled = false
    }
    
    @objc private func radiusChanged() {
        switch radiusSegment.selectedSegmentIndex {
        case 0: selectedRadius = 10
        case 1: selectedRadius = 20
        case 2: selectedRadius = 50
        default: selectedRadius = 20
        }
    }
    
    @objc private func savePressed() {
        guard let coords = currentCoordinate else {
            let alert = UIAlertController(title: "Error", message: "Primero captura tu ubicación GPS.", preferredStyle: .alert)
            alert.addAction(UIAlertAction(title: "OK", style: .default))
            present(alert, animated: true)
            return
        }
        
        saveButton.isEnabled = false
        NetworkManager.shared.updateConfiguracion(lat: coords.latitude, lng: coords.longitude, radius: selectedRadius) { [weak self] result in
            DispatchQueue.main.async {
                self?.saveButton.isEnabled = true
                switch result {
                case .success:
                    let alert = UIAlertController(title: "¡Éxito!", message: "Configuración de oficina actualizada correctamente.", preferredStyle: .alert)
                    alert.addAction(UIAlertAction(title: "OK", style: .default) { _ in
                        self?.navigationController?.popViewController(animated: true)
                    })
                    self?.present(alert, animated: true)
                case .failure(let error):
                    print("Error: \(error)")
                }
            }
        }
    }
    
    func locationManager(_ manager: CLLocationManager, didUpdateLocations locations: [CLLocation]) {
        if let location = locations.last {
            currentCoordinate = location.coordinate
            coordsLabel.text = "Lat: \(location.coordinate.latitude)\nLng: \(location.coordinate.longitude)"
            captureButton.setTitle("✅ Ubicación Capturada", for: .normal)
            captureButton.isEnabled = true
            locationManager.stopUpdatingLocation()
        }
    }
}
