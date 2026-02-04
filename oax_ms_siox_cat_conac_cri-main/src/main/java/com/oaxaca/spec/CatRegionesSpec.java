package com.oaxaca.spec;

import java.time.LocalDate;
import java.util.Map;

import javax.persistence.criteria.CriteriaBuilder;
import javax.persistence.criteria.CriteriaQuery;
import javax.persistence.criteria.Join;
import javax.persistence.criteria.Predicate;
import javax.persistence.criteria.Root;

import org.springframework.data.jpa.domain.Specification;

import com.oaxaca.entity.CatRegion;
import com.oaxaca.util.DateTimeUtils;

public class CatRegionesSpec implements Specification<CatRegion> {

    @Override
    public Predicate toPredicate(Root<CatRegion> root, CriteriaQuery<?> query, CriteriaBuilder criteriaBuilder) {
        return null;
    }

    public Specification<CatRegion> getSpecificationByFilters(Map<String, String> params) {

        Specification<CatRegion> specification = null;
        for (Map.Entry<String, String> entry : params.entrySet()) {
            Specification<CatRegion> currentFilter = switch (entry.getKey()) {
                case "id" -> filterById(entry.getValue());
                case "estado" -> filterByEstado(entry.getValue());
                case "region" -> filterByRegion(entry.getValue());
                case "fechaAlta" -> filterByFechaAlta(entry.getValue());
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

    private Specification<CatRegion> filterById(String id) {
        return (root, query, cb) -> cb.equal(root.get("id"), Integer.parseInt(id));
    }

    private Specification<CatRegion> filterByEstado(String estado) {
        return (root, query, cb) -> {
            Join<Object, Object> rel = root.join("estados");
            Join<Object, Object> estadoEntity = rel.join("estado");
            return cb.equal(estadoEntity.get("nombre"), estado);
        };
    }

    private Specification<CatRegion> filterByRegion(String region) {
        return (root, query, cb) -> cb.like(
                cb.lower(root.get("nombre")),
                "%" + region.toLowerCase() + "%");
    }

    private Specification<CatRegion> filterByFechaAlta(String fechaAlta) {
        LocalDate fecha = DateTimeUtils.parseToLocalDate(fechaAlta);
        return (root, query, cb) -> cb.equal(root.get("fechaAlta"), fecha);
    }

}
