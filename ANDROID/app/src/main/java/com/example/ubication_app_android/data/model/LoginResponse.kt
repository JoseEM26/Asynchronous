package com.example.ubication_app_android.data.model

data class LoginResponse(
    val id: Int,
    val username: String,
    val rol: RolResponse?,
    val trabajador: TrabajadorResponse?
)

data class RolResponse(
    val id: Int,
    val nombre: String
)

data class TrabajadorResponse(
    val id: Int,
    val dni: String,
    val nombres: String,
    val apellidos: String,
    val email: String?,
    val telefono: String?,
    val direccion: String?,
    val fechaIngreso: String?,
    val activo: Boolean?,
    val modalidadId: Int?,
    val esJefeTerreno: Boolean?,
    val permitirCambioUbicacion: Boolean?,
    val latitudVirtual: Double? = null,
    val longitudVirtual: Double? = null,
    val diasPresencial: String? = null,
    val diasRemotos: String? = null,
    val rolNombre: String? = null,
    val modalidadNombre: String? = null,
    val jefeNombre: String? = null,
    val jefe: TrabajadorResponse? = null
)
