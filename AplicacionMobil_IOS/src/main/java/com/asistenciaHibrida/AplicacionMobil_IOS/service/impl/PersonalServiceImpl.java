package com.asistenciaHibrida.AplicacionMobil_IOS.service.impl;

import com.asistenciaHibrida.AplicacionMobil_IOS.dto.request.PersonalUnificadoDTO;
import com.asistenciaHibrida.AplicacionMobil_IOS.dto.response.PersonalResponseDTO;
import com.asistenciaHibrida.AplicacionMobil_IOS.dto.page.PageResponseDTO;
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

import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.data.jpa.domain.Specification;
import java.util.List;
import java.util.stream.Collectors;
import jakarta.persistence.criteria.Predicate;
import java.util.ArrayList;

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

        if (dto.getJefeId() != null) {
            Trabajador jefe = trabajadorRepository.findById(dto.getJefeId())
                    .orElseThrow(() -> new RuntimeException("Jefe no encontrado"));
            trabajador.setJefe(jefe);
        } else {
            trabajador.setJefe(null);
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
    public PageResponseDTO<PersonalResponseDTO> listarPaginado(com.asistenciaHibrida.AplicacionMobil_IOS.dto.page.PageRequestDTO request) {
        Sort sort = request.getSortDir().equalsIgnoreCase("ASC") 
            ? Sort.by(request.getSortBy()).ascending() 
            : Sort.by(request.getSortBy()).descending();
            
        Pageable pageable = PageRequest.of(request.getPageIndex(), request.getPageSize(), sort);
        
        Specification<Trabajador> spec = (root, query, cb) -> {
            List<Predicate> predicates = new ArrayList<>();
            
            if (request.getFilters() != null) {
                String searchTerm = (String) request.getFilters().get("searchTerm");
                if (searchTerm != null && !searchTerm.isEmpty()) {
                    String pattern = "%" + searchTerm.toLowerCase() + "%";
                    predicates.add(cb.or(
                        cb.like(cb.lower(root.get("nombres")), pattern),
                        cb.like(cb.lower(root.get("apellidos")), pattern),
                        cb.like(cb.lower(root.get("dni")), pattern)
                    ));
                }
                
                Object modId = request.getFilters().get("modalidadId");
                if (modId != null) {
                    predicates.add(cb.equal(root.get("modalidad").get("id"), modId));
                }
            }
            
            return cb.and(predicates.toArray(new Predicate[0]));
        };

        Page<Trabajador> page = trabajadorRepository.findAll(spec, pageable);
        
        List<PersonalResponseDTO> content = page.getContent().stream()
                .map(this::mapToResponseDTO)
                .collect(Collectors.toList());

        PageResponseDTO<PersonalResponseDTO> response = new PageResponseDTO<>();
        response.setContent(content);
        response.setTotalItems(page.getTotalElements());
        response.setTotalPages(page.getTotalPages());
        response.setCurrentPage(page.getNumber());
        
        return response;
    }

    private PersonalResponseDTO mapToResponseDTO(Trabajador t) {
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
        
        if (t.getJefe() != null) {
            resp.setJefeId(t.getJefe().getId());
            resp.setJefeNombre(t.getJefe().getNombres() + " " + t.getJefe().getApellidos());
        }
        
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
    }

    @Override
    @Transactional(readOnly = true)
    public List<PersonalResponseDTO> listarTodos() {
        return trabajadorRepository.findAll().stream()
                .map(this::mapToResponseDTO)
                .collect(Collectors.toList());
    }

    @Override
    @Transactional
    public void actualizarEstadoActivo(Integer id, boolean activo) {
        Trabajador trabajador = trabajadorRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Trabajador no encontrado"));
        
        trabajador.setActivo(activo);
        trabajadorRepository.save(trabajador);
        
        usuarioRepository.findByTrabajador(trabajador).ifPresent(u -> {
            u.setActivo(activo);
            usuarioRepository.save(u);
        });
    }
}
