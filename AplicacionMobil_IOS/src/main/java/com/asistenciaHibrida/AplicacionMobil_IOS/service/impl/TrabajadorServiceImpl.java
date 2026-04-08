package com.asistenciaHibrida.AplicacionMobil_IOS.service.impl;

import com.asistenciaHibrida.AplicacionMobil_IOS.dto.page.PageRequestDTO;
import com.asistenciaHibrida.AplicacionMobil_IOS.dto.page.PageResponseDTO;
import com.asistenciaHibrida.AplicacionMobil_IOS.exception.ResourceNotFoundException;
import com.asistenciaHibrida.AplicacionMobil_IOS.model.Trabajador;
import com.asistenciaHibrida.AplicacionMobil_IOS.repository.TrabajadorRepository;
import com.asistenciaHibrida.AplicacionMobil_IOS.service.TrabajadorService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.data.jpa.domain.Specification;
import org.springframework.stereotype.Service;
import com.asistenciaHibrida.AplicacionMobil_IOS.repository.specification.TrabajadorSpecification;

import java.util.List;

import com.asistenciaHibrida.AplicacionMobil_IOS.dto.response.TrabajadorResponseDTO;
import com.asistenciaHibrida.AplicacionMobil_IOS.mapper.TrabajadorMapper;
import org.springframework.transaction.annotation.Transactional;

import java.util.stream.Collectors;

@Service
public class TrabajadorServiceImpl implements TrabajadorService {

    @Autowired
    private TrabajadorRepository trabajadorRepository;

    @Autowired
    private TrabajadorMapper trabajadorMapper;

    @Autowired
    private com.asistenciaHibrida.AplicacionMobil_IOS.repository.UsuarioRepository usuarioRepository;

    @Override
    @Transactional(readOnly = true)
    public List<TrabajadorResponseDTO> listarTodos() {
        return trabajadorRepository.findAll().stream()
                .map(trabajadorMapper::toResponseDTO)
                .collect(Collectors.toList());
    }

    @Override
    @Transactional(readOnly = true)
    public PageResponseDTO<TrabajadorResponseDTO> listarPaginado(PageRequestDTO pageRequest) {
        if (pageRequest == null) pageRequest = new PageRequestDTO();
        String sortBy = (pageRequest.getSortBy() == null || pageRequest.getSortBy().isEmpty()) ? "id" : pageRequest.getSortBy();
        String sortDir = (pageRequest.getSortDir() == null || pageRequest.getSortDir().isEmpty()) ? "asc" : pageRequest.getSortDir();

        Sort sort = sortDir.equalsIgnoreCase(Sort.Direction.ASC.name()) 
                    ? Sort.by(sortBy).ascending() 
                    : Sort.by(sortBy).descending();
        
        Pageable pageable = PageRequest.of(pageRequest.getPageIndex(), pageRequest.getPageSize(), sort);
        
        Specification<Trabajador> spec = TrabajadorSpecification.withFilters(pageRequest.getFilters());
        Page<Trabajador> page = trabajadorRepository.findAll(spec, pageable);
        
        List<TrabajadorResponseDTO> dtoList = page.getContent().stream()
                .map(trabajadorMapper::toResponseDTO)
                .collect(Collectors.toList());

        return new PageResponseDTO<>(
                dtoList,
                page.getNumber(),
                page.getTotalElements(),
                page.getTotalPages(),
                page.isFirst(),
                page.isLast(),
                page.getSize()
        );
    }

    @Override
    @Transactional
    public TrabajadorResponseDTO guardar(Trabajador trabajador) {
        Trabajador saved = trabajadorRepository.save(trabajador);
        return trabajadorMapper.toResponseDTO(saved);
    }

    @Override
    @Transactional(readOnly = true)
    public TrabajadorResponseDTO buscarPorId(Integer id) {
        Trabajador t = trabajadorRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Trabajador no encontrado con id: " + id));
        return trabajadorMapper.toResponseDTO(t);
    }

    @Override
    @Transactional
    public void eliminar(Integer id) {
        Trabajador t = trabajadorRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Trabajador no encontrado con id: " + id));
        t.setActivo(false);
        trabajadorRepository.save(t);
        
        // Cascade deactivation to User
        usuarioRepository.findByTrabajador(t).ifPresent(u -> {
            u.setActivo(false);
            usuarioRepository.save(u);
        });
    }

    @Override
    @Transactional
    public TrabajadorResponseDTO actualizar(Integer id, Trabajador detalles) {
        Trabajador trabajador = trabajadorRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Trabajador no encontrado con id: " + id));
        
        trabajador.setDni(detalles.getDni());
        trabajador.setNombres(detalles.getNombres());
        trabajador.setApellidos(detalles.getApellidos());
        trabajador.setEmail(detalles.getEmail());
        trabajador.setTelefono(detalles.getTelefono());
        trabajador.setDireccion(detalles.getDireccion());
        trabajador.setFechaIngreso(detalles.getFechaIngreso());
        trabajador.setActivo(detalles.getActivo());
        trabajador.setPermitirCambioUbicacion(detalles.getPermitirCambioUbicacion());
        trabajador.setLatitudVirtual(detalles.getLatitudVirtual());
        trabajador.setLongitudVirtual(detalles.getLongitudVirtual());
        trabajador.setEsJefeTerreno(detalles.getEsJefeTerreno());
        trabajador.setModalidad(detalles.getModalidad());
        trabajador.setRol(detalles.getRol());
        trabajador.setDiasPresencial(detalles.getDiasPresencial());
        trabajador.setDiasRemotos(detalles.getDiasRemotos());
        
        Trabajador updated = trabajadorRepository.save(trabajador);
        
        // Sync deactivation to user if worker was deactivated
        if (Boolean.FALSE.equals(updated.getActivo())) {
            usuarioRepository.findByTrabajador(updated).ifPresent(u -> {
                u.setActivo(false);
                usuarioRepository.save(u);
            });
        }
        
        return trabajadorMapper.toResponseDTO(updated);
    }

    @Override
    public void actualizarUbicacionVirtual(Integer trabajadorId, java.math.BigDecimal lat, java.math.BigDecimal lng) {
        Trabajador t = trabajadorRepository.findById(trabajadorId)
                .orElseThrow(() -> new ResourceNotFoundException("Trabajador no encontrado"));
        // Only allow if not set OR if admin permitted
        if (t.getLatitudVirtual() == null || Boolean.TRUE.equals(t.getPermitirCambioUbicacion())) {
            t.setLatitudVirtual(lat);
            t.setLongitudVirtual(lng);
            t.setPermitirCambioUbicacion(false); // Reset flag
            trabajadorRepository.save(t);
        } else {
            throw new RuntimeException("No tiene permisos para cambiar su ubicación. Contacte al administrador.");
        }
    }

    @Autowired
    private com.asistenciaHibrida.AplicacionMobil_IOS.repository.PuntoTerrenoRepository puntoTerrenoRepository;

    @Override
    public void registrarPuntoTerreno(Integer jefeId, java.math.BigDecimal lat, java.math.BigDecimal lng, String nombre) {
        Trabajador jefe = trabajadorRepository.findById(jefeId)
                .orElseThrow(() -> new ResourceNotFoundException("Trabajador no encontrado"));
        if (!Boolean.TRUE.equals(jefe.getEsJefeTerreno())) {
            throw new RuntimeException("El trabajador no tiene permisos de Jefe de Terreno");
        }
        
        com.asistenciaHibrida.AplicacionMobil_IOS.model.PuntoTerreno p = new com.asistenciaHibrida.AplicacionMobil_IOS.model.PuntoTerreno();
        p.setLatitud(lat);
        p.setLongitud(lng);
        p.setActualizadoPor(jefe);
        p.setFechaActualizacion(java.time.LocalDateTime.now());
        p.setNombreUbicacion(nombre != null ? nombre : "Ubicación Campo - " + jefe.getNombres());
        
        puntoTerrenoRepository.save(p);
    }

    @Override
    public void permitirCambioUbicacion(Integer trabajadorId, Boolean permitir) {
        Trabajador t = trabajadorRepository.findById(trabajadorId)
                .orElseThrow(() -> new ResourceNotFoundException("Trabajador no encontrado"));
        t.setPermitirCambioUbicacion(permitir);
        trabajadorRepository.save(t);
    }
}
