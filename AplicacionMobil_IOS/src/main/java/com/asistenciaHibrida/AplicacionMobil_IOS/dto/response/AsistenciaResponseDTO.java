package com.asistenciaHibrida.AplicacionMobil_IOS.dto.response;

import com.asistenciaHibrida.AplicacionMobil_IOS.model.Asistencia;
import lombok.Data;
import java.math.BigDecimal;
import java.time.LocalDateTime;

@Data
public class AsistenciaResponseDTO {
    private Long id;
    private TrabajadorResponseDTO trabajador;
    private LocalDateTime fechaHora;
    private Asistencia.TipoAsistencia tipo;
    private ModalidadResponseDTO modalidad;
    private BigDecimal latitud;
    private BigDecimal longitud;
    private BigDecimal latitudReferencia;
    private BigDecimal longitudReferencia;
    private String notas;
}
