package com.asistenciaHibrida.AplicacionMobil_IOS.dto.request;

import lombok.Data;
import java.time.LocalDate;

@Data
public class PersonalUnificadoDTO {
    // Datos del Trabajador
    private Integer id; // Para edición
    private String dni;
    private String nombres;
    private String apellidos;
    private String email;
    private String telefono;
    private String direccion;
    private LocalDate fechaIngreso;
    private Boolean activo;
    private Integer modalidadId;
    private Boolean esJefeTerreno;
    private java.math.BigDecimal latitudVirtual;
    private java.math.BigDecimal longitudVirtual;
    private String diasPresencial;
    private String diasRemotos;
    private String horaIngreso;
    private String horaSalida;
    private Boolean permitirCambioUbicacion;
    private Integer jefeId;

    // Datos del Usuario
    private String username;
    private String password; // Puede ser nulo en edición
    private Integer rolId;
    private Boolean usuarioActivo;
}
