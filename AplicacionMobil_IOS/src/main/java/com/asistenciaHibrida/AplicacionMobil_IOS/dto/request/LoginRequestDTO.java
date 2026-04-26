package com.asistenciaHibrida.AplicacionMobil_IOS.dto.request;

import com.fasterxml.jackson.annotation.JsonProperty;
import lombok.Data;

@Data
public class LoginRequestDTO {
    private String username;
    private String password;
    
    @JsonProperty("isMobile")
    private Boolean isMobile;
}
