package com.asistenciaHibrida.AplicacionMobil_IOS.dto.response;

import lombok.Data;
import java.time.LocalDateTime;

@Data
public class ComunicadoResponseDTO {
    private Integer id;
    private String titulo;
    private String contenido;
    private LocalDateTime fechaPublicacion;
    private String tipo;
}
