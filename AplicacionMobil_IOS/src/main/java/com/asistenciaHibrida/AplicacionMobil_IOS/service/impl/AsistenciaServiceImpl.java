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

        @Autowired
        private ConfiguracionRepository configuracionRepository;

        @Autowired
        private PuntoTerrenoRepository puntoTerrenoRepository;

        private static final double EARTH_RADIUS = 6371000; // in meters

        @Override
        public Asistencia registrarAsistencia(Integer trabajadorId, Integer modalidadId,
                        Asistencia.TipoAsistencia tipo, BigDecimal latitud,
                        BigDecimal longitud, String notas) {

                Trabajador trabajador = trabajadorRepository.findById(trabajadorId)
                                .orElseThrow(() -> new ResourceNotFoundException("Trabajador no encontrado"));

                Modalidad modalidad;
                if (modalidadId != null) {
                        modalidad = modalidadRepository.findById(modalidadId)
                                        .orElseThrow(() -> new ResourceNotFoundException("Modalidad no encontrada"));
                } else {
                        modalidad = trabajador.getModalidad();
                        if (modalidad == null) {
                                throw new RuntimeException("El trabajador no tiene una modalidad asignada");
                        }
                }

                // Validation Logic
                validateGeofence(trabajador, modalidad, latitud, longitud);

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

        private void validateGeofence(Trabajador t, Modalidad m, BigDecimal currentLatB, BigDecimal currentLngB) {
                if (currentLatB == null || currentLngB == null)
                        return;

                double currentLat = currentLatB.doubleValue();
                double currentLng = currentLngB.doubleValue();
                int modalityId = m.getId();

                Configuracion config = configuracionRepository.findCurrent()
                                .orElseGet(this::createDefaultConfig);

                switch (modalityId) {
                        case 1: // PRESENCIAL
                                validateDistance(currentLat, currentLng,
                                                config.getOfficeLat().doubleValue(),
                                                config.getOfficeLng().doubleValue(),
                                                config.getRadius(), "Oficina");
                                break;

                        case 2: // VIRTUAL (Remote)
                                handleVirtualValidation(t, currentLat, currentLng, config.getRadius());
                                break;

                        case 3: // HIBRIDO
                                if (isTodayPresencial(t)) {
                                        validateDistance(currentLat, currentLng,
                                                        config.getOfficeLat().doubleValue(),
                                                        config.getOfficeLng().doubleValue(),
                                                        config.getRadius(), "Oficina (Día hibrido)");
                                } else {
                                        handleVirtualValidation(t, currentLat, currentLng, config.getRadius());
                                }
                                break;

                        case 4: // TERRENO
                                if (Boolean.TRUE.equals(t.getEsJefeTerreno())) {
                                        savePuntoTerreno(t, currentLatB, currentLngB);
                                } else {
                                        PuntoTerreno latest = puntoTerrenoRepository.findLatest()
                                                        .orElseThrow(() -> new RuntimeException(
                                                                        "No hay punto de terreno definido por un jefe"));
                                        validateDistance(currentLat, currentLng,
                                                        latest.getLatitud().doubleValue(),
                                                        latest.getLongitud().doubleValue(),
                                                        config.getRadius(),
                                                        "Punto de Terreno: " + latest.getNombreUbicacion());
                                }
                                break;
                }
        }

        private void handleVirtualValidation(Trabajador t, double lat, double lng, int radius) {
                if (t.getLatitudVirtual() == null || t.getLongitudVirtual() == null) {
                        t.setLatitudVirtual(BigDecimal.valueOf(lat));
                        t.setLongitudVirtual(BigDecimal.valueOf(lng));
                        trabajadorRepository.save(t);
                } else {
                        validateDistance(lat, lng,
                                        t.getLatitudVirtual().doubleValue(),
                                        t.getLongitudVirtual().doubleValue(),
                                        radius, "Casa / Ubicación Remota");
                }
        }

        private boolean isTodayPresencial(Trabajador t) {
                if (t.getDiasPresencial() == null || t.getDiasPresencial().isEmpty())
                        return false;
                String dayName = LocalDateTime.now().getDayOfWeek().name();
                return t.getDiasPresencial().toUpperCase().contains(dayName.substring(0, 3));
        }

        private void validateDistance(double lat1, double lon1, double lat2, double lon2, int radius, String area) {
                double distance = calculateDistance(lat1, lon1, lat2, lon2);
                if (distance > radius) {
                        throw new RuntimeException("Fuera de rango en " + area + ". Distancia: " + (int) distance
                                        + "m, Permitido: " + radius + "m");
                }
        }

        private double calculateDistance(double lat1, double lon1, double lat2, double lon2) {
                double dLat = Math.toRadians(lat2 - lat1);
                double dLon = Math.toRadians(lon2 - lon1);
                double a = Math.sin(dLat / 2) * Math.sin(dLat / 2) +
                                Math.cos(Math.toRadians(lat1)) * Math.cos(Math.toRadians(lat2)) *
                                                Math.sin(dLon / 2) * Math.sin(dLon / 2);
                double c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
                return EARTH_RADIUS * c;
        }

        private void savePuntoTerreno(Trabajador boss, BigDecimal lat, BigDecimal lng) {
                PuntoTerreno p = new PuntoTerreno();
                p.setLatitud(lat);
                p.setLongitud(lng);
                p.setActualizadoPor(boss);
                p.setFechaActualizacion(LocalDateTime.now());
                p.setNombreUbicacion("Ubicación Lider: " + boss.getNombres());
                puntoTerrenoRepository.save(p);
        }

        private Configuracion createDefaultConfig() {
                Configuracion c = new Configuracion();
                c.setOfficeLat(BigDecimal.valueOf(-12.046374));
                c.setOfficeLng(BigDecimal.valueOf(-77.042793));
                c.setRadius(50);
                return c;
        }

        @Override
        public List<Asistencia> listarPorTrabajador(Integer trabajadorId) {
                Trabajador trabajador = trabajadorRepository.findById(trabajadorId)
                                .orElseThrow(() -> new ResourceNotFoundException("Trabajador no encontrado"));
                return asistenciaRepository.findByTrabajador(trabajador);
        }

        @Override
        public PageResponseDTO<Asistencia> listarPorTrabajadorPaginado(Integer trabajadorId,
                        PageRequestDTO pageRequest) {
                Trabajador trabajador = trabajadorRepository.findById(trabajadorId)
                                .orElseThrow(() -> new ResourceNotFoundException("Trabajador no encontrado"));

                if (pageRequest == null)
                        pageRequest = new PageRequestDTO();
                String sortBy = (pageRequest.getSortBy() == null || pageRequest.getSortBy().isEmpty()) ? "id"
                                : pageRequest.getSortBy();
                String sortDir = (pageRequest.getSortDir() == null || pageRequest.getSortDir().isEmpty()) ? "asc"
                                : pageRequest.getSortDir();

                Sort sort = sortDir.equalsIgnoreCase(Sort.Direction.ASC.name())
                                ? Sort.by(sortBy).ascending()
                                : Sort.by(sortBy).descending();

                Pageable pageable = PageRequest.of(pageRequest.getPageIndex(), pageRequest.getPageSize(), sort);

                // Necesitamos implementar findByTrabajador(Trabajador t, Pageable p) en el
                // repositorio
                Page<Asistencia> page = asistenciaRepository.findByTrabajador(trabajador, pageable);

                return new PageResponseDTO<>(
                                page.getContent(),
                                page.getNumber(),
                                page.getTotalElements(),
                                page.getTotalPages(),
                                page.isFirst(),
                                page.isLast(),
                                page.getSize());
        }

        @Override
        public List<Asistencia> listarTodas() {
                return asistenciaRepository.findAll();
        }

        @Override
        public PageResponseDTO<Asistencia> listarTodasPaginado(PageRequestDTO pageRequest) {
                if (pageRequest == null)
                        pageRequest = new PageRequestDTO();
                String sortBy = (pageRequest.getSortBy() == null || pageRequest.getSortBy().isEmpty()) ? "id"
                                : pageRequest.getSortBy();
                String sortDir = (pageRequest.getSortDir() == null || pageRequest.getSortDir().isEmpty()) ? "asc"
                                : pageRequest.getSortDir();

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
                                page.getSize());
        }
}
