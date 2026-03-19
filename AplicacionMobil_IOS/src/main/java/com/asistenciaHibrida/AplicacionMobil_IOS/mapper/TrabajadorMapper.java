package com.asistenciaHibrida.AplicacionMobil_IOS.mapper;

import com.asistenciaHibrida.AplicacionMobil_IOS.dto.request.TrabajadorRequestDTO;
import com.asistenciaHibrida.AplicacionMobil_IOS.dto.response.TrabajadorResponseDTO;
import com.asistenciaHibrida.AplicacionMobil_IOS.model.Trabajador;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;
import org.mapstruct.MappingTarget;

@Mapper(componentModel = "spring")
public interface TrabajadorMapper {

    TrabajadorResponseDTO toResponseDTO(Trabajador trabajador);

    Trabajador toEntity(TrabajadorRequestDTO requestDTO);

    @Mapping(target = "id", ignore = true)
    void updateEntityFromDTO(TrabajadorRequestDTO requestDTO, @MappingTarget Trabajador trabajador);
}
