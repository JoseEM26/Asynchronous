package com.asistenciaHibrida.AplicacionMobil_IOS.service;

import com.asistenciaHibrida.AplicacionMobil_IOS.model.Configuracion;

public interface ConfiguracionService {
    Configuracion obtenerConfiguracion();

    Configuracion guardarConfiguracion(Configuracion config);
    void actualizarOficina(java.math.BigDecimal lat, java.math.BigDecimal lng);
}
