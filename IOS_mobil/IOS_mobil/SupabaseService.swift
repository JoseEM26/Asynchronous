import Foundation

class SupabaseService {
    static let shared = SupabaseService()
    
    // Configuración
    private let supabaseUrl = "https://dfzsxkqkcwaeckzldswd.supabase.co"
    private let supabaseKey = "TU_SUPABASE_ANON_KEY" // El usuario debe completar esto
    
    func enviarLog(mensaje: String, tipo: String = "INFO", usuario: String? = nil) {
        guard let url = URL(string: "\(supabaseUrl)/rest/v1/logs_actividad") else { return }
        
        var request = URLRequest(url: url)
        request.httpMethod = "POST"
        request.addValue(supabaseKey, forHTTPHeaderField: "apikey")
        request.addValue("Bearer \(supabaseKey)", forHTTPHeaderField: "Authorization")
        request.addValue("application/json", forHTTPHeaderField: "Content-Type")
        request.addValue("return=minimal", forHTTPHeaderField: "Prefer")
        
        let body: [String: Any] = [
            "mensaje": mensaje,
            "tipo": tipo,
            "usuario": usuario ?? "Sistema"
        ]
        
        do {
            request.httpBody = try JSONSerialization.data(withJSONObject: body)
        } catch {
            print("Error serializando JSON para Supabase: \(error)")
            return
        }
        
        let task = URLSession.shared.dataTask(with: request) { data, response, error in
            if let error = error {
                print("Error enviando a Supabase: \(error)")
            } else {
                print("Log enviado a Supabase con éxito")
            }
        }
        task.resume()
    }
}
