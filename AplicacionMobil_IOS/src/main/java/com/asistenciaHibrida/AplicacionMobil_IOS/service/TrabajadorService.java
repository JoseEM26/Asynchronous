package com.asistenciaHibrida.AplicacionMobil_IOS.service;

import com.asistenciaHibrida.AplicacionMobil_IOS.dto.page.PageRequestDTO;
import com.asistenciaHibrida.AplicacionMobil_IOS.dto.page.PageResponseDTO;
import com.asistenciaHibrida.AplicacionMobil_IOS.model.Trabajador;

import java.util.List;

public interface TrabajadorService {
    List<Trabajador> listarTodos();
    PageResponseDTO<Trabajador> listarPaginado(PageRequestDTO pageRequest);
    Trabajador guardar(Trabajador trabajador);
    Trabajador buscarPorId(Integer id);
    void eliminar(Integer id);
    Trabajador actualizar(Integer id, Trabajador detalles);
    void actualizarUbicacionVirtual(Integer trabajadorId, java.math.BigDecimal lat, java.math.BigDecimal lng);
    void registrarPuntoTerreno(Integer jefeId, java.math.BigDecimal lat, java.math.BigDecimal lng, String nombre);
    void permitirCambioUbicacion(Integer trabajadorId, Boolean permitir);
}
