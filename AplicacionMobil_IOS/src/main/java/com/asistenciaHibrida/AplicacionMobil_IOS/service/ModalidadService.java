package com.asistenciaHibrida.AplicacionMobil_IOS.service;

import com.asistenciaHibrida.AplicacionMobil_IOS.dto.page.PageRequestDTO;
import com.asistenciaHibrida.AplicacionMobil_IOS.dto.page.PageResponseDTO;
import com.asistenciaHibrida.AplicacionMobil_IOS.model.Modalidad;

import java.util.List;

public interface ModalidadService {
    List<Modalidad> listarTodas();
    PageResponseDTO<Modalidad> listarTodasPaginado(PageRequestDTO pageRequest);
}
