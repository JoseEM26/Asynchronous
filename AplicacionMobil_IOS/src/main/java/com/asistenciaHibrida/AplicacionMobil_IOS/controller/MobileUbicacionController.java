package com.asistenciaHibrida.AplicacionMobil_IOS.controller;

import com.asistenciaHibrida.AplicacionMobil_IOS.dto.request.MobileLocationDTO;
import com.asistenciaHibrida.AplicacionMobil_IOS.service.ConfiguracionService;
import com.asistenciaHibrida.AplicacionMobil_IOS.service.TrabajadorService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/mobile/puntos")
public class MobileUbicacionController {

    @Autowired
    private TrabajadorService trabajadorService;

    @Autowired
    private ConfiguracionService configuracionService;

    @PostMapping("/remoto")
    public ResponseEntity<?> registrarPuntoRemoto(@RequestBody MobileLocationDTO request) {
        try {
            trabajadorService.actualizarUbicacionVirtual(
                request.getTrabajadorId(), 
                request.getLatitud(), 
                request.getLongitud()
            );
            return ResponseEntity.ok("Ubicación remota (casa) registrada con éxito");
        } catch (Exception e) {
            return ResponseEntity.badRequest().body("Error al registrar punto remoto: " + e.getMessage());
        }
    }

    @PostMapping("/terreno")
    public ResponseEntity<?> registrarPuntoTerreno(@RequestBody MobileLocationDTO request) {
        try {
            trabajadorService.registrarPuntoTerreno(
                request.getTrabajadorId(),
                request.getLatitud(),
                request.getLongitud(),
                request.getNombreUbicacion()
            );
            return ResponseEntity.ok("Punto de terreno (campo) actualizado por el líder");
        } catch (Exception e) {
            return ResponseEntity.badRequest().body("Error al registrar punto terreno: " + e.getMessage());
        }
    }

    @PostMapping("/oficina")
    public ResponseEntity<?> actualizarPuntoOficina(@RequestBody MobileLocationDTO request) {
        try {
            configuracionService.actualizarOficina(
                request.getLatitud(),
                request.getLongitud()
            );
            return ResponseEntity.ok("Coordenadas de la oficina central actualizadas");
        } catch (Exception e) {
            return ResponseEntity.badRequest().body("Error al actualizar oficina: " + e.getMessage());
        }
    }
}
