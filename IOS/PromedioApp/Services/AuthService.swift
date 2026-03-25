import Foundation

class AuthService {
    static let shared = AuthService()
    private let network = NetworkManager.shared
    
    @Published var currentUser: UsuarioResponse?
    
    private init() {
        if let data = UserDefaults.standard.data(forKey: "asistencia_user"),
           let user = try? JSONDecoder().decode(UsuarioResponse.self, from: data) {
            self.currentUser = user
        }
    }
    
    func login(request: LoginRequest, completion: @escaping (Result<UsuarioResponse, NetworkError>) -> Void) {
        let encoder = JSONEncoder()
        guard let data = try? encoder.encode(request) else { return }
        
        network.request("/usuarios/login", method: "POST", body: data) { (result: Result<UsuarioResponse, NetworkError>) in
            switch result {
            case .success(let user):
                if let data = try? encoder.encode(user) {
                    UserDefaults.standard.set(data, forKey: "asistencia_user")
                    self.currentUser = user
                }
                completion(.success(user))
            case .failure(let error):
                completion(.failure(error))
            }
        }
    }
    
    func logout() {
        UserDefaults.standard.removeObject(forKey: "asistencia_user")
        self.currentUser = nil
    }
}
