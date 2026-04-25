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
import com.asistenciaHibrida.AplicacionMobil_IOS.service.UsuarioService;
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
@Tag(name = "Asistencia", description = "Endpoints para la gestión de asistencias")
public class AsistenciaController {

    @Autowired
    private AsistenciaService asistenciaService;

    @Autowired
    private AsistenciaMapper asistenciaMapper;

    @Autowired
    private QrSecureService qrSecureService;

    @Autowired
    private UsuarioService usuarioService;

    @PostMapping
    public ResponseEntity<AsistenciaResponseDTO> registrar(@RequestBody AsistenciaRequestDTO request) {
        return ResponseEntity.ok(asistenciaService.registrarAsistencia(
                request.getTrabajadorId(),
                request.getModalidadId(),
                request.getTipo(),
                request.getLatitud(),
                request.getLongitud(),
                request.getNotas(),
                request.getFechaHoraManual()));
    }

    @GetMapping
    public List<AsistenciaResponseDTO> listar() {
        return asistenciaService.listarTodas().stream()
                .map(asistenciaMapper::toResponseDTO)
                .collect(Collectors.toList());
    }

    @PostMapping("/paged")
    public PageResponseDTO<AsistenciaResponseDTO> listarPaginado(@RequestBody PageRequestDTO pageRequest) {
        return mapToPageResponseDTO(asistenciaService.listarTodasPaginado(pageRequest));
    }

    @GetMapping("/trabajador/{id}")
    public List<AsistenciaResponseDTO> listarPorTrabajador(@PathVariable Integer id) {
        Integer trabajadorId = resolverTrabajadorId(id);
        return asistenciaService.listarPorTrabajador(trabajadorId).stream()
                .map(asistenciaMapper::toResponseDTO)
                .collect(Collectors.toList());
    }

    @PostMapping("/registrar-qr")
    public ResponseEntity<?> registrarConQr(@RequestBody AsistenciaQrRequestDTO request) {
        boolean esVirtual = "VIRTUAL_TOKEN".equals(request.getQrToken());
        
        if (!esVirtual && !qrSecureService.isValidToken(request.getQrToken())) {
            return ResponseEntity.status(401).body("QR Token inválido o expirado.");
        }

        try {
            Integer trabajadorId = resolverTrabajadorId(request.getTrabajadorId());
            Asistencia.TipoAsistencia tipoEnum;

            if ("AUTOMATICO".equalsIgnoreCase(request.getTipo())) {
                AsistenciaResponseDTO ultimo = asistenciaService.obtenerEstadoHoy(trabajadorId);
                if (ultimo == null || Asistencia.TipoAsistencia.SALIDA.name().equals(ultimo.getTipo())) {
                    tipoEnum = Asistencia.TipoAsistencia.ENTRADA;
                } else {
                    tipoEnum = Asistencia.TipoAsistencia.SALIDA;
                }
            } else {
                tipoEnum = Asistencia.TipoAsistencia.valueOf(request.getTipo().toUpperCase());
            }

            AsistenciaResponseDTO responseDTO = asistenciaService.registrarAsistencia(
                    trabajadorId, null, tipoEnum,
                    request.getLatitud(), request.getLongitud(),
                    esVirtual ? "Registro de Asistencia Virtual (Hogar)" : "Registro por QR móvil (Oficina)", null);
            
            return ResponseEntity.ok(responseDTO);
        } catch (IllegalArgumentException e) {
            return ResponseEntity.badRequest().body("Tipo de asistencia inválido (ENTRADA/SALIDA)");
        } catch (Exception e) {
            return ResponseEntity.status(500).body("Error: " + e.getMessage());
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

    @GetMapping("/estado-hoy/{id}")
    public ResponseEntity<AsistenciaResponseDTO> obtenerEstadoHoy(@PathVariable Integer id) {
        Integer trabajadorId = resolverTrabajadorId(id);
        AsistenciaResponseDTO response = asistenciaService.obtenerEstadoHoy(trabajadorId);
        return response != null ? ResponseEntity.ok(response) : ResponseEntity.noContent().build();
    }

    private Integer resolverTrabajadorId(Integer id) {
        try {
            // Intentamos buscar si el ID proporcionado es un ID de Usuario
            com.asistenciaHibrida.AplicacionMobil_IOS.dto.response.UsuarioResponseDTO usuario = usuarioService.buscarPorId(id);
            if (usuario != null && usuario.getTrabajador() != null) {
                System.out.println("ID " + id + " resuelto como Usuario. Trabajador asociado: " + usuario.getTrabajador().getId());
                return usuario.getTrabajador().getId();
            }
        } catch (Exception e) {
            // Si falla, es probable que ya sea un ID de trabajador o el usuario no existe
            System.out.println("ID " + id + " no es un Usuario válido, se usará como ID de Trabajador directo.");
        }
        return id;
    }

    private PageResponseDTO<AsistenciaResponseDTO> mapToPageResponseDTO(PageResponseDTO<com.asistenciaHibrida.AplicacionMobil_IOS.model.Asistencia> pageResponse) {
        if (pageResponse == null || pageResponse.getContent() == null) {
            return PageResponseDTO.<AsistenciaResponseDTO>builder().content(java.util.Collections.emptyList()).build();
        }
        List<AsistenciaResponseDTO> dtoList = pageResponse.getContent().stream()
                .map(asistenciaMapper::toResponseDTO)
                .collect(Collectors.toList());
        return PageResponseDTO.<AsistenciaResponseDTO>builder()
                .content(dtoList)
                .currentPage(pageResponse.getCurrentPage())
                .totalItems(pageResponse.getTotalItems())
                .totalPages(pageResponse.getTotalPages())
                .pageSize(pageResponse.getPageSize())
                .build();
    }
}
