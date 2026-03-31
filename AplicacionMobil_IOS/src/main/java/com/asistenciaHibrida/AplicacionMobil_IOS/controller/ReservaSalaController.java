package com.asistenciaHibrida.AplicacionMobil_IOS.controller;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.ArrayList;
import java.util.List;

@RestController
@RequestMapping("/api/reserva-sala")
public class ReservaSalaController {

    @GetMapping("/notificaciones")
    public ResponseEntity<List<?>> getNotificaciones() {
        return ResponseEntity.ok(new ArrayList<>());
    }
}
