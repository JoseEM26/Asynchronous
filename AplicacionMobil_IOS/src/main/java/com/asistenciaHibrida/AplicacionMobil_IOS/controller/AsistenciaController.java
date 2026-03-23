package com.asistenciaHibrida.AplicacionMobil_IOS.controller;

import com.asistenciaHibrida.AplicacionMobil_IOS.dto.request.AsistenciaRequestDTO;
import com.asistenciaHibrida.AplicacionMobil_IOS.dto.response.AsistenciaResponseDTO;
import com.asistenciaHibrida.AplicacionMobil_IOS.dto.response.QrResponseDTO;
import com.asistenciaHibrida.AplicacionMobil_IOS.dto.page.PageRequestDTO;
import com.asistenciaHibrida.AplicacionMobil_IOS.dto.page.PageResponseDTO;
import com.asistenciaHibrida.AplicacionMobil_IOS.mapper.AsistenciaMapper;
import com.asistenciaHibrida.AplicacionMobil_IOS.model.Asistencia;
import com.asistenciaHibrida.AplicacionMobil_IOS.service.AsistenciaService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDateTime;
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
                request.getNotas());
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
    public PageResponseDTO<AsistenciaResponseDTO> listarPorTrabajadorPaginado(@PathVariable Integer id,
            @RequestBody PageRequestDTO pageRequest) {
        PageResponseDTO<Asistencia> pageResponse = asistenciaService.listarPorTrabajadorPaginado(id, pageRequest);
        return mapToPageResponseDTO(pageResponse);
    }

    @Autowired
    private com.asistenciaHibrida.AplicacionMobil_IOS.service.QrSecureService qrSecureService;

    @PostMapping("/registrar-qr")
    public ResponseEntity<?> registrarConQr(@RequestBody com.asistenciaHibrida.AplicacionMobil_IOS.dto.request.AsistenciaQrRequestDTO request) {
        if (!qrSecureService.isValidToken(request.getQrToken())) {
            return ResponseEntity.status(401).body("QR Token inválido o expirado. Por favor escanee de nuevo.");
        }

        try {
            Asistencia.TipoAsistencia tipoEnum = Asistencia.TipoAsistencia.valueOf(request.getTipo().toUpperCase());

            // Si el token es válido, procedemos con el registro normal
            Asistencia asistencia = asistenciaService.registrarAsistencia(
                    request.getTrabajadorId(),
                    null, // La modalidad se detectará automáticamente en el service
                    tipoEnum,
                    request.getLatitud(),
                    request.getLongitud(),
                    "Registro por código QR móvil");
            
            return ResponseEntity.ok(asistenciaMapper.toResponseDTO(asistencia));
        } catch (IllegalArgumentException e) {
            return ResponseEntity.badRequest().body("Tipo de asistencia inválido (Debe ser ENTRADA o SALIDA)");
        } catch (Exception e) {
            return ResponseEntity.status(500).body("Error al registrar: " + e.getMessage());
        }
    }

    @GetMapping("/qr")
    public ResponseEntity<QrResponseDTO> getQrToken() {
        QrResponseDTO response = QrResponseDTO.builder()
                .token(qrSecureService.getActiveToken())
                .timestamp(LocalDateTime.now())
                .status("ACTIVE")
                .expiresIn((int) qrSecureService.getSecondsUntilNextRotation())
                .build();
        return ResponseEntity.ok(response);
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
