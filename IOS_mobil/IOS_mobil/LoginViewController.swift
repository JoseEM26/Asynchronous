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

    private let gradientLayer = CAGradientLayer()

    override func viewWillAppear(_ animated: Bool) {
        super.viewWillAppear(animated)
        navigationController?.setNavigationBarHidden(true, animated: false)
    }

    override func viewDidLoad() {
        super.viewDidLoad()
        setupBackgroundGradient()
        setupActivityIndicator()
        setupStyle()
        
        if #available(iOS 17.0, *) {
            registerForTraitChanges([UITraitUserInterfaceStyle.self]) { (self: Self, previousTraitCollection: UITraitCollection) in
                self.setupStyle()
                self.updateBackgroundGradient()
            }
        }
    }
    
    private func setupBackgroundGradient() {
        gradientLayer.frame = view.bounds
        gradientLayer.startPoint = CGPoint(x: 0.5, y: 0)
        gradientLayer.endPoint = CGPoint(x: 0.5, y: 1)
        view.layer.insertSublayer(gradientLayer, at: 0)
        updateBackgroundGradient()
    }
    
    private func updateBackgroundGradient() {
        let isDark = traitCollection.userInterfaceStyle == .dark
        if isDark {
            let topColor = UIColor(red: 0.15, green: 0.15, blue: 0.18, alpha: 1.0).cgColor
            let bottomColor = UIColor(red: 0.08, green: 0.08, blue: 0.10, alpha: 1.0).cgColor
            gradientLayer.colors = [topColor, bottomColor]
        } else {
            let topColor = UIColor(red: 1.0, green: 0.98, blue: 0.95, alpha: 1.0).cgColor
            let bottomColor = UIColor(red: 1.0, green: 0.94, blue: 0.88, alpha: 1.0).cgColor
            gradientLayer.colors = [topColor, bottomColor]
        }
        gradientLayer.frame = view.bounds
    }

    override func viewDidLayoutSubviews() {
        super.viewDidLayoutSubviews()
        gradientLayer.frame = view.bounds
    }
    
    private func setupStyle() {
        let isDark = traitCollection.userInterfaceStyle == .dark
        view.backgroundColor = isDark ? .black : .white
        if let gv = gradientView { gv.backgroundColor = .clear }
        
        let fieldBg = isDark ? UIColor(white: 1.0, alpha: 0.08) : UIColor(white: 0.0, alpha: 0.05)
        let fieldText = isDark ? UIColor.white : UIColor.black
        let placeholderColor = isDark ? UIColor(white: 0.6, alpha: 1.0) : UIColor(white: 0.4, alpha: 1.0)
        
        for field in [usernameField, passwordField] {
            guard let field = field else { continue }
            field.backgroundColor = fieldBg
            field.textColor = fieldText
            field.layer.cornerRadius = 18
            field.clipsToBounds = true
            field.layer.borderWidth = isDark ? 1 : 0
            field.layer.borderColor = UIColor(white: 1.0, alpha: 0.1).cgColor
            
            // Seguridad de contraseña
            if field == passwordField {
                field.isSecureTextEntry = true
                field.textContentType = .password
            }
            
            field.attributedPlaceholder = NSAttributedString(
                string: field == usernameField ? "Usuario" : "Contraseña",
                attributes: [.foregroundColor: placeholderColor]
            )
            
            let paddingView = UIView(frame: CGRect(x: 0, y: 0, width: 22, height: 55))
            field.leftView = paddingView
            field.leftViewMode = .always
        }
        
        loginButton.backgroundColor = .systemOrange
        loginButton.setTitleColor(.white, for: .normal)
        loginButton.layer.cornerRadius = 20
        loginButton.layer.shadowColor = UIColor.systemOrange.cgColor
        loginButton.layer.shadowOpacity = 0.4
        loginButton.layer.shadowOffset = CGSize(width: 0, height: 10)
        loginButton.layer.shadowRadius = 15
        loginButton.titleLabel?.font = .systemFont(ofSize: 19, weight: .bold)
        
        updateLogoForMode()
    }

    private func updateLogoForMode() {
        let isDark = traitCollection.userInterfaceStyle == .dark
        func findAndStyleLogo(in view: UIView) {
            if let imgView = view as? UIImageView, view != gradientView {
                imgView.image = UIImage(named: "AppLogo")
                imgView.contentMode = .scaleAspectFit
                imgView.transform = CGAffineTransform(scaleX: 1.4, y: 1.4)
                if isDark {
                    imgView.layer.shadowColor = UIColor.white.cgColor
                    imgView.layer.shadowOpacity = 0.3
                    imgView.layer.shadowRadius = 20
                    imgView.layer.shadowOffset = .zero
                } else {
                    imgView.layer.shadowOpacity = 0
                }
            }
            for subview in view.subviews { findAndStyleLogo(in: subview) }
        }
        findAndStyleLogo(in: self.view)
    }

    override func traitCollectionDidChange(_ previousTraitCollection: UITraitCollection?) {
        super.traitCollectionDidChange(previousTraitCollection)
        if #available(iOS 17.0, *) { return }
        if self.traitCollection.userInterfaceStyle != previousTraitCollection?.userInterfaceStyle {
            setupStyle()
            updateBackgroundGradient()
        }
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
                    case .invalidURL: message = "URL Inválida"; case .noData: message = "Sin respuesta del servidor"; case .decodingError: message = "Error al procesar respuesta"; case .serverError(let err): message = err
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
        if segue.identifier == "toDashboard", let dashboardVC = segue.destination as? DashboardViewController, let response = sender as? UsuarioResponse {
            dashboardVC.modalPresentationStyle = .fullScreen
            dashboardVC.trabajadorId = response.id
            dashboardVC.userRole = response.rol?.nombre
        }
    }
}
