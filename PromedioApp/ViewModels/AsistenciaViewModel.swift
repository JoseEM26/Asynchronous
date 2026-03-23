import Foundation

class AsistenciaViewModel: ObservableObject {
    
    // MARK: - Properties
    @Published var isLoading: Bool = false
    @Published var errorMessage: String?
    @Published var lastResponse: AsistenciaResponse?
    @Published var statusMessage: String?
    
    // MARK: - Services
    private let service = AsistenciaService.shared
    
    // MARK: - Actions
    
    func registerAttendance(workerId: Int, modalityId: Int, type: String, lat: Double, lng: Double, notes: String?) {
        self.isLoading = true
        self.errorMessage = nil
        
        let request = AsistenciaRequest(
            trabajadorId: workerId,
            modalidadId: modalityId,
            tipo: type,
            latitud: lat,
            longitud: lng,
            notas: notes
        )
        
        service.registrarAsistencia(request: request) { [weak self] result in
            self?.isLoading = false
            switch result {
            case .success(let response):
                self?.lastResponse = response
                self?.statusMessage = "¡Marcación de \(type) exitosa!"
            case .failure(let error):
                self?.errorMessage = "Error al marcar: \(error.localizedDescription)"
            }
        }
    }
    
    func registerQrAttendance(workerId: Int, token: String, lat: Double, lng: Double) {
        self.isLoading = true
        self.errorMessage = nil
        
        let request = AsistenciaQrRequest(
            trabajadorId: workerId,
            qrToken: token,
            tipo: "ENTRADA", // El servidor puede inferirlo, pero enviamos uno por defecto
            latitud: lat,
            longitud: lng
        )
        
        service.registrarPorQr(request: request) { [weak self] result in
            self?.isLoading = false
            switch result {
            case .success(let response):
                self?.lastResponse = response
                self?.statusMessage = "Asistencia QR registrada correctamente"
            case .failure(let error):
                self?.errorMessage = "Error al escanear QR: \(error.localizedDescription)"
            }
        }
    }
    
    func updateRemoteLocation(id: Int, lat: Double, lng: Double) {
        self.isLoading = true
        service.actualizarUbicacionRemota(id: id, lat: lat, lng: lng) { [weak self] result in
            self?.isLoading = false
            switch result {
            case .success(let msg):
                self?.statusMessage = msg
            case .failure(let error):
                self?.errorMessage = error.localizedDescription
            }
        }
    }
    
    func updateTerrainPoint(jefeId: Int, lat: Double, lng: Double, name: String?) {
        self.isLoading = true
        service.actualizarPuntoTerreno(jefeId: jefeId, lat: lat, lng: lng, nombre: name) { [weak self] result in
            self?.isLoading = false
            switch result {
            case .success(let msg):
                self?.statusMessage = msg
            case .failure(let error):
                self?.errorMessage = error.localizedDescription
            }
        }
    }
}
