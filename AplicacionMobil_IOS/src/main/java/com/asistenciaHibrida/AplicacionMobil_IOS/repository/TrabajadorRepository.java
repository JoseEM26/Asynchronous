package com.asistenciaHibrida.AplicacionMobil_IOS.repository;

import com.asistenciaHibrida.AplicacionMobil_IOS.model.Trabajador;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface TrabajadorRepository extends JpaRepository<Trabajador, Integer> {
    Optional<Trabajador> findByDni(String dni);
}
