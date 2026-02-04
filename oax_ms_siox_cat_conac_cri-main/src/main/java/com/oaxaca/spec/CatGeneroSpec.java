package com.oaxaca.spec;

import java.time.LocalDate;
import java.util.Map;

import javax.persistence.criteria.CriteriaBuilder;
import javax.persistence.criteria.CriteriaQuery;
import javax.persistence.criteria.Predicate;
import javax.persistence.criteria.Root;

import org.springframework.data.jpa.domain.Specification;

import com.oaxaca.entity.CatGenero;

public class CatGeneroSpec implements Specification<CatGenero> {
    @Override
    public Predicate toPredicate(Root<CatGenero> root, CriteriaQuery<?> query, CriteriaBuilder criteriaBuilder) {
        return null;
    }

    public Specification<CatGenero> getSpecificationByFilters(Map<String, String> params) {
        Specification<CatGenero> specification = null;
        for (Map.Entry<String, String> entry : params.entrySet()) {
            Specification<CatGenero> currentFilter = switch (entry.getKey()) {
                case "id" -> filterById(entry.getValue());
                case "clave" -> filterByClave(entry.getValue());
                case "descripcion" -> filterByDescripcion(entry.getValue());
                case "fechaAlta" -> filterByFechaAlta(entry.getValue());
                case "bloqueado" -> filterByBloqueado(entry.getValue());
                default -> null;
            };
            if (currentFilter != null) {
                specification = (specification == null)
                        ? currentFilter
                        : specification.and(currentFilter);
            }
        }
        return specification;
    }

    /*
     * ==========================
     * Filtros individuales
     * ==========================
     */

    private Specification<CatGenero> filterById(String id) {
        return (root, query, cb) -> cb.equal(root.get("id"), Integer.parseInt(id));
    }

    private Specification<CatGenero> filterByClave(String clave) {
        return (root, query, cb) -> cb.like(cb.lower(root.get("clave")),
                "%" + clave.toLowerCase() + "%");
    }

    private Specification<CatGenero> filterByDescripcion(String descripcion) {
        return (root, query, cb) -> cb.like(cb.lower(root.get("descripcion")),
                "%" + descripcion.toLowerCase() + "%");
    }

    private Specification<CatGenero> filterByFechaAlta(String fecha) {
        return (root, query, cb) -> cb.equal(root.get("fechaAlta"), LocalDate.parse(fecha));
    }

    private Specification<CatGenero> filterByBloqueado(String bloqueado) {
        return (root, query, cb) -> cb.equal(root.get("bloqueado"), Boolean.parseBoolean(bloqueado));
    }

}
