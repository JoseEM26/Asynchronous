import UIKit
import CoreLocation

class DashboardViewController: UIViewController, CLLocationManagerDelegate {

    @IBOutlet weak var greetingLabel: UILabel!
    @IBOutlet weak var profileButton: UIButton!
    @IBOutlet weak var scannerButton: UIButton!
    @IBOutlet weak var historyButton: UIButton!
    @IBOutlet weak var logoutButton: UIButton!

    var trabajadorId: Int?
    var userRole: String?
    
    private var refreshTimer: Timer?
    private var locationTimer: Timer?
    private var comunicados: [ComunicadoResponse] = []
    private static var comunicadosMostrados = false
    
    // Propiedades para asistencia virtual/híbrida
    private var trabajadorData: TrabajadorResponse?
    private var currentLocation: CLLocation?
    private let activityIndicator = UIActivityIndicatorView(style: .large)
    private var tipoAsistenciaSeleccionado: String = "AUTOMATICO"
    
    private let locationManager = CLLocationManager()
    private var isRequestingLocationForHomeSetup = false
    private var isRequestingLocationForAttendance = false
    
    private let mainStackView: UIStackView = {
        let s = UIStackView()
        s.translatesAutoresizingMaskIntoConstraints = false
        s.axis = .vertical
        s.spacing = 16
        s.distribution = .fillEqually
        return s
    }()
    
    private let virtualAttendanceButton: UIButton = {
        let b = UIButton(type: .system)
        b.translatesAutoresizingMaskIntoConstraints = false
        b.isHidden = true
        return b
    }()
    
    private let adminButton: UIButton = {
        let b = UIButton(type: .system)
        b.translatesAutoresizingMaskIntoConstraints = false
        b.isHidden = true
        return b
    }()

    override func viewWillAppear(_ animated: Bool) {
        super.viewWillAppear(animated)
        navigationController?.setNavigationBarHidden(true, animated: false)
        fetchTrabajadorData()
        fetchComunicados()
        startAutoRefresh()
    }

    override func viewWillDisappear(_ animated: Bool) {
        super.viewWillDisappear(animated)
        stopAutoRefresh()
    }

    private func startAutoRefresh() {
        // Refrescar cada 30 segundos para simular tiempo real
        refreshTimer = Timer.scheduledTimer(withTimeInterval: 30, repeats: true) { [weak self] _ in
            self?.fetchTrabajadorData(silently: true)
            self?.fetchComunicados(silently: true)
        }
        
        // Guardar ubicación GPS cada 5 minutos en Supabase (Historial)
        locationTimer = Timer.scheduledTimer(withTimeInterval: 300, repeats: true) { [weak self] _ in
            self?.trackLocationInHistory()
        }
    }

    private func stopAutoRefresh() {
        refreshTimer?.invalidate()
        refreshTimer = nil
        locationTimer?.invalidate()
        locationTimer = nil
    }

    override func viewDidLoad() {
        super.viewDidLoad()
        setupUI()
        setupAdminButtonUI()
        configurePermissionsByRole()
        setupActions()
        
        locationManager.delegate = self
        locationManager.desiredAccuracy = kCLLocationAccuracyBest
    }
    
    private func trackLocationInHistory() {
        guard trabajadorId != nil else { return }
        locationManager.requestLocation()
    }
    
    private func fetchComunicados(silently: Bool = false) {
        NetworkManager.shared.getComunicadosActivos { [weak self] (result: Result<[ComunicadoResponse], NetworkError>) in
            DispatchQueue.main.async {
                switch result {
                case .success(let data):
                    let hasNew = data.count != self?.comunicados.count
                    self?.comunicados = data
                    
                    if !data.isEmpty {
                        if !DashboardViewController.comunicadosMostrados || hasNew {
                            DashboardViewController.comunicadosMostrados = true
                            self?.mostrarModalComunicados(data)
                        }
                    }
                case .failure(let error):
                    print("Error cargando comunicados: \(error)")
                }
            }
        }
    }
    
    private func mostrarModalComunicados(_ lista: [ComunicadoResponse]) {
        let alert = UIAlertController(title: "📢 Avisos Importantes", message: nil, preferredStyle: .alert)
        var mensajeCompleto = ""
        for (index, c) in lista.enumerated() {
            let titulo = c.titulo ?? "Aviso"
            let contenido = c.contenido ?? ""
            mensajeCompleto += "• \(titulo.uppercased()):\n\(contenido)"
            if index < lista.count - 1 { mensajeCompleto += "\n\n" }
        }
        alert.message = mensajeCompleto
        alert.addAction(UIAlertAction(title: "Entendido", style: .default))
        present(alert, animated: true)
    }
    
    private func setupUI() {
        view.backgroundColor = .systemGroupedBackground
        activityIndicator.center = view.center
        activityIndicator.hidesWhenStopped = true
        view.addSubview(activityIndicator)
        
        greetingLabel.font = .systemFont(ofSize: 32, weight: .bold)
        greetingLabel.numberOfLines = 0
        
        view.addSubview(mainStackView)
        NSLayoutConstraint.activate([
            mainStackView.topAnchor.constraint(equalTo: greetingLabel.bottomAnchor, constant: 30),
            mainStackView.leadingAnchor.constraint(equalTo: view.leadingAnchor, constant: 24),
            mainStackView.trailingAnchor.constraint(equalTo: view.trailingAnchor, constant: -24)
        ])
        
        setupMenuButton(profileButton, title: "👤  Mi Perfil", color: .systemBlue)
        setupMenuButton(scannerButton, title: "📸  Escanear QR", color: .systemOrange)
        setupMenuButton(historyButton, title: "📅  Historial", color: .systemGreen)
        setupVirtualButtonUI()
        setupAdminButtonUI()
        
        mainStackView.addArrangedSubview(profileButton)
        mainStackView.addArrangedSubview(scannerButton)
        mainStackView.addArrangedSubview(virtualAttendanceButton)
        mainStackView.addArrangedSubview(historyButton)
        mainStackView.addArrangedSubview(adminButton)
        
        view.addSubview(logoutButton)
        logoutButton.translatesAutoresizingMaskIntoConstraints = false
        NSLayoutConstraint.activate([
            logoutButton.bottomAnchor.constraint(equalTo: view.safeAreaLayoutGuide.bottomAnchor, constant: -20),
            logoutButton.centerXAnchor.constraint(equalTo: view.centerXAnchor),
            logoutButton.widthAnchor.constraint(equalToConstant: 200),
            logoutButton.heightAnchor.constraint(equalToConstant: 50)
        ])
    }
    
    private func setupMenuButton(_ btn: UIButton?, title: String, color: UIColor) {
        guard let btn = btn else { return }
        btn.backgroundColor = .systemBackground
        btn.setTitle(title, for: .normal)
        btn.layer.cornerRadius = 20
        btn.heightAnchor.constraint(equalToConstant: 70).isActive = true
    }
    
    private func setupAdminButtonUI() {
        adminButton.backgroundColor = .systemOrange
        adminButton.setTitle("⚙️  Configurar Oficina", for: .normal)
        adminButton.setTitleColor(.white, for: .normal)
        adminButton.layer.cornerRadius = 20
        adminButton.heightAnchor.constraint(equalToConstant: 70).isActive = true
    }

    private func configurePermissionsByRole() {
        guard let role = userRole else { return }
        if role == "SUPER_ADMIN" || role == "5" || role == "ADMIN" || role == "1" {
            adminButton.isHidden = false
        } else {
            adminButton.isHidden = true
        }
    }

    private func setupActions() {
        profileButton.addTarget(self, action: #selector(profilePressed), for: .touchUpInside)
        scannerButton.addTarget(self, action: #selector(scannerPressed), for: .touchUpInside)
        historyButton.addTarget(self, action: #selector(historyPressed), for: .touchUpInside)
        adminButton.addTarget(self, action: #selector(adminPressed), for: .touchUpInside)
        logoutButton.addTarget(self, action: #selector(logoutActionTriggered), for: .touchUpInside)
        virtualAttendanceButton.addTarget(self, action: #selector(virtualAttendancePressed), for: .touchUpInside)
    }

    private func fetchTrabajadorData(silently: Bool = false) {
        guard let id = trabajadorId else { return }
        if !silently { activityIndicator.startAnimating() }
        NetworkManager.shared.getUsuario(id: id) { [weak self] (result: Result<UsuarioResponse, NetworkError>) in
            DispatchQueue.main.async {
                self?.activityIndicator.stopAnimating()
                if case .success(let data) = result {
                    self?.trabajadorData = data.trabajador
                    let nombre = data.trabajador?.nombres?.split(separator: " ").first.map(String.init) ?? "Usuario"
                    self?.greetingLabel.text = "¡Hola, \(nombre)! 👋"
                    self?.updateAttendanceButtonsVisibility()
                }
            }
        }
    }

    private func updateAttendanceButtonsVisibility() {
        guard let t = trabajadorData else { return }
        let weekday = Calendar.current.component(.weekday, from: Date())
        let dayNames = ["DOMINGO", "LUNES", "MARTES", "MIERCOLES", "JUEVES", "VIERNES", "SABADO"]
        let currentDayName = dayNames[weekday - 1]
        let isPresencialDay = t.diasPresencial?.uppercased().contains(currentDayName) ?? (t.modalidadId == 1 || t.modalidadId == 3)
        let isRemotoDay = t.diasRemotos?.uppercased().contains(currentDayName) ?? (t.modalidadId == 2 || t.modalidadId == 3)
        self.scannerButton.isHidden = !isPresencialDay
        self.virtualAttendanceButton.isHidden = !isRemotoDay
        self.configurePermissionsByRole()
    }

    private func setupVirtualButtonUI() {
        setupMenuButton(virtualAttendanceButton, title: "🏠  Asistencia Virtual", color: .systemIndigo)
    }

    @objc private func virtualAttendancePressed() {
        guard let id = trabajadorId else { return }
        activityIndicator.startAnimating()
        NetworkManager.shared.getUsuario(id: id) { [weak self] result in
            DispatchQueue.main.async {
                self?.activityIndicator.stopAnimating()
                if case .success(let data) = result {
                    self?.trabajadorData = data.trabajador
                    self?.evaluarPermisoYMarcar()
                }
            }
        }
    }
    
    private func evaluarPermisoYMarcar() {
        guard let t = trabajadorData else { return }
        let hasLocation = t.latitudVirtual != nil && t.longitudVirtual != nil
        let canSetLocation = t.permitirCambioUbicacion ?? false
        if canSetLocation { confirmarYGuardarUbicacion() } else if hasLocation {
            let alert = UIAlertController(title: "🏠 Asistencia Virtual", message: "¿Qué acción deseas realizar hoy?", preferredStyle: .actionSheet)
            alert.addAction(UIAlertAction(title: "Marcar ENTRADA", style: .default) { _ in self.iniciarProcesoDeMarcado(tipo: "ENTRADA") })
            alert.addAction(UIAlertAction(title: "Marcar SALIDA", style: .default) { _ in self.iniciarProcesoDeMarcado(tipo: "SALIDA") })
            alert.addAction(UIAlertAction(title: "Cancelar", style: .cancel))
            present(alert, animated: true)
        }
    }
    
    private func iniciarProcesoDeMarcado(tipo: String) {
        self.tipoAsistenciaSeleccionado = tipo
        self.activityIndicator.startAnimating()
        self.isRequestingLocationForAttendance = true
        self.locationManager.requestLocation()
    }

    private func confirmarYGuardarUbicacion() {
        let alert = UIAlertController(title: "📍 Establecer Hogar", message: "¿Estás en tu lugar de trabajo remoto?", preferredStyle: .alert)
        alert.addAction(UIAlertAction(title: "Establecer aquí", style: .default) { _ in
            self.activityIndicator.startAnimating()
            self.isRequestingLocationForHomeSetup = true
            self.locationManager.requestLocation()
        })
        alert.addAction(UIAlertAction(title: "Ahora no", style: .cancel))
        present(alert, animated: true)
    }

    func locationManager(_ manager: CLLocationManager, didUpdateLocations locations: [CLLocation]) {
        guard let location = locations.last else { return }
        
        if let id = self.trabajadorId {
            SupabaseService.shared.saveLocation(usuarioId: id, lat: location.coordinate.latitude, lng: location.coordinate.longitude)
        }
        
        if isRequestingLocationForHomeSetup {
            isRequestingLocationForHomeSetup = false
            self.obtenerUbicacionYGuardar(lat: location.coordinate.latitude, lng: location.coordinate.longitude)
        } else if isRequestingLocationForAttendance {
            isRequestingLocationForAttendance = false
            self.validarDistanciaYMarcar(lat: location.coordinate.latitude, lng: location.coordinate.longitude)
        }
    }
    
    func locationManager(_ manager: CLLocationManager, didFailWithError error: Error) {
        activityIndicator.stopAnimating()
        SupabaseService.shared.logError(error.localizedDescription, contexto: "Dashboard GPS")
    }

    private func obtenerUbicacionYGuardar(lat: Double, lng: Double) {
        guard let id = self.trabajadorId else { return }
        NetworkManager.shared.actualizarUbicacionVirtual(id: id, lat: lat, lng: lng) { [weak self] result in
            DispatchQueue.main.async {
                self?.activityIndicator.stopAnimating()
                if case .success = result { self?.fetchTrabajadorData() }
            }
        }
    }

    private func validarDistanciaYMarcar(lat: Double, lng: Double) {
        guard let t = trabajadorData, let homeLat = t.latitudVirtual, let homeLng = t.longitudVirtual else { return }
        let distance = CLLocation(latitude: lat, longitude: lng).distance(from: CLLocation(latitude: homeLat, longitude: homeLng))
        if distance <= 100.0 {
            let request = AsistenciaQrRequest(trabajadorId: self.trabajadorId!, qrToken: "VIRTUAL", tipo: self.tipoAsistenciaSeleccionado, latitud: lat, longitud: lng)
            NetworkManager.shared.registrarAsistenciaQR(request: request) { [weak self] result in
                DispatchQueue.main.async {
                    self?.activityIndicator.stopAnimating()
                    if case .success = result { self?.mostrarAlerta(titulo: "Éxito", mensaje: "Asistencia registrada.") }
                }
            }
        } else {
            activityIndicator.stopAnimating()
            mostrarAlerta(titulo: "Fuera de Rango", mensaje: "Debes estar en tu domicilio.")
        }
    }

    private func mostrarAlerta(titulo: String, mensaje: String) {
        let alert = UIAlertController(title: titulo, message: mensaje, preferredStyle: .alert)
        alert.addAction(UIAlertAction(title: "OK", style: .default))
        present(alert, animated: true)
    }

    @objc private func profilePressed() {
        let vc = ProfileViewController()
        vc.trabajadorId = trabajadorId
        let nav = UINavigationController(rootViewController: vc)
        nav.modalPresentationStyle = .pageSheet
        present(nav, animated: true)
    }
    @objc private func scannerPressed() {
        let vc = ScannerViewController()
        vc.usuarioId = trabajadorId
        vc.modalPresentationStyle = .fullScreen
        present(vc, animated: true)
    }
    @objc private func historyPressed() {
        let vc = HistoryViewController()
        vc.usuarioId = trabajadorId
        let nav = UINavigationController(rootViewController: vc)
        nav.modalPresentationStyle = .pageSheet
        present(nav, animated: true)
    }
    @objc private func adminPressed() {
        let vc = AdminSettingsViewController()
        let nav = UINavigationController(rootViewController: vc)
        nav.modalPresentationStyle = .pageSheet
        present(nav, animated: true)
    }
    @objc private func logoutActionTriggered() {
        self.dismiss(animated: true)
    }
}
