package com.asistenciaHibrida.AplicacionMobil_IOS.repository;

import com.asistenciaHibrida.AplicacionMobil_IOS.model.PuntoTerreno;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface PuntoTerrenoRepository extends JpaRepository<PuntoTerreno, Long> {

    @Query("SELECT p FROM PuntoTerreno p ORDER BY p.fechaActualizacion DESC LIMIT 1")
    Optional<PuntoTerreno> findLatest();
}
