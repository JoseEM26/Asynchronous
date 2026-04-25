package com.asistenciaHibrida.AplicacionMobil_IOS.service;

import com.asistenciaHibrida.AplicacionMobil_IOS.dto.request.PersonalUnificadoDTO;
import com.asistenciaHibrida.AplicacionMobil_IOS.dto.response.PersonalResponseDTO;
import java.util.List;

public interface PersonalService {
    void guardarPersonalUnificado(PersonalUnificadoDTO dto);
    List<PersonalResponseDTO> listarTodos();
}
