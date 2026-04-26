package com.asistenciaHibrida.AplicacionMobil_IOS.controller;

import com.asistenciaHibrida.AplicacionMobil_IOS.dto.page.PageRequestDTO;
import com.asistenciaHibrida.AplicacionMobil_IOS.dto.page.PageResponseDTO;
import com.asistenciaHibrida.AplicacionMobil_IOS.dto.request.PersonalUnificadoDTO;
import com.asistenciaHibrida.AplicacionMobil_IOS.dto.response.PersonalResponseDTO;
import com.asistenciaHibrida.AplicacionMobil_IOS.service.PersonalService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/personal")
@CrossOrigin(origins = "*")
public class PersonalController {

    @Autowired
    private PersonalService personalService;

    @GetMapping
    public List<PersonalResponseDTO> listar() {
        return personalService.listarTodos();
    }

    @PostMapping("/paged")
    public PageResponseDTO<PersonalResponseDTO> listarPaginado(@RequestBody PageRequestDTO pageRequest) {
        return personalService.listarPaginado(pageRequest);
    }

    @GetMapping("/mi-equipo/{jefeId}")
    public List<PersonalResponseDTO> listarMiEquipo(@PathVariable Integer jefeId) {
        // Podríamos filtrar el listado general o llamar a un método específico del service
        return personalService.listarTodos().stream()
                .filter(p -> jefeId.equals(p.getJefeId()))
                .collect(java.util.stream.Collectors.toList());
    }

    @PostMapping
    public ResponseEntity<Void> guardar(@RequestBody PersonalUnificadoDTO request) {
        personalService.guardarPersonalUnificado(request);
        return ResponseEntity.ok().build();
    }

    @PutMapping("/{id}/toggle-activo")
    public ResponseEntity<Void> toggleActivo(@PathVariable Integer id, @RequestParam boolean activo) {
        personalService.actualizarEstadoActivo(id, activo);
        return ResponseEntity.ok().build();
    }
}
