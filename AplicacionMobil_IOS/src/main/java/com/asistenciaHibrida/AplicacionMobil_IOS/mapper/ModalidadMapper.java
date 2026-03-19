package com.asistenciaHibrida.AplicacionMobil_IOS.mapper;

import com.asistenciaHibrida.AplicacionMobil_IOS.dto.response.ModalidadResponseDTO;
import com.asistenciaHibrida.AplicacionMobil_IOS.model.Modalidad;
import org.mapstruct.Mapper;

@Mapper(componentModel = "spring")
public interface ModalidadMapper {
    ModalidadResponseDTO toResponseDTO(Modalidad modalidad);
}
