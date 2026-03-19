package com.asistenciaHibrida.AplicacionMobil_IOS.service.impl;

import com.asistenciaHibrida.AplicacionMobil_IOS.dto.page.PageRequestDTO;
import com.asistenciaHibrida.AplicacionMobil_IOS.dto.page.PageResponseDTO;
import com.asistenciaHibrida.AplicacionMobil_IOS.model.*;
import com.asistenciaHibrida.AplicacionMobil_IOS.repository.*;
import com.asistenciaHibrida.AplicacionMobil_IOS.service.AsistenciaService;
import com.asistenciaHibrida.AplicacionMobil_IOS.exception.ResourceNotFoundException;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.stereotype.Service;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.List;

@Service
public class AsistenciaServiceImpl implements AsistenciaService {

    @Autowired
    private AsistenciaRepository asistenciaRepository;

    @Autowired
    private TrabajadorRepository trabajadorRepository;

    @Autowired
    private ModalidadRepository modalidadRepository;

    @Override
    public Asistencia registrarAsistencia(Integer trabajadorId, Integer modalidadId, 
                                         Asistencia.TipoAsistencia tipo, BigDecimal latitud, 
                                         BigDecimal longitud, String notas) {
        
        Trabajador trabajador = trabajadorRepository.findById(trabajadorId)
                .orElseThrow(() -> new ResourceNotFoundException("Trabajador no encontrado"));
                
        Modalidad modalidad = modalidadRepository.findById(modalidadId)
                .orElseThrow(() -> new ResourceNotFoundException("Modalidad no encontrada"));

        Asistencia asistencia = new Asistencia();
        asistencia.setTrabajador(trabajador);
        asistencia.setModalidad(modalidad);
        asistencia.setTipo(tipo);
        asistencia.setFechaHora(LocalDateTime.now());
        asistencia.setLatitud(latitud);
        asistencia.setLongitud(longitud);
        asistencia.setNotas(notas);

        return asistenciaRepository.save(asistencia);
    }

    @Override
    public List<Asistencia> listarPorTrabajador(Integer trabajadorId) {
        Trabajador trabajador = trabajadorRepository.findById(trabajadorId)
                .orElseThrow(() -> new ResourceNotFoundException("Trabajador no encontrado"));
        return asistenciaRepository.findByTrabajador(trabajador);
    }

    @Override
    public PageResponseDTO<Asistencia> listarPorTrabajadorPaginado(Integer trabajadorId, PageRequestDTO pageRequest) {
        Trabajador trabajador = trabajadorRepository.findById(trabajadorId)
                .orElseThrow(() -> new ResourceNotFoundException("Trabajador no encontrado"));

        if (pageRequest == null) pageRequest = new PageRequestDTO();
        String sortBy = (pageRequest.getSortBy() == null || pageRequest.getSortBy().isEmpty()) ? "id" : pageRequest.getSortBy();
        String sortDir = (pageRequest.getSortDir() == null || pageRequest.getSortDir().isEmpty()) ? "asc" : pageRequest.getSortDir();

        Sort sort = sortDir.equalsIgnoreCase(Sort.Direction.ASC.name()) 
                    ? Sort.by(sortBy).ascending() 
                    : Sort.by(sortBy).descending();
        
        Pageable pageable = PageRequest.of(pageRequest.getPageIndex(), pageRequest.getPageSize(), sort);
        
        // Necesitamos implementar findByTrabajador(Trabajador t, Pageable p) en el repositorio
        Page<Asistencia> page = asistenciaRepository.findByTrabajador(trabajador, pageable);
        
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
    public List<Asistencia> listarTodas() {
        return asistenciaRepository.findAll();
    }

    @Override
    public PageResponseDTO<Asistencia> listarTodasPaginado(PageRequestDTO pageRequest) {
        if (pageRequest == null) pageRequest = new PageRequestDTO();
        String sortBy = (pageRequest.getSortBy() == null || pageRequest.getSortBy().isEmpty()) ? "id" : pageRequest.getSortBy();
        String sortDir = (pageRequest.getSortDir() == null || pageRequest.getSortDir().isEmpty()) ? "asc" : pageRequest.getSortDir();

        Sort sort = sortDir.equalsIgnoreCase(Sort.Direction.ASC.name()) 
                    ? Sort.by(sortBy).ascending() 
                    : Sort.by(sortBy).descending();
        
        Pageable pageable = PageRequest.of(pageRequest.getPageIndex(), pageRequest.getPageSize(), sort);
        
        Page<Asistencia> page = asistenciaRepository.findAll(pageable);
        
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
}
