package com.asistenciaHibrida.AplicacionMobil_IOS.controller;

import com.asistenciaHibrida.AplicacionMobil_IOS.model.Configuracion;
import com.asistenciaHibrida.AplicacionMobil_IOS.model.Trabajador;
import com.asistenciaHibrida.AplicacionMobil_IOS.service.ConfiguracionService;
import com.asistenciaHibrida.AplicacionMobil_IOS.repository.PuntoTerrenoRepository;
import com.asistenciaHibrida.AplicacionMobil_IOS.repository.TrabajadorRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/configuracion")
public class ConfiguracionController {

    @Autowired
    private ConfiguracionService configuracionService;

    @Autowired
    private PuntoTerrenoRepository puntoTerrenoRepository;

    @Autowired
    private TrabajadorRepository trabajadorRepository;

    @GetMapping
    public ResponseEntity<Configuracion> get() {
        return ResponseEntity.ok(configuracionService.obtenerConfiguracion());
    }

    @PutMapping
    public ResponseEntity<Configuracion> update(@RequestBody Configuracion config) {
        return ResponseEntity.ok(configuracionService.guardarConfiguracion(config));
    }

    @GetMapping("/terreno")
    public ResponseEntity<?> getLatestPuntoTerreno() {
        return puntoTerrenoRepository.findLatest()
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    @GetMapping("/terreno/all")
    public ResponseEntity<List<com.asistenciaHibrida.AplicacionMobil_IOS.model.PuntoTerreno>> getAllPuntosTerreno() {
        return ResponseEntity.ok(puntoTerrenoRepository.findAll());
    }

    @PostMapping("/terreno")
    public ResponseEntity<?> crearPuntoTerreno(@RequestBody com.asistenciaHibrida.AplicacionMobil_IOS.model.PuntoTerreno punto) {
        punto.setFechaActualizacion(java.time.LocalDateTime.now());
        return ResponseEntity.ok(puntoTerrenoRepository.save(punto));
    }

    @GetMapping("/remoto/trabajadores")
    public ResponseEntity<List<Trabajador>> getTrabajadoresRemotos() {
        // Buscamos trabajadores que tengan latitud_virtual != null
        return ResponseEntity.ok(trabajadorRepository.findAll().stream()
                .filter(t -> t.getLatitudVirtual() != null)
                .collect(Collectors.toList()));
    }

    @DeleteMapping("/remoto/trabajador/{id}")
    public ResponseEntity<?> resetUbicacionVirtual(@PathVariable Integer id) {
        return trabajadorRepository.findById(id).map(t -> {
            t.setLatitudVirtual(null);
            t.setLongitudVirtual(null);
            trabajadorRepository.save(t);
            return ResponseEntity.ok().build();
        }).orElse(ResponseEntity.notFound().build());
    }
}
