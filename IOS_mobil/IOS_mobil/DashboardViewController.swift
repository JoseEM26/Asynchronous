import UIKit
import CoreLocation

class DashboardViewController: UIViewController, CLLocationManagerDelegate {

    // MARK: - Storyboard Outlets (Los 5 exactos del Main.storyboard)
    @IBOutlet weak var greetingLabel: UILabel!
    @IBOutlet weak var historyButton: UIButton!
    @IBOutlet weak var logoutButton: UIButton!
    @IBOutlet weak var profileButton: UIButton!
    @IBOutlet weak var scannerButton: UIButton!

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

    // MARK: - Estilizar los elementos del Storyboard para darles look premium
    private func styleUI() {
        view.backgroundColor = .systemGroupedBackground

        // Greeting Label - estilo premium
        greetingLabel.font = .systemFont(ofSize: 28, weight: .bold)
        greetingLabel.textColor = .label
        greetingLabel.text = "¡Hola! 👋"

        // Estilizar cada botón como tarjeta premium
        styleCard(profileButton, title: "👤  Mi Perfil", color: .systemBlue)
        styleCard(scannerButton, title: "📸  Escanear QR", color: .systemOrange)
        styleCard(historyButton, title: "📅  Historial", color: .systemGreen)

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
        button.setTitle(title, for: .normal)
        button.setTitleColor(.label, for: .normal)
        button.titleLabel?.font = .systemFont(ofSize: 18, weight: .semibold)
        button.contentHorizontalAlignment = .left
        button.contentEdgeInsets = UIEdgeInsets(top: 0, left: 24, bottom: 0, right: 24)
        button.backgroundColor = .secondarySystemGroupedBackground
        button.layer.cornerRadius = 20
        button.clipsToBounds = true
        button.layer.shadowColor = UIColor.black.cgColor
        button.layer.shadowOpacity = 0.05
        button.layer.shadowRadius = 8
        button.layer.shadowOffset = CGSize(width: 0, height: 4)
        button.layer.masksToBounds = false
    }

    // MARK: - Actions
    private func setupActions() {
        profileButton.addTarget(self, action: #selector(profilePressed), for: .touchUpInside)
        scannerButton.addTarget(self, action: #selector(scannerPressed), for: .touchUpInside)
        historyButton.addTarget(self, action: #selector(historyPressed), for: .touchUpInside)
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

    private func configurePermissionsByRole() {
        let role = userRole ?? ""
        // Solo ADMIN y SUPER_ADMIN pueden ver ciertos elementos
        // Los botones base del storyboard están siempre visibles para todos
    }

    @objc private func logoutActionTriggered() {
        dismiss(animated: true)
    }
}
