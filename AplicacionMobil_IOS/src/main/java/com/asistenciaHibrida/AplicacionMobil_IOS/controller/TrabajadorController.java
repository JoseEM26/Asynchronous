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
        return trabajadorService.listarTodos().stream()
                .map(trabajadorMapper::toResponseDTO)
                .collect(Collectors.toList());
    }

    @PostMapping("/paged")
    public PageResponseDTO<TrabajadorResponseDTO> listarPaginado(@RequestBody PageRequestDTO pageRequest) {
        PageResponseDTO<Trabajador> pageResponse = trabajadorService.listarPaginado(pageRequest);
        List<TrabajadorResponseDTO> dtoList = pageResponse.getContent().stream()
                .map(trabajadorMapper::toResponseDTO)
                .collect(Collectors.toList());
        
        return PageResponseDTO.<TrabajadorResponseDTO>builder()
                .content(dtoList)
                .currentPage(pageResponse.getCurrentPage())
                .totalItems(pageResponse.getTotalItems())
                .totalPages(pageResponse.getTotalPages())
                .first(pageResponse.isFirst())
                .last(pageResponse.isLast())
                .pageSize(pageResponse.getPageSize())
                .filters(pageResponse.getFilters())
                .build();
    }

    @PostMapping
    public TrabajadorResponseDTO crear(@RequestBody TrabajadorRequestDTO request) {
        Trabajador trabajador = trabajadorMapper.toEntity(request);
        return trabajadorMapper.toResponseDTO(trabajadorService.guardar(trabajador));
    }

    @GetMapping("/{id}")
    public ResponseEntity<TrabajadorResponseDTO> obtener(@PathVariable Integer id) {
        return ResponseEntity.ok(trabajadorMapper.toResponseDTO(trabajadorService.buscarPorId(id)));
    }

    @PutMapping("/{id}")
    public ResponseEntity<TrabajadorResponseDTO> actualizar(@PathVariable Integer id, @RequestBody TrabajadorRequestDTO request) {
        Trabajador trabajadorExistente = trabajadorService.buscarPorId(id);
        trabajadorMapper.updateEntityFromDTO(request, trabajadorExistente);
        return ResponseEntity.ok(trabajadorMapper.toResponseDTO(trabajadorService.actualizar(id, trabajadorExistente)));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> eliminar(@PathVariable Integer id) {
        trabajadorService.eliminar(id);
        return ResponseEntity.noContent().build();
    }
}
