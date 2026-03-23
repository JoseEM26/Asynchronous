package com.asistenciaHibrida.AplicacionMobil_IOS.service;

import com.asistenciaHibrida.AplicacionMobil_IOS.dto.page.PageRequestDTO;
import com.asistenciaHibrida.AplicacionMobil_IOS.dto.page.PageResponseDTO;
import com.asistenciaHibrida.AplicacionMobil_IOS.model.Usuario;

import java.util.List;

public interface UsuarioService {
    List<Usuario> listarTodos();
    PageResponseDTO<Usuario> listarPaginado(PageRequestDTO pageRequest);
    Usuario guardar(Usuario usuario);
    Usuario buscarPorId(Integer id);
    void eliminar(Integer id);
    Usuario login(String username, String password);
}
