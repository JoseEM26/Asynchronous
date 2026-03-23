package com.asistenciaHibrida.AplicacionMobil_IOS.dto.response;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class QrResponseDTO {
    private String token;
    private LocalDateTime timestamp;
    private String status;
    private Integer expiresIn; // seconds
}
