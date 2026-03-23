package com.asistenciaHibrida.AplicacionMobil_IOS.dto.request;

import lombok.Data;
import java.math.BigDecimal;

@Data
public class AsistenciaQrRequestDTO {
    private Integer trabajadorId;
    private String qrToken;
    private String tipo; // ENTRADA or SALIDA
    private BigDecimal latitud;
    private BigDecimal longitud;
}
