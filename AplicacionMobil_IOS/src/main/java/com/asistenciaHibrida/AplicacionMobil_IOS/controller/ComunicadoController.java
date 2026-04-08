package com.asistenciaHibrida.AplicacionMobil_IOS.controller;

import com.asistenciaHibrida.AplicacionMobil_IOS.dto.page.PageRequestDTO;
import com.asistenciaHibrida.AplicacionMobil_IOS.dto.page.PageResponseDTO;
import com.asistenciaHibrida.AplicacionMobil_IOS.dto.response.ComunicadoResponseDTO;
import com.asistenciaHibrida.AplicacionMobil_IOS.service.ComunicadoService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/comunicados")
@Tag(name = "Comunicados", description = "Endpoints para obtener anuncios y noticias de la empresa")
public class ComunicadoController {

    @Autowired
    private ComunicadoService comunicadoService;

    @Operation(summary = "Obtener comunicados activos", description = "Retorna una lista de noticias y anuncios vigentes para ser mostrados en la app móvil.")
    @GetMapping("/activos")
    public ResponseEntity<List<ComunicadoResponseDTO>> getComunicadosActivos() {
        return ResponseEntity.ok(comunicadoService.obtenerActivos());
    }

    @PostMapping("/paged")
    public PageResponseDTO<ComunicadoResponseDTO> listarPaginado(@RequestBody PageRequestDTO pageRequest) {
        return comunicadoService.listarPaginado(pageRequest);
    }

    @PostMapping
    public ResponseEntity<ComunicadoResponseDTO> crear(
            @RequestBody com.asistenciaHibrida.AplicacionMobil_IOS.model.Comunicado comunicado) {
        return ResponseEntity.ok(comunicadoService.crear(comunicado));
    }

    @PutMapping("/{id}")
    public ResponseEntity<ComunicadoResponseDTO> actualizar(@PathVariable Integer id,
            @RequestBody com.asistenciaHibrida.AplicacionMobil_IOS.model.Comunicado detalles) {
        return ResponseEntity.ok(comunicadoService.actualizar(id, detalles));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> eliminar(@PathVariable Integer id) {
        comunicadoService.eliminar(id);
        return ResponseEntity.noContent().build();
    }
}
