package com.asistenciaHibrida.AplicacionMobil_IOS.service.impl;

import com.asistenciaHibrida.AplicacionMobil_IOS.dto.page.PageRequestDTO;
import com.asistenciaHibrida.AplicacionMobil_IOS.dto.page.PageResponseDTO;
import com.asistenciaHibrida.AplicacionMobil_IOS.dto.response.ComunicadoResponseDTO;
import com.asistenciaHibrida.AplicacionMobil_IOS.mapper.ComunicadoMapper;
import com.asistenciaHibrida.AplicacionMobil_IOS.model.Comunicado;
import com.asistenciaHibrida.AplicacionMobil_IOS.repository.ComunicadoRepository;
import com.asistenciaHibrida.AplicacionMobil_IOS.service.ComunicadoService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.data.jpa.domain.Specification;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.List;
import java.util.stream.Collectors;

@Service
public class ComunicadoServiceImpl implements ComunicadoService {

    @Autowired
    private ComunicadoRepository comunicadoRepository;

    @Autowired
    private ComunicadoMapper comunicadoMapper;

    @Override
    @Transactional(readOnly = true)
    public List<ComunicadoResponseDTO> obtenerActivos() {
        return comunicadoRepository.findActiveComunicados(LocalDateTime.now())
                .stream()
                .map(comunicadoMapper::toResponseDTO)
                .collect(Collectors.toList());
    }

    @Override
    @Transactional(readOnly = true)
    public PageResponseDTO<ComunicadoResponseDTO> listarPaginado(PageRequestDTO pageRequest) {
        if (pageRequest == null)
            pageRequest = new PageRequestDTO();

        final String sortBy = (pageRequest.getSortBy() == null || pageRequest.getSortBy().isEmpty()) ? "id"
                : pageRequest.getSortBy();
        final String sortDir = (pageRequest.getSortDir() == null || pageRequest.getSortDir().isEmpty()) ? "desc"
                : pageRequest.getSortDir();

        Sort sort = sortDir.equalsIgnoreCase(Sort.Direction.ASC.name()) ? Sort.by(sortBy).ascending()
                : Sort.by(sortBy).descending();
        Pageable pageable = PageRequest.of(pageRequest.getPageIndex(), pageRequest.getPageSize(), sort);

        Specification<Comunicado> spec = null;
        if (pageRequest.getFilters() != null) {
            String q = (String) pageRequest.getFilters().get("q");
            if (q != null && !q.isEmpty()) {
                String searchPattern = "%" + q.toLowerCase() + "%";
                spec = (root, query, cb) -> cb.like(cb.lower(root.get("titulo")), searchPattern);
            }
        }

        Page<Comunicado> page = (spec != null) ? comunicadoRepository.findAll(spec, pageable)
                : comunicadoRepository.findAll(pageable);

        List<ComunicadoResponseDTO> dtoList = page.getContent().stream()
                .map(comunicadoMapper::toResponseDTO)
                .collect(Collectors.toList());

        return new PageResponseDTO<>(
                dtoList,
                page.getNumber(),
                page.getTotalElements(),
                page.getTotalPages(),
                page.isFirst(),
                page.isLast(),
                page.getSize(),
                pageRequest.getFilters());
    }

    @Override
    @Transactional
    public ComunicadoResponseDTO crear(Comunicado comunicado) {
        if (comunicado.getFechaPublicacion() == null) {
            comunicado.setFechaPublicacion(LocalDateTime.now());
        }
        return comunicadoMapper.toResponseDTO(comunicadoRepository.save(comunicado));
    }

    @Override
    @Transactional
    public ComunicadoResponseDTO actualizar(Integer id, Comunicado detalles) {
        Comunicado existing = comunicadoRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Comunicado no encontrado"));

        existing.setTitulo(detalles.getTitulo());
        existing.setContenido(detalles.getContenido());
        existing.setTipo(detalles.getTipo());
        existing.setFechaExpiracion(detalles.getFechaExpiracion());
        existing.setActivo(detalles.getActivo());

        return comunicadoMapper.toResponseDTO(comunicadoRepository.save(existing));
    }

    @Override
    @Transactional
    public void eliminar(Integer id) {
        comunicadoRepository.deleteById(id);
    }
}
