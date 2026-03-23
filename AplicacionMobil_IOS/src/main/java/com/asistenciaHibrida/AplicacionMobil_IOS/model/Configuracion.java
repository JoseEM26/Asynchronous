package com.asistenciaHibrida.AplicacionMobil_IOS.model;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.math.BigDecimal;

@Entity
@Table(name = "configuracion")
@Getter
@Setter
@NoArgsConstructor
public class Configuracion {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer id;

    @Column(nullable = false, precision = 10, scale = 8)
    private BigDecimal officeLat;

    @Column(nullable = false, precision = 11, scale = 8)
    private BigDecimal officeLng;

    @Column(nullable = false)
    private Integer radius = 50; // Default 50 meters
}
