package com.asistenciaHibrida.AplicacionMobil_IOS.controller;

import com.asistenciaHibrida.AplicacionMobil_IOS.dto.request.AsistenciaRequestDTO;
import com.asistenciaHibrida.AplicacionMobil_IOS.dto.response.AsistenciaResponseDTO;
import com.asistenciaHibrida.AplicacionMobil_IOS.dto.page.PageRequestDTO;
import com.asistenciaHibrida.AplicacionMobil_IOS.dto.page.PageResponseDTO;
import com.asistenciaHibrida.AplicacionMobil_IOS.mapper.AsistenciaMapper;
import com.asistenciaHibrida.AplicacionMobil_IOS.model.Asistencia;
import com.asistenciaHibrida.AplicacionMobil_IOS.service.AsistenciaService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/asistencias")
public class AsistenciaController {

    @Autowired
    private AsistenciaService asistenciaService;

    @Autowired
    private AsistenciaMapper asistenciaMapper;

    @PostMapping
    public ResponseEntity<AsistenciaResponseDTO> registrar(@RequestBody AsistenciaRequestDTO request) {
        Asistencia asistencia = asistenciaService.registrarAsistencia(
                request.getTrabajadorId(),
                request.getModalidadId(),
                request.getTipo(),
                request.getLatitud(),
                request.getLongitud(),
                request.getNotas()
        );
        return ResponseEntity.ok(asistenciaMapper.toResponseDTO(asistencia));
    }

    @GetMapping
    public List<AsistenciaResponseDTO> listar() {
        return asistenciaService.listarTodas().stream()
                .map(asistenciaMapper::toResponseDTO)
                .collect(Collectors.toList());
    }

    @PostMapping("/paged")
    public PageResponseDTO<AsistenciaResponseDTO> listarPaginado(@RequestBody PageRequestDTO pageRequest) {
        PageResponseDTO<Asistencia> pageResponse = asistenciaService.listarTodasPaginado(pageRequest);
        return mapToPageResponseDTO(pageResponse);
    }

    @GetMapping("/trabajador/{id}")
    public List<AsistenciaResponseDTO> listarPorTrabajador(@PathVariable Integer id) {
        return asistenciaService.listarPorTrabajador(id).stream()
                .map(asistenciaMapper::toResponseDTO)
                .collect(Collectors.toList());
    }

    @PostMapping("/trabajador/{id}/paged")
    public PageResponseDTO<AsistenciaResponseDTO> listarPorTrabajadorPaginado(@PathVariable Integer id, @RequestBody PageRequestDTO pageRequest) {
        PageResponseDTO<Asistencia> pageResponse = asistenciaService.listarPorTrabajadorPaginado(id, pageRequest);
        return mapToPageResponseDTO(pageResponse);
    }

    private PageResponseDTO<AsistenciaResponseDTO> mapToPageResponseDTO(PageResponseDTO<Asistencia> pageResponse) {
        if (pageResponse == null || pageResponse.getContent() == null) {
            return PageResponseDTO.<AsistenciaResponseDTO>builder()
                    .content(java.util.Collections.emptyList())
                    .build();
        }

        List<AsistenciaResponseDTO> dtoList = pageResponse.getContent().stream()
                .map(a -> {
                    try {
                        return asistenciaMapper.toResponseDTO(a);
                    } catch (Exception e) {
                        return null;
                    }
                })
                .filter(java.util.Objects::nonNull)
                .collect(Collectors.toList());

        return PageResponseDTO.<AsistenciaResponseDTO>builder()
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
}
