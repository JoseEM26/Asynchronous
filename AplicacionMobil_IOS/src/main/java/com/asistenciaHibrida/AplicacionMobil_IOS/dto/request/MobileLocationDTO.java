package com.asistenciaHibrida.AplicacionMobil_IOS.dto.request;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class MobileLocationDTO {
    private Integer trabajadorId;
    private BigDecimal latitud;
    private BigDecimal longitud;
    private String nombreUbicacion; // Opcional, solo para Puntos de Terreno
}
