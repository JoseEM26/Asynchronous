import Foundation

// MARK: - Models

struct TrabajadorResponse: Codable {
    let id: Int
    let dni: String
    let nombres: String
    let apellidos: String
    let modalidad: ModalidadResponse?
    let esJefeTerreno: Bool?
}

struct ModalidadResponse: Codable {
    let id: Int
    let nombre: String
}

struct AsistenciaResponse: Codable {
    let id: Int
    let trabajador: TrabajadorResponse
    let fechaHora: String
    let tipo: String // ENTRADA, SALIDA
    let modalidad: ModalidadResponse
    let latitud: Double
    let longitud: Double
    let notas: String?
}

// MARK: - Requests

struct AsistenciaRequest: Codable {
    let trabajadorId: Int
    let modalidadId: Int?
    let tipo: String
    let latitud: Double
    let longitud: Double
    let notas: String?
}

struct AsistenciaQrRequest: Codable {
    let trabajadorId: Int
    let qrToken: String
    let tipo: String
    let latitud: Double
    let longitud: Double
}

struct MobileLocationRequest: Codable {
    let trabajadorId: Int?
    let latitud: Double
    let longitud: Double
    let nombreUbicacion: String?
}

struct QrResponse: Codable {
    let token: String
    let timestamp: String
    let status: String
    let expiresIn: Int
}

struct LoginRequest: Codable {
    let username: String
    let password: String
}

struct UsuarioResponse: Codable {
    let id: Int
    let username: String
    let rol: RolResponse?
    let trabajador: TrabajadorResponse?
}

struct RolResponse: Codable {
    let id: Int
    let nombre: String
}
