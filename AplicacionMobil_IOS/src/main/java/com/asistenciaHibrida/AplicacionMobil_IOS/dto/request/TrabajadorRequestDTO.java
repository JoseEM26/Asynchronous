package com.asistenciaHibrida.AplicacionMobil_IOS.dto.request;

import lombok.Data;
import java.time.LocalDate;

@Data
public class TrabajadorRequestDTO {
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
}
