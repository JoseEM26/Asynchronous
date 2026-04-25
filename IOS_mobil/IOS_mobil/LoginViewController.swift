import UIKit

class LoginViewController: UIViewController {

    @IBOutlet weak var gradientView: UIView!
    @IBOutlet weak var loginCard: UIStackView!
    @IBOutlet weak var usernameField: UITextField!
    @IBOutlet weak var passwordField: UITextField!
    @IBOutlet weak var loginButton: UIButton!

    private let activityIndicator: UIActivityIndicatorView = {
        let ai = UIActivityIndicatorView(style: .large)
        ai.color = .systemOrange
        ai.hidesWhenStopped = true
        return ai
    }()

    override func viewWillAppear(_ animated: Bool) {
        super.viewWillAppear(animated)
        navigationController?.setNavigationBarHidden(true, animated: false)
    }

    override func viewDidLoad() {
        super.viewDidLoad()
        setupActivityIndicator()
        setupStyle()
    }
    
    private func setupStyle() {
        // Fondo gris oscuro elegante (fijo, no cambia con modo oscuro)
        let darkBg = UIColor(red: 0.12, green: 0.12, blue: 0.14, alpha: 1.0)
        view.backgroundColor = darkBg
        gradientView.backgroundColor = darkBg
        
        // Campos de texto - fondo claro con texto oscuro, funciona en cualquier modo
        let fieldBg = UIColor(white: 0.95, alpha: 1.0)
        let fieldText = UIColor(white: 0.1, alpha: 1.0)
        let placeholderColor = UIColor(white: 0.5, alpha: 1.0)
        
        for field in [usernameField, passwordField] {
            field?.backgroundColor = fieldBg
            field?.textColor = fieldText
            field?.layer.cornerRadius = 14
            field?.clipsToBounds = true
            field?.layer.borderWidth = 0
            field?.attributedPlaceholder = NSAttributedString(
                string: field == usernameField ? "Usuario" : "Contraseña",
                attributes: [.foregroundColor: placeholderColor]
            )
            // Padding interno
            let paddingView = UIView(frame: CGRect(x: 0, y: 0, width: 16, height: 44))
            field?.leftView = paddingView
            field?.leftViewMode = .always
        }
        
        // Botón naranja vibrante
        loginButton.backgroundColor = UIColor(red: 1.0, green: 0.55, blue: 0.0, alpha: 1.0)
        loginButton.setTitleColor(.white, for: .normal)
        loginButton.layer.cornerRadius = 16
        loginButton.layer.shadowColor = UIColor.orange.cgColor
        loginButton.layer.shadowOpacity = 0.4
        loginButton.layer.shadowOffset = CGSize(width: 0, height: 6)
        loginButton.layer.shadowRadius = 12
        loginButton.titleLabel?.font = .boldSystemFont(ofSize: 18)
    }

    private func setupActivityIndicator() {
        view.addSubview(activityIndicator)
        activityIndicator.translatesAutoresizingMaskIntoConstraints = false
        NSLayoutConstraint.activate([
            activityIndicator.centerXAnchor.constraint(equalTo: view.centerXAnchor),
            activityIndicator.centerYAnchor.constraint(equalTo: view.centerYAnchor)
        ])
    }

    @IBAction func loginPressed(_ sender: UIButton) {
        guard let username = usernameField.text, !username.isEmpty,
              let password = passwordField.text, !password.isEmpty else {
            showAlert(title: "Campos Vacíos", message: "Por favor ingrese usuario y contraseña")
            return
        }

        activityIndicator.startAnimating()
        loginButton.isEnabled = false

        let request = LoginRequest(username: username, password: password)
        NetworkManager.shared.login(request: request) { [weak self] result in
            DispatchQueue.main.async {
                self?.activityIndicator.stopAnimating()
                self?.loginButton.isEnabled = true

                switch result {
                case .success(let response):
                    self?.performSegue(withIdentifier: "toDashboard", sender: response)
                case .failure(let error):
                    var message = "Error desconocido"
                    switch error {
                    case .invalidURL: message = "URL Inválida"
                    case .noData: message = "Sin respuesta del servidor"
                    case .decodingError: message = "Error al procesar respuesta"
                    case .serverError(let err): message = err
                    }
                    self?.showAlert(title: "Login Fallido", message: message)
                }
            }
        }
    }

    private func showAlert(title: String, message: String) {
        let alert = UIAlertController(title: title, message: message, preferredStyle: .alert)
        alert.addAction(UIAlertAction(title: "OK", style: .default))
        present(alert, animated: true)
    }

    override func prepare(for segue: UIStoryboardSegue, sender: Any?) {
        if segue.identifier == "toDashboard",
           let dashboardVC = segue.destination as? DashboardViewController,
           let response = sender as? UsuarioResponse {
            dashboardVC.trabajadorId = response.id
            dashboardVC.userRole = response.rol?.nombre
        }
    }
}
