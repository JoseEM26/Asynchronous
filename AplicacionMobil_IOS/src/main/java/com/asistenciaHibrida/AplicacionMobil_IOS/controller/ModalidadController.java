package com.asistenciaHibrida.AplicacionMobil_IOS.controller;

import com.asistenciaHibrida.AplicacionMobil_IOS.dto.response.ModalidadResponseDTO;
import com.asistenciaHibrida.AplicacionMobil_IOS.dto.page.PageRequestDTO;
import com.asistenciaHibrida.AplicacionMobil_IOS.dto.page.PageResponseDTO;
import com.asistenciaHibrida.AplicacionMobil_IOS.mapper.ModalidadMapper;
import com.asistenciaHibrida.AplicacionMobil_IOS.model.Modalidad;
import com.asistenciaHibrida.AplicacionMobil_IOS.service.ModalidadService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/modalidades")
public class ModalidadController {

    @Autowired
    private ModalidadService modalidadService;

    @Autowired
    private ModalidadMapper modalidadMapper;

    @GetMapping
    public List<ModalidadResponseDTO> listar() {
        return modalidadService.listarTodas().stream()
                .map(modalidadMapper::toResponseDTO)
                .collect(Collectors.toList());
    }

    @PostMapping("/paged")
    public PageResponseDTO<ModalidadResponseDTO> listarPaginado(@RequestBody PageRequestDTO pageRequest) {
        PageResponseDTO<Modalidad> pageResponse = modalidadService.listarTodasPaginado(pageRequest);
        List<ModalidadResponseDTO> dtoList = pageResponse.getContent().stream()
                .map(modalidadMapper::toResponseDTO)
                .collect(Collectors.toList());

        return PageResponseDTO.<ModalidadResponseDTO>builder()
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
