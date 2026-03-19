package com.asistenciaHibrida.AplicacionMobil_IOS.controller;

import com.asistenciaHibrida.AplicacionMobil_IOS.dto.request.UsuarioRequestDTO;
import com.asistenciaHibrida.AplicacionMobil_IOS.dto.response.UsuarioResponseDTO;
import com.asistenciaHibrida.AplicacionMobil_IOS.dto.page.PageRequestDTO;
import com.asistenciaHibrida.AplicacionMobil_IOS.dto.page.PageResponseDTO;
import com.asistenciaHibrida.AplicacionMobil_IOS.mapper.UsuarioMapper;
import com.asistenciaHibrida.AplicacionMobil_IOS.model.Usuario;
import com.asistenciaHibrida.AplicacionMobil_IOS.service.UsuarioService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/usuarios")
public class UsuarioController {

    @Autowired
    private UsuarioService usuarioService;

    @Autowired
    private UsuarioMapper usuarioMapper;

    @GetMapping
    public List<UsuarioResponseDTO> listar() {
        return usuarioService.listarTodos().stream()
                .map(usuarioMapper::toResponseDTO)
                .collect(Collectors.toList());
    }

    @PostMapping("/paged")
    public PageResponseDTO<UsuarioResponseDTO> listarPaginado(@RequestBody PageRequestDTO pageRequest) {
        PageResponseDTO<Usuario> pageResponse = usuarioService.listarPaginado(pageRequest);
        if (pageResponse == null || pageResponse.getContent() == null) {
            return PageResponseDTO.<UsuarioResponseDTO>builder()
                    .content(java.util.Collections.emptyList())
                    .build();
        }

        List<UsuarioResponseDTO> dtoList = pageResponse.getContent().stream()
                .map(u -> {
                    try {
                        return usuarioMapper.toResponseDTO(u);
                    } catch (Exception e) {
                        return null; // Omitir si falla el mapeo
                    }
                })
                .filter(java.util.Objects::nonNull)
                .collect(Collectors.toList());

        return PageResponseDTO.<UsuarioResponseDTO>builder()
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
    public UsuarioResponseDTO crear(@RequestBody UsuarioRequestDTO request) {
        Usuario usuario = usuarioMapper.toEntity(request);
        // Nota: El service debería manejar la asociación de Rol y Trabajador basándose en IDs si fuera necesario,
        // o podemos hacerlo aquí si el service espera la entidad completa.
        // Asumiendo que el service guarda lo que recibe.
        return usuarioMapper.toResponseDTO(usuarioService.guardar(usuario));
    }

    @GetMapping("/{id}")
    public ResponseEntity<UsuarioResponseDTO> obtener(@PathVariable Integer id) {
        return ResponseEntity.ok(usuarioMapper.toResponseDTO(usuarioService.buscarPorId(id)));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> eliminar(@PathVariable Integer id) {
        usuarioService.eliminar(id);
        return ResponseEntity.noContent().build();
    }
}
