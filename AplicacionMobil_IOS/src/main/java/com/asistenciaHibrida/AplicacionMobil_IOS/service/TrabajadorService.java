package com.asistenciaHibrida.AplicacionMobil_IOS.service;

import com.asistenciaHibrida.AplicacionMobil_IOS.dto.page.PageRequestDTO;
import com.asistenciaHibrida.AplicacionMobil_IOS.dto.page.PageResponseDTO;
import com.asistenciaHibrida.AplicacionMobil_IOS.model.Trabajador;

import java.util.List;

import com.asistenciaHibrida.AplicacionMobil_IOS.dto.response.TrabajadorResponseDTO;

public interface TrabajadorService {
    List<TrabajadorResponseDTO> listarTodos();
    PageResponseDTO<TrabajadorResponseDTO> listarPaginado(PageRequestDTO pageRequest);
    TrabajadorResponseDTO guardar(Trabajador trabajador);
    TrabajadorResponseDTO buscarPorId(Integer id);
    void eliminar(Integer id);
    TrabajadorResponseDTO actualizar(Integer id, Trabajador detalles);
    void actualizarUbicacionVirtual(Integer trabajadorId, java.math.BigDecimal lat, java.math.BigDecimal lng);
    void registrarPuntoTerreno(Integer jefeId, java.math.BigDecimal lat, java.math.BigDecimal lng, String nombre);
    void permitirCambioUbicacion(Integer trabajadorId, Boolean permitir);
}
