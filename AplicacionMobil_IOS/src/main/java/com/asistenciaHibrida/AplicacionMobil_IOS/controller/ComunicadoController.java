package com.asistenciaHibrida.AplicacionMobil_IOS.controller;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.ArrayList;
import java.util.List;

@RestController
@RequestMapping("/api/comunicados")
public class ComunicadoController {

    @GetMapping("/activos")
    public ResponseEntity<List<?>> getComunicadosActivos() {
        return ResponseEntity.ok(new ArrayList<>());
    }
}
