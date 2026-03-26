package com.asistenciaHibrida.AplicacionMobil_IOS.repository;

import com.asistenciaHibrida.AplicacionMobil_IOS.model.Asistencia;
import com.asistenciaHibrida.AplicacionMobil_IOS.model.Trabajador;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.EntityGraph;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface AsistenciaRepository extends JpaRepository<Asistencia, Long> {
    @EntityGraph(attributePaths = { "trabajador", "trabajador.modalidad", "trabajador.rol", "modalidad" })
    List<Asistencia> findAll();

    @EntityGraph(attributePaths = { "trabajador", "trabajador.modalidad", "trabajador.rol", "modalidad" })
    List<Asistencia> findByTrabajador(Trabajador trabajador);

    @EntityGraph(attributePaths = { "trabajador", "trabajador.modalidad", "trabajador.rol", "modalidad" })
    Page<Asistencia> findByTrabajador(Trabajador trabajador, Pageable pageable);

    @EntityGraph(attributePaths = { "trabajador", "trabajador.modalidad", "trabajador.rol", "modalidad" })
    Page<Asistencia> findAll(Pageable pageable);
}
