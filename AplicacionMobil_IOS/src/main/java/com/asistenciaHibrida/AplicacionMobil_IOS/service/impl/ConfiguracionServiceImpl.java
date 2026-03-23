package com.asistenciaHibrida.AplicacionMobil_IOS.service.impl;

import com.asistenciaHibrida.AplicacionMobil_IOS.model.Configuracion;
import com.asistenciaHibrida.AplicacionMobil_IOS.repository.ConfiguracionRepository;
import com.asistenciaHibrida.AplicacionMobil_IOS.service.ConfiguracionService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.math.BigDecimal;

@Service
public class ConfiguracionServiceImpl implements ConfiguracionService {

    @Autowired
    private ConfiguracionRepository repository;

    @Override
    public Configuracion obtenerConfiguracion() {
        return repository.findCurrent().orElseGet(this::createDefault);
    }

    @Override
    public Configuracion guardarConfiguracion(Configuracion config) {
        Configuracion existing = repository.findCurrent().orElseGet(Configuracion::new);
        existing.setOfficeLat(config.getOfficeLat());
        existing.setOfficeLng(config.getOfficeLng());
        existing.setRadius(config.getRadius());
        return repository.save(existing);
    }

    @Override
    public void actualizarOficina(BigDecimal lat, BigDecimal lng) {
        Configuracion existing = repository.findCurrent().orElseGet(this::createDefault);
        existing.setOfficeLat(lat);
        existing.setOfficeLng(lng);
        repository.save(existing);
    }

    private Configuracion createDefault() {
        Configuracion c = new Configuracion();
        c.setOfficeLat(BigDecimal.valueOf(-12.046374));
        c.setOfficeLng(BigDecimal.valueOf(-77.042793));
        c.setRadius(50);
        return c;
    }
}
