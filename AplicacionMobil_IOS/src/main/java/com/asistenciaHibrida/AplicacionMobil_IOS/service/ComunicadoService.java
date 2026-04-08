package com.asistenciaHibrida.AplicacionMobil_IOS.service;

import com.asistenciaHibrida.AplicacionMobil_IOS.dto.page.PageRequestDTO;
import com.asistenciaHibrida.AplicacionMobil_IOS.dto.page.PageResponseDTO;
import com.asistenciaHibrida.AplicacionMobil_IOS.dto.response.ComunicadoResponseDTO;
import java.util.List;

public interface ComunicadoService {
    List<ComunicadoResponseDTO> obtenerActivos();
    PageResponseDTO<ComunicadoResponseDTO> listarPaginado(PageRequestDTO pageRequest);
    ComunicadoResponseDTO crear(com.asistenciaHibrida.AplicacionMobil_IOS.model.Comunicado comunicado);
    ComunicadoResponseDTO actualizar(Integer id, com.asistenciaHibrida.AplicacionMobil_IOS.model.Comunicado detalles);
    void eliminar(Integer id);
}
