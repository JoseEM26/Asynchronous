package com.asistenciaHibrida.AplicacionMobil_IOS.dto.request;

import lombok.Data;

@Data
public class UsuarioRequestDTO {
    private String username;
    private String password;
    private Integer rolId;
    private Integer trabajadorId;
    private Boolean activo;
}
