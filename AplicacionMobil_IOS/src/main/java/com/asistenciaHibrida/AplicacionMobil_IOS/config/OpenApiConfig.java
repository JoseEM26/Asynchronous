package com.asistenciaHibrida.AplicacionMobil_IOS.config;

import io.swagger.v3.oas.models.OpenAPI;
import io.swagger.v3.oas.models.info.Info;
import io.swagger.v3.oas.models.info.Contact;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

@Configuration
public class OpenApiConfig {

    @Bean
    public OpenAPI customOpenAPI() {
        return new OpenAPI()
                .info(new Info()
                        .title("API de Asistencia Híbrida")
                        .version("1.0")
                        .description("Documentación de los endpoints para la aplicación móvil de asistencia.")
                        .contact(new Contact()
                                .name("Soporte Técnico")
                                .email("soporte@asistenciahibrida.com")));
    }
}
