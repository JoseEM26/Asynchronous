package com.asistenciaHibrida.AplicacionMobil_IOS.dto.page;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.Map;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class PageRequestDTO {
    private int pageIndex = 0;
    private int pageSize = 10;
    private String sortBy = "id";
    private String sortDir = "asc";
    private Map<String, Object> filters;
}
