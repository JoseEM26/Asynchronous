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
        return usuarioService.listarTodos();
    }

    @PostMapping("/paged")
    public PageResponseDTO<UsuarioResponseDTO> listarPaginado(@RequestBody PageRequestDTO pageRequest) {
        return usuarioService.listarPaginado(pageRequest);
    }

    @PostMapping("/login")
    public ResponseEntity<?> login(
            @RequestBody com.asistenciaHibrida.AplicacionMobil_IOS.dto.request.LoginRequestDTO request) {
        try {
            return ResponseEntity.ok(usuarioService.login(request.getUsername(), request.getPassword()));
        } catch (RuntimeException e) {
            return ResponseEntity.status(401).body(e.getMessage());
        }
    }

    @PostMapping
    public UsuarioResponseDTO crear(@RequestBody UsuarioRequestDTO request) {
        Usuario usuario = usuarioMapper.toEntity(request);
        return usuarioService.guardar(usuario);
    }

    @GetMapping("/{id}")
    public ResponseEntity<UsuarioResponseDTO> obtener(@PathVariable Integer id) {
        return ResponseEntity.ok(usuarioService.buscarPorId(id));
    }

    @PutMapping("/{id}")
    public ResponseEntity<UsuarioResponseDTO> actualizar(@PathVariable Integer id,
            @RequestBody UsuarioRequestDTO request) {
        Usuario usuario = usuarioMapper.toEntity(request);
        return ResponseEntity.ok(usuarioService.actualizar(id, usuario));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> eliminar(@PathVariable Integer id) {
        usuarioService.eliminar(id);
        return ResponseEntity.noContent().build();
    }
}
