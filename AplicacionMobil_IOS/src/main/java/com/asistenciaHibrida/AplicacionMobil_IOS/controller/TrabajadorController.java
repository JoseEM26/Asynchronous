package com.asistenciaHibrida.AplicacionMobil_IOS.controller;

import com.asistenciaHibrida.AplicacionMobil_IOS.dto.request.TrabajadorRequestDTO;
import com.asistenciaHibrida.AplicacionMobil_IOS.dto.response.TrabajadorResponseDTO;
import com.asistenciaHibrida.AplicacionMobil_IOS.dto.page.PageRequestDTO;
import com.asistenciaHibrida.AplicacionMobil_IOS.dto.page.PageResponseDTO;
import com.asistenciaHibrida.AplicacionMobil_IOS.mapper.TrabajadorMapper;
import com.asistenciaHibrida.AplicacionMobil_IOS.model.Trabajador;
import com.asistenciaHibrida.AplicacionMobil_IOS.service.TrabajadorService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/trabajadores")
public class TrabajadorController {

    @Autowired
    private TrabajadorService trabajadorService;

    @Autowired
    private TrabajadorMapper trabajadorMapper;

    @GetMapping
    public List<TrabajadorResponseDTO> listar() {
        return trabajadorService.listarTodos();
    }

    @PostMapping("/paged")
    public PageResponseDTO<TrabajadorResponseDTO> listarPaginado(@RequestBody PageRequestDTO pageRequest) {
        return trabajadorService.listarPaginado(pageRequest);
    }

    @PostMapping
    public TrabajadorResponseDTO crear(@RequestBody TrabajadorRequestDTO request) {
        Trabajador trabajador = trabajadorMapper.toEntity(request);
        return trabajadorService.guardar(trabajador);
    }

    @GetMapping("/{id}")
    public ResponseEntity<TrabajadorResponseDTO> obtener(@PathVariable Integer id) {
        return ResponseEntity.ok(trabajadorService.buscarPorId(id));
    }

    @PutMapping("/{id}")
    public ResponseEntity<TrabajadorResponseDTO> actualizar(@PathVariable Integer id,
            @RequestBody TrabajadorRequestDTO request) {
        Trabajador trabajadorExistente = trabajadorMapper.toEntity(request); // Usar mapper para crear objeto de datos
        return ResponseEntity.ok(trabajadorService.actualizar(id, trabajadorExistente));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> eliminar(@PathVariable Integer id) {
        trabajadorService.eliminar(id);
        return ResponseEntity.noContent().build();
    }

    @PutMapping("/{id}/permitir-cambio-ubicacion")
    public ResponseEntity<Void> permitirCambioUbicacion(@PathVariable Integer id, @RequestParam Boolean permitir) {
        trabajadorService.permitirCambioUbicacion(id, permitir);
        return ResponseEntity.ok().build();
    }

    @PutMapping("/{id}/ubicacion-virtual")
    public ResponseEntity<Void> actualizarUbicacionVirtual(
            @PathVariable Integer id,
            @RequestParam java.math.BigDecimal lat,
            @RequestParam java.math.BigDecimal lng) {
        trabajadorService.actualizarUbicacionVirtual(id, lat, lng);
        return ResponseEntity.ok().build();
    }

    @PostMapping("/puntos-terreno")
    public ResponseEntity<Void> registrarPuntoTerreno(
            @RequestParam Integer jefeId,
            @RequestParam java.math.BigDecimal lat,
            @RequestParam java.math.BigDecimal lng,
            @RequestParam(required = false) String nombre) {
        trabajadorService.registrarPuntoTerreno(jefeId, lat, lng, nombre);
        return ResponseEntity.ok().build();
    }

    // Nuevo: Obtener los trabajadores asignados a un jefe
    @GetMapping("/por-jefe/{jefeId}")
    public List<TrabajadorResponseDTO> listarPorJefe(@PathVariable Integer jefeId) {
        return trabajadorService.listarPorJefe(jefeId);
    }
}
