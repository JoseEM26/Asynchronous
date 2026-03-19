package com.asistenciaHibrida.AplicacionMobil_IOS.dto.page;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import java.util.List;
import java.util.Map;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class PageResponseDTO<T> {
    private List<T> content;
    private int currentPage;
    private long totalItems;
    private int totalPages;
    private boolean first;
    private boolean last;
    private int pageSize;
    private Map<String, Object> filters; // Para mantener los filtros aplicados

    // Constructor sin filters (para compatibilidad)
    public PageResponseDTO(List<T> content, int currentPage, long totalItems, int totalPages,
            boolean first, boolean last, int pageSize) {
        this.content = content;
        this.currentPage = currentPage;
        this.totalItems = totalItems;
        this.totalPages = totalPages;
        this.first = first;
        this.last = last;
        this.pageSize = pageSize;
        this.filters = null;
    }
}
