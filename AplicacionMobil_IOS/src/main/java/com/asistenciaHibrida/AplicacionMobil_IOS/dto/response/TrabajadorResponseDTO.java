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
}
