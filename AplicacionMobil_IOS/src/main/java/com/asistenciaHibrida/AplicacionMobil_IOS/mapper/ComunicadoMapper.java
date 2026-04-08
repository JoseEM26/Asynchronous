package com.asistenciaHibrida.AplicacionMobil_IOS.mapper;

import com.asistenciaHibrida.AplicacionMobil_IOS.dto.response.ComunicadoResponseDTO;
import com.asistenciaHibrida.AplicacionMobil_IOS.model.Comunicado;
import org.mapstruct.Mapper;

@Mapper(componentModel = "spring")
public interface ComunicadoMapper {
    ComunicadoResponseDTO toResponseDTO(Comunicado comunicado);
}
