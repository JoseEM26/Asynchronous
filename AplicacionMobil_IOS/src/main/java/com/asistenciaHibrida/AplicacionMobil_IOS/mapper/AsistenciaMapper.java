package com.asistenciaHibrida.AplicacionMobil_IOS.mapper;

import com.asistenciaHibrida.AplicacionMobil_IOS.dto.request.AsistenciaRequestDTO;
import com.asistenciaHibrida.AplicacionMobil_IOS.dto.response.AsistenciaResponseDTO;
import com.asistenciaHibrida.AplicacionMobil_IOS.model.Asistencia;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;

@Mapper(componentModel = "spring", uses = {TrabajadorMapper.class, ModalidadMapper.class})
public interface AsistenciaMapper {

    @Mapping(target = "trabajador", source = "trabajador")
    @Mapping(target = "modalidad", source = "modalidad")
    AsistenciaResponseDTO toResponseDTO(Asistencia asistencia);

    @Mapping(target = "id", ignore = true)
    @Mapping(target = "trabajador", ignore = true)
    @Mapping(target = "modalidad", ignore = true)
    @Mapping(target = "fechaHora", ignore = true)
    Asistencia toEntity(AsistenciaRequestDTO requestDTO);
}
