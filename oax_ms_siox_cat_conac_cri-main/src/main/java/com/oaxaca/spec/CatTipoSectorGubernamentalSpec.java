package com.oaxaca.spec;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.Map;

import javax.persistence.criteria.CriteriaBuilder;
import javax.persistence.criteria.CriteriaQuery;
import javax.persistence.criteria.Join;
import javax.persistence.criteria.JoinType;
import javax.persistence.criteria.Predicate;
import javax.persistence.criteria.Root;

import org.springframework.data.jpa.domain.Specification;

import com.oaxaca.entity.CatTipoSectorGubernamental;
import com.oaxaca.entity.TblUsuarios;
import com.oaxaca.util.DateTimeUtils;

public class CatTipoSectorGubernamentalSpec implements Specification<CatTipoSectorGubernamental> {

    @Override
    public Predicate toPredicate(Root<CatTipoSectorGubernamental> root, CriteriaQuery<?> query,
            CriteriaBuilder criteriaBuilder) {
        return null;
    }

    public Specification<CatTipoSectorGubernamental> getSpecificationByFilters(Map<String, String> params) {

        Specification<CatTipoSectorGubernamental> specification = null;
        for (Map.Entry<String, String> entry : params.entrySet()) {
            Specification<CatTipoSectorGubernamental> currentFilter = switch (entry.getKey()) {
                case "id" -> filterById(entry.getValue());
                case "sector" -> filterBySector(entry.getValue());
                case "clave" -> filterByClave(entry.getValue());
                case "fechaInicioVigencia" -> filterByFechaInicioVigencia(entry.getValue());
                case "fechaFinVigencia" -> filterByFechaFinVigencia(entry.getValue());
                case "fechaAlta" -> filterByFechaAlta(entry.getValue());
                case "fechaModificacion" -> filterByFechaModificacion(entry.getValue());
                case "activo" -> filterByActivo(entry.getValue());

                case "idUsuarioCreacion" -> filterByUsuarioCreacion(entry.getValue());
                case "idUsuarioModificacion" -> filterByUsuarioModificacion(entry.getValue());

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
     * =========================
     * FILTROS SIMPLES
     * =========================
     */

    private Specification<CatTipoSectorGubernamental> filterById(String id) {
        return (root, query, cb) -> cb.equal(root.get("id"), Integer.valueOf(id));
    }

    private Specification<CatTipoSectorGubernamental> filterBySector(String sector) {
        return (root, query, cb) -> cb.like(cb.lower(root.get("sector")), "%" + sector.toLowerCase() + "%");
    }

    private Specification<CatTipoSectorGubernamental> filterByClave(String clave) {
        return (root, query, cb) -> cb.like(cb.lower(root.get("clave")), "%" + clave.toLowerCase() + "%");
    }

    private Specification<CatTipoSectorGubernamental> filterByActivo(String activo) {
        return (root, query, cb) -> cb.equal(root.get("activo"), Boolean.valueOf(activo));
    }

    /*
     * =========================
     * FECHAS
     * =========================
     */

    private Specification<CatTipoSectorGubernamental> filterByFechaInicioVigencia(String fecha) {
        LocalDate date = DateTimeUtils.parseToLocalDate(fecha);
        return (root, query, cb) -> cb.equal(root.get("fechaInicioVigencia"), date);
    }

    private Specification<CatTipoSectorGubernamental> filterByFechaFinVigencia(String fecha) {
        LocalDate date = DateTimeUtils.parseToLocalDate(fecha);
        return (root, query, cb) -> cb.equal(root.get("fechaFinVigencia"), date);
    }

    private Specification<CatTipoSectorGubernamental> filterByFechaAlta(String fecha) {
        LocalDateTime date = DateTimeUtils.parseToLocalDateTime(fecha);
        return (root, query, cb) -> cb.equal(root.get("fechaAlta"), date);
    }

    private Specification<CatTipoSectorGubernamental> filterByFechaModificacion(String fecha) {
        LocalDateTime date = DateTimeUtils.parseToLocalDateTime(fecha);
        return (root, query, cb) -> cb.equal(root.get("fechaModificacion"), date);
    }

    /*
     * =========================
     * RELACIONES (JOIN)
     * =========================
     */

    private Specification<CatTipoSectorGubernamental> filterByUsuarioCreacion(String idUsuario) {
        return (root, query, cb) -> {
            Join<CatTipoSectorGubernamental, TblUsuarios> join = root.join("usuarioCreacion", JoinType.INNER);
            return cb.equal(join.get("id"), Long.valueOf(idUsuario));
        };
    }

    private Specification<CatTipoSectorGubernamental> filterByUsuarioModificacion(String idUsuario) {
        return (root, query, cb) -> {
            Join<CatTipoSectorGubernamental, TblUsuarios> join = root.join("usuarioModificacion", JoinType.LEFT);
            return cb.equal(join.get("id"), Long.valueOf(idUsuario));
        };
    }

}
