package com.asistenciaHibrida.AplicacionMobil_IOS.repository;

import com.asistenciaHibrida.AplicacionMobil_IOS.model.Comunicado;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.JpaSpecificationExecutor;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.time.LocalDateTime;
import java.util.List;

@Repository
public interface ComunicadoRepository extends JpaRepository<Comunicado, Integer>, JpaSpecificationExecutor<Comunicado> {
    
    @Query("SELECT c FROM Comunicado c WHERE c.activo = true AND (c.fechaExpiracion IS NULL OR c.fechaExpiracion > :now) ORDER BY c.fechaPublicacion DESC")
    List<Comunicado> findActiveComunicados(LocalDateTime now);
}
