import UIKit

class ProfileViewController: UIViewController {

    @IBOutlet weak var nameLabel: UILabel!
    @IBOutlet weak var roleLabel: UILabel!
    @IBOutlet weak var dniLabel: UILabel!
    @IBOutlet weak var emailLabel: UILabel!
    @IBOutlet weak var statusLabel: UILabel!

    var trabajadorId: Int? // Este ahora recibirá el ID de Usuario para mayor compatibilidad
    
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
        
        // Estilo ViajesApp
        view.backgroundColor = UIColor(red: 0.91, green: 0.95, blue: 0.98, alpha: 1.0)
        
        DispatchQueue.main.async {
            self.loadProfileData()
        }
    }

    private func setupUI() {
        view.addSubview(activityIndicator)
        activityIndicator.center = view.center
    }

    private func loadProfileData() {
        guard let id = trabajadorId else { 
            showErrorAlert(message: "ID de usuario no encontrado")
            return 
        }
        
        activityIndicator.startAnimating()
        // Usamos getUsuario en lugar de getTrabajador para mayor compatibilidad
        NetworkManager.shared.getUsuario(id: id) { [weak self] result in
            DispatchQueue.main.async {
                self?.activityIndicator.stopAnimating()
                switch result {
                case .success(let usuario):
                    self?.updateUI(with: usuario)
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

    private func updateUI(with u: UsuarioResponse) {
        // Extraer datos, ya sea del trabajador o del usuario directamente
        let username = u.username
        let rol = u.rol?.nombre ?? "Usuario"
        
        if let t = u.trabajador {
            let nombre = t.nombres ?? ""
            let apellido = t.apellidos ?? ""
            nameLabel.text = "\(nombre) \(apellido)"
            dniLabel.text = "DNI: \(t.dni ?? "No registrado")"
            emailLabel.text = "Email: \(t.email ?? "No registrado")"
            statusLabel.text = "Estado: \(t.activo == true ? "ACTIVO" : "INACTIVO")"
            statusLabel.textColor = t.activo == true ? .systemGreen : .systemRed
        } else {
            // Caso para administradores sin registro de trabajador
            nameLabel.text = username.capitalized
            dniLabel.text = "ID: \(u.id)"
            emailLabel.text = "Email: Sistema"
            statusLabel.text = "Estado: ADMINISTRADOR"
            statusLabel.textColor = .systemBlue
        }
        
        roleLabel.text = "Rol: \(rol)"
    }

    private func showErrorAlert(message: String) {
        DispatchQueue.main.async {
            if self.view.window == nil {
                DispatchQueue.main.asyncAfter(deadline: .now() + 0.5) {
                    self.presentAlert(message: message)
                }
            } else {
                self.presentAlert(message: message)
            }
        }
    }
    
    private func presentAlert(message: String) {
        let alert = UIAlertController(title: "Error al Cargar Perfil", message: message, preferredStyle: .alert)
        alert.addAction(UIAlertAction(title: "OK", style: .default, handler: { [weak self] _ in
            self?.navigationController?.popViewController(animated: true)
        }))
        self.present(alert, animated: true)
    }
}
