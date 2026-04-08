package com.asistenciaHibrida.AplicacionMobil_IOS.repository;

import com.asistenciaHibrida.AplicacionMobil_IOS.model.Usuario;
import com.asistenciaHibrida.AplicacionMobil_IOS.model.Trabajador;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.JpaSpecificationExecutor;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface UsuarioRepository extends JpaRepository<Usuario, Integer>, JpaSpecificationExecutor<Usuario> {
    @org.springframework.data.jpa.repository.Query("SELECT u FROM Usuario u LEFT JOIN FETCH u.rol LEFT JOIN FETCH u.trabajador t LEFT JOIN FETCH t.modalidad LEFT JOIN FETCH t.rol WHERE u.username = :username")
    Optional<Usuario> findByUsername(@org.springframework.data.repository.query.Param("username") String username);

    Optional<Usuario> findByTrabajador(Trabajador trabajador);
}
