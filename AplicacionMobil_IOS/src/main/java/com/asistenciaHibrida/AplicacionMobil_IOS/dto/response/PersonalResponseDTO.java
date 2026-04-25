package com.asistenciaHibrida.AplicacionMobil_IOS.dto.response;

import lombok.Data;
import java.time.LocalDate;

@Data
public class PersonalResponseDTO {
    // Datos del Trabajador
    private Integer id;
    private String dni;
    private String nombres;
    private String apellidos;
    private String email;
    private String telefono;
    private String direccion;
    private LocalDate fechaIngreso;
    private Boolean activo;
    private String modalidadNombre;
    private Integer modalidadId;
    private java.math.BigDecimal latitudVirtual;
    private java.math.BigDecimal longitudVirtual;
    private String diasPresencial;
    private String diasRemotos;
    private String horaIngreso;
    private String horaSalida;
    private Boolean permitirCambioUbicacion;

    // Datos del Usuario vinculado
    private Integer usuarioId;
    private String username;
    private String rolNombre;
    private Integer rolId;
    private Boolean usuarioActivo;
}
