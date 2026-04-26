package com.asistenciaHibrida.AplicacionMobil_IOS.dto.response;

import lombok.Data;

@Data
public class UsuarioResponseDTO {
    private Integer id;
    private String username;
    private RolResponseDTO rol;
    private TrabajadorResponseDTO trabajador;
    private Boolean activo;
    private String token;
    
    // Campos para el soporte de 2FA en la Web
    private Boolean setup2FA;
    private Boolean require2FA;
    private String qrCodeData;
    private String tempToken;
    private Boolean twoFactorEnabled;
}
