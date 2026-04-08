import Foundation

enum NetworkError: Error {
    case invalidURL
    case noData
    case decodingError
    case serverError(String)
}

class NetworkManager {
    static let shared = NetworkManager()
    private let baseURL = "http://57.156.64.242/api/"

    private init() {}

    func login(request: LoginRequest, completion: @escaping (Result<LoginResponse, NetworkError>) -> Void) {
        guard let url = URL(string: baseURL + "usuarios/login") else {
            completion(.failure(.invalidURL))
            return
        }

        var urlRequest = URLRequest(url: url)
        urlRequest.httpMethod = "POST"
        urlRequest.addValue("application/json", forHTTPHeaderField: "Content-Type")

        do {
            let body = try JSONEncoder().encode(request)
            urlRequest.httpBody = body
        } catch {
            completion(.failure(.decodingError))
            return
        }

        URLSession.shared.dataTask(with: urlRequest) { data, response, error in
            if let error = error {
                DispatchQueue.main.async { completion(.failure(.serverError(error.localizedDescription))) }
                return
            }

            guard let data = data else {
                DispatchQueue.main.async { completion(.failure(.noData)) }
                return
            }

            // Debug: print(String(data: data, encoding: .utf8) ?? "")

            do {
                let loginResponse = try JSONDecoder().decode(LoginResponse.self, from: data)
                DispatchQueue.main.async { completion(.success(loginResponse)) }
            } catch {
                DispatchQueue.main.async { completion(.failure(.decodingError)) }
            }
        }.resume()
    }

    func getTrabajador(id: Int, completion: @escaping (Result<TrabajadorResponse, NetworkError>) -> Void) {
        guard let url = URL(string: baseURL + "trabajadores/\(id)") else {
            completion(.failure(.invalidURL))
            return
        }

        URLSession.shared.dataTask(with: url) { data, response, error in
            if let error = error {
                DispatchQueue.main.async { completion(.failure(.serverError(error.localizedDescription))) }
                return
            }

            guard let data = data else {
                DispatchQueue.main.async { completion(.failure(.noData)) }
                return
            }

            // DEBUG: print JSON to console to catch schema mismatches
            if let jsonString = String(data: data, encoding: .utf8) {
                print("DEBUG JSON: \(jsonString)")
            }

            do {
                let trabajador = try JSONDecoder().decode(TrabajadorResponse.self, from: data)
                DispatchQueue.main.async { completion(.success(trabajador)) }
            } catch {
                print("DECODING ERROR: \(error)")
                DispatchQueue.main.async { completion(.failure(.decodingError)) }
            }
        }.resume()
    }
}
