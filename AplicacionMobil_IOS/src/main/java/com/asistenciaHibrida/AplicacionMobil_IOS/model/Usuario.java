package com.asistenciaHibrida.AplicacionMobil_IOS.model;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Entity
@Table(name = "usuarios")
@Getter
@Setter
@NoArgsConstructor
public class Usuario {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer id;

    @Column(nullable = false, unique = true, length = 50)
    private String username;

    @Column(nullable = false, length = 255)
    private String password;

    @ManyToOne
    @JoinColumn(name = "rol_id")
    private Rol rol;

    @OneToOne
    @JoinColumn(name = "trabajador_id")
    private Trabajador trabajador;

    @Column(nullable = false)
    private Boolean activo = true;

    @Column(name = "two_factor_enabled", nullable = false)
    private Boolean twoFactorEnabled = false;
}
