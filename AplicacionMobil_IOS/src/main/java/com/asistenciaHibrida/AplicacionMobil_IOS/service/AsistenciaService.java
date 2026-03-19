package com.asistenciaHibrida.AplicacionMobil_IOS.service;

import com.asistenciaHibrida.AplicacionMobil_IOS.dto.page.PageRequestDTO;
import com.asistenciaHibrida.AplicacionMobil_IOS.dto.page.PageResponseDTO;
import com.asistenciaHibrida.AplicacionMobil_IOS.model.Asistencia;

import java.math.BigDecimal;
import java.util.List;

public interface AsistenciaService {
    Asistencia registrarAsistencia(Integer trabajadorId, Integer modalidadId,
            Asistencia.TipoAsistencia tipo, BigDecimal latitud,
            BigDecimal longitud, String notas);

    List<Asistencia> listarPorTrabajador(Integer trabajadorId);

    PageResponseDTO<Asistencia> listarPorTrabajadorPaginado(Integer trabajadorId, PageRequestDTO pageRequest);

    List<Asistencia> listarTodas();

    PageResponseDTO<Asistencia> listarTodasPaginado(PageRequestDTO pageRequest);
}
