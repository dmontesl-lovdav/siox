package com.oaxaca.service.impl;

import java.util.Date;
import java.util.List;
import java.util.Map;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.oaxaca.dto.CatNombreAsentamientoDTO;
import com.oaxaca.dto.ConsultaRespuesta;
import com.oaxaca.entity.CatNombreAsentamiento;
import com.oaxaca.repository.CatNombreAsentamientoRepository;
import com.oaxaca.service.ICatNombreAsentamientoService;

@Service
public class CatNombreAsentamientoServiceImpl implements ICatNombreAsentamientoService {

    @Autowired
    private CatNombreAsentamientoRepository catNombreAsentamientoRepository;
    @Autowired
    private CatNombreAsentamientoRepository repository;

    @Override
    public ConsultaRespuesta<List<CatNombreAsentamientoDTO>> buscarNombreAsentamiento(String busqueda, String sort,
            Integer page,
            Integer pageSize) {
        ConsultaRespuesta<List<CatNombreAsentamientoDTO>> respuesta = new ConsultaRespuesta<>();
        try {
            if (page == null || page < 1) {
                page = 1;
            }
            if (pageSize == null || pageSize < 1) {
                pageSize = 10;
            }
            if (sort == null || sort.trim().isEmpty()) {
                sort = "id ASC";
            }

            List<Map<String, Object>> results = repository.getCatNombreAsentamientoNative(busqueda, sort, page,
                    pageSize);
            List<CatNombreAsentamientoDTO> datos = new java.util.ArrayList<>();
            for (Map<String, Object> obj : results) {
                CatNombreAsentamientoDTO dto = new CatNombreAsentamientoDTO();
                dto.setTotalRegistros(
                        obj.get("total_registros") != null ? ((Number) obj.get("total_registros")).intValue() : null);
                dto.setId(obj.get("id") != null ? ((Number) obj.get("id")).intValue() : null);
                dto.setClave(obj.get("clave") != null ? obj.get("clave").toString() : null);
                dto.setDescripcion(obj.get("descripcion") != null ? obj.get("descripcion").toString() : null);
                dto.setFechaAlta(obj.get("fecha_alta") instanceof java.sql.Date
                        ? new java.util.Date(((java.sql.Date) obj.get("fecha_alta")).getTime())
                        : null);
                dto.setIdTipoAsentamiento(
                        obj.get("id_tipo_asentamiento") != null ? ((Number) obj.get("id_tipo_asentamiento")).intValue()
                                : null);
                dto.setIdUsuarioCreacion(
                        obj.get("id_usuario_creacion") != null ? ((Number) obj.get("id_usuario_creacion")).intValue()
                                : null);
                dto.setEstatus(obj.get("estatus") != null ? Boolean.valueOf(obj.get("estatus").toString()) : null);
                dto.setTipoClave(obj.get("tipo_clave") != null ? obj.get("tipo_clave").toString() : null);
                dto.setTipoDescripcion(
                        obj.get("tipo_descripcion") != null ? obj.get("tipo_descripcion").toString() : null);
                dto.setNombre(obj.get("nombre") != null ? obj.get("nombre").toString() : null);
                dto.setAPaterno(obj.get("a_paterno") != null ? obj.get("a_paterno").toString() : null);
                dto.setAMaterno(obj.get("a_materno") != null ? obj.get("a_materno").toString() : null);
                dto.setUsuarioCreacion(
                        obj.get("usuario_creacion") != null ? obj.get("usuario_creacion").toString() : null);
                datos.add(dto);
            }
            int totalRegistros = datos.isEmpty() ? 0
                    : (datos.get(0).getTotalRegistros() != null ? datos.get(0).getTotalRegistros() : 0);

            respuesta.setExito(true);
            respuesta.setMensaje("Consulta exitosa");
            respuesta.setDatos(datos);
            respuesta.setTotal(totalRegistros);
            respuesta.setPagina(page);
            respuesta.setTamano(pageSize);
        } catch (Exception e) {
            respuesta.setExito(false);
            respuesta.setMensaje("Error en la consulta: " + e.getMessage());
            respuesta.setDatos(java.util.Collections.emptyList());
            respuesta.setTotal(0);
            respuesta.setPagina(page != null ? page : 1);
            respuesta.setTamano(pageSize != null ? pageSize : 10);
        }
        return respuesta;

    }

    @Transactional
    public CatNombreAsentamiento guardarNombreAsentamiento(Integer idTipoAsentamiento, String clave,
            String descripcion) {
        CatNombreAsentamiento entidad = new CatNombreAsentamiento();
        entidad.setIdTipoAsentamiento(idTipoAsentamiento);
        entidad.setClave(clave);
        entidad.setDescripcion(descripcion);
        entidad.setFechaAlta(new Date());
        entidad.setIdUsuario(1); // Fijo como solicitaste
        entidad.setEstatus(false); // Por defecto
        return catNombreAsentamientoRepository.save(entidad);
    }

    @Transactional
    public CatNombreAsentamiento actualizarNombreAsentamiento(Integer id, Integer idTipoAsentamiento, String clave, String descripcion) {
        CatNombreAsentamiento entidad = catNombreAsentamientoRepository.findById(id).orElseThrow(() -> new RuntimeException("No encontrado"));
        if (idTipoAsentamiento != null) entidad.setIdTipoAsentamiento(idTipoAsentamiento);
        if (clave != null) entidad.setClave(clave);
        if (descripcion != null) entidad.setDescripcion(descripcion);
        return catNombreAsentamientoRepository.save(entidad);
    }

    @Transactional
    public CatNombreAsentamiento actualizarEstatusNombreAsentamiento(Integer id, Boolean estatus) {
        CatNombreAsentamiento entidad = catNombreAsentamientoRepository.findById(id).orElseThrow(() -> new RuntimeException("No encontrado"));
        entidad.setEstatus(estatus);
        return catNombreAsentamientoRepository.save(entidad);
    }

    
}