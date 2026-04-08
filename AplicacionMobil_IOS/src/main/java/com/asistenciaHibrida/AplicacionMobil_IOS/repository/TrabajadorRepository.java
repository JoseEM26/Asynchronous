package com.asistenciaHibrida.AplicacionMobil_IOS.repository;

import com.asistenciaHibrida.AplicacionMobil_IOS.model.Trabajador;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.EntityGraph;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.JpaSpecificationExecutor;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface TrabajadorRepository extends JpaRepository<Trabajador, Integer>, JpaSpecificationExecutor<Trabajador> {
    Optional<Trabajador> findByDni(String dni);

    @EntityGraph(attributePaths = {"modalidad", "rol", "jefe"})
    Page<Trabajador> findAll(Pageable pageable);
}
