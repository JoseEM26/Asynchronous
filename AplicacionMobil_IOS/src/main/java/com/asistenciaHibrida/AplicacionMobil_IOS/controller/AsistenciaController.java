package com.asistenciaHibrida.AplicacionMobil_IOS.controller;

import com.asistenciaHibrida.AplicacionMobil_IOS.dto.request.AsistenciaRequestDTO;
import com.asistenciaHibrida.AplicacionMobil_IOS.dto.request.AsistenciaQrRequestDTO;
import com.asistenciaHibrida.AplicacionMobil_IOS.dto.response.AsistenciaResponseDTO;
import com.asistenciaHibrida.AplicacionMobil_IOS.dto.response.QrResponseDTO;
import com.asistenciaHibrida.AplicacionMobil_IOS.dto.page.PageRequestDTO;
import com.asistenciaHibrida.AplicacionMobil_IOS.dto.page.PageResponseDTO;
import com.asistenciaHibrida.AplicacionMobil_IOS.mapper.AsistenciaMapper;
import com.asistenciaHibrida.AplicacionMobil_IOS.model.Asistencia;
import com.asistenciaHibrida.AplicacionMobil_IOS.service.AsistenciaService;
import com.asistenciaHibrida.AplicacionMobil_IOS.service.QrSecureService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDateTime;
import java.util.List;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/asistencias")
@Tag(name = "Asistencia", description = "Endpoints para la gestión de asistencias (registros, listados, QR)")
public class AsistenciaController {

    @Autowired
    private AsistenciaService asistenciaService;

    @Autowired
    private AsistenciaMapper asistenciaMapper;

    @Autowired
    private QrSecureService qrSecureService;

    @Autowired
    private com.asistenciaHibrida.AplicacionMobil_IOS.service.UsuarioService usuarioService;

    @Operation(summary = "Registrar una nueva asistencia", description = "Permite registrar una asistencia manual indicando trabajador, modalidad y ubicación.")
    @PostMapping
    public ResponseEntity<AsistenciaResponseDTO> registrar(@RequestBody AsistenciaRequestDTO request) {
        // El servicio ya devuelve el DTO mapeado dentro de la transacción
        return ResponseEntity.ok(asistenciaService.registrarAsistencia(
                request.getTrabajadorId(),
                request.getModalidadId(),
                request.getTipo(),
                request.getLatitud(),
                request.getLongitud(),
                request.getNotas(),
                request.getFechaHoraManual()));
    }

    @Operation(summary = "Listar todas las asistencias", description = "Retorna una lista completa de todos los registros de asistencia.")
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
        Integer trabajadorId = id;
        com.asistenciaHibrida.AplicacionMobil_IOS.dto.response.UsuarioResponseDTO usuario = usuarioService.buscarPorId(id);
        if (usuario != null && usuario.getTrabajador() != null) {
            trabajadorId = usuario.getTrabajador().getId();
        }
        return asistenciaService.listarPorTrabajador(trabajadorId).stream()
                .map(asistenciaMapper::toResponseDTO)
                .collect(Collectors.toList());
    }

    @PostMapping("/trabajador/{id}/paged")
    public PageResponseDTO<AsistenciaResponseDTO> listarPorTrabajadorPaginado(@PathVariable Integer id,
            @RequestBody PageRequestDTO pageRequest) {
        PageResponseDTO<Asistencia> pageResponse = asistenciaService.listarPorTrabajadorPaginado(id, pageRequest);
        return mapToPageResponseDTO(pageResponse);
    }

    @Operation(summary = "Registrar asistencia mediante código QR", description = "Valida un token QR y registra la asistencia del trabajador si el token es válido.")
    @PostMapping("/registrar-qr")
    public ResponseEntity<?> registrarConQr(@RequestBody AsistenciaQrRequestDTO request) {
        if (!qrSecureService.isValidToken(request.getQrToken())) {
            return ResponseEntity.status(401).body("QR Token inválido o expirado. Por favor escanee de nuevo.");
        }

        try {
            Asistencia.TipoAsistencia tipoEnum = Asistencia.TipoAsistencia.valueOf(request.getTipo().toUpperCase());

            // Resolver trabajadorId si el ID enviado es de un Usuario
            Integer trabajadorId = request.getTrabajadorId();
            com.asistenciaHibrida.AplicacionMobil_IOS.dto.response.UsuarioResponseDTO usuario = usuarioService.buscarPorId(trabajadorId);
            if (usuario != null && usuario.getTrabajador() != null) {
                trabajadorId = usuario.getTrabajador().getId();
            }

            // Registro por QR
            AsistenciaResponseDTO responseDTO = asistenciaService.registrarAsistencia(
                    trabajadorId,
                    null, 
                    tipoEnum,
                    request.getLatitud(),
                    request.getLongitud(),
                    "Registro por código QR móvil",
                    null);
            
            return ResponseEntity.ok(responseDTO);
        } catch (IllegalArgumentException e) {
            return ResponseEntity.badRequest().body("Tipo de asistencia inválido (Debe ser ENTRADA o SALIDA)");
        } catch (Exception e) {
            return ResponseEntity.status(500).body("Error al registrar: " + e.getMessage());
        }
    }

    @Operation(summary = "Obtener token QR activo", description = "Genera u obtiene el token QR actual para ser escaneado por la aplicación móvil.")
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

    @Operation(summary = "Obtener el estado de asistencia de hoy para un trabajador", description = "Retorna la última marcación realizada hoy (Entrada o Salida) para determinar el siguiente paso en la app móvil.")
    @GetMapping("/estado-hoy/{trabajadorId}")
    public ResponseEntity<AsistenciaResponseDTO> obtenerEstadoHoy(@PathVariable Integer trabajadorId) {
        Integer realTrabajadorId = trabajadorId;
        com.asistenciaHibrida.AplicacionMobil_IOS.dto.response.UsuarioResponseDTO usuario = usuarioService.buscarPorId(trabajadorId);
        if (usuario != null && usuario.getTrabajador() != null) {
            realTrabajadorId = usuario.getTrabajador().getId();
        }
        
        AsistenciaResponseDTO response = asistenciaService.obtenerEstadoHoy(realTrabajadorId);
        if (response == null) {
            return ResponseEntity.noContent().build(); // No hay marcaciones hoy
        }
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
