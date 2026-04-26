import Foundation
import UIKit

class SupabaseService {
    static let shared = SupabaseService()
    
    // Configuración
    private let supabaseUrl = "https://dfzsxkqkcwaeckzldswd.supabase.co"
    private let supabaseKey = "TU_SUPABASE_ANON_KEY" // El usuario debe completar esto
    
    /// Envía un registro de actividad o error a Supabase
    func log(mensaje: String, tipo: String = "INFO", usuario: String? = nil) {
        guard supabaseKey != "TU_SUPABASE_ANON_KEY" else { return }
        
        guard let url = URL(string: "\(supabaseUrl)/rest/v1/logs_actividad") else { return }
        
        var request = URLRequest(url: url)
        request.httpMethod = "POST"
        request.addValue(supabaseKey, forHTTPHeaderField: "apikey")
        request.addValue("Bearer \(supabaseKey)", forHTTPHeaderField: "Authorization")
        request.addValue("application/json", forHTTPHeaderField: "Content-Type")
        
        let body: [String: Any] = [
            "mensaje": mensaje,
            "tipo": tipo,
            "usuario": usuario ?? "Sistema iOS",
            "fecha": ISO8601DateFormatter().string(from: Date())
        ]
        
        request.httpBody = try? JSONSerialization.data(withJSONObject: body)
        URLSession.shared.dataTask(with: request).resume()
    }
    
    func logError(_ error: String, contexto: String, usuario: String? = nil) {
        log(mensaje: "ERROR en [\(contexto)]: \(error)", tipo: "ERROR", usuario: usuario)
    }

    // MARK: - Historial de Ubicación
    
    func saveLocation(usuarioId: Int, lat: Double, lng: Double) {
        guard supabaseKey != "TU_SUPABASE_ANON_KEY" else { return }
        guard let url = URL(string: "\(supabaseUrl)/rest/v1/historial_ubicacion") else { return }
        
        var request = URLRequest(url: url)
        request.httpMethod = "POST"
        request.addValue(supabaseKey, forHTTPHeaderField: "apikey")
        request.addValue("Bearer \(supabaseKey)", forHTTPHeaderField: "Authorization")
        request.addValue("application/json", forHTTPHeaderField: "Content-Type")
        
        let body: [String: Any] = [
            "usuario_id": usuarioId,
            "latitud": lat,
            "longitud": lng,
            "fecha": ISO8601DateFormatter().string(from: Date())
        ]
        
        request.httpBody = try? JSONSerialization.data(withJSONObject: body)
        URLSession.shared.dataTask(with: request).resume()
    }

    // MARK: - Supabase Storage (Fotos de Perfil)
    
    func uploadProfileImage(usuarioId: Int, image: UIImage, completion: @escaping (Result<String, Error>) -> Void) {
        guard supabaseKey != "TU_SUPABASE_ANON_KEY" else { 
            completion(.failure(NSError(domain: "Supabase", code: 401, userInfo: [NSLocalizedDescriptionKey: "Key no configurada"])))
            return 
        }
        
        let path = "avatar_\(usuarioId).jpg"
        guard let url = URL(string: "\(supabaseUrl)/storage/v1/object/perfiles/\(path)") else { return }
        
        guard let imageData = image.jpegData(compressionQuality: 0.5) else { return }
        
        var request = URLRequest(url: url)
        request.httpMethod = "POST"
        request.addValue(supabaseKey, forHTTPHeaderField: "apikey")
        request.addValue("Bearer \(supabaseKey)", forHTTPHeaderField: "Authorization")
        request.addValue("image/jpeg", forHTTPHeaderField: "Content-Type")
        request.addValue("upsert=true", forHTTPHeaderField: "x-upsert") // Sobreescribir si existe
        
        request.httpBody = imageData
        
        URLSession.shared.dataTask(with: request) { data, response, error in
            if let error = error {
                completion(.failure(error))
                return
            }
            completion(.success("\(self.supabaseUrl)/storage/v1/object/public/perfiles/\(path)"))
        }.resume()
    }
    
    func getProfileImageUrl(usuarioId: Int) -> URL? {
        return URL(string: "\(supabaseUrl)/storage/v1/object/public/perfiles/avatar_\(usuarioId).jpg")
    }
}
