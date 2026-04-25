import UIKit

class DashboardViewController: UIViewController {

    @IBOutlet weak var greetingLabel: UILabel!
    @IBOutlet weak var profileButton: UIButton!
    @IBOutlet weak var scannerButton: UIButton!
    @IBOutlet weak var historyButton: UIButton!
    @IBOutlet weak var logoutButton: UIButton!

    var trabajadorId: Int?
    var userRole: String?
    
    private let adminButton: UIButton = {
        let b = UIButton(type: .system)
        b.translatesAutoresizingMaskIntoConstraints = false
        b.isHidden = true
        return b
    }()

    override func viewWillAppear(_ animated: Bool) {
        super.viewWillAppear(animated)
        navigationController?.setNavigationBarHidden(true, animated: false)
    }

    override func viewDidLoad() {
        super.viewDidLoad()
        setupUI()
        setupActions()
        checkAdminRole()
    }
    
    private func setupUI() {
        // Fondo adaptable
        view.backgroundColor = UIColor { trait in
            trait.userInterfaceStyle == .dark
                ? UIColor(red: 0.08, green: 0.08, blue: 0.10, alpha: 1.0)
                : UIColor(red: 0.95, green: 0.95, blue: 0.97, alpha: 1.0)
        }
        
        // Greeting label
        greetingLabel.font = .systemFont(ofSize: 32, weight: .bold)
        greetingLabel.textColor = UIColor { trait in
            trait.userInterfaceStyle == .dark ? .white : UIColor(white: 0.15, alpha: 1.0)
        }
        
        // Colores adaptativos
        let cardBg = UIColor { trait in
            trait.userInterfaceStyle == .dark
                ? UIColor(red: 0.15, green: 0.15, blue: 0.18, alpha: 1.0)
                : UIColor.white
        }
        let cardText = UIColor { trait in
            trait.userInterfaceStyle == .dark ? .white : UIColor(white: 0.2, alpha: 1.0)
        }
        
        // Tarjetas con barra de color
        let cardData: [(UIButton?, String, UIColor)] = [
            (profileButton,  "👤  Mi Perfil", UIColor.systemBlue),
            (scannerButton,  "📸  Escanear QR", UIColor.systemOrange),
            (historyButton,  "📅  Historial", UIColor.systemGreen),
        ]
        
        for (button, title, accentColor) in cardData {
            guard let btn = button else { continue }
            btn.backgroundColor = cardBg
            btn.setTitle(title, for: .normal)
            btn.setTitleColor(cardText, for: .normal)
            btn.titleLabel?.font = .systemFont(ofSize: 20, weight: .semibold)
            btn.contentHorizontalAlignment = .left
            btn.contentEdgeInsets = UIEdgeInsets(top: 0, left: 24, bottom: 0, right: 24)
            btn.layer.cornerRadius = 20
            btn.clipsToBounds = false
            
            let accentBar = UIView()
            accentBar.backgroundColor = accentColor
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
        
        // Logout
        logoutButton.backgroundColor = .clear
        logoutButton.setTitle("Cerrar Sesión", for: .normal)
        logoutButton.setTitleColor(.systemRed, for: .normal)
        logoutButton.titleLabel?.font = .systemFont(ofSize: 16, weight: .medium)
        logoutButton.layer.cornerRadius = 14
        logoutButton.layer.borderWidth = 1.5
        logoutButton.layer.borderColor = UIColor.systemRed.cgColor
        
        // Admin button
        setupAdminButton()
    }
    
    private func setupAdminButton() {
        adminButton.backgroundColor = UIColor.systemOrange
        adminButton.setTitle("⚙️  Configurar Oficina", for: .normal)
        adminButton.setTitleColor(.white, for: .normal)
        adminButton.titleLabel?.font = .systemFont(ofSize: 18, weight: .semibold)
        adminButton.layer.cornerRadius = 20
        adminButton.layer.shadowColor = UIColor.systemOrange.cgColor
        adminButton.layer.shadowOpacity = 0.3
        adminButton.layer.shadowOffset = CGSize(width: 0, height: 4)
        adminButton.layer.shadowRadius = 10
        
        view.addSubview(adminButton)
        NSLayoutConstraint.activate([
            adminButton.topAnchor.constraint(equalTo: historyButton.bottomAnchor, constant: 16),
            adminButton.leadingAnchor.constraint(equalTo: view.leadingAnchor, constant: 24),
            adminButton.trailingAnchor.constraint(equalTo: view.trailingAnchor, constant: -24),
            adminButton.heightAnchor.constraint(equalToConstant: 60)
        ])
    }
    
    private func checkAdminRole() {
        if userRole == "ADMIN" {
            adminButton.isHidden = false
        }
    }

    private func setupActions() {
        profileButton.addTarget(self, action: #selector(profilePressed), for: .touchUpInside)
        scannerButton.addTarget(self, action: #selector(scannerPressed), for: .touchUpInside)
        historyButton.addTarget(self, action: #selector(historyPressed), for: .touchUpInside)
        adminButton.addTarget(self, action: #selector(adminPressed), for: .touchUpInside)
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
        performSegue(withIdentifier: "toScanner", sender: trabajadorId)
    }

    @objc private func historyPressed() {
        let vc = HistoryViewController()
        vc.usuarioId = trabajadorId
        let nav = UINavigationController(rootViewController: vc)
        nav.modalPresentationStyle = .pageSheet
        if let sheet = nav.sheetPresentationController {
            sheet.detents = [.medium(), .large()]
            sheet.prefersGrabberVisible = true
            sheet.prefersScrollingExpandsWhenScrolledToEdge = true
        }
        present(nav, animated: true)
    }
    
    @objc private func adminPressed() {
        performSegue(withIdentifier: "toAdminSettings", sender: nil)
    }

    @IBAction func logoutPressed(_ sender: UIButton) {
        let generator = UIImpactFeedbackGenerator(style: .light)
        generator.impactOccurred()
        navigationController?.popViewController(animated: true)
    }

    override func prepare(for segue: UIStoryboardSegue, sender: Any?) {
        let id = sender as? Int
        if segue.identifier == "toScanner",
           let scannerVC = segue.destination as? ScannerViewController {
            scannerVC.usuarioId = id
        }
    }
}
