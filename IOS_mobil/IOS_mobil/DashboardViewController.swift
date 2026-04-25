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
        b.setTitle("⚙️ Configurar Oficina", for: .normal)
        b.backgroundColor = .systemOrange
        b.setTitleColor(.white, for: .normal)
        b.layer.cornerRadius = 24
        b.isHidden = true
        b.translatesAutoresizingMaskIntoConstraints = false
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
        // Estilo ViajesApp
        view.backgroundColor = UIColor(red: 0.96, green: 0.97, blue: 0.94, alpha: 1.0)
        
        let buttons = [profileButton, scannerButton, historyButton, logoutButton]
        for button in buttons {
            button?.layer.cornerRadius = 24
            button?.backgroundColor = .white
            button?.layer.shadowColor = UIColor.black.cgColor
            button?.layer.shadowOpacity = 0.12
            button?.layer.shadowOffset = CGSize(width: 0, height: 10)
            button?.layer.shadowRadius = 14
        }
        
        // Añadir botón admin si es necesario
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

    @objc private func profilePressed() {
        performSegue(withIdentifier: "toProfile", sender: trabajadorId)
    }

    @objc private func scannerPressed() {
        performSegue(withIdentifier: "toScanner", sender: trabajadorId)
    }

    @objc private func historyPressed() {
        performSegue(withIdentifier: "toHistory", sender: trabajadorId)
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
        
        if segue.identifier == "toProfile",
           let profileVC = segue.destination as? ProfileViewController {
            profileVC.trabajadorId = id
        } else if segue.identifier == "toScanner",
                  let scannerVC = segue.destination as? ScannerViewController {
            scannerVC.usuarioId = id
        } else if segue.identifier == "toHistory",
                  let historyVC = segue.destination as? HistoryViewController {
            historyVC.usuarioId = id
        }
    }
}

