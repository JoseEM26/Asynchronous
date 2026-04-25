import UIKit

class LoginViewController: UIViewController {

    @IBOutlet weak var gradientView: UIView!
    @IBOutlet weak var loginCard: UIStackView!
    @IBOutlet weak var usernameField: UITextField!
    @IBOutlet weak var passwordField: UITextField!
    @IBOutlet weak var loginButton: UIButton!

    private let activityIndicator: UIActivityIndicatorView = {
        let ai = UIActivityIndicatorView(style: .large)
        ai.color = .gray
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
        
        // Estilo ViajesApp
        view.backgroundColor = UIColor(red: 0.91, green: 0.95, blue: 0.98, alpha: 1.0)
        gradientView.backgroundColor = .clear
        
        usernameField.layer.cornerRadius = 14
        usernameField.clipsToBounds = true
        passwordField.layer.cornerRadius = 14
        passwordField.clipsToBounds = true
        
        loginButton.layer.cornerRadius = 18
        loginButton.layer.shadowColor = UIColor.black.cgColor
        loginButton.layer.shadowOpacity = 0.12
        loginButton.layer.shadowOffset = CGSize(width: 0, height: 10)
        loginButton.layer.shadowRadius = 14
    }

    private func setupActivityIndicator() {
        view.addSubview(activityIndicator)
        activityIndicator.center = view.center
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
                    self?.performSegue(withIdentifier: "toDashboard", sender: response.trabajador?.id)
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
           let id = sender as? Int {
            dashboardVC.trabajadorId = id
        }
    }
}
