import UIKit
import CoreLocation
import MapKit

class AdminSettingsViewController: UIViewController, CLLocationManagerDelegate, MKMapViewDelegate {

    private let locationManager = CLLocationManager()
    private var currentCoordinate: CLLocationCoordinate2D?
    private var previousCoordinate: CLLocationCoordinate2D?
    private var selectedRadius: Int = 20
    private var refreshTimer: Timer?
    
    private let statusLabel: UILabel = {
        let l = UILabel()
        l.text = "Configuración de Oficina"
        l.font = .boldSystemFont(ofSize: 22)
        l.textAlignment = .center
        l.translatesAutoresizingMaskIntoConstraints = false
        return l
    }()
    
    private let previousLocLabel: UILabel = {
        let l = UILabel()
        l.text = "Ubicación Anterior: Cargando..."
        l.font = .systemFont(ofSize: 13, weight: .medium)
        l.textColor = .secondaryLabel
        l.textAlignment = .center
        l.numberOfLines = 0
        l.translatesAutoresizingMaskIntoConstraints = false
        return l
    }()
    
    private let mapView: MKMapView = {
        let mv = MKMapView()
        mv.layer.cornerRadius = 20
        mv.clipsToBounds = true
        mv.translatesAutoresizingMaskIntoConstraints = false
        return mv
    }()
    
    private let coordsLabel: UILabel = {
        let l = UILabel()
        l.text = "Lat: -, Lng: -"
        l.font = .monospacedSystemFont(ofSize: 14, weight: .bold)
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
        b.setTitle("📍 Capturar Ubicación Actual", for: .normal)
        b.backgroundColor = .systemBlue
        b.setTitleColor(.white, for: .normal)
        b.titleLabel?.font = .boldSystemFont(ofSize: 16)
        b.layer.cornerRadius = 12
        b.translatesAutoresizingMaskIntoConstraints = false
        return b
    }()
    
    private let saveButton: UIButton = {
        let b = UIButton(type: .system)
        b.setTitle("Guardar Configuración", for: .normal)
        b.backgroundColor = .systemGreen
        b.setTitleColor(.white, for: .normal)
        b.titleLabel?.font = .boldSystemFont(ofSize: 18)
        b.layer.cornerRadius = 12
        b.translatesAutoresizingMaskIntoConstraints = false
        return b
    }()

    override func viewDidLoad() {
        super.viewDidLoad()
        view.backgroundColor = .systemGroupedBackground
        view.layer.cornerRadius = 30
        view.layer.maskedCorners = [.layerMinXMinYCorner, .layerMaxXMinYCorner]
        view.clipsToBounds = true
        title = "Ajustes de Oficina"
        setupUI()
        setupLocation()
        fetchCurrentConfig()
    }
    
    override func viewWillAppear(_ animated: Bool) {
        super.viewWillAppear(animated)
        startAutoRefresh()
    }

    override func viewWillDisappear(_ animated: Bool) {
        super.viewWillDisappear(animated)
        stopAutoRefresh()
    }

    private func startAutoRefresh() {
        // Refrescar configuración cada 30 segundos
        refreshTimer = Timer.scheduledTimer(withTimeInterval: 30, repeats: true) { [weak self] _ in
            self?.fetchCurrentConfig()
        }
    }

    private func stopAutoRefresh() {
        refreshTimer?.invalidate()
        refreshTimer = nil
    }
    
    private func setupUI() {
        view.addSubview(statusLabel)
        view.addSubview(previousLocLabel)
        view.addSubview(mapView)
        view.addSubview(coordsLabel)
        view.addSubview(radiusSegment)
        view.addSubview(captureButton)
        view.addSubview(saveButton)
        
        mapView.delegate = self
        
        NSLayoutConstraint.activate([
            statusLabel.topAnchor.constraint(equalTo: view.safeAreaLayoutGuide.topAnchor, constant: 20),
            statusLabel.leadingAnchor.constraint(equalTo: view.leadingAnchor, constant: 20),
            statusLabel.trailingAnchor.constraint(equalTo: view.trailingAnchor, constant: -20),
            
            previousLocLabel.topAnchor.constraint(equalTo: statusLabel.bottomAnchor, constant: 8),
            previousLocLabel.leadingAnchor.constraint(equalTo: view.leadingAnchor, constant: 20),
            previousLocLabel.trailingAnchor.constraint(equalTo: view.trailingAnchor, constant: -20),
            
            mapView.topAnchor.constraint(equalTo: previousLocLabel.bottomAnchor, constant: 20),
            mapView.leadingAnchor.constraint(equalTo: view.leadingAnchor, constant: 20),
            mapView.trailingAnchor.constraint(equalTo: view.trailingAnchor, constant: -20),
            mapView.heightAnchor.constraint(equalToConstant: 250),
            
            coordsLabel.topAnchor.constraint(equalTo: mapView.bottomAnchor, constant: 12),
            coordsLabel.leadingAnchor.constraint(equalTo: view.leadingAnchor, constant: 20),
            coordsLabel.trailingAnchor.constraint(equalTo: view.trailingAnchor, constant: -20),
            
            captureButton.topAnchor.constraint(equalTo: coordsLabel.bottomAnchor, constant: 15),
            captureButton.leadingAnchor.constraint(equalTo: view.leadingAnchor, constant: 40),
            captureButton.trailingAnchor.constraint(equalTo: view.trailingAnchor, constant: -40),
            captureButton.heightAnchor.constraint(equalToConstant: 45),
            
            radiusSegment.topAnchor.constraint(equalTo: captureButton.bottomAnchor, constant: 25),
            radiusSegment.leadingAnchor.constraint(equalTo: view.leadingAnchor, constant: 40),
            radiusSegment.trailingAnchor.constraint(equalTo: view.trailingAnchor, constant: -40),
            
            saveButton.bottomAnchor.constraint(equalTo: view.safeAreaLayoutGuide.bottomAnchor, constant: -20),
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
    
    private func fetchCurrentConfig() {
        NetworkManager.shared.getConfiguracion { [weak self] result in
            DispatchQueue.main.async {
                switch result {
                case .success(let config):
                    if let lat = config.officeLat, let lng = config.officeLng {
                        let coord = CLLocationCoordinate2D(latitude: lat, longitude: lng)
                        
                        // Si la ubicación ha cambiado respecto a lo que mostramos, actualizar
                        if self?.previousCoordinate?.latitude != lat || self?.previousCoordinate?.longitude != lng {
                            self?.previousCoordinate = coord
                            self?.previousLocLabel.text = "📍 Ubicación Actual:\n\(lat), \(lng)"
                            self?.updateMapWithCoordinate(coord, radius: config.radius ?? 20)
                        }
                        
                        // Sync radius segment si no estamos capturando activamente
                        if self?.currentCoordinate == nil {
                            if let r = config.radius {
                                self?.selectedRadius = r
                                switch r {
                                case 10: self?.radiusSegment.selectedSegmentIndex = 0
                                case 20: self?.radiusSegment.selectedSegmentIndex = 1
                                case 50: self?.radiusSegment.selectedSegmentIndex = 2
                                default: break
                                }
                            }
                        }
                    } else {
                        self?.previousLocLabel.text = "⚠️ No hay ubicación configurada"
                    }
                case .failure:
                    self?.previousLocLabel.text = "⚠️ Error cargando configuración"
                }
            }
        }
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
        
        if let coord = currentCoordinate ?? previousCoordinate {
            updateMapWithCoordinate(coord, radius: selectedRadius)
        }
    }
    
    private func updateMapWithCoordinate(_ coord: CLLocationCoordinate2D, radius: Int) {
        mapView.removeAnnotations(mapView.annotations)
        mapView.removeOverlays(mapView.overlays)
        
        let annotation = MKPointAnnotation()
        annotation.coordinate = coord
        annotation.title = "Oficina"
        mapView.addAnnotation(annotation)
        
        let circle = MKCircle(center: coord, radius: CLLocationDistance(radius))
        mapView.addOverlay(circle)
        
        let region = MKCoordinateRegion(center: coord, latitudinalMeters: Double(radius) * 4, longitudinalMeters: Double(radius) * 4)
        mapView.setRegion(region, animated: true)
    }
    
    @objc private func savePressed() {
        guard let coords = currentCoordinate ?? previousCoordinate else {
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
                    let alert = UIAlertController(title: "¡Éxito!", message: "La configuración ha sido guardada correctamente.", preferredStyle: .alert)
                    alert.addAction(UIAlertAction(title: "OK", style: .default) { _ in
                        self?.navigationController?.popViewController(animated: true)
                    })
                    self?.present(alert, animated: true)
                    SupabaseService.shared.log(mensaje: "Configuración de oficina actualizada", tipo: "INFO")
                case .failure(let error):
                    let alert = UIAlertController(title: "Error", message: "No se pudo guardar: \(error)", preferredStyle: .alert)
                    alert.addAction(UIAlertAction(title: "OK", style: .default))
                    self?.present(alert, animated: true)
                }
            }
        }
    }
    
    // MARK: - CLLocationManagerDelegate
    func locationManager(_ manager: CLLocationManager, didUpdateLocations locations: [CLLocation]) {
        if let location = locations.last {
            currentCoordinate = location.coordinate
            coordsLabel.text = "Nueva Lat: \(location.coordinate.latitude)\nNueva Lng: \(location.coordinate.longitude)"
            captureButton.setTitle("✅ Ubicación Capturada", for: .normal)
            captureButton.isEnabled = true
            
            updateMapWithCoordinate(location.coordinate, radius: selectedRadius)
            locationManager.stopUpdatingLocation()
        }
    }
    
    // MARK: - MKMapViewDelegate
    func mapView(_ mapView: MKMapView, rendererFor overlay: MKOverlay) -> MKOverlayRenderer {
        if let circleOverlay = overlay as? MKCircle {
            let circleRenderer = MKCircleRenderer(circle: circleOverlay)
            circleRenderer.fillColor = UIColor.systemBlue.withAlphaComponent(0.2)
            circleRenderer.strokeColor = .systemBlue
            circleRenderer.lineWidth = 1
            return circleRenderer
        }
        return MKOverlayRenderer(overlay: overlay)
    }
}
