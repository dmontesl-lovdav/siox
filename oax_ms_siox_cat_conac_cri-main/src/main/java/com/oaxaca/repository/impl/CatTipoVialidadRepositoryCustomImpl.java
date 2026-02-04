package com.oaxaca.repository.impl;

import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

import javax.persistence.EntityManager;
import javax.persistence.PersistenceContext;
import javax.persistence.TypedQuery;

import org.springframework.stereotype.Repository;

import com.oaxaca.entity.CatTipoVialidad;
import com.oaxaca.repository.CatTipoVialidadRepositoryCustom;

@Repository
public class CatTipoVialidadRepositoryCustomImpl implements CatTipoVialidadRepositoryCustom {

    @PersistenceContext
    private EntityManager entityManager;

    @Override
    public List<Map<String, Object>> getCatTipoVialidadCustom(String busqueda, String sort, Integer page,
            Integer pageSize) {
        String jpql = "SELECT c FROM CatTipoVialidad c WHERE (:busqueda IS NULL OR LOWER(c.descripcion) LIKE LOWER(CONCAT('%', :busqueda, '%'))) ORDER BY c."
                + sort;
        TypedQuery<CatTipoVialidad> query = entityManager.createQuery(jpql, CatTipoVialidad.class);
        query.setParameter("busqueda", busqueda);
        if (page != null && pageSize != null) {
            query.setFirstResult((page - 1) * pageSize);
            query.setMaxResults(pageSize);
        }
        List<CatTipoVialidad> resultList = query.getResultList();
        List<Map<String, Object>> mappedList = new ArrayList<>();
        for (CatTipoVialidad entity : resultList) {
            Map<String, Object> map = new HashMap<>();
            map.put("id", entity.getId());
            map.put("descripcion", entity.getDescripcion());
            map.put("fechaAlta", entity.getFechaAlta());
            map.put("idUsuarioCreacion", entity.getIdUsuarioCreacion());
            map.put("estatus", entity.getEstatus());
            mappedList.add(map);
        }
        return mappedList;
    }
}
