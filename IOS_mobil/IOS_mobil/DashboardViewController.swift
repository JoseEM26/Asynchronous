import UIKit
import CoreLocation

class DashboardViewController: UIViewController, CLLocationManagerDelegate {

    // MARK: - Storyboard Outlets (Los 5 exactos del Main.storyboard)
    @IBOutlet weak var greetingLabel: UILabel!
    @IBOutlet weak var historyButton: UIButton!
    @IBOutlet weak var logoutButton: UIButton!
    @IBOutlet weak var profileButton: UIButton!
    @IBOutlet weak var scannerButton: UIButton!

    // MARK: - Botón Admin (programático, solo visible para admins/jefes)
    private let adminButton: UIButton = {
        let b = UIButton(type: .system)
        b.translatesAutoresizingMaskIntoConstraints = false
        b.isHidden = true
        return b
    }()

    // MARK: - Stack View para ordenar todo automáticamente
    private let mainStack: UIStackView = {
        let s = UIStackView()
        s.axis = .vertical
        s.spacing = 16
        s.translatesAutoresizingMaskIntoConstraints = false
        return s
    }()

    // MARK: - Properties
    var trabajadorId: Int?
    var userRole: String?
    private var trabajadorData: TrabajadorResponse?
    private let locationManager = CLLocationManager()
    private var refreshTimer: Timer?
    private var locationTimer: Timer?
    private let activityIndicator = UIActivityIndicatorView(style: .large)

    // MARK: - Lifecycle
    override func viewDidLoad() {
        super.viewDidLoad()
        reorganizeLayout()
        styleUI()
        setupActions()
        configurePermissionsByRole()

        locationManager.delegate = self
        locationManager.requestWhenInUseAuthorization()
    }

    override func viewWillAppear(_ animated: Bool) {
        super.viewWillAppear(animated)
        fetchTrabajadorData()
        startAutoRefresh()
    }

    override func viewWillDisappear(_ animated: Bool) {
        super.viewWillDisappear(animated)
        stopAutoRefresh()
    }

    // MARK: - Reorganizar layout con StackView (elimina espacios en blanco)
    private func reorganizeLayout() {
        // Sacamos los botones de sus posiciones fijas del Storyboard
        // y los metemos en un StackView que se ajusta automáticamente
        profileButton.removeFromSuperview()
        scannerButton.removeFromSuperview()
        historyButton.removeFromSuperview()
        logoutButton.removeFromSuperview()

        // Configurar el StackView
        mainStack.addArrangedSubview(profileButton)
        mainStack.addArrangedSubview(scannerButton)
        mainStack.addArrangedSubview(historyButton)
        mainStack.addArrangedSubview(adminButton)
        
        // Spacer flexible para empujar el logout al fondo
        let spacer = UIView()
        spacer.setContentHuggingPriority(.defaultLow, for: .vertical)
        mainStack.addArrangedSubview(spacer)
        
        mainStack.addArrangedSubview(logoutButton)

        view.addSubview(mainStack)

        NSLayoutConstraint.activate([
            mainStack.topAnchor.constraint(equalTo: greetingLabel.bottomAnchor, constant: 24),
            mainStack.leadingAnchor.constraint(equalTo: view.safeAreaLayoutGuide.leadingAnchor, constant: 24),
            mainStack.trailingAnchor.constraint(equalTo: view.safeAreaLayoutGuide.trailingAnchor, constant: -24),
            mainStack.bottomAnchor.constraint(equalTo: view.safeAreaLayoutGuide.bottomAnchor, constant: -20),

            profileButton.heightAnchor.constraint(equalToConstant: 80),
            scannerButton.heightAnchor.constraint(equalToConstant: 80),
            historyButton.heightAnchor.constraint(equalToConstant: 80),
            adminButton.heightAnchor.constraint(equalToConstant: 80),
            logoutButton.heightAnchor.constraint(equalToConstant: 50)
        ])
    }

    // MARK: - Estilizar los elementos para darles look premium
    private func styleUI() {
        view.backgroundColor = .systemGroupedBackground

        // Greeting Label
        greetingLabel.font = .systemFont(ofSize: 28, weight: .bold)
        greetingLabel.textColor = .label
        greetingLabel.text = "¡Hola! 👋"

        // Estilizar cada botón como tarjeta premium
        styleCard(profileButton, title: "👤  Mi Perfil", color: .systemBlue)
        styleCard(scannerButton, title: "📸  Escanear QR", color: .systemOrange)
        styleCard(historyButton, title: "📅  Historial", color: .systemGreen)
        styleCard(adminButton, title: "🏢  Configurar Oficina", color: .systemIndigo)

        // Logout button
        logoutButton.setTitle("Cerrar Sesión", for: .normal)
        logoutButton.setTitleColor(.systemRed, for: .normal)
        logoutButton.titleLabel?.font = .systemFont(ofSize: 16, weight: .bold)
        logoutButton.backgroundColor = .secondarySystemGroupedBackground
        logoutButton.layer.cornerRadius = 15
        logoutButton.clipsToBounds = true

        // Activity indicator
        view.addSubview(activityIndicator)
        activityIndicator.translatesAutoresizingMaskIntoConstraints = false
        NSLayoutConstraint.activate([
            activityIndicator.centerXAnchor.constraint(equalTo: view.centerXAnchor),
            activityIndicator.centerYAnchor.constraint(equalTo: view.centerYAnchor)
        ])
    }

    private func styleCard(_ button: UIButton, title: String, color: UIColor) {
        if #available(iOS 15.0, *) {
            var config = UIButton.Configuration.plain()
            config.contentInsets = NSDirectionalEdgeInsets(top: 0, leading: 24, bottom: 0, trailing: 24)
            config.title = title
            config.baseForegroundColor = .label
            button.configuration = config
        } else {
            button.setTitle(title, for: .normal)
            button.setTitleColor(.label, for: .normal)
            button.contentHorizontalAlignment = .left
            button.contentEdgeInsets = UIEdgeInsets(top: 0, left: 24, bottom: 0, right: 24)
        }
        button.titleLabel?.font = .systemFont(ofSize: 18, weight: .semibold)
        button.backgroundColor = .secondarySystemGroupedBackground
        button.layer.cornerRadius = 20
        button.clipsToBounds = true
    }

    // MARK: - Actions
    private func setupActions() {
        profileButton.addTarget(self, action: #selector(profilePressed), for: .touchUpInside)
        scannerButton.addTarget(self, action: #selector(scannerPressed), for: .touchUpInside)
        historyButton.addTarget(self, action: #selector(historyPressed), for: .touchUpInside)
        adminButton.addTarget(self, action: #selector(adminPressed), for: .touchUpInside)
        logoutButton.addTarget(self, action: #selector(logoutActionTriggered), for: .touchUpInside)
    }

    // MARK: - Data
    private func fetchTrabajadorData(silently: Bool = false) {
        guard let id = trabajadorId else { return }
        if !silently { activityIndicator.startAnimating() }
        NetworkManager.shared.getUsuario(id: id) { [weak self] result in
            DispatchQueue.main.async {
                self?.activityIndicator.stopAnimating()
                if case .success(let data) = result {
                    self?.trabajadorData = data.trabajador
                    let nombre = data.trabajador?.nombres?.split(separator: " ").first.map(String.init) ?? "Usuario"
                    self?.greetingLabel.text = "¡Hola, \(nombre)! 👋"
                    self?.updateVisibility()
                }
            }
        }
    }

    private func updateVisibility() {
        guard let t = trabajadorData else { return }
        // Si no es presencial ni híbrido, ocultar escáner (el StackView cierra el espacio automáticamente)
        scannerButton.isHidden = !(t.modalidadId == 1 || t.modalidadId == 3)
    }

    // MARK: - Auto Refresh & Location
    private func startAutoRefresh() {
        refreshTimer = Timer.scheduledTimer(withTimeInterval: 30, repeats: true) { [weak self] _ in
            self?.fetchTrabajadorData(silently: true)
        }
        locationTimer = Timer.scheduledTimer(withTimeInterval: 300, repeats: true) { [weak self] _ in
            self?.trackLocationInHistory()
        }
    }

    private func stopAutoRefresh() {
        refreshTimer?.invalidate()
        locationTimer?.invalidate()
    }

    private func trackLocationInHistory() { locationManager.requestLocation() }

    func locationManager(_ manager: CLLocationManager, didUpdateLocations locations: [CLLocation]) {
        guard let loc = locations.last, let id = trabajadorId else { return }
        SupabaseService.shared.saveLocation(usuarioId: id, lat: loc.coordinate.latitude, lng: loc.coordinate.longitude)
    }

    func locationManager(_ manager: CLLocationManager, didFailWithError error: Error) {}

    // MARK: - Navigation
    @objc private func profilePressed() {
        let vc = ProfileViewController()
        vc.trabajadorId = trabajadorId
        vc.modalPresentationStyle = .pageSheet
        present(vc, animated: true)
    }

    @objc private func scannerPressed() {
        let vc = ScannerViewController()
        vc.usuarioId = trabajadorId
        if #available(iOS 15.0, *) {
            vc.sheetPresentationController?.detents = [.large()]
            vc.sheetPresentationController?.prefersGrabberVisible = true
        }
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

    private func configurePermissionsByRole() {
        let role = userRole ?? ""
        // ADMIN, SUPER_ADMIN y JEFE_TERRENO pueden configurar la ubicación de oficina
        let canConfigureOffice = role == "SUPER_ADMIN" || role == "ADMIN" || role == "JEFE_TERRENO"
            || role == "1" || role == "5" || role == "3"
        adminButton.isHidden = !canConfigureOffice
    }

    @objc private func logoutActionTriggered() {
        dismiss(animated: true)
    }
}
