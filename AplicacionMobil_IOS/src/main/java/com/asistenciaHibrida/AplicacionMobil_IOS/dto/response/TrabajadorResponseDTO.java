package com.asistenciaHibrida.AplicacionMobil_IOS.dto.response;

import lombok.Data;
import java.time.LocalDate;

@Data
public class TrabajadorResponseDTO {
    private Integer id;
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
    private Boolean permitirCambioUbicacion;
    private Integer rolId;
    private Integer jefeId;
    private String rolNombre;
    private String modalidadNombre;
    private String jefeNombre;
}
