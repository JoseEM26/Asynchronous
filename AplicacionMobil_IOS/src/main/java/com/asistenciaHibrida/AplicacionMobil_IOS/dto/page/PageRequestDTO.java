package com.asistenciaHibrida.AplicacionMobil_IOS.dto.page;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class PageRequestDTO {
    private int pageIndex = 0; // Cambiado de page para evitar conflictos con page de Spring
    private int pageSize = 10;
    private String sortBy = "id"; // Cambiado de idCliente a id
    private String sortDir = "asc";
}
