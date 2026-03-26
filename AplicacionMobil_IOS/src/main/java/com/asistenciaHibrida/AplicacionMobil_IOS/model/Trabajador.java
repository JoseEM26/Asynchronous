package com.asistenciaHibrida.AplicacionMobil_IOS.model;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.time.LocalDate;

@Entity
@Table(name = "trabajadores")
@Getter
@Setter
@NoArgsConstructor
public class Trabajador {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer id;

    @Column(nullable = false, unique = true, length = 20)
    private String dni;

    @Column(nullable = false, length = 100)
    private String nombres;

    @Column(nullable = false, length = 100)
    private String apellidos;

    @Column(unique = true, length = 100)
    private String email;

    @Column(length = 20)
    private String telefono;

    @Column(columnDefinition = "TEXT")
    private String direccion;

    @Column(name = "fecha_ingreso")
    private LocalDate fechaIngreso;

    @Column(nullable = false)
    private Boolean activo = true;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "modalidad_id")
    private Modalidad modalidad;

    @Column(name = "es_jefe_terreno")
    private Boolean esJefeTerreno = false;

    @Column(name = "latitud_virtual", precision = 10, scale = 8)
    private java.math.BigDecimal latitudVirtual;

    @Column(name = "longitud_virtual", precision = 11, scale = 8)
    private java.math.BigDecimal longitudVirtual;

    @Column(name = "dias_presencial", length = 50)
    private String diasPresencial;

    @Column(name = "permitir_cambio_ubicacion")
    private Boolean permitirCambioUbicacion = false;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "jefe_id")
    private Trabajador jefe;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "rol_id")
    private Rol rol;
}
