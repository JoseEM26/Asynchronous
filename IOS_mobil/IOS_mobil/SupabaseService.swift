import Foundation
import UIKit

class SupabaseService {
    static let shared = SupabaseService()
    
    // Configuración
    private let supabaseUrl = "https://dfzsxkqkcwaeckzldswd.supabase.co"
    private let supabaseKey = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImRmenN4a3FrY3dhZWNremxkc3dkIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzcwNjUzNzksImV4cCI6MjA5MjY0MTM3OX0.1bV0BiP6oF_XkHCgUsJlZZQV-eG5wNHpOB-Et3J3SX0"
    
    func log(mensaje: String, tipo: String = "INFO", usuario: String? = nil) {
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

    func saveLocation(usuarioId: Int, lat: Double, lng: Double) {
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

    func uploadProfileImage(usuarioId: Int, image: UIImage, completion: @escaping (Result<String, Error>) -> Void) {
        let path = "avatar_\(usuarioId).jpg"
        // Corregido: la URL para subir archivos es /storage/v1/object/
        guard let url = URL(string: "\(supabaseUrl)/storage/v1/object/perfiles/\(path)") else { return }
        
        // Comprimir imagen para no exceder límites
        guard let imageData = image.jpegData(compressionQuality: 0.5) else { return }
        
        var request = URLRequest(url: url)
        request.httpMethod = "POST"
        request.addValue(supabaseKey, forHTTPHeaderField: "apikey")
        request.addValue("Bearer \(supabaseKey)", forHTTPHeaderField: "Authorization")
        request.addValue("image/jpeg", forHTTPHeaderField: "Content-Type")
        request.addValue("true", forHTTPHeaderField: "x-upsert")
        request.httpBody = imageData
        
        URLSession.shared.dataTask(with: request) { data, response, error in
            if let error = error {
                print("❌ Error de red: \(error.localizedDescription)")
                completion(.failure(error))
                return
            }
            
            if let http = response as? HTTPURLResponse {
                print("📡 Supabase Status: \(http.statusCode)")
                if let d = data, let str = String(data: d, encoding: .utf8) {
                    print("📄 Body: \(str)")
                }
                
                if http.statusCode == 200 || http.statusCode == 201 {
                    completion(.success("\(self.supabaseUrl)/storage/v1/object/public/perfiles/\(path)"))
                } else {
                    let err = NSError(domain: "Supabase", code: http.statusCode, userInfo: [NSLocalizedDescriptionKey: "Error \(http.statusCode). Revisa si el bucket 'perfiles' existe y es público."])
                    completion(.failure(err))
                }
            }
        }.resume()
    }
    
    func getProfileImageUrl(usuarioId: Int) -> URL? {
        // URL pública para descargar la imagen
        return URL(string: "\(supabaseUrl)/storage/v1/object/public/perfiles/avatar_\(usuarioId).jpg")
    }
}
