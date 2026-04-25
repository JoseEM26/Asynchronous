import Foundation

enum NetworkError: Error {
    case invalidURL
    case noData
    case decodingError
    case serverError(String)
}

class NetworkManager {
    static let shared = NetworkManager()
    private let baseURL = "https://asynchronous-production.up.railway.app/api/"

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

    func registrarAsistenciaQR(request: AsistenciaQrRequest, completion: @escaping (Result<AsistenciaResponse, NetworkError>) -> Void) {
        guard let url = URL(string: baseURL + "asistencias/registrar-qr") else {
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

            if let httpResponse = response as? HTTPURLResponse, !(200...299).contains(httpResponse.statusCode) {
                let errorMessage = String(data: data, encoding: .utf8) ?? "Error \(httpResponse.statusCode)"
                DispatchQueue.main.async { completion(.failure(.serverError(errorMessage))) }
                return
            }

            DispatchQueue.main.async {
                do {
                    let responseData = try JSONDecoder().decode(AsistenciaResponse.self, from: data)
                    
                    // Log a Supabase (Real-time Feed)
                    SupabaseService.shared.enviarLog(
                        mensaje: "✅ Asistencia registrada (\(request.tipo)): Trabajador #\(request.trabajadorId)",
                        tipo: "ASISTENCIA",
                        usuario: "App iOS"
                    )
                    
                    completion(.success(responseData))
                } catch {
                    print("Decoding error: \(error)")
                    completion(.failure(.decodingError))
                }
            }
        }.resume()
    }

    func getEstadoHoy(trabajadorId: Int, completion: @escaping (Result<AsistenciaResponse?, NetworkError>) -> Void) {
        guard let url = URL(string: baseURL + "asistencias/estado-hoy/\(trabajadorId)") else {
            completion(.failure(.invalidURL))
            return
        }

        URLSession.shared.dataTask(with: url) { data, response, error in
            if let error = error {
                DispatchQueue.main.async { completion(.failure(.serverError(error.localizedDescription))) }
                return
            }

            if let httpResponse = response as? HTTPURLResponse, httpResponse.statusCode == 204 {
                DispatchQueue.main.async { completion(.success(nil)) }
                return
            }

            guard let data = data else {
                DispatchQueue.main.async { completion(.failure(.noData)) }
                return
            }

            DispatchQueue.main.async {
                do {
                    let asistencia = try JSONDecoder().decode(AsistenciaResponse.self, from: data)
                    completion(.success(asistencia))
                } catch {
                    completion(.failure(.decodingError))
                }
            }
        }.resume()
    }

    func getAsistenciasPorTrabajador(id: Int, completion: @escaping (Result<[AsistenciaResponse], NetworkError>) -> Void) {
        guard let url = URL(string: baseURL + "asistencias/trabajador/\(id)") else {
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

            DispatchQueue.main.async {
                do {
                    let asistencias = try JSONDecoder().decode([AsistenciaResponse].self, from: data)
                    completion(.success(asistencias))
                } catch {
                    completion(.failure(.decodingError))
                }
            }
        }.resume()
    }

    func getComunicadosActivos(completion: @escaping (Result<[ComunicadoResponse], NetworkError>) -> Void) {
        guard let url = URL(string: baseURL + "comunicados/activos") else {
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

            do {
                let comunicados = try JSONDecoder().decode([ComunicadoResponse].self, from: data)
                DispatchQueue.main.async { completion(.success(comunicados)) }
            } catch {
                DispatchQueue.main.async { completion(.failure(.decodingError)) }
            }
        }.resume()
    }

    func actualizarUbicacionVirtual(id: Int, lat: Double, lng: Double, completion: @escaping (Result<Void, NetworkError>) -> Void) {
        var components = URLComponents(string: baseURL + "trabajadores/\(id)/ubicacion-virtual")
        components?.queryItems = [
            URLQueryItem(name: "lat", value: String(lat)),
            URLQueryItem(name: "lng", value: String(lng))
        ]

        guard let url = components?.url else {
            completion(.failure(.invalidURL))
            return
        }

        var urlRequest = URLRequest(url: url)
        urlRequest.httpMethod = "PUT"

        URLSession.shared.dataTask(with: urlRequest) { data, response, error in
            if let error = error {
                DispatchQueue.main.async { completion(.failure(.serverError(error.localizedDescription))) }
                return
            }

            if let httpResponse = response as? HTTPURLResponse, !(200...299).contains(httpResponse.statusCode) {
                let errorMessage = String(data: data ?? Data(), encoding: .utf8) ?? "Error \(httpResponse.statusCode)"
                DispatchQueue.main.async { completion(.failure(.serverError(errorMessage))) }
                return
            }

            DispatchQueue.main.async { completion(.success(())) }
        }.resume()
    }
}
