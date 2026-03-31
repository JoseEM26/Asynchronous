package com.asistenciaHibrida.AplicacionMobil_IOS.controller;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.HashMap;
import java.util.Map;

@RestController
public class MantenimientoController {

    @GetMapping("/api/mantenimiento/estado")
    public ResponseEntity<Map<String, Object>> getEstadoMantenimiento() {
        Map<String, Object> response = new HashMap<>();
        response.put("enMantenimiento", false);
        response.put("mensaje", "Sistema operativo");
        return ResponseEntity.ok(response);
    }

    @GetMapping("/ws-mantenimiento")
    public ResponseEntity<String> wsMantenimientoFallback() {
        return ResponseEntity.ok("WS Fallback OK");
    }
}
