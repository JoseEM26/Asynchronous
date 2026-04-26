import UIKit
import CoreLocation

class DashboardViewController: UIViewController, CLLocationManagerDelegate {

    // MARK: - UI Components
    private let scrollView = UIScrollView()
    private let contentView = UIView()
    
    private let headerView: UIView = {
        let v = UIView()
        v.backgroundColor = .systemOrange
        v.translatesAutoresizingMaskIntoConstraints = false
        return v
    }()
    
    private let greetingLabel: UILabel = {
        let l = UILabel()
        l.font = .systemFont(ofSize: 24, weight: .bold)
        l.textColor = .white
        l.translatesAutoresizingMaskIntoConstraints = false
        return l
    }()
    
    private let subtitleLabel: UILabel = {
        let l = UILabel()
        l.text = "Panel de Control Administrativo"
        l.font = .systemFont(ofSize: 14, weight: .medium)
        l.textColor = UIColor.white.withAlphaComponent(0.8)
        l.translatesAutoresizingMaskIntoConstraints = false
        return l
    }()
    
    private let statusCard: UIView = {
        let v = UIView()
        v.backgroundColor = .secondarySystemGroupedBackground
        v.layer.cornerRadius = 20
        v.layer.shadowColor = UIColor.black.cgColor
        v.layer.shadowOpacity = 0.05
        v.layer.shadowRadius = 10
        v.layer.shadowOffset = CGSize(width: 0, height: 4)
        v.translatesAutoresizingMaskIntoConstraints = false
        return v
    }()
    
    private let statusIndicator: UIView = {
        let v = UIView()
        v.backgroundColor = .systemGreen
        v.layer.cornerRadius = 6
        v.translatesAutoresizingMaskIntoConstraints = false
        return v
    }()
    
    private let statusText: UILabel = {
        let l = UILabel()
        l.text = "Sistema Activo"
        l.font = .systemFont(ofSize: 13, weight: .semibold)
        l.textColor = .label
        l.translatesAutoresizingMaskIntoConstraints = false
        return l
    }()
    
    private let gridStack: UIStackView = {
        let s = UIStackView()
        s.axis = .vertical
        s.spacing = 16
        s.translatesAutoresizingMaskIntoConstraints = false
        return s
    }()

    private let logoutButton: UIButton = {
        let b = UIButton(type: .system)
        b.setTitle("Cerrar Sesión", for: .normal)
        b.setTitleColor(.systemRed, for: .normal)
        b.titleLabel?.font = .systemFont(ofSize: 16, weight: .bold)
        b.backgroundColor = .secondarySystemGroupedBackground
        b.layer.cornerRadius = 15
        b.translatesAutoresizingMaskIntoConstraints = false
        return b
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
        setupUI()
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
    
    private func setupUI() {
        view.backgroundColor = .systemGroupedBackground
        
        view.addSubview(scrollView)
        scrollView.addSubview(contentView)
        scrollView.translatesAutoresizingMaskIntoConstraints = false
        contentView.translatesAutoresizingMaskIntoConstraints = false
        
        contentView.addSubview(headerView)
        headerView.addSubview(greetingLabel)
        headerView.addSubview(subtitleLabel)
        
        contentView.addSubview(statusCard)
        statusCard.addSubview(statusIndicator)
        statusCard.addSubview(statusText)
        
        contentView.addSubview(gridStack)
        contentView.addSubview(logoutButton)
        view.addSubview(activityIndicator)
        activityIndicator.translatesAutoresizingMaskIntoConstraints = false
        
        NSLayoutConstraint.activate([
            scrollView.topAnchor.constraint(equalTo: view.topAnchor),
            scrollView.leadingAnchor.constraint(equalTo: view.leadingAnchor),
            scrollView.trailingAnchor.constraint(equalTo: view.trailingAnchor),
            scrollView.bottomAnchor.constraint(equalTo: view.bottomAnchor),
            
            contentView.topAnchor.constraint(equalTo: scrollView.topAnchor),
            contentView.leadingAnchor.constraint(equalTo: scrollView.leadingAnchor),
            contentView.trailingAnchor.constraint(equalTo: scrollView.trailingAnchor),
            contentView.bottomAnchor.constraint(equalTo: scrollView.bottomAnchor),
            contentView.widthAnchor.constraint(equalTo: scrollView.widthAnchor),
            
            headerView.topAnchor.constraint(equalTo: contentView.topAnchor),
            headerView.leadingAnchor.constraint(equalTo: contentView.leadingAnchor),
            headerView.trailingAnchor.constraint(equalTo: contentView.trailingAnchor),
            headerView.heightAnchor.constraint(equalToConstant: 180),
            
            greetingLabel.topAnchor.constraint(equalTo: headerView.topAnchor, constant: 60),
            greetingLabel.leadingAnchor.constraint(equalTo: headerView.leadingAnchor, constant: 24),
            
            subtitleLabel.topAnchor.constraint(equalTo: greetingLabel.bottomAnchor, constant: 4),
            subtitleLabel.leadingAnchor.constraint(equalTo: greetingLabel.leadingAnchor),
            
            statusCard.topAnchor.constraint(equalTo: headerView.bottomAnchor, constant: -30),
            statusCard.leadingAnchor.constraint(equalTo: contentView.leadingAnchor, constant: 24),
            statusCard.trailingAnchor.constraint(equalTo: contentView.trailingAnchor, constant: -24),
            statusCard.heightAnchor.constraint(equalToConstant: 60),
            
            statusIndicator.leadingAnchor.constraint(equalTo: statusCard.leadingAnchor, constant: 20),
            statusIndicator.centerYAnchor.constraint(equalTo: statusCard.centerYAnchor),
            statusIndicator.widthAnchor.constraint(equalToConstant: 12),
            statusIndicator.heightAnchor.constraint(equalToConstant: 12),
            
            statusText.leadingAnchor.constraint(equalTo: statusIndicator.trailingAnchor, constant: 12),
            statusText.centerYAnchor.constraint(equalTo: statusCard.centerYAnchor),
            
            gridStack.topAnchor.constraint(equalTo: statusCard.bottomAnchor, constant: 24),
            gridStack.leadingAnchor.constraint(equalTo: contentView.leadingAnchor, constant: 24),
            gridStack.trailingAnchor.constraint(equalTo: contentView.trailingAnchor, constant: -24),
            
            logoutButton.topAnchor.constraint(equalTo: gridStack.bottomAnchor, constant: 30),
            logoutButton.leadingAnchor.constraint(equalTo: contentView.leadingAnchor, constant: 24),
            logoutButton.trailingAnchor.constraint(equalTo: contentView.trailingAnchor, constant: -24),
            logoutButton.heightAnchor.constraint(equalToConstant: 55),
            logoutButton.bottomAnchor.constraint(equalTo: contentView.bottomAnchor, constant: -40),
            
            activityIndicator.centerXAnchor.constraint(equalTo: view.centerXAnchor),
            activityIndicator.centerYAnchor.constraint(equalTo: view.centerYAnchor)
        ])
        
        setupMenuGrid()
    }
    
    private func setupMenuGrid() {
        let row1 = createRowStack()
        row1.addArrangedSubview(createMenuCard(id: "profile", title: "Mi Perfil", icon: "person.circle.fill", color: .systemBlue))
        row1.addArrangedSubview(createMenuCard(id: "history", title: "Historial", icon: "calendar", color: .systemGreen))
        gridStack.addArrangedSubview(row1)
        
        let row2 = createRowStack()
        row2.addArrangedSubview(createMenuCard(id: "scanner", title: "Escanear QR", icon: "qrcode.viewfinder", color: .systemOrange))
        row2.addArrangedSubview(createMenuCard(id: "virtual", title: "Remoto", icon: "house.fill", color: .systemPurple))
        gridStack.addArrangedSubview(row2)
        
        let row3 = createRowStack()
        row3.addArrangedSubview(createMenuCard(id: "admin", title: "Oficina", icon: "building.2.fill", color: .systemIndigo))
        row3.addArrangedSubview(UIView()) // Placeholder
        gridStack.addArrangedSubview(row3)
    }
    
    private func createRowStack() -> UIStackView {
        let s = UIStackView()
        s.axis = .horizontal
        s.spacing = 16
        s.distribution = .fillEqually
        return s
    }
    
    private func createMenuCard(id: String, title: String, icon: String, color: UIColor) -> UIView {
        let card = UIButton(type: .system)
        card.backgroundColor = .secondarySystemGroupedBackground
        card.layer.cornerRadius = 20
        card.accessibilityIdentifier = id
        
        let iconImg = UIImageView(image: UIImage(systemName: icon))
        iconImg.tintColor = color
        iconImg.contentMode = .scaleAspectFit
        iconImg.translatesAutoresizingMaskIntoConstraints = false
        
        let label = UILabel()
        label.text = title
        label.font = .systemFont(ofSize: 15, weight: .bold)
        label.textColor = .label
        label.translatesAutoresizingMaskIntoConstraints = false
        
        card.addSubview(iconImg)
        card.addSubview(label)
        
        NSLayoutConstraint.activate([
            card.heightAnchor.constraint(equalToConstant: 130),
            iconImg.topAnchor.constraint(equalTo: card.topAnchor, constant: 20),
            iconImg.leadingAnchor.constraint(equalTo: card.leadingAnchor, constant: 20),
            iconImg.widthAnchor.constraint(equalToConstant: 35),
            iconImg.heightAnchor.constraint(equalToConstant: 35),
            label.bottomAnchor.constraint(equalTo: card.bottomAnchor, constant: -20),
            label.leadingAnchor.constraint(equalTo: card.leadingAnchor, constant: 20)
        ])
        
        card.addTarget(self, action: #selector(menuItemPressed(_:)), for: .touchUpInside)
        return card
    }
    
    @objc private func menuItemPressed(_ sender: UIButton) {
        switch sender.accessibilityIdentifier {
        case "profile": profilePressed()
        case "history": historyPressed()
        case "scanner": scannerPressed()
        case "virtual": virtualAttendancePressed()
        case "admin": adminPressed()
        default: break
        }
    }

    private func startAutoRefresh() {
        refreshTimer = Timer.scheduledTimer(withTimeInterval: 30, repeats: true) { [weak self] _ in self?.fetchTrabajadorData(silently: true) }
        locationTimer = Timer.scheduledTimer(withTimeInterval: 300, repeats: true) { [weak self] _ in self?.trackLocationInHistory() }
    }

    private func stopAutoRefresh() { refreshTimer?.invalidate(); locationTimer?.invalidate() }
    
    private func setupActions() { logoutButton.addTarget(self, action: #selector(logoutActionTriggered), for: .touchUpInside) }

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
        // Lógica de visibilidad simplificada para el nuevo grid
        if let scannerCard = gridStack.findViewWithId("scanner") { scannerCard.isHidden = !(t.modalidadId == 1 || t.modalidadId == 3) }
        if let virtualCard = gridStack.findViewWithId("virtual") { virtualCard.isHidden = !(t.modalidadId == 2 || t.modalidadId == 3) }
    }

    private func trackLocationInHistory() { locationManager.requestLocation() }

    func locationManager(_ manager: CLLocationManager, didUpdateLocations locations: [CLLocation]) {
        guard let loc = locations.last, let id = trabajadorId else { return }
        SupabaseService.shared.saveLocation(usuarioId: id, lat: loc.coordinate.latitude, lng: loc.coordinate.longitude)
    }
    
    func locationManager(_ manager: CLLocationManager, didFailWithError error: Error) {}

    // MARK: - Navigation Actions
    private func profilePressed() {
        let vc = ProfileViewController(); vc.trabajadorId = trabajadorId; vc.modalPresentationStyle = .pageSheet; present(vc, animated: true)
    }
    private func scannerPressed() {
        let vc = ScannerViewController(); vc.usuarioId = trabajadorId; if #available(iOS 15.0, *) { vc.sheetPresentationController?.detents = [.large()]; vc.sheetPresentationController?.prefersGrabberVisible = true }; present(vc, animated: true)
    }
    private func historyPressed() {
        let vc = HistoryViewController(); vc.usuarioId = trabajadorId; let nav = UINavigationController(rootViewController: vc); nav.modalPresentationStyle = .pageSheet; present(nav, animated: true)
    }
    private func adminPressed() {
        let vc = AdminSettingsViewController(); let nav = UINavigationController(rootViewController: vc); nav.modalPresentationStyle = .pageSheet; present(nav, animated: true)
    }
    
    @objc private func virtualAttendancePressed() {
        // Implementar lógica de marcado virtual ya existente...
        let alert = UIAlertController(title: "🏠 Asistencia Remota", message: "¿Qué desea marcar?", preferredStyle: .actionSheet)
        alert.addAction(UIAlertAction(title: "ENTRADA", style: .default))
        alert.addAction(UIAlertAction(title: "SALIDA", style: .default))
        alert.addAction(UIAlertAction(title: "Cancelar", style: .cancel))
        present(alert, animated: true)
    }

    private func configurePermissionsByRole() {
        if let adminCard = gridStack.findViewWithId("admin") {
            let role = userRole ?? ""
            adminCard.isHidden = !(role == "SUPER_ADMIN" || role == "ADMIN" || role == "1" || role == "5")
        }
    }

    @objc private func logoutActionTriggered() { dismiss(animated: true) }
}

extension UIView {
    func findViewWithId(_ id: String) -> UIView? {
        if self.accessibilityIdentifier == id { return self }
        for subview in subviews { if let found = subview.findViewWithId(id) { return found } }
        return nil
    }
}
