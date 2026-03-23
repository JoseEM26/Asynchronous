package com.asistenciaHibrida.AplicacionMobil_IOS.mapper;

import com.asistenciaHibrida.AplicacionMobil_IOS.dto.request.TrabajadorRequestDTO;
import com.asistenciaHibrida.AplicacionMobil_IOS.dto.response.TrabajadorResponseDTO;
import com.asistenciaHibrida.AplicacionMobil_IOS.model.Trabajador;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;
import org.mapstruct.MappingTarget;

@Mapper(componentModel = "spring")
public interface TrabajadorMapper {

    @Mapping(source = "modalidad.id", target = "modalidadId")
    TrabajadorResponseDTO toResponseDTO(Trabajador trabajador);

    @Mapping(source = "modalidadId", target = "modalidad.id")
    Trabajador toEntity(TrabajadorRequestDTO requestDTO);

    @Mapping(target = "id", ignore = true)
    @Mapping(source = "modalidadId", target = "modalidad.id")
    void updateEntityFromDTO(TrabajadorRequestDTO requestDTO, @MappingTarget Trabajador trabajador);
}
