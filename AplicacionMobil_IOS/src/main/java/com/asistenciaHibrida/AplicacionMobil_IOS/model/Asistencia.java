package com.asistenciaHibrida.AplicacionMobil_IOS.model;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.math.BigDecimal;
import java.time.LocalDateTime;

@Entity
@Table(name = "asistencias")
@Getter
@Setter
@NoArgsConstructor
public class Asistencia {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne
    @JoinColumn(name = "trabajador_id", nullable = false)
    private Trabajador trabajador;

    @Column(name = "fecha_hora", nullable = false)
    private LocalDateTime fechaHora = LocalDateTime.now();

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private TipoAsistencia tipo;

    @ManyToOne
    @JoinColumn(name = "modalidad_id")
    private Modalidad modalidad;

    @Column
    private BigDecimal latitud;

    @Column
    private BigDecimal longitud;

    @Column(columnDefinition = "TEXT")
    private String notas;

    public enum TipoAsistencia {
        ENTRADA, SALIDA
    }
}
