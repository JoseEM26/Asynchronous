package com.asistenciaHibrida.AplicacionMobil_IOS.service.impl;

import com.asistenciaHibrida.AplicacionMobil_IOS.dto.request.PersonalUnificadoDTO;
import com.asistenciaHibrida.AplicacionMobil_IOS.dto.response.PersonalResponseDTO;
import com.asistenciaHibrida.AplicacionMobil_IOS.model.Modalidad;
import com.asistenciaHibrida.AplicacionMobil_IOS.model.Rol;
import com.asistenciaHibrida.AplicacionMobil_IOS.model.Trabajador;
import com.asistenciaHibrida.AplicacionMobil_IOS.model.Usuario;
import com.asistenciaHibrida.AplicacionMobil_IOS.repository.ModalidadRepository;
import com.asistenciaHibrida.AplicacionMobil_IOS.repository.RolRepository;
import com.asistenciaHibrida.AplicacionMobil_IOS.repository.TrabajadorRepository;
import com.asistenciaHibrida.AplicacionMobil_IOS.repository.UsuarioRepository;
import com.asistenciaHibrida.AplicacionMobil_IOS.service.PersonalService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.stream.Collectors;

@Service
public class PersonalServiceImpl implements PersonalService {

    @Autowired
    private TrabajadorRepository trabajadorRepository;

    @Autowired
    private UsuarioRepository usuarioRepository;

    @Autowired
    private RolRepository rolRepository;

    @Autowired
    private ModalidadRepository modalidadRepository;

    @Override
    @Transactional
    public void guardarPersonalUnificado(PersonalUnificadoDTO dto) {
        Trabajador trabajador;
        if (dto.getId() != null) {
            trabajador = trabajadorRepository.findById(dto.getId())
                    .orElseThrow(() -> new RuntimeException("Trabajador no encontrado"));
        } else {
            trabajador = new Trabajador();
        }

        // Mapear campos de Trabajador
        trabajador.setDni(dto.getDni());
        trabajador.setNombres(dto.getNombres());
        trabajador.setApellidos(dto.getApellidos());
        trabajador.setEmail(dto.getEmail());
        trabajador.setTelefono(dto.getTelefono());
        trabajador.setDireccion(dto.getDireccion());
        trabajador.setFechaIngreso(dto.getFechaIngreso());
        trabajador.setActivo(dto.getActivo() != null ? dto.getActivo() : true);
        trabajador.setEsJefeTerreno(dto.getEsJefeTerreno() != null ? dto.getEsJefeTerreno() : false);
        trabajador.setLatitudVirtual(dto.getLatitudVirtual());
        trabajador.setLongitudVirtual(dto.getLongitudVirtual());
        trabajador.setDiasPresencial(dto.getDiasPresencial());
        trabajador.setDiasRemotos(dto.getDiasRemotos());
        if (dto.getHoraIngreso() != null && !dto.getHoraIngreso().isEmpty()) {
            trabajador.setHoraIngreso(java.time.LocalTime.parse(dto.getHoraIngreso()));
        } else {
            trabajador.setHoraIngreso(null);
        }
        if (dto.getHoraSalida() != null && !dto.getHoraSalida().isEmpty()) {
            trabajador.setHoraSalida(java.time.LocalTime.parse(dto.getHoraSalida()));
        } else {
            trabajador.setHoraSalida(null);
        }
        trabajador.setPermitirCambioUbicacion(dto.getPermitirCambioUbicacion() != null ? dto.getPermitirCambioUbicacion() : false);

        if (dto.getModalidadId() != null) {
            Modalidad mod = modalidadRepository.findById(dto.getModalidadId())
                    .orElseThrow(() -> new RuntimeException("Modalidad no encontrada"));
            trabajador.setModalidad(mod);
        }

        trabajador = trabajadorRepository.save(trabajador);

        // Manejar Usuario vinculado
        Usuario usuario = usuarioRepository.findByTrabajador(trabajador).orElse(new Usuario());
        
        usuario.setTrabajador(trabajador);
        usuario.setUsername(dto.getUsername());
        
        // Solo actualizar password si viene en el DTO (útil para creación o cambio explícito)
        if (dto.getPassword() != null && !dto.getPassword().isEmpty()) {
            usuario.setPassword(dto.getPassword());
        } else if (usuario.getId() == null) {
            throw new RuntimeException("La contraseña es requerida para nuevos usuarios");
        }

        if (dto.getRolId() != null) {
            Rol rol = rolRepository.findById(dto.getRolId())
                    .orElseThrow(() -> new RuntimeException("Rol no encontrado"));
            usuario.setRol(rol);
        }

        usuario.setActivo(dto.getUsuarioActivo() != null ? dto.getUsuarioActivo() : true);
        
        usuarioRepository.save(usuario);
    }

    @Override
    @Transactional(readOnly = true)
    public List<PersonalResponseDTO> listarTodos() {
        return trabajadorRepository.findAll().stream().map(t -> {
            PersonalResponseDTO resp = new PersonalResponseDTO();
            resp.setId(t.getId());
            resp.setDni(t.getDni());
            resp.setNombres(t.getNombres());
            resp.setApellidos(t.getApellidos());
            resp.setEmail(t.getEmail());
            resp.setTelefono(t.getTelefono());
            resp.setDireccion(t.getDireccion());
            resp.setFechaIngreso(t.getFechaIngreso());
            resp.setActivo(t.getActivo());
            resp.setLatitudVirtual(t.getLatitudVirtual());
            resp.setLongitudVirtual(t.getLongitudVirtual());
            resp.setDiasPresencial(t.getDiasPresencial());
            resp.setDiasRemotos(t.getDiasRemotos());
            if (t.getHoraIngreso() != null) {
                resp.setHoraIngreso(t.getHoraIngreso().toString());
            }
            if (t.getHoraSalida() != null) {
                resp.setHoraSalida(t.getHoraSalida().toString());
            }
            resp.setPermitirCambioUbicacion(t.getPermitirCambioUbicacion());
            
            if (t.getModalidad() != null) {
                resp.setModalidadNombre(t.getModalidad().getNombre());
                resp.setModalidadId(t.getModalidad().getId());
            }

            usuarioRepository.findByTrabajador(t).ifPresent(u -> {
                resp.setUsuarioId(u.getId());
                resp.setUsername(u.getUsername());
                resp.setUsuarioActivo(u.getActivo());
                if (u.getRol() != null) {
                    resp.setRolNombre(u.getRol().getNombre());
                    resp.setRolId(u.getRol().getId());
                }
            });

            return resp;
        }).collect(Collectors.toList());
    }
}
