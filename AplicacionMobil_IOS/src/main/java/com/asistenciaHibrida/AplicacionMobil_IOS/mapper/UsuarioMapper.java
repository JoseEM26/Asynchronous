package com.asistenciaHibrida.AplicacionMobil_IOS.mapper;

import com.asistenciaHibrida.AplicacionMobil_IOS.dto.request.UsuarioRequestDTO;
import com.asistenciaHibrida.AplicacionMobil_IOS.dto.response.UsuarioResponseDTO;
import com.asistenciaHibrida.AplicacionMobil_IOS.model.Usuario;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;

@Mapper(componentModel = "spring", uses = {RolMapper.class, TrabajadorMapper.class})
public interface UsuarioMapper {

    @Mapping(target = "rol", source = "rol")
    @Mapping(target = "trabajador", source = "trabajador")
    UsuarioResponseDTO toResponseDTO(Usuario usuario);

    @Mapping(target = "id", ignore = true)
    @Mapping(target = "rol", ignore = true)
    @Mapping(target = "trabajador", ignore = true)
    Usuario toEntity(UsuarioRequestDTO requestDTO);
}
