package com.asistenciaHibrida.AplicacionMobil_IOS.dto.request;

import lombok.Data;

@Data
public class LoginRequestDTO {
    private String username;
    private String password;
    private Boolean isMobile; // Nuevo campo para diferenciar plataformas
}
