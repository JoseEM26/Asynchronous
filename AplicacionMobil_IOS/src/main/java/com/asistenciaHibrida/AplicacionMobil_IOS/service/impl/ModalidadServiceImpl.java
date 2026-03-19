package com.asistenciaHibrida.AplicacionMobil_IOS.service.impl;

import com.asistenciaHibrida.AplicacionMobil_IOS.dto.page.PageRequestDTO;
import com.asistenciaHibrida.AplicacionMobil_IOS.dto.page.PageResponseDTO;
import com.asistenciaHibrida.AplicacionMobil_IOS.model.Modalidad;
import com.asistenciaHibrida.AplicacionMobil_IOS.repository.ModalidadRepository;
import com.asistenciaHibrida.AplicacionMobil_IOS.service.ModalidadService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class ModalidadServiceImpl implements ModalidadService {

    @Autowired
    private ModalidadRepository modalidadRepository;

    @Override
    public List<Modalidad> listarTodas() {
        return modalidadRepository.findAll();
    }

    @Override
    public PageResponseDTO<Modalidad> listarTodasPaginado(PageRequestDTO pageRequest) {
        Sort sort = pageRequest.getSortDir().equalsIgnoreCase(Sort.Direction.ASC.name()) 
                    ? Sort.by(pageRequest.getSortBy()).ascending() 
                    : Sort.by(pageRequest.getSortBy()).descending();
        
        Pageable pageable = PageRequest.of(pageRequest.getPageIndex(), pageRequest.getPageSize(), sort);
        
        Page<Modalidad> page = modalidadRepository.findAll(pageable);
        
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
