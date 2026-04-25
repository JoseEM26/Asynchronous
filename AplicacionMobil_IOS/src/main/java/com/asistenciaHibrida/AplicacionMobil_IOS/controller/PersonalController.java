package com.asistenciaHibrida.AplicacionMobil_IOS.controller;

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

    @PostMapping
    public ResponseEntity<Void> guardar(@RequestBody PersonalUnificadoDTO request) {
        personalService.guardarPersonalUnificado(request);
        return ResponseEntity.ok().build();
    }
}
