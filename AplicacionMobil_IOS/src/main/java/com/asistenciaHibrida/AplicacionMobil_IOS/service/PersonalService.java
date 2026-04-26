package com.asistenciaHibrida.AplicacionMobil_IOS.service;

import com.asistenciaHibrida.AplicacionMobil_IOS.dto.request.PersonalUnificadoDTO;
import com.asistenciaHibrida.AplicacionMobil_IOS.dto.response.PersonalResponseDTO;
import com.asistenciaHibrida.AplicacionMobil_IOS.dto.page.PageRequestDTO;
import com.asistenciaHibrida.AplicacionMobil_IOS.dto.page.PageResponseDTO;
import java.util.List;

public interface PersonalService {
    void guardarPersonalUnificado(PersonalUnificadoDTO dto);
    List<PersonalResponseDTO> listarTodos();
    PageResponseDTO<PersonalResponseDTO> listarPaginado(PageRequestDTO pageRequest);
    void actualizarEstadoActivo(Integer id, boolean activo);
}
