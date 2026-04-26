package com.asistenciaHibrida.AplicacionMobil_IOS.service;

import com.asistenciaHibrida.AplicacionMobil_IOS.dto.page.PageRequestDTO;
import com.asistenciaHibrida.AplicacionMobil_IOS.dto.page.PageResponseDTO;
import com.asistenciaHibrida.AplicacionMobil_IOS.model.Usuario;

import java.util.List;

import com.asistenciaHibrida.AplicacionMobil_IOS.dto.response.UsuarioResponseDTO;

public interface UsuarioService {
    List<UsuarioResponseDTO> listarTodos();

    PageResponseDTO<UsuarioResponseDTO> listarPaginado(PageRequestDTO pageRequest);

    UsuarioResponseDTO guardar(Usuario usuario);

    UsuarioResponseDTO buscarPorId(Integer id);

    void eliminar(Integer id);

    UsuarioResponseDTO actualizar(Integer id, Usuario detalles);

    // Actualizado para soportar discriminación por plataforma
    UsuarioResponseDTO login(String username, String password, Boolean isMobile);
}
