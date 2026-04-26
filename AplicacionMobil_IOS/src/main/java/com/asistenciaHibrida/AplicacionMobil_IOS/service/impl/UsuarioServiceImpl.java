package com.asistenciaHibrida.AplicacionMobil_IOS.service.impl;

import com.asistenciaHibrida.AplicacionMobil_IOS.dto.page.PageRequestDTO;
import com.asistenciaHibrida.AplicacionMobil_IOS.dto.page.PageResponseDTO;
import com.asistenciaHibrida.AplicacionMobil_IOS.model.Usuario;
import com.asistenciaHibrida.AplicacionMobil_IOS.repository.UsuarioRepository;
import com.asistenciaHibrida.AplicacionMobil_IOS.service.UsuarioService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.stream.Collectors;

import com.asistenciaHibrida.AplicacionMobil_IOS.dto.response.UsuarioResponseDTO;
import com.asistenciaHibrida.AplicacionMobil_IOS.mapper.UsuarioMapper;

@Service
public class UsuarioServiceImpl implements UsuarioService {

    @Autowired
    private UsuarioRepository usuarioRepository;

    @Autowired
    private UsuarioMapper usuarioMapper;

    @Override
    @Transactional(readOnly = true)
    public List<UsuarioResponseDTO> listarTodos() {
        return usuarioRepository.findAll().stream()
                .map(usuarioMapper::toResponseDTO)
                .collect(Collectors.toList());
    }

    @Override
    @Transactional(readOnly = true)
    public PageResponseDTO<UsuarioResponseDTO> listarPaginado(PageRequestDTO pageRequest) {
        if (pageRequest == null) pageRequest = new PageRequestDTO();

        final String sortBy = (pageRequest.getSortBy() == null || pageRequest.getSortBy().isEmpty()) ? "id" : pageRequest.getSortBy();
        final String sortDir = (pageRequest.getSortDir() == null || pageRequest.getSortDir().isEmpty()) ? "asc" : pageRequest.getSortDir();

        Sort sort = sortDir.equalsIgnoreCase(Sort.Direction.ASC.name()) ? Sort.by(sortBy).ascending() : Sort.by(sortBy).descending();
        Pageable pageable = PageRequest.of(pageRequest.getPageIndex(), pageRequest.getPageSize(), sort);

        org.springframework.data.jpa.domain.Specification<Usuario> spec = null;
        if (pageRequest.getFilters() != null) {
            String q = (String) pageRequest.getFilters().get("q");
            if (q != null && !q.isEmpty()) {
                String searchPattern = "%" + q.toLowerCase() + "%";
                spec = org.springframework.data.jpa.domain.Specification.where((root, query, cb) -> cb.or(
                    cb.like(cb.lower(root.get("username")), searchPattern),
                    cb.like(cb.lower(root.join("trabajador").get("nombres")), searchPattern),
                    cb.like(cb.lower(root.join("trabajador").get("apellidos")), searchPattern)
                ));
            }
        }

        Page<Usuario> page = (spec != null) ? usuarioRepository.findAll(spec, pageable) : usuarioRepository.findAll(pageable);
        List<UsuarioResponseDTO> dtoList = page.getContent().stream().map(usuarioMapper::toResponseDTO).collect(Collectors.toList());

        return new PageResponseDTO<>(dtoList, page.getNumber(), page.getTotalElements(), page.getTotalPages(), page.isFirst(), page.isLast(), page.getSize(), pageRequest.getFilters());
    }

    @Override
    @Transactional
    public UsuarioResponseDTO guardar(Usuario usuario) {
        Usuario saved = usuarioRepository.save(usuario);
        return usuarioMapper.toResponseDTO(saved);
    }

    @Override
    @Transactional(readOnly = true)
    public UsuarioResponseDTO buscarPorId(Integer id) {
        Usuario u = usuarioRepository.findById(id).orElseThrow(() -> new RuntimeException("Usuario no encontrado"));
        return usuarioMapper.toResponseDTO(u);
    }

    @Override
    @Transactional
    public void eliminar(Integer id) {
        Usuario u = usuarioRepository.findById(id).orElseThrow(() -> new RuntimeException("Usuario no encontrado"));
        u.setActivo(false);
        usuarioRepository.save(u);
    }

    @Override
    @Transactional
    public UsuarioResponseDTO actualizar(Integer id, Usuario detalles) {
        Usuario usuario = usuarioRepository.findById(id).orElseThrow(() -> new RuntimeException("Usuario no encontrado"));
        usuario.setUsername(detalles.getUsername());
        if (detalles.getPassword() != null && !detalles.getPassword().isEmpty()) {
            usuario.setPassword(detalles.getPassword());
        }
        usuario.setRol(detalles.getRol());
        usuario.setActivo(detalles.getActivo());
        Usuario updated = usuarioRepository.save(usuario);
        return usuarioMapper.toResponseDTO(updated);
    }

    @Override
    @Transactional(readOnly = true)
    public UsuarioResponseDTO login(String username, String password, Boolean isMobile) {
        Usuario usuario = usuarioRepository.findByUsername(username)
                .orElseThrow(() -> new RuntimeException("Usuario no encontrado"));

        if (!usuario.getPassword().equals(password)) {
            throw new RuntimeException("Contraseña incorrecta");
        }

        if (!Boolean.TRUE.equals(usuario.getActivo())) {
            throw new RuntimeException("La cuenta de usuario está desactivada");
        }

        UsuarioResponseDTO response = usuarioMapper.toResponseDTO(usuario);
        
        // Lógica corregida para asegurar que el iPhone siempre entre directo
        if (Boolean.TRUE.equals(isMobile)) {
            response.setToken("normal-test-token-" + usuario.getId());
            response.setRequire2FA(false);
            response.setSetup2FA(false);
        } else {
            // WEB: Requiere configuración de 2FA (simulado para Angular)
            response.setSetup2FA(true);
            response.setQrCodeData("otpauth://totp/GeoCheck:" + username + "?secret=JBSWY3DPEHPK3PXP&issuer=GeoCheck");
            response.setTempToken("temp-web-token-" + usuario.getId());
        }
        
        return response;
    }
}
