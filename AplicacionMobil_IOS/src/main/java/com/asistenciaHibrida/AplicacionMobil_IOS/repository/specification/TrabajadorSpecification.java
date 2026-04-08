package com.asistenciaHibrida.AplicacionMobil_IOS.repository.specification;

import com.asistenciaHibrida.AplicacionMobil_IOS.model.Trabajador;
import org.springframework.data.jpa.domain.Specification;
import jakarta.persistence.criteria.Predicate;
import java.util.ArrayList;
import java.util.List;
import java.util.Map;

public class TrabajadorSpecification {

    public static Specification<Trabajador> withFilters(Map<String, Object> filters) {
        return (root, query, cb) -> {
            List<Predicate> predicates = new ArrayList<>();

            if (filters == null || filters.isEmpty()) {
                return cb.conjunction();
            }

            // Search Term: Names, Surnames, DNI, Email
            if (filters.containsKey("searchTerm") && filters.get("searchTerm") != null) {
                String search = "%" + filters.get("searchTerm").toString().toLowerCase() + "%";
                predicates.add(cb.or(
                        cb.like(cb.lower(root.get("nombres")), search),
                        cb.like(cb.lower(root.get("apellidos")), search),
                        cb.like(cb.lower(root.get("dni")), search),
                        cb.like(cb.lower(root.get("email")), search)
                ));
            }

            // Modality Filter
            if (filters.containsKey("modalidadId") && filters.get("modalidadId") != null) {
                try {
                    Integer modId = Integer.parseInt(filters.get("modalidadId").toString());
                    predicates.add(cb.equal(root.get("modalidad").get("id"), modId));
                } catch (NumberFormatException ignored) {}
            }

            // Active Filter
            if (filters.containsKey("activo") && filters.get("activo") != null) {
                Boolean activo = Boolean.parseBoolean(filters.get("activo").toString());
                predicates.add(cb.equal(root.get("activo"), activo));
            }

            // Rol Filter
            if (filters.containsKey("rolId") && filters.get("rolId") != null) {
                try {
                    Integer rolId = Integer.parseInt(filters.get("rolId").toString());
                    predicates.add(cb.equal(root.get("rol").get("id"), rolId));
                } catch (NumberFormatException ignored) {}
            }

            return cb.and(predicates.toArray(new Predicate[0]));
        };
    }
}
