import Foundation

class LoginViewModel: ObservableObject {
    @Published var username = ""
    @Published var password = ""
    @Published var isLoading = false
    @Published var errorMessage: String?
    @Published var isLoggedIn = false
    
    private let authService = AuthService.shared
    
    init() {
        self.isLoggedIn = authService.currentUser != nil
    }
    
    func login() {
        guard !username.isEmpty, !password.isEmpty else {
            self.errorMessage = "Por favor ingresa usuario y contraseña"
            return
        }
        
        self.isLoading = true
        self.errorMessage = nil
        
        let request = LoginRequest(username: username, password: password)
        
        authService.login(request: request) { [weak self] result in
            self?.isLoading = false
            switch result {
            case .success(_):
                self?.isLoggedIn = true
            case .failure(let error):
                self?.errorMessage = "Error: \(error.localizedDescription)"
            }
        }
    }
    
    func logout() {
        authService.logout()
        self.isLoggedIn = false
        self.username = ""
        self.password = ""
    }
}
