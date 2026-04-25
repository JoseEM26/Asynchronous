import UIKit

class ProfileViewController: UIViewController {

    // Creados por código, no por Storyboard
    private let nameLabel = UILabel()
    private let roleLabel = UILabel()
    private let dniLabel = UILabel()
    private let emailLabel = UILabel()
    private let statusLabel = UILabel()

    var trabajadorId: Int?
    
    private let activityIndicator: UIActivityIndicatorView = {
        let ai = UIActivityIndicatorView(style: .large)
        ai.color = .systemOrange
        ai.hidesWhenStopped = true
        return ai
    }()

    override func viewWillAppear(_ animated: Bool) {
        super.viewWillAppear(animated)
        navigationController?.setNavigationBarHidden(false, animated: true)
        title = "👤 Mi Perfil"
    }

    override func viewDidLoad() {
        super.viewDidLoad()
        
        // Botón cerrar (X)
        navigationItem.rightBarButtonItem = UIBarButtonItem(
            barButtonSystemItem: .close,
            target: self,
            action: #selector(closeTapped)
        )
        navigationItem.rightBarButtonItem?.tintColor = .systemOrange
        
        setupUI()
        loadProfileData()
    }
    
    @objc private func closeTapped() {
        dismiss(animated: true)
    }

    private func setupUI() {
        // Fondo adaptable
        view.backgroundColor = UIColor { trait in
            trait.userInterfaceStyle == .dark
                ? UIColor(red: 0.08, green: 0.08, blue: 0.10, alpha: 1.0)
                : UIColor(red: 0.95, green: 0.95, blue: 0.97, alpha: 1.0)
        }
        
        // Card contenedora
        let card = UIView()
        card.backgroundColor = UIColor { trait in
            trait.userInterfaceStyle == .dark
                ? UIColor(red: 0.15, green: 0.15, blue: 0.18, alpha: 1.0)
                : .white
        }
        card.layer.cornerRadius = 20
        card.layer.shadowColor = UIColor.black.cgColor
        card.layer.shadowOpacity = 0.08
        card.layer.shadowOffset = CGSize(width: 0, height: 4)
        card.layer.shadowRadius = 12
        card.translatesAutoresizingMaskIntoConstraints = false
        view.addSubview(card)
        
        // Avatar placeholder
        let avatarView = UIView()
        avatarView.backgroundColor = UIColor.systemOrange.withAlphaComponent(0.15)
        avatarView.layer.cornerRadius = 45
        avatarView.translatesAutoresizingMaskIntoConstraints = false
        card.addSubview(avatarView)
        
        let avatarLabel = UILabel()
        avatarLabel.text = "👤"
        avatarLabel.font = .systemFont(ofSize: 40)
        avatarLabel.textAlignment = .center
        avatarLabel.translatesAutoresizingMaskIntoConstraints = false
        avatarView.addSubview(avatarLabel)
        
        // Labels
        let labels = [nameLabel, roleLabel, dniLabel, emailLabel, statusLabel]
        let textColor = UIColor { trait in
            trait.userInterfaceStyle == .dark ? .white : UIColor(white: 0.2, alpha: 1.0)
        }
        let subtitleColor = UIColor { trait in
            trait.userInterfaceStyle == .dark
                ? UIColor(white: 0.65, alpha: 1.0)
                : UIColor(white: 0.45, alpha: 1.0)
        }
        
        nameLabel.font = .systemFont(ofSize: 24, weight: .bold)
        nameLabel.textColor = textColor
        nameLabel.textAlignment = .center
        nameLabel.text = "Cargando..."
        
        roleLabel.font = .systemFont(ofSize: 16, weight: .medium)
        roleLabel.textColor = .systemOrange
        roleLabel.textAlignment = .center
        
        for lbl in [dniLabel, emailLabel, statusLabel] {
            lbl.font = .systemFont(ofSize: 15, weight: .regular)
            lbl.textColor = subtitleColor
        }
        
        let stack = UIStackView(arrangedSubviews: labels)
        stack.axis = .vertical
        stack.spacing = 10
        stack.alignment = .fill
        stack.translatesAutoresizingMaskIntoConstraints = false
        card.addSubview(stack)
        
        // Activity indicator
        activityIndicator.translatesAutoresizingMaskIntoConstraints = false
        view.addSubview(activityIndicator)
        
        // Constraints
        NSLayoutConstraint.activate([
            card.topAnchor.constraint(equalTo: view.safeAreaLayoutGuide.topAnchor, constant: 24),
            card.leadingAnchor.constraint(equalTo: view.leadingAnchor, constant: 20),
            card.trailingAnchor.constraint(equalTo: view.trailingAnchor, constant: -20),
            
            avatarView.topAnchor.constraint(equalTo: card.topAnchor, constant: 30),
            avatarView.centerXAnchor.constraint(equalTo: card.centerXAnchor),
            avatarView.widthAnchor.constraint(equalToConstant: 90),
            avatarView.heightAnchor.constraint(equalToConstant: 90),
            
            avatarLabel.centerXAnchor.constraint(equalTo: avatarView.centerXAnchor),
            avatarLabel.centerYAnchor.constraint(equalTo: avatarView.centerYAnchor),
            
            stack.topAnchor.constraint(equalTo: avatarView.bottomAnchor, constant: 20),
            stack.leadingAnchor.constraint(equalTo: card.leadingAnchor, constant: 24),
            stack.trailingAnchor.constraint(equalTo: card.trailingAnchor, constant: -24),
            stack.bottomAnchor.constraint(equalTo: card.bottomAnchor, constant: -30),
            
            activityIndicator.centerXAnchor.constraint(equalTo: view.centerXAnchor),
            activityIndicator.centerYAnchor.constraint(equalTo: view.centerYAnchor),
        ])
    }

    private func loadProfileData() {
        guard let id = trabajadorId else { 
            showErrorAlert(message: "ID de usuario no encontrado")
            return 
        }
        
        activityIndicator.startAnimating()
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
                    case .decodingError: message = "Error de formato en los datos"
                    case .serverError(let detail): message = detail
                    }
                    self?.showErrorAlert(message: message)
                }
            }
        }
    }

    private func updateUI(with u: UsuarioResponse) {
        let rol = u.rol?.nombre ?? "Usuario"
        
        if let t = u.trabajador {
            let nombre = t.nombres ?? ""
            let apellido = t.apellidos ?? ""
            nameLabel.text = "\(nombre) \(apellido)"
            dniLabel.text = "📋  DNI: \(t.dni ?? "No registrado")"
            emailLabel.text = "📧  Email: \(t.email ?? "No registrado")"
            statusLabel.text = "⚡  Estado: \(t.activo == true ? "ACTIVO" : "INACTIVO")"
            statusLabel.textColor = t.activo == true ? .systemGreen : .systemRed
        } else {
            nameLabel.text = u.username.capitalized
            dniLabel.text = "📋  ID: \(u.id)"
            emailLabel.text = "📧  Email: Sistema"
            statusLabel.text = "⚡  Estado: ADMINISTRADOR"
            statusLabel.textColor = .systemBlue
        }
        
        roleLabel.text = "🏷  \(rol)"
    }

    private func showErrorAlert(message: String) {
        DispatchQueue.main.async {
            let alert = UIAlertController(title: "Error al Cargar Perfil", message: message, preferredStyle: .alert)
            alert.addAction(UIAlertAction(title: "OK", style: .default, handler: { [weak self] _ in
                self?.navigationController?.popViewController(animated: true)
            }))
            self.present(alert, animated: true)
        }
    }
}
