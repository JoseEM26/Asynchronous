import Foundation

// MARK: - Login Request
struct LoginRequest: Codable, Sendable {
    let username: String
    let password: String
    let isMobile: Bool // Campo añadido para saltar el 2FA en el backend
}

// MARK: - Login Response
final class LoginResponse: Codable, @unchecked Sendable {
    let id: Int
    let username: String
    let rol: RolResponse?
    let trabajador: TrabajadorResponse?
    let token: String?

    enum CodingKeys: String, CodingKey {
        case id, username, rol, trabajador, token
    }

    required nonisolated init(from decoder: Decoder) throws {
        let container = try decoder.container(keyedBy: CodingKeys.self)
        self.id = try container.decode(Int.self, forKey: .id)
        self.username = try container.decode(String.self, forKey: .username)
        self.rol = try container.decodeIfPresent(RolResponse.self, forKey: .rol)
        self.trabajador = try container.decodeIfPresent(TrabajadorResponse.self, forKey: .trabajador)
        self.token = try container.decodeIfPresent(String.self, forKey: .token)
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
    let fechaIngreso: Date?
    let activo: Bool?
    let modalidadId: Int?
    let esJefeTerreno: Bool?
    let permitirCambioUbicacion: Bool?
    let latitudVirtual: Double?
    let longitudVirtual: Double?
    let diasPresencial: String?
    let diasRemotos: String?
    let horaIngreso: String?
    let horaSalida: String?
    let rolNombre: String?
    let modalidadNombre: String?
    let jefeNombre: String?
    let jefe: TrabajadorResponse?

    enum CodingKeys: String, CodingKey {
        case id, dni, nombres, apellidos, email, telefono, direccion, fechaIngreso, activo, modalidadId, esJefeTerreno, permitirCambioUbicacion, latitudVirtual, longitudVirtual, diasPresencial, diasRemotos, horaIngreso, horaSalida, rolNombre, modalidadNombre, jefeNombre, jefe
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
        self.fechaIngreso = try container.decodeIfPresent(Date.self, forKey: .fechaIngreso)
        self.activo = try container.decodeIfPresent(Bool.self, forKey: .activo)
        self.modalidadId = try container.decodeIfPresent(Int.self, forKey: .modalidadId)
        self.esJefeTerreno = try container.decodeIfPresent(Bool.self, forKey: .esJefeTerreno)
        self.permitirCambioUbicacion = try container.decodeIfPresent(Bool.self, forKey: .permitirCambioUbicacion)
        self.latitudVirtual = try container.decodeIfPresent(Double.self, forKey: .latitudVirtual)
        self.longitudVirtual = try container.decodeIfPresent(Double.self, forKey: .longitudVirtual)
        self.diasPresencial = try container.decodeIfPresent(String.self, forKey: .diasPresencial)
        self.diasRemotos = try container.decodeIfPresent(String.self, forKey: .diasRemotos)
        self.horaIngreso = try container.decodeIfPresent(String.self, forKey: .horaIngreso)
        self.horaSalida = try container.decodeIfPresent(String.self, forKey: .horaSalida)
        self.rolNombre = try container.decodeIfPresent(String.self, forKey: .rolNombre)
        self.modalidadNombre = try container.decodeIfPresent(String.self, forKey: .modalidadNombre)
        self.jefeNombre = try container.decodeIfPresent(String.self, forKey: .jefeNombre)
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
    let tipo: String // "ENTRADA" or "SALIDA" or "AUTOMATICO"
    let latitud: Double?
    let longitud: Double?
}

struct AsistenciaResponse: Codable, Sendable {
    let id: Int
    let trabajador: TrabajadorResponse?
    let fechaHora: Date?
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
    let fechaPublicacion: Date?
    let tipo: String?
}

// MARK: - Usuario
struct UsuarioResponse: Codable, Sendable {
    let id: Int
    let username: String
    let rol: RolResponseDTO?
    let trabajador: TrabajadorResponse?
    let activo: Bool?
    let token: String?
}

struct RolResponseDTO: Codable, Sendable {
    let id: Int
    let nombre: String
}

struct ConfiguracionResponse: Codable, Sendable {
    let id: Int?
    let officeLat: Double?
    let officeLng: Double?
    let radius: Int?
}

// MARK: - Trabajador Simple (para lista de equipo del jefe)
struct TrabajadorSimpleResponse: Codable, Sendable {
    let id: Int?
    let dni: String?
    let nombres: String?
    let apellidos: String?
    let email: String?
    let telefono: String?
    let activo: Bool?
    let modalidadNombre: String?
    let esJefeTerreno: Bool?
}

