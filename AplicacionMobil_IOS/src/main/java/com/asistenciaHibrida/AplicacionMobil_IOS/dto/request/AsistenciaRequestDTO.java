package com.asistenciaHibrida.AplicacionMobil_IOS.dto.request;

import com.asistenciaHibrida.AplicacionMobil_IOS.model.Asistencia;
import lombok.Data;
import java.math.BigDecimal;

@Data
public class AsistenciaRequestDTO {
    private Integer trabajadorId;
    private Integer modalidadId;
    private Asistencia.TipoAsistencia tipo;
    private BigDecimal latitud;
    private BigDecimal longitud;
    private String notas;
}
