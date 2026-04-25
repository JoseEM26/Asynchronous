import UIKit

class ProfileViewController: UIViewController {

    @IBOutlet weak var nameLabel: UILabel!
    @IBOutlet weak var roleLabel: UILabel!
    @IBOutlet weak var dniLabel: UILabel!
    @IBOutlet weak var emailLabel: UILabel!
    @IBOutlet weak var statusLabel: UILabel!

    var trabajadorId: Int?
    
    private let activityIndicator: UIActivityIndicatorView = {
        let ai = UIActivityIndicatorView(style: .large)
        ai.hidesWhenStopped = true
        return ai
    }()

    override func viewWillAppear(_ animated: Bool) {
        super.viewWillAppear(animated)
        navigationController?.setNavigationBarHidden(false, animated: true)
        title = "Mi Perfil"
    }

    override func viewDidLoad() {
        super.viewDidLoad()
        setupUI()
        loadProfileData()
        
        // Estilo ViajesApp
        view.backgroundColor = UIColor(red: 0.91, green: 0.95, blue: 0.98, alpha: 1.0)
    }

    private func setupUI() {
        view.addSubview(activityIndicator)
        activityIndicator.center = view.center
    }

    private func loadProfileData() {
        guard let id = trabajadorId else { 
            showErrorAlert(message: "ID de trabajador no encontrado")
            return 
        }
        
        activityIndicator.startAnimating()
        NetworkManager.shared.getTrabajador(id: id) { [weak self] result in
            DispatchQueue.main.async {
                self?.activityIndicator.stopAnimating()
                switch result {
                case .success(let trabajador):
                    self?.updateUI(with: trabajador)
                case .failure(let error):
                    let message: String
                    switch error {
                    case .invalidURL: message = "URL Inválida"
                    case .noData: message = "El servidor no envió datos"
                    case .decodingError: message = "Error de formato en los datos (Decoding)"
                    case .serverError(let detail): message = detail
                    }
                    self?.showErrorAlert(message: message)
                }
            }
        }
    }

    private func updateUI(with t: TrabajadorResponse) {
        let nombre = t.nombres ?? "Nombre"
        let apellido = t.apellidos ?? "Desconocido"
        nameLabel.text = "\(nombre) \(apellido)"
        roleLabel.text = "Rol: \(t.rolNombre ?? "Trabajador")"
        dniLabel.text = "DNI: \(t.dni ?? "No registrado")"
        emailLabel.text = "Email: \(t.email ?? "No registrado")"
        
        let isActive = t.activo ?? false
        statusLabel.text = "Estado: \(isActive ? "ACTIVO" : "INACTIVO")"
        statusLabel.textColor = isActive ? .systemGreen : .systemRed
    }

    private func showErrorAlert(message: String) {
        let alert = UIAlertController(title: "Error al Cargar Perfil", message: message, preferredStyle: .alert)
        alert.addAction(UIAlertAction(title: "OK", style: .default, handler: { [weak self] _ in
            // Use a slight delay to avoid "Unbalanced call" if another transition is happening
            DispatchQueue.main.asyncAfter(deadline: .now() + 0.1) {
                self?.navigationController?.popViewController(animated: true)
            }
        }))
        present(alert, animated: true)
    }
}
