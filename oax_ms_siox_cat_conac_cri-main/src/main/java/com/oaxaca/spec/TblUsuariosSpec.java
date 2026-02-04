package com.oaxaca.spec;

import java.time.LocalDate;
import java.util.Map;

import javax.persistence.criteria.CriteriaBuilder;
import javax.persistence.criteria.CriteriaQuery;
import javax.persistence.criteria.Predicate;
import javax.persistence.criteria.Root;

import org.springframework.data.jpa.domain.Specification;
import org.springframework.lang.Nullable;

import com.oaxaca.entity.TblUsuarios;
import com.oaxaca.util.DateTimeUtils;

public class TblUsuariosSpec implements Specification<TblUsuarios> {
    @Override
    @Nullable
    public Predicate toPredicate(Root<TblUsuarios> root, @Nullable CriteriaQuery<?> query,
            CriteriaBuilder criteriaBuilder) {
        return null;
    }

    public Specification<TblUsuarios> getSpecificationByFilters(Map<String, String> params) {

        Specification<TblUsuarios> specification = null;
        for (Map.Entry<String, String> entry : params.entrySet()) {
            Specification<TblUsuarios> currentFilter = switch (entry.getKey()) {
                case "id" -> filterById(entry.getValue());
                case "date" -> filterByDate(entry.getValue());
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

    private Specification<TblUsuarios> filterById(String id) {
        return (root, query, cb) -> cb.equal(root.<Long>get("id"), Long.parseLong(id));
    }

    private Specification<TblUsuarios> filterByDate(String date) {
        return (root, query, cb) -> cb.equal(root.<LocalDate>get("date"), DateTimeUtils.parseToLocalDate(date));

    }

}
