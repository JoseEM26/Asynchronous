package com.asistenciaHibrida.AplicacionMobil_IOS.mapper;

import com.asistenciaHibrida.AplicacionMobil_IOS.dto.response.RolResponseDTO;
import com.asistenciaHibrida.AplicacionMobil_IOS.model.Rol;
import org.mapstruct.Mapper;

@Mapper(componentModel = "spring")
public interface RolMapper {
    RolResponseDTO toResponseDTO(Rol rol);
}
