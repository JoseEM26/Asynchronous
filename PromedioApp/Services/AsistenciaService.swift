import Foundation

class AsistenciaService {
    
    static let shared = AsistenciaService()
    private let network = NetworkManager.shared
    
    // MARK: - Attendance Actions
    
    func registrarAsistencia(request: AsistenciaRequest, completion: @escaping (Result<AsistenciaResponse, NetworkError>) -> Void) {
        let encoder = JSONEncoder()
        guard let data = try? encoder.encode(request) else { return }
        
        network.request("/asistencias", method: "POST", body: data, completion: completion)
    }
    
    func registrarPorQr(request: AsistenciaQrRequest, completion: @escaping (Result<AsistenciaResponse, NetworkError>) -> Void) {
        let encoder = JSONEncoder()
        guard let data = try? encoder.encode(request) else { return }
        
        network.request("/asistencias/registrar-qr", method: "POST", body: data, completion: completion)
    }
    
    // MARK: - Location Management (Mobile Specific)
    
    func actualizarUbicacionRemota(id: Int, lat: Double, lng: Double, completion: @escaping (Result<String, NetworkError>) -> Void) {
        let body: [String: Any] = [
            "trabajadorId": id,
            "latitud": lat,
            "longitud": lng
        ]
        let data = try? JSONSerialization.data(withJSONObject: body)
        
        network.request("/mobile/puntos/remoto", method: "POST", body: data) { (result: Result<String, NetworkError>) in
            completion(result)
        }
    }
    
    func actualizarPuntoTerreno(jefeId: Int, lat: Double, lng: Double, nombre: String?, completion: @escaping (Result<String, NetworkError>) -> Void) {
        let body: [String: Any] = [
            "trabajadorId": jefeId,
            "latitud": lat,
            "longitud": lng,
            "nombreUbicacion": nombre ?? ""
        ]
        let data = try? JSONSerialization.data(withJSONObject: body)
        
        network.request("/mobile/puntos/terreno", method: "POST", body: data) { (result: Result<String, NetworkError>) in
            completion(result)
        }
    }
    
    func actualizarOficina(lat: Double, lng: Double, completion: @escaping (Result<String, NetworkError>) -> Void) {
        let body: [String: Any] = [
            "latitud": lat,
            "longitud": lng
        ]
        let data = try? JSONSerialization.data(withJSONObject: body)
        
        network.request("/mobile/puntos/oficina", method: "POST", body: data) { (result: Result<String, NetworkError>) in
            completion(result)
        }
    }
}
