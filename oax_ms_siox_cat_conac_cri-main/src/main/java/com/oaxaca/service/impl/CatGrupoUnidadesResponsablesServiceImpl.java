package com.oaxaca.service.impl;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;
import java.util.Optional;

import javax.transaction.Transactional;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.oaxaca.dto.CatGrupoUnidadesResponsablesDTO;
import com.oaxaca.dto.CatGrupoUnidadesResponsablesUpdateDTO;
import com.oaxaca.dto.ConsultaRespuesta;
import com.oaxaca.entity.CatGrupoUnidadesResponsables;
import com.oaxaca.repository.CatGrupoUnidadesResponsablesRepository;
import com.oaxaca.service.ICatGrupoUnidadesResponsablesService;

@Service
public class CatGrupoUnidadesResponsablesServiceImpl implements ICatGrupoUnidadesResponsablesService {

    @Autowired
    private CatGrupoUnidadesResponsablesRepository repository;

    @Override
    public ConsultaRespuesta<List<CatGrupoUnidadesResponsablesDTO>> getCatGrupoUnidadesResponsables(
            Integer page, Integer pageSize, String sort, String clave, String grupoUnidadResponsable, Boolean activo) {

        try {
            if (page == null || page < 1) page = 1;
            if (pageSize == null || pageSize < 1) pageSize = 10;
            if (sort == null || sort.trim().isEmpty()) sort = "clave DESC";

            List<Object[]> resultados = repository.getCatGrupoUnidadesResponsables(
                    page, pageSize, sort, clave, grupoUnidadResponsable, activo
            );

            List<CatGrupoUnidadesResponsablesDTO> datos = new ArrayList<>();
            Integer totalRegistros = 0;

            for (Object[] row : resultados) {
                CatGrupoUnidadesResponsablesDTO d = new CatGrupoUnidadesResponsablesDTO();

                if (row[0] != null) {
                    totalRegistros = ((Number) row[0]).intValue();
                    d.setTotalRegistros(totalRegistros);
                }
                if (row[1] != null) d.setId(((Number) row[1]).intValue());
                if (row[2] != null) d.setClave(row[2].toString().trim());
                if (row[3] != null) d.setGrupoUnidadResponsable(row[3].toString().trim());
                if (row[4] != null) d.setIdUsuarioCreacion(((Number) row[4]).intValue());
                if (row[5] != null) d.setFechaAlta(((java.sql.Timestamp) row[5]).toLocalDateTime());
                if (row[6] != null) d.setIdUsuarioModificacion(((Number) row[6]).intValue());
                if (row[7] != null) d.setFechaModificacion(((java.sql.Timestamp) row[7]).toLocalDateTime());
                if (row[8] != null) d.setIdUsuarioBaja(((Number) row[8]).intValue());
                if (row[9] != null) d.setFechaBaja(((java.sql.Timestamp) row[9]).toLocalDateTime());
                if (row[10] != null) d.setActivo((Boolean) row[10]);

                datos.add(d);
            }

            ConsultaRespuesta<List<CatGrupoUnidadesResponsablesDTO>> resp = new ConsultaRespuesta<>();
            resp.setExito(true);
            resp.setMensaje("Consulta exitosa");
            resp.setDatos(datos);
            resp.setTotal(totalRegistros);
            resp.setPagina(page);
            resp.setTamano(pageSize);
            return resp;

        } catch (Exception e) {
            ConsultaRespuesta<List<CatGrupoUnidadesResponsablesDTO>> resp = new ConsultaRespuesta<>();
            resp.setExito(false);
            resp.setMensaje("Error al consultar GUR: " + e.getMessage());
            resp.setDatos(new ArrayList<>());
            resp.setTotal(0);
            resp.setPagina(page != null ? page : 1);
            resp.setTamano(pageSize != null ? pageSize : 10);
            return resp;
        }
    }

    @Override
    @Transactional
    public ConsultaRespuesta<String> createGur(CatGrupoUnidadesResponsablesUpdateDTO dto) {
        ConsultaRespuesta<String> resp = new ConsultaRespuesta<>();
        try {
            // CLAVE máx 1 y solo números :contentReference[oaicite:13]{index=13}
            if (dto.getClave() == null || dto.getClave().trim().isEmpty()) {
                resp.setExito(false); resp.setMensaje("La clave es requerida"); return resp;
            }
            String clave = dto.getClave().trim();
            if (clave.length() > 1) {
                resp.setExito(false); resp.setMensaje("La clave no puede exceder 1 caracter"); return resp;
            }
            if (!clave.matches("\\d+")) {
                resp.setExito(false); resp.setMensaje("La clave solo permite números"); return resp;
            }

            // Grupo min 1, max 40 :contentReference[oaicite:14]{index=14}
            if (dto.getGrupoUnidadResponsable() == null || dto.getGrupoUnidadResponsable().trim().isEmpty()) {
                resp.setExito(false); resp.setMensaje("El grupo de unidad responsable es requerido"); return resp;
            }
            String grupo = dto.getGrupoUnidadResponsable().trim();
            if (grupo.length() > 40) {
                resp.setExito(false); resp.setMensaje("El grupo de unidad responsable no puede exceder 40 caracteres"); return resp;
            }

            if (dto.getIdUsuarioCreacion() == null) {
                resp.setExito(false); resp.setMensaje("El usuario de creación es requerido"); return resp;
            }

            // Duplicado de clave
            if (repository.existsByClaveActiva(clave)) {
                resp.setExito(false); resp.setMensaje("La clave ingresada ya existe"); return resp;
            }

            CatGrupoUnidadesResponsables entity = new CatGrupoUnidadesResponsables();
            entity.setClave(clave);
            entity.setGrupoUnidadResponsable(grupo);
            entity.setIdUsuarioCreacion(dto.getIdUsuarioCreacion());
            entity.setFechaAlta(LocalDateTime.now());
            entity.setActivo(true);

            repository.save(entity);

            resp.setExito(true);
            resp.setMensaje("Registro creado exitosamente");
            resp.setDatos("Clave: " + clave);
            return resp;

        } catch (Exception e) {
            System.out.println(e.getMessage());
            resp.setExito(false);
            resp.setMensaje("Error al crear GUR: " + e.getMessage());
            return resp;
        }
    }

    @Override
    @Transactional
    public ConsultaRespuesta<String> updateGur(Integer id, CatGrupoUnidadesResponsablesUpdateDTO dto) {
        ConsultaRespuesta<String> resp = new ConsultaRespuesta<>();
        try {
            Optional<CatGrupoUnidadesResponsables> existente = repository.findById(id);
            if (!existente.isPresent() || Boolean.FALSE.equals(existente.get().getActivo())) {
                resp.setExito(false); resp.setMensaje("No se encontró el registro con ID: " + id); return resp;
            }

            if (dto.getClave() == null || dto.getClave().trim().isEmpty()) {
                resp.setExito(false); resp.setMensaje("La clave es requerida"); return resp;
            }
            String clave = dto.getClave().trim();
            if (clave.length() > 1) { resp.setExito(false); resp.setMensaje("La clave no puede exceder 1 caracter"); return resp; }
            if (!clave.matches("\\d+")) { resp.setExito(false); resp.setMensaje("La clave solo permite números"); return resp; }

            if (dto.getGrupoUnidadResponsable() == null || dto.getGrupoUnidadResponsable().trim().isEmpty()) {
                resp.setExito(false); resp.setMensaje("El grupo de unidad responsable es requerido"); return resp;
            }
            String grupo = dto.getGrupoUnidadResponsable().trim();
            if (grupo.length() > 40) { resp.setExito(false); resp.setMensaje("El grupo de unidad responsable no puede exceder 40 caracteres"); return resp; }

            if (dto.getIdUsuarioModificacion() == null) {
                resp.setExito(false); resp.setMensaje("El usuario de modificación es requerido"); return resp;
            }

            if (repository.existsByClaveActivaAndIdNot(clave, id)) {
                resp.setExito(false); resp.setMensaje("La clave ingresada ya existe"); return resp;
            }

            CatGrupoUnidadesResponsables entity = existente.get();
            entity.setClave(clave);
            entity.setGrupoUnidadResponsable(grupo);
            entity.setIdUsuarioModificacion(dto.getIdUsuarioModificacion());

            repository.save(entity);

            resp.setExito(true);
            resp.setMensaje("Registro actualizado correctamente");
            resp.setDatos("ID actualizado: " + id);
            return resp;

        } catch (Exception e) {
            resp.setExito(false);
            resp.setMensaje("Error al actualizar GUR: " + e.getMessage());
            return resp;
        }
    }

    @Override
    @Transactional
    public ConsultaRespuesta<String> deleteGur(Integer id, Integer idUsuarioBaja) {
        ConsultaRespuesta<String> resp = new ConsultaRespuesta<>();
        try {
            Optional<CatGrupoUnidadesResponsables> existente = repository.findById(id);
            if (!existente.isPresent() || Boolean.FALSE.equals(existente.get().getActivo())) {
                resp.setExito(false); resp.setMensaje("No se encontró el registro con ID: " + id); return resp;
            }

            if (idUsuarioBaja == null) {
                resp.setExito(false); resp.setMensaje("El usuario de baja es requerido"); return resp;
            }

            // Borrado lógico (no físico)
            CatGrupoUnidadesResponsables entity = existente.get();
            entity.setActivo(false);
            entity.setIdUsuarioBaja(idUsuarioBaja);

            repository.save(entity);

            resp.setExito(true);
            resp.setMensaje("Registro eliminado correctamente (borrado lógico)");
            resp.setDatos("ID eliminado: " + id);
            return resp;

        } catch (Exception e) {
            resp.setExito(false);
            resp.setMensaje("Error al eliminar GUR: " + e.getMessage());
            return resp;
        }
    }
}
