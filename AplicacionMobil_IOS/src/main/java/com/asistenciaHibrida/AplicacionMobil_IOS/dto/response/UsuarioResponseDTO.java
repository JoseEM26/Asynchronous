package com.asistenciaHibrida.AplicacionMobil_IOS.dto.response;

import lombok.Data;

@Data
public class UsuarioResponseDTO {
    private Integer id;
    private String username;
    private RolResponseDTO rol;
    private TrabajadorResponseDTO trabajador;
    private Boolean activo;
}
