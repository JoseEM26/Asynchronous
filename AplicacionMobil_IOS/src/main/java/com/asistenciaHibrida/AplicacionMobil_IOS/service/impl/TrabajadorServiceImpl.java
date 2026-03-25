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
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class TrabajadorServiceImpl implements TrabajadorService {

    @Autowired
    private TrabajadorRepository trabajadorRepository;

    @Override
    public List<Trabajador> listarTodos() {
        return trabajadorRepository.findAll();
    }

    @Override
    public PageResponseDTO<Trabajador> listarPaginado(PageRequestDTO pageRequest) {
        if (pageRequest == null) pageRequest = new PageRequestDTO();
        String sortBy = (pageRequest.getSortBy() == null || pageRequest.getSortBy().isEmpty()) ? "id" : pageRequest.getSortBy();
        String sortDir = (pageRequest.getSortDir() == null || pageRequest.getSortDir().isEmpty()) ? "asc" : pageRequest.getSortDir();

        Sort sort = sortDir.equalsIgnoreCase(Sort.Direction.ASC.name()) 
                    ? Sort.by(sortBy).ascending() 
                    : Sort.by(sortBy).descending();
        
        Pageable pageable = PageRequest.of(pageRequest.getPageIndex(), pageRequest.getPageSize(), sort);
        
        Page<Trabajador> page = trabajadorRepository.findAll(pageable);
        
        return new PageResponseDTO<>(
                page.getContent(),
                page.getNumber(),
                page.getTotalElements(),
                page.getTotalPages(),
                page.isFirst(),
                page.isLast(),
                page.getSize()
        );
    }

    @Override
    public Trabajador guardar(Trabajador trabajador) {
        return trabajadorRepository.save(trabajador);
    }

    @Override
    public Trabajador buscarPorId(Integer id) {
        return trabajadorRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Trabajador no encontrado con id: " + id));
    }

    @Override
    public void eliminar(Integer id) {
        Trabajador trabajador = buscarPorId(id);
        trabajadorRepository.delete(trabajador);
    }

    @Override
    public Trabajador actualizar(Integer id, Trabajador detalles) {
        Trabajador trabajador = buscarPorId(id);
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
        return trabajadorRepository.save(trabajador);
    }

    @Override
    public void actualizarUbicacionVirtual(Integer trabajadorId, java.math.BigDecimal lat, java.math.BigDecimal lng) {
        Trabajador t = buscarPorId(trabajadorId);
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
        Trabajador jefe = buscarPorId(jefeId);
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
        Trabajador t = buscarPorId(trabajadorId);
        t.setPermitirCambioUbicacion(permitir);
        trabajadorRepository.save(t);
    }
}
