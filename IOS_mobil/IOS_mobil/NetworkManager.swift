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
            
            // Limpieza robusta: tomamos solo los primeros 19 caracteres (yyyy-MM-ddTHH:mm:ss)
            // Esto ignora cualquier cantidad de decimales o zonas horarias que confundan al formateador
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
                DispatchQueue.main.async { completion(.failure(.serverError(error.localizedDescription))) }
                return
            }

            guard let data = data else {
                DispatchQueue.main.async { completion(.failure(.noData)) }
                return
            }
            
            // Verificar código HTTP
            if let httpResponse = response as? HTTPURLResponse, !(200...299).contains(httpResponse.statusCode) {
                let serverMessage = String(data: data, encoding: .utf8) ?? "Error del servidor (código \(httpResponse.statusCode))"
                print("Server Error Response: \(serverMessage)")
                DispatchQueue.main.async { completion(.failure(.serverError(serverMessage))) }
                return
            }

            DispatchQueue.main.async {
                if let body = String(data: data, encoding: .utf8) { print("Respuesta Servidor QR: \(body)") }
                do {
                    let asistencia = try self.getDecoder().decode(AsistenciaResponse.self, from: data)
                    completion(.success(asistencia))
                } catch {
                    // Si no es JSON válido, puede ser un mensaje de texto del servidor
                    if let textResponse = String(data: data, encoding: .utf8) {
                        completion(.failure(.serverError(textResponse)))
                    } else {
                        print("QR decoding error: \(error)")
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
                DispatchQueue.main.async { completion(.failure(.serverError(error.localizedDescription))) }
                return
            }

            guard let data = data else {
                DispatchQueue.main.async { completion(.failure(.noData)) }
                return
            }

            DispatchQueue.main.async {
                if let body = String(data: data, encoding: .utf8) { print("📦 Historial Recibido: \(body)") }
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

        URLSession.shared.dataTask(with: urlRequest) { _, response, error in
            if let error = error {
                DispatchQueue.main.async { completion(.failure(.serverError(error.localizedDescription))) }
                return
            }

            if let httpResponse = response as? HTTPURLResponse, !(200...299).contains(httpResponse.statusCode) {
                DispatchQueue.main.async { completion(.failure(.serverError("Error \(httpResponse.statusCode)")))}
                return
            }

            DispatchQueue.main.async { completion(.success(())) }
        }.resume()
    }
}
