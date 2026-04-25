import Foundation

// MARK: - Login Request
struct LoginRequest: Codable, Sendable {
    let username: String
    let password: String
}

// MARK: - Login Response
final class LoginResponse: Codable, @unchecked Sendable {
    let id: Int
    let username: String
    let rol: RolResponse?
    let trabajador: TrabajadorResponse?

    enum CodingKeys: String, CodingKey {
        case id, username, rol, trabajador
    }

    required nonisolated init(from decoder: Decoder) throws {
        let container = try decoder.container(keyedBy: CodingKeys.self)
        self.id = try container.decode(Int.self, forKey: .id)
        self.username = try container.decode(String.self, forKey: .username)
        self.rol = try container.decodeIfPresent(RolResponse.self, forKey: .rol)
        self.trabajador = try container.decodeIfPresent(TrabajadorResponse.self, forKey: .trabajador)
    }
}

struct RolResponse: Codable, Sendable {
    let id: Int
    let nombre: String
}

final class TrabajadorResponse: Codable, @unchecked Sendable {
    let id: Int?
    let dni: String?
    let nombres: String?
    let apellidos: String?
    let email: String?
    let telefono: String?
    let direccion: String?
    let fechaIngreso: String?
    let activo: Bool?
    let modalidadId: Int?
    let esJefeTerreno: Bool?
    let permitirCambioUbicacion: Bool?
    let rolNombre: String?
    let modalidadNombre: String?
    let jefe: TrabajadorResponse?

    enum CodingKeys: String, CodingKey {
        case id, dni, nombres, apellidos, email, telefono, direccion, fechaIngreso, activo, modalidadId, esJefeTerreno, permitirCambioUbicacion, rolNombre, modalidadNombre, jefe
    }

    required nonisolated init(from decoder: Decoder) throws {
        let container = try decoder.container(keyedBy: CodingKeys.self)
        self.id = try container.decodeIfPresent(Int.self, forKey: .id)
        self.dni = try container.decodeIfPresent(String.self, forKey: .dni)
        self.nombres = try container.decodeIfPresent(String.self, forKey: .nombres)
        self.apellidos = try container.decodeIfPresent(String.self, forKey: .apellidos)
        self.email = try container.decodeIfPresent(String.self, forKey: .email)
        self.telefono = try container.decodeIfPresent(String.self, forKey: .telefono)
        self.direccion = try container.decodeIfPresent(String.self, forKey: .direccion)
        self.fechaIngreso = try container.decodeIfPresent(String.self, forKey: .fechaIngreso)
        self.activo = try container.decodeIfPresent(Bool.self, forKey: .activo)
        self.modalidadId = try container.decodeIfPresent(Int.self, forKey: .modalidadId)
        self.esJefeTerreno = try container.decodeIfPresent(Bool.self, forKey: .esJefeTerreno)
        self.permitirCambioUbicacion = try container.decodeIfPresent(Bool.self, forKey: .permitirCambioUbicacion)
        self.rolNombre = try container.decodeIfPresent(String.self, forKey: .rolNombre)
        self.modalidadNombre = try container.decodeIfPresent(String.self, forKey: .modalidadNombre)
        self.jefe = try container.decodeIfPresent(TrabajadorResponse.self, forKey: .jefe)
    }
}

// MARK: - Modalidad Response
struct ModalidadResponse: Codable, Sendable {
    let id: Int
    let nombre: String
}

// MARK: - Asistencia
struct AsistenciaQrRequest: Codable, Sendable {
    let trabajadorId: Int
    let qrToken: String
    let tipo: String // "ENTRADA" or "SALIDA"
    let latitud: Double?
    let longitud: Double?
}

struct AsistenciaResponse: Codable, Sendable {
    let id: Int
    let trabajador: TrabajadorResponse?
    let fechaHora: String?
    let tipo: String?
    let modalidad: ModalidadResponse?
    let latitud: Double?
    let longitud: Double?
    let notas: String?
}

// MARK: - Comunicado
struct ComunicadoResponse: Codable, Sendable {
    let id: Int
    let titulo: String?
    let contenido: String?
    let fechaPublicacion: String?
    let tipo: String?
}

// MARK: - Empty Response
struct EmptyResponse: Codable, Sendable {}
