import Foundation

enum NetworkError: Error {
    case invalidURL
    case noData
    case decodingError
    case serverError(String)
}

class NetworkManager {
    static let shared = NetworkManager()
    private init() {}

    let baseURL = "https://asynchronous-production.up.railway.app/api/"

    func getDecoder() -> JSONDecoder {
        let decoder = JSONDecoder()
        decoder.dateDecodingStrategy = .custom { decoder in
            let container = try decoder.singleValueContainer()
            let dateString = try container.decode(String.self)
            
            let baseDate = String(dateString.prefix(19))
            
            let fallbackFormatter = DateFormatter()
            fallbackFormatter.dateFormat = "yyyy-MM-dd'T'HH:mm:ss"
            if let date = fallbackFormatter.date(from: baseDate) { return date }
            
            return Date()
        }
        return decoder
    }

    func login(request: LoginRequest, completion: @escaping (Result<UsuarioResponse, NetworkError>) -> Void) {
        guard let url = URL(string: baseURL + "usuarios/login") else {
            completion(.failure(.invalidURL))
            return
        }

        var urlRequest = URLRequest(url: url)
        urlRequest.httpMethod = "POST"
        urlRequest.addValue("application/json", forHTTPHeaderField: "Content-Type")

        do {
            urlRequest.httpBody = try JSONEncoder().encode(request)
        } catch {
            completion(.failure(.decodingError))
            return
        }

        URLSession.shared.dataTask(with: urlRequest) { data, response, error in
            if let error = error {
                SupabaseService.shared.logError(error.localizedDescription, contexto: "Login")
                DispatchQueue.main.async { completion(.failure(.serverError(error.localizedDescription))) }
                return
            }

            guard let data = data else {
                DispatchQueue.main.async { completion(.failure(.noData)) }
                return
            }

            DispatchQueue.main.async {
                do {
                    let usuario = try self.getDecoder().decode(UsuarioResponse.self, from: data)
                    completion(.success(usuario))
                } catch {
                    print("Login decoding error: \(error)")
                    completion(.failure(.decodingError))
                }
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
            urlRequest.httpBody = try JSONEncoder().encode(request)
        } catch {
            completion(.failure(.decodingError))
            return
        }

        URLSession.shared.dataTask(with: urlRequest) { data, response, error in
            if let error = error {
                SupabaseService.shared.logError(error.localizedDescription, contexto: "RegistrarAsistenciaQR")
                DispatchQueue.main.async { completion(.failure(.serverError(error.localizedDescription))) }
                return
            }

            guard let data = data else {
                DispatchQueue.main.async { completion(.failure(.noData)) }
                return
            }
            
            if let httpResponse = response as? HTTPURLResponse, !(200...299).contains(httpResponse.statusCode) {
                let serverMessage = String(data: data, encoding: .utf8) ?? "Error del servidor (código \(httpResponse.statusCode))"
                SupabaseService.shared.logError(serverMessage, contexto: "RegistrarAsistenciaQR Server")
                DispatchQueue.main.async { completion(.failure(.serverError(serverMessage))) }
                return
            }

            DispatchQueue.main.async {
                do {
                    let asistencia = try self.getDecoder().decode(AsistenciaResponse.self, from: data)
                    completion(.success(asistencia))
                } catch {
                    if let textResponse = String(data: data, encoding: .utf8) {
                        completion(.failure(.serverError(textResponse)))
                    } else {
                        completion(.failure(.decodingError))
                    }
                }
            }
        }.resume()
    }

    func getUsuario(id: Int, completion: @escaping (Result<UsuarioResponse, NetworkError>) -> Void) {
        guard let url = URL(string: baseURL + "usuarios/\(id)") else {
            completion(.failure(.invalidURL))
            return
        }

        URLSession.shared.dataTask(with: url) { data, response, error in
            if let error = error {
                SupabaseService.shared.logError(error.localizedDescription, contexto: "GetUsuario")
                DispatchQueue.main.async { completion(.failure(.serverError(error.localizedDescription))) }
                return
            }

            guard let data = data else {
                DispatchQueue.main.async { completion(.failure(.noData)) }
                return
            }

            DispatchQueue.main.async {
                do {
                    let usuario = try self.getDecoder().decode(UsuarioResponse.self, from: data)
                    completion(.success(usuario))
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
                SupabaseService.shared.logError(error.localizedDescription, contexto: "GetAsistencias")
                DispatchQueue.main.async { completion(.failure(.serverError(error.localizedDescription))) }
                return
            }

            guard let data = data else {
                DispatchQueue.main.async { completion(.failure(.noData)) }
                return
            }

            DispatchQueue.main.async {
                do {
                    let asistencias = try self.getDecoder().decode([AsistenciaResponse].self, from: data)
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
                SupabaseService.shared.logError(error.localizedDescription, contexto: "GetComunicados")
                DispatchQueue.main.async { completion(.failure(.serverError(error.localizedDescription))) }
                return
            }

            guard let data = data else {
                DispatchQueue.main.async { completion(.failure(.noData)) }
                return
            }

            DispatchQueue.main.async {
                do {
                    let comunicados = try self.getDecoder().decode([ComunicadoResponse].self, from: data)
                    completion(.success(comunicados))
                } catch {
                    completion(.failure(.decodingError))
                }
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
                SupabaseService.shared.logError(error.localizedDescription, contexto: "ActualizarUbicacionVirtual")
                DispatchQueue.main.async { completion(.failure(.serverError(error.localizedDescription))) }
                return
            }

            if let httpResponse = response as? HTTPURLResponse, !(200...299).contains(httpResponse.statusCode) {
                let errorMessage = String(data: data ?? Data(), encoding: .utf8) ?? "Error \(httpResponse.statusCode)"
                SupabaseService.shared.logError(errorMessage, contexto: "ActualizarUbicacionVirtual Server")
                DispatchQueue.main.async { completion(.failure(.serverError(errorMessage))) }
                return
            }

            DispatchQueue.main.async { completion(.success(())) }
        }.resume()
    }

    func getConfiguracion(completion: @escaping (Result<ConfiguracionResponse, NetworkError>) -> Void) {
        guard let url = URL(string: baseURL + "configuracion") else {
            completion(.failure(.invalidURL))
            return
        }

        URLSession.shared.dataTask(with: url) { data, response, error in
            if let error = error {
                SupabaseService.shared.logError(error.localizedDescription, contexto: "GetConfiguracion")
                DispatchQueue.main.async { completion(.failure(.serverError(error.localizedDescription))) }
                return
            }

            guard let data = data else {
                DispatchQueue.main.async { completion(.failure(.noData)) }
                return
            }

            DispatchQueue.main.async {
                do {
                    let config = try self.getDecoder().decode(ConfiguracionResponse.self, from: data)
                    completion(.success(config))
                } catch {
                    completion(.failure(.decodingError))
                }
            }
        }.resume()
    }

    func updateConfiguracion(lat: Double, lng: Double, radius: Int, completion: @escaping (Result<Void, NetworkError>) -> Void) {
        guard let url = URL(string: baseURL + "configuracion") else {
            completion(.failure(.invalidURL))
            return
        }

        var urlRequest = URLRequest(url: url)
        urlRequest.httpMethod = "PUT"
        urlRequest.addValue("application/json", forHTTPHeaderField: "Content-Type")

        let body: [String: Any] = [
            "officeLat": lat,
            "officeLng": lng,
            "radius": radius
        ]

        urlRequest.httpBody = try? JSONSerialization.data(withJSONObject: body)

        URLSession.shared.dataTask(with: urlRequest) { data, response, error in
            if let error = error {
                SupabaseService.shared.logError(error.localizedDescription, contexto: "UpdateConfiguracion")
                DispatchQueue.main.async { completion(.failure(.serverError(error.localizedDescription))) }
                return
            }

            if let httpResponse = response as? HTTPURLResponse, !(200...299).contains(httpResponse.statusCode) {
                let msg = String(data: data ?? Data(), encoding: .utf8) ?? "Error \(httpResponse.statusCode)"
                SupabaseService.shared.logError(msg, contexto: "UpdateConfiguracion Server")
                DispatchQueue.main.async { completion(.failure(.serverError("Error \(httpResponse.statusCode)")))}
                return
            }

            DispatchQueue.main.async { completion(.success(())) }
        }.resume()
    }
}
