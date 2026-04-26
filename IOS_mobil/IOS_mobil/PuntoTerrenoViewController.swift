import UIKit
import CoreLocation
import MapKit

class PuntoTerrenoViewController: UIViewController, CLLocationManagerDelegate, MKMapViewDelegate, UIGestureRecognizerDelegate {

    var jefeId: Int?
    private let locationManager = CLLocationManager()
    private var currentCoordinate: CLLocationCoordinate2D?
    private var selectedCoordinate: CLLocationCoordinate2D?
    
    private let statusLabel: UILabel = {
        let l = UILabel()
        l.text = "Definir Punto de Terreno"
        l.font = .boldSystemFont(ofSize: 22)
        l.textAlignment = .center
        l.translatesAutoresizingMaskIntoConstraints = false
        return l
    }()
    
    private let helpLabel: UILabel = {
        let l = UILabel()
        l.text = "Toca cualquier punto en el mapa para establecerlo como lugar de asistencia para tu equipo."
        l.font = .systemFont(ofSize: 13)
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
        mv.isUserInteractionEnabled = true
        mv.translatesAutoresizingMaskIntoConstraints = false
        return mv
    }()
    
    private let captureButton: UIButton = {
        let b = UIButton(type: .system)
        b.setTitle("📍 Usar mi Ubicación Actual", for: .normal)
        b.backgroundColor = .systemBlue
        b.setTitleColor(.white, for: .normal)
        b.titleLabel?.font = .boldSystemFont(ofSize: 16)
        b.layer.cornerRadius = 12
        b.translatesAutoresizingMaskIntoConstraints = false
        return b
    }()
    
    private let saveButton: UIButton = {
        let b = UIButton(type: .system)
        b.setTitle("Establecer Punto de Equipo", for: .normal)
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
        title = "Punto Terreno"
        setupUI()
        setupLocation()
        
        let longPress = UILongPressGestureRecognizer(target: self, action: #selector(handleLongPress))
        longPress.minimumPressDuration = 0.5 // Un poco más corto para que se sienta reactivo
        longPress.delegate = self
        mapView.addGestureRecognizer(longPress)
    }
    
    // Permitir que el gesto funcione junto con los gestos internos del mapa (pan, zoom)
    func gestureRecognizer(_ gestureRecognizer: UIGestureRecognizer, shouldRecognizeSimultaneouslyWith otherGestureRecognizer: UIGestureRecognizer) -> Bool {
        return true
    }
    
    @objc private func handleLongPress(gesture: UILongPressGestureRecognizer) {
        // Solo actuamos al inicio del gesto para evitar múltiples disparos
        if gesture.state == .began {
            let point = gesture.location(in: mapView)
            let coord = mapView.convert(point, toCoordinateFrom: mapView)
            selectedCoordinate = coord
            updateMarker(at: coord)
            
            // Feedback táctico opcional (vibración suave)
            let generator = UIImpactFeedbackGenerator(style: .medium)
            generator.impactOccurred()
        }
    }
    
    private func setupUI() {
        view.addSubview(statusLabel)
        view.addSubview(helpLabel)
        view.addSubview(mapView)
        view.addSubview(captureButton)
        view.addSubview(saveButton)
        
        mapView.delegate = self
        
        NSLayoutConstraint.activate([
            statusLabel.topAnchor.constraint(equalTo: view.safeAreaLayoutGuide.topAnchor, constant: 20),
            statusLabel.leadingAnchor.constraint(equalTo: view.leadingAnchor, constant: 20),
            statusLabel.trailingAnchor.constraint(equalTo: view.trailingAnchor, constant: -20),
            
            helpLabel.topAnchor.constraint(equalTo: statusLabel.bottomAnchor, constant: 8),
            helpLabel.leadingAnchor.constraint(equalTo: view.leadingAnchor, constant: 30),
            helpLabel.trailingAnchor.constraint(equalTo: view.trailingAnchor, constant: -30),
            
            mapView.topAnchor.constraint(equalTo: helpLabel.bottomAnchor, constant: 20),
            mapView.leadingAnchor.constraint(equalTo: view.leadingAnchor, constant: 20),
            mapView.trailingAnchor.constraint(equalTo: view.trailingAnchor, constant: -20),
            mapView.heightAnchor.constraint(equalToConstant: 350),
            
            captureButton.topAnchor.constraint(equalTo: mapView.bottomAnchor, constant: 20),
            captureButton.leadingAnchor.constraint(equalTo: view.leadingAnchor, constant: 40),
            captureButton.trailingAnchor.constraint(equalTo: view.trailingAnchor, constant: -40),
            captureButton.heightAnchor.constraint(equalToConstant: 45),
            
            saveButton.bottomAnchor.constraint(equalTo: view.safeAreaLayoutGuide.bottomAnchor, constant: -20),
            saveButton.leadingAnchor.constraint(equalTo: view.leadingAnchor, constant: 40),
            saveButton.trailingAnchor.constraint(equalTo: view.trailingAnchor, constant: -40),
            saveButton.heightAnchor.constraint(equalToConstant: 55)
        ])
        
        captureButton.addTarget(self, action: #selector(capturePressed), for: .touchUpInside)
        saveButton.addTarget(self, action: #selector(savePressed), for: .touchUpInside)
    }
    
    private func setupLocation() {
        locationManager.delegate = self
        locationManager.requestWhenInUseAuthorization()
        locationManager.startUpdatingLocation()
    }
    
    @objc private func capturePressed() {
        if let coord = currentCoordinate {
            selectedCoordinate = coord
            updateMarker(at: coord)
            let region = MKCoordinateRegion(center: coord, latitudinalMeters: 200, longitudinalMeters: 200)
            mapView.setRegion(region, animated: true)
        }
    }
    
    private func updateMarker(at coord: CLLocationCoordinate2D) {
        mapView.removeAnnotations(mapView.annotations)
        let annotation = MKPointAnnotation()
        annotation.coordinate = coord
        annotation.title = "Punto Seleccionado"
        mapView.addAnnotation(annotation)
    }
    
    @objc private func savePressed() {
        guard let coords = selectedCoordinate else {
            let alert = UIAlertController(title: "Selecciona un punto", message: "Toca el mapa o usa tu ubicación actual.", preferredStyle: .alert)
            alert.addAction(UIAlertAction(title: "OK", style: .default))
            present(alert, animated: true)
            return
        }
        
        saveButton.isEnabled = false
        // Usamos el mismo endpoint de configuración o uno específico si existiera
        // Para terreno, el backend guarda el punto del jefe para que sus subordinados marquen ahí
        NetworkManager.shared.updateConfiguracion(lat: coords.latitude, lng: coords.longitude, radius: 100) { [weak self] result in
            DispatchQueue.main.async {
                self?.saveButton.isEnabled = true
                if case .success = result {
                    let alert = UIAlertController(title: "Punto Establecido", message: "Tu equipo ahora podrá marcar asistencia en esta ubicación.", preferredStyle: .alert)
                    alert.addAction(UIAlertAction(title: "Excelente", style: .default) { _ in
                        self?.dismiss(animated: true)
                    })
                    self?.present(alert, animated: true)
                }
            }
        }
    }
    
    func locationManager(_ manager: CLLocationManager, didUpdateLocations locations: [CLLocation]) {
        if let loc = locations.last {
            currentCoordinate = loc.coordinate
            if selectedCoordinate == nil {
                selectedCoordinate = loc.coordinate
                updateMarker(at: loc.coordinate)
                let region = MKCoordinateRegion(center: loc.coordinate, latitudinalMeters: 500, longitudinalMeters: 500)
                mapView.setRegion(region, animated: true)
            }
        }
    }
}
