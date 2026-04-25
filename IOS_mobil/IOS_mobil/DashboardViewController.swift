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
        if !DashboardViewController.comunicadosMostrados {
            fetchComunicados()
        }
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
    
    private func fetchComunicados() {
        NetworkManager.shared.getComunicadosActivos { [weak self] (result: Result<[ComunicadoResponse], NetworkError>) in
            switch result {
            case .success(let data):
                self?.comunicados = data
                if !data.isEmpty {
                    DashboardViewController.comunicadosMostrados = true
                    self?.mostrarModalComunicados(data)
                }
            case .failure(let error):
                print("Error cargando comunicados: \(error)")
            }
        }
    }
    
    private func mostrarModalComunicados(_ lista: [ComunicadoResponse]) {
        let alert = UIAlertController(title: "📢 Avisos Importantes", 
                                      message: nil, 
                                      preferredStyle: .alert)
        
        // Crear el mensaje concatenando todos los comunicados
        var mensajeCompleto = ""
        for (index, c) in lista.enumerated() {
            let titulo = c.titulo ?? "Aviso"
            let contenido = c.contenido ?? ""
            mensajeCompleto += "• \(titulo.uppercased()):\n\(contenido)"
            
            if index < lista.count - 1 {
                mensajeCompleto += "\n\n" // Espacio entre avisos
            }
        }
        
        alert.message = mensajeCompleto
        
        let action = UIAlertAction(title: "Entendido", style: .default, handler: nil)
        alert.addAction(action)
        
        present(alert, animated: true)
    }
    
    private func setupUI() {
        // Fondo adaptable
        view.backgroundColor = UIColor { trait in
            trait.userInterfaceStyle == .dark
                ? UIColor(red: 0.08, green: 0.08, blue: 0.10, alpha: 1.0)
                : UIColor(red: 0.95, green: 0.95, blue: 0.97, alpha: 1.0)
        }
        
        activityIndicator.center = view.center
        activityIndicator.hidesWhenStopped = true
        activityIndicator.color = .systemIndigo
        activityIndicator.transform = CGAffineTransform(scaleX: 1.5, y: 1.5)
        view.addSubview(activityIndicator)
        
        // Greeting label
        greetingLabel.font = .systemFont(ofSize: 32, weight: .bold)
        greetingLabel.numberOfLines = 0 // Permitir múltiples líneas
        greetingLabel.lineBreakMode = .byWordWrapping
        greetingLabel.textColor = UIColor { trait in
            trait.userInterfaceStyle == .dark ? .white : UIColor(white: 0.15, alpha: 1.0)
        }
        
        // Configurar StackView
        view.addSubview(mainStackView)
        NSLayoutConstraint.activate([
            mainStackView.topAnchor.constraint(equalTo: greetingLabel.bottomAnchor, constant: 30),
            mainStackView.leadingAnchor.constraint(equalTo: view.leadingAnchor, constant: 24),
            mainStackView.trailingAnchor.constraint(equalTo: view.trailingAnchor, constant: -24)
        ])
        
        // Estilizar botones existentes (ya vienen del Storyboard o se añaden)
        setupMenuButton(profileButton, title: "👤  Mi Perfil", color: .systemBlue)
        setupMenuButton(scannerButton, title: "📸  Escanear QR", color: .systemOrange)
        setupMenuButton(historyButton, title: "📅  Historial", color: .systemGreen)
        setupVirtualButtonUI() // Estilizar el virtual
        setupAdminButtonUI()   // Estilizar el admin
        
        // Añadir al stack en orden
        mainStackView.addArrangedSubview(profileButton)
        mainStackView.addArrangedSubview(scannerButton)
        mainStackView.addArrangedSubview(virtualAttendanceButton)
        mainStackView.addArrangedSubview(historyButton)
        mainStackView.addArrangedSubview(adminButton)
        
        // Logout
        logoutButton.backgroundColor = .clear
        logoutButton.setTitle("Cerrar Sesión", for: .normal)
        logoutButton.setTitleColor(.systemRed, for: .normal)
        logoutButton.titleLabel?.font = .systemFont(ofSize: 16, weight: .medium)
        logoutButton.layer.cornerRadius = 14
        logoutButton.layer.borderWidth = 1.5
        logoutButton.layer.borderColor = UIColor.systemRed.cgColor
        
        NSLayoutConstraint.activate([
            logoutButton.bottomAnchor.constraint(equalTo: view.safeAreaLayoutGuide.bottomAnchor, constant: -20),
            logoutButton.centerXAnchor.constraint(equalTo: view.centerXAnchor),
            logoutButton.widthAnchor.constraint(equalToConstant: 200),
            logoutButton.heightAnchor.constraint(equalToConstant: 50)
        ])
    }
    
    private func setupMenuButton(_ btn: UIButton?, title: String, color: UIColor) {
        guard let btn = btn else { return }
        let cardBg = UIColor { trait in
            trait.userInterfaceStyle == .dark ? UIColor(red: 0.15, green: 0.15, blue: 0.18, alpha: 1.0) : .white
        }
        let cardText = UIColor { trait in
            trait.userInterfaceStyle == .dark ? .white : UIColor(white: 0.2, alpha: 1.0)
        }
        
        btn.backgroundColor = cardBg
        var config = UIButton.Configuration.plain()
        config.contentInsets = NSDirectionalEdgeInsets(top: 0, leading: 24, bottom: 0, trailing: 24)
        btn.configuration = config
        
        btn.setTitle(title, for: .normal)
        btn.setTitleColor(cardText, for: .normal)
        btn.titleLabel?.font = .systemFont(ofSize: 20, weight: .semibold)
        btn.contentHorizontalAlignment = .left
        btn.layer.cornerRadius = 20
        btn.heightAnchor.constraint(equalToConstant: 70).isActive = true
        
        let accentBar = UIView()
        accentBar.backgroundColor = color
        accentBar.translatesAutoresizingMaskIntoConstraints = false
        accentBar.layer.cornerRadius = 2
        btn.addSubview(accentBar)
        NSLayoutConstraint.activate([
            accentBar.leadingAnchor.constraint(equalTo: btn.leadingAnchor, constant: 8),
            accentBar.centerYAnchor.constraint(equalTo: btn.centerYAnchor),
            accentBar.widthAnchor.constraint(equalToConstant: 4),
            accentBar.heightAnchor.constraint(equalToConstant: 40)
        ])
        
        btn.layer.shadowColor = UIColor.black.cgColor
        btn.layer.shadowOpacity = 0.08
        btn.layer.shadowOffset = CGSize(width: 0, height: 4)
        btn.layer.shadowRadius = 12
    }
    
    private func setupAdminButtonUI() {
        adminButton.backgroundColor = UIColor.systemOrange
        adminButton.setTitle("⚙️  Configurar Oficina", for: .normal)
        adminButton.setTitleColor(.white, for: .normal)
        adminButton.titleLabel?.font = .systemFont(ofSize: 18, weight: .semibold)
        adminButton.layer.cornerRadius = 20
        adminButton.layer.shadowColor = UIColor.systemOrange.cgColor
        adminButton.layer.shadowOpacity = 0.3
        adminButton.layer.shadowOffset = CGSize(width: 0, height: 4)
        adminButton.layer.shadowRadius = 10
        adminButton.heightAnchor.constraint(equalToConstant: 70).isActive = true
    }

    private func configurePermissionsByRole() {
        guard let role = userRole else { return }
        
        print("Configurando permisos para el rol: \(role)")
        
        // 1. Lógica para SUPER_ADMIN (5)
        if role == "SUPER_ADMIN" || role == "5" {
            scannerButton.isHidden = true // Un Super Admin puro de oficina no marca
            adminButton.isHidden = false
            adminButton.setTitle("👁️ Ver Oficinas", for: .normal)
        }
        
        // 2. Lógica para ADMIN (1)
        else if role == "ADMIN" || role == "1" {
            adminButton.isHidden = false
            // scannerButton lo maneja updateAttendanceButtonsVisibility
        }
        
        // 3. Roles de terreno o estándar
        else {
            adminButton.isHidden = true
            // scannerButton lo maneja updateAttendanceButtonsVisibility
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

    private func fetchTrabajadorData() {
        guard let id = trabajadorId else { return }
        
        DispatchQueue.main.async {
            self.activityIndicator.startAnimating()
            self.mainStackView.alpha = 0.5 // Atenuar mientras carga
        }
        
        NetworkManager.shared.getUsuario(id: id) { [weak self] (result: Result<UsuarioResponse, NetworkError>) in
            DispatchQueue.main.async {
                self?.activityIndicator.stopAnimating()
                self?.mainStackView.alpha = 1.0
                
                if case .success(let data) = result {
                    self?.trabajadorData = data.trabajador
                    
                    // Saludo personalizado con nombre
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
        
        var isPresencialDay = t.diasPresencial?.uppercased().contains(currentDayName) ?? false
        var isRemotoDay = t.diasRemotos?.uppercased().contains(currentDayName) ?? false
        
        // Fallback: Si el administrador aún no le ha configurado los días de la semana, guiarnos por su modalidad general
        let hasNoDaysConfigured = (t.diasPresencial == nil || t.diasPresencial!.isEmpty) && (t.diasRemotos == nil || t.diasRemotos!.isEmpty)
        
        if hasNoDaysConfigured {
            if t.modalidadId == 1 { // Presencial
                isPresencialDay = true
            } else if t.modalidadId == 2 { // Virtual
                isRemotoDay = true
            } else if t.modalidadId == 3 { // Híbrido (por defecto permitimos ambas hasta que se configure)
                isPresencialDay = true
                isRemotoDay = true
            }
        }
        
        print("Hoy es \(currentDayName). ¿Día Presencial?: \(isPresencialDay). ¿Día Remoto?: \(isRemotoDay)")
        
        // Si no es día de trabajo en ninguna modalidad, ocultar ambos
        if !isPresencialDay && !isRemotoDay {
            self.scannerButton.isHidden = true
            self.virtualAttendanceButton.isHidden = true
            let nombre = t.nombres?.split(separator: " ").first.map(String.init) ?? ""
            self.greetingLabel.text = "¡Hola, \(nombre)! Hoy es tu día de descanso."
        } else if isRemotoDay && !isPresencialDay {
            // Es SOLO día remoto: ocultar escáner, mostrar virtual
            self.scannerButton.isHidden = true
            self.virtualAttendanceButton.isHidden = false
        } else if isPresencialDay && !isRemotoDay {
            // Es SOLO día presencial: mostrar escáner, ocultar virtual
            self.scannerButton.isHidden = false
            self.virtualAttendanceButton.isHidden = true
        } else {
            // Si tiene ambas permitidas (ej. Híbrido sin configurar) mostramos el escáner y el virtual
            self.scannerButton.isHidden = false
            self.virtualAttendanceButton.isHidden = false
        }
        
        // Aplicar permisos de rol adicionales (Admin/Super Admin)
        self.configurePermissionsByRole()
    }

    private func setupVirtualButtonUI() {
        setupMenuButton(virtualAttendanceButton, title: "🏠  Asistencia Virtual", color: .systemIndigo)
    }

    @objc private func virtualAttendancePressed() {
        guard let id = trabajadorId else { return }
        
        self.activityIndicator.startAnimating()
        self.mainStackView.alpha = 0.5
        
        // Consultar los datos más frescos del servidor para no depender de la caché de la vista
        NetworkManager.shared.getUsuario(id: id) { [weak self] result in
            DispatchQueue.main.async {
                self?.activityIndicator.stopAnimating()
                self?.mainStackView.alpha = 1.0
                
                if case .success(let data) = result {
                    self?.trabajadorData = data.trabajador
                    self?.evaluarPermisoYMarcar()
                } else {
                    self?.mostrarAlerta(titulo: "Error de Conexión", mensaje: "No pudimos validar tus permisos con el servidor.")
                }
            }
        }
    }
    
    private func evaluarPermisoYMarcar() {
        guard let t = trabajadorData else { return }
        
        let hasLocation = t.latitudVirtual != nil && t.longitudVirtual != nil
        let canSetLocation = t.permitirCambioUbicacion ?? false
        
        if !hasLocation && !canSetLocation {
            let alert = UIAlertController(title: "Ubicación No Establecida", 
                                          message: "Aún no has definido tu ubicación de trabajo desde casa. Por favor, solicita al administrador que te habilite el permiso para establecerla por primera vez.", 
                                          preferredStyle: .alert)
            alert.addAction(UIAlertAction(title: "Entendido", style: .default))
            present(alert, animated: true)
            return
        }
        
        if canSetLocation {
            confirmarYGuardarUbicacion()
        } else {
            // Mostrar selector de Entrada/Salida antes de marcar
            let alert = UIAlertController(title: "🏠 Asistencia Virtual", 
                                          message: "¿Qué acción deseas realizar hoy?", 
                                          preferredStyle: .actionSheet)
            
            alert.addAction(UIAlertAction(title: "Marcar ENTRADA", style: .default) { _ in
                self.iniciarProcesoDeMarcado(tipo: "ENTRADA")
            })
            
            alert.addAction(UIAlertAction(title: "Marcar SALIDA", style: .default) { _ in
                self.iniciarProcesoDeMarcado(tipo: "SALIDA")
            })
            
            alert.addAction(UIAlertAction(title: "Cancelar", style: .cancel))
            
            // Soporte para iPad
            if let popover = alert.popoverPresentationController {
                popover.sourceView = virtualAttendanceButton
                popover.sourceRect = virtualAttendanceButton.bounds
            }
            
            present(alert, animated: true)
        }
    }
    
    private func iniciarProcesoDeMarcado(tipo: String) {
        self.tipoAsistenciaSeleccionado = tipo
        self.realizarMarcadoVirtual()
    }

    private func confirmarYGuardarUbicacion() {
        let alert = UIAlertController(title: "📍 Establecer Hogar", 
                                      message: "Estás a punto de registrar tu ubicación actual como tu punto fijo de asistencia virtual.\n\n⚠️ Solo puedes hacerlo una vez. Asegúrate de estar en tu lugar de trabajo remoto.", 
                                      preferredStyle: .alert)
        
        let confirmAction = UIAlertAction(title: "Establecer aquí", style: .default) { _ in
            self.activityIndicator.startAnimating()
            self.isRequestingLocationForHomeSetup = true
            self.locationManager.requestWhenInUseAuthorization()
            self.locationManager.requestLocation()
        }
        
        alert.addAction(confirmAction)
        alert.addAction(UIAlertAction(title: "Ahora no", style: .cancel))
        
        present(alert, animated: true)
    }

    private func realizarMarcadoVirtual() {
        self.activityIndicator.startAnimating()
        self.isRequestingLocationForAttendance = true
        self.locationManager.requestWhenInUseAuthorization()
        self.locationManager.requestLocation()
    }
    
    // MARK: - CLLocationManagerDelegate
    func locationManager(_ manager: CLLocationManager, didUpdateLocations locations: [CLLocation]) {
        guard let location = locations.last else { return }
        
        // Ignorar ubicaciones de hace más de 15 segundos (pueden ser viejas/cache)
        if abs(location.timestamp.timeIntervalSinceNow) > 15 {
            return
        }
        
        // Ignorar si la precisión es muy mala (más de 100 metros de margen de error)
        if location.horizontalAccuracy > 100 {
            return
        }
        
        self.currentLocation = location
        print("📍 Ubicación Fresca Detectada: \(location.coordinate.latitude), \(location.coordinate.longitude) (Precisión: \(location.horizontalAccuracy)m)")
        
        if isRequestingLocationForHomeSetup {
            isRequestingLocationForHomeSetup = false
            manager.stopUpdatingLocation()
            self.obtenerUbicacionYGuardar(lat: location.coordinate.latitude, lng: location.coordinate.longitude)
        } else if isRequestingLocationForAttendance {
            isRequestingLocationForAttendance = false
            manager.stopUpdatingLocation()
            self.validarDistanciaYMarcar(lat: location.coordinate.latitude, lng: location.coordinate.longitude)
        }
    }
    
    func locationManager(_ manager: CLLocationManager, didFailWithError error: Error) {
        activityIndicator.stopAnimating()
        isRequestingLocationForHomeSetup = false
        isRequestingLocationForAttendance = false
        mostrarAlerta(titulo: "Error de GPS", mensaje: "No pudimos obtener tu ubicación actual. Revisa los permisos.")
    }

    private func obtenerUbicacionYGuardar(lat: Double, lng: Double) {
        guard let id = self.trabajadorId else { return } // Usar el ID de Usuario para evitar cruces
        
        NetworkManager.shared.actualizarUbicacionVirtual(id: id, lat: lat, lng: lng) { [weak self] result in
            DispatchQueue.main.async {
                self?.activityIndicator.stopAnimating()
                switch result {
                case .success:
                    self?.mostrarAlerta(titulo: "Éxito", mensaje: "Ubicación guardada. Ahora puedes marcar tu asistencia.")
                    self?.fetchTrabajadorData() // Refrescar datos
                case .failure(let err):
                    self?.mostrarAlerta(titulo: "Error", mensaje: "No se pudo guardar la ubicación: \(err)")
                }
            }
        }
    }

    private func validarDistanciaYMarcar(lat: Double, lng: Double) {
        guard let t = trabajadorData, let homeLat = t.latitudVirtual, let homeLng = t.longitudVirtual else {
            activityIndicator.stopAnimating()
            return
        }
        
        let currentLocation = CLLocation(latitude: lat, longitude: lng)
        let homeLocation = CLLocation(latitude: homeLat, longitude: homeLng)
        let distance = currentLocation.distance(from: homeLocation)
        
        if distance <= 15.0 {
            // Está dentro del radio
            guard let id = self.trabajadorId else { return } // Usar el ID de Usuario para evitar cruces con otros trabajadores
            let request = AsistenciaQrRequest(trabajadorId: id, qrToken: "VIRTUAL_TOKEN", tipo: self.tipoAsistenciaSeleccionado, latitud: lat, longitud: lng)
            
            NetworkManager.shared.registrarAsistenciaQR(request: request) { [weak self] result in
                DispatchQueue.main.async {
                    self?.activityIndicator.stopAnimating()
                    switch result {
                    case .success:
                        let tipoText = self?.tipoAsistenciaSeleccionado == "ENTRADA" ? "entrada" : "salida"
                        self?.mostrarAlertaConHistorial(titulo: "¡Asistencia Exitosa!", 
                                                       mensaje: "Tu \(tipoText) se ha registrado correctamente desde casa.")
                    case .failure(let err):
                        self?.mostrarAlerta(titulo: "Error", mensaje: "No se pudo registrar: \(err)")
                    }
                }
            }
        } else {
            // Fuera del radio
            activityIndicator.stopAnimating()
            let distanceStr = String(format: "%.0f", distance)
            mostrarAlerta(titulo: "Zona Fuera de Alcance", mensaje: "Estás fuera de tu zona de trabajo (Casa). Distancia actual: \(distanceStr) metros. Debes estar a un máximo de 10 metros.")
        }
    }

    private func mostrarAlertaConHistorial(titulo: String, mensaje: String) {
        let alert = UIAlertController(title: titulo, message: mensaje, preferredStyle: .alert)
        alert.addAction(UIAlertAction(title: "Ver Mi Historial", style: .default) { _ in
            self.historyPressed()
        })
        alert.addAction(UIAlertAction(title: "Cerrar", style: .cancel))
        present(alert, animated: true)
    }

    private func mostrarAlerta(titulo: String, mensaje: String) {
        let alert = UIAlertController(title: titulo, message: mensaje, preferredStyle: .alert)
        alert.addAction(UIAlertAction(title: "OK", style: .default))
        present(alert, animated: true)
    }

    // MARK: - Presentar como páginas flotantes (modal sheets)
    
    @objc private func profilePressed() {
        let vc = ProfileViewController()
        vc.trabajadorId = trabajadorId
        let nav = UINavigationController(rootViewController: vc)
        nav.modalPresentationStyle = .pageSheet
        if let sheet = nav.sheetPresentationController {
            sheet.detents = [.large()]
            sheet.prefersGrabberVisible = true
        }
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
        if let sheet = nav.sheetPresentationController {
            sheet.detents = [.large()]
            sheet.prefersGrabberVisible = true
        }
        present(nav, animated: true)
    }
    
    @objc private func adminPressed() {
        let vc = AdminSettingsViewController()
        let nav = UINavigationController(rootViewController: vc)
        nav.modalPresentationStyle = .pageSheet
        if let sheet = nav.sheetPresentationController {
            sheet.detents = [.large()]
            sheet.prefersGrabberVisible = true
        }
        present(nav, animated: true)
    }

    @objc private func logoutActionTriggered() {
        let alert = UIAlertController(title: "¿Cerrar Sesión?", 
                                      message: "Tu sesión actual finalizará. ¿Estás seguro de que deseas salir?", 
                                      preferredStyle: .actionSheet)
        
        let logout = UIAlertAction(title: "Cerrar Sesión", style: .destructive) { _ in
            let generator = UIImpactFeedbackGenerator(style: .medium)
            generator.impactOccurred()
            
            // Limpiar sesión
            DashboardViewController.comunicadosMostrados = false
            
            // Intentar volver al Login
            if let nav = self.navigationController {
                nav.popToRootViewController(animated: true)
            } else {
                self.dismiss(animated: true, completion: nil)
            }
        }
        
        let cancel = UIAlertAction(title: "Cancelar", style: .cancel, handler: nil)
        
        alert.addAction(logout)
        alert.addAction(cancel)
        
        // Soporte para iPad (importante para que no crashee)
        if let popoverController = alert.popoverPresentationController {
            popoverController.sourceView = self.logoutButton
            popoverController.sourceRect = self.logoutButton.bounds
        }
        
        present(alert, animated: true)
    }

    @IBAction func logoutPressed(_ sender: UIButton) {
        logoutActionTriggered()
    }
}
