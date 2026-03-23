import Foundation

enum NetworkError: Error {
    case invalidURL
    case noData
    case decodingError(Error)
    case serverError(String)
    case unauthorized
}

class NetworkManager {
    static let shared = NetworkManager()
    private init() {}
    
    // Configura aquí tu IP local o dominio del servidor Java
    let baseURL = "http://192.168.1.100:8080/api" 

    func request<T: Codable>(_ endpoint: String, 
                            method: String = "GET", 
                            body: Data? = nil, 
                            completion: @escaping (Result<T, NetworkError>) -> Void) {
        
        guard let url = URL(string: "\(baseURL)\(endpoint)") else {
            completion(.failure(.invalidURL))
            return
        }
        
        var request = URLRequest(url: url)
        request.httpMethod = method
        request.setValue("application/json", forHTTPHeaderField: "Content-Type")
        request.httpBody = body
        
        let task = URLSession.shared.dataTask(with: request) { data, response, error in
            if let error = error {
                completion(.failure(.serverError(error.localizedDescription)))
                return
            }
            
            guard let httpResponse = response as? HTTPURLResponse else {
                completion(.failure(.noData))
                return
            }
            
            if httpResponse.statusCode == 401 {
                completion(.failure(.unauthorized))
                return
            }
            
            guard (200...299).contains(httpResponse.statusCode) else {
                completion(.failure(.serverError("Status code: \(httpResponse.statusCode)")))
                return
            }
            
            guard let data = data else {
                completion(.failure(.noData))
                return
            }
            
            do {
                let decoder = JSONDecoder()
                // Soporte para fechas en formato ISO u otros personalizados según el backend
                let decodedData = try decoder.decode(T.self, from: data)
                DispatchQueue.main.async {
                    completion(.success(decodedData))
                }
            } catch {
                print("Decoding Error: \(error)")
                completion(.failure(.decodingError(error)))
            }
        }
        
        task.resume()
    }
}
