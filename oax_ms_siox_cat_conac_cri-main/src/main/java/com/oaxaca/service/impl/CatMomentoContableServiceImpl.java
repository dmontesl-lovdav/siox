package com.oaxaca.service.impl;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;
import java.util.Optional;

import javax.transaction.Transactional;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.oaxaca.dto.CatMomentoContableDTO;
import com.oaxaca.dto.CatMomentoContableUpdateDTO;
import com.oaxaca.dto.ConsultaRespuesta;
import com.oaxaca.entity.CatMomentoContable;
import com.oaxaca.repository.CatMomentoContableRepository;
import com.oaxaca.service.ICatMomentoContableService;

@Service
public class CatMomentoContableServiceImpl implements ICatMomentoContableService {

    @Autowired
    private CatMomentoContableRepository repository;

    @Override
    public ConsultaRespuesta<List<CatMomentoContableDTO>> getCatMomentoContable(
            Integer page,
            Integer pageSize,
            String sort,
            String clave,
            String momentoContable,
            Integer tipoPolizaId,
            Boolean esPresupuestal,
            Boolean activo
    ) {
        try {
            if (page == null || page < 1) page = 1;
            if (pageSize == null || pageSize < 1) pageSize = 10;
            if (sort == null || sort.trim().isEmpty()) sort = "id ASC";

            List<Object[]> resultados = repository.getCatMomentoContable(
                    page, pageSize, sort, clave, momentoContable, tipoPolizaId, esPresupuestal, activo
            );

            List<CatMomentoContableDTO> datos = new ArrayList<>();
            Integer totalRegistros = 0;

            for (Object[] row : resultados) {
                CatMomentoContableDTO dto = new CatMomentoContableDTO();

                // 0 total_registros
                if (row[0] != null) {
                    totalRegistros = ((Number) row[0]).intValue();
                    dto.setTotalRegistros(totalRegistros);
                }

                // 1 id
                if (row[1] != null) dto.setId(((Number) row[1]).intValue());

                // 2 clave
                if (row[2] != null) dto.setClave(row[2].toString().trim());

                // 3 momento_contable
                if (row[3] != null) dto.setMomentoContable(row[3].toString().trim());

                // 4 tipo_poliza_id
                if (row[4] != null) dto.setTipoPolizaId(((Number) row[4]).intValue());

                // 5 es_presupuestal
                if (row[5] != null) dto.setEsPresupuestal((Boolean) row[5]);

                // 6 id_usuario_creacion
                if (row[6] != null) dto.setIdUsuarioCreacion(((Number) row[6]).intValue());

                // 7 fecha_alta
                if (row[7] != null) dto.setFechaAlta(((java.sql.Timestamp) row[7]).toLocalDateTime());

                // 8 id_usuario_modificacion
                if (row[8] != null) dto.setIdUsuarioModificacion(((Number) row[8]).intValue());

                // 9 fecha_modificacion
                if (row[9] != null) dto.setFechaModificacion(((java.sql.Timestamp) row[9]).toLocalDateTime());

                // 10 id_usuario_baja
                if (row[10] != null) dto.setIdUsuarioBaja(((Number) row[10]).intValue());

                // 11 fecha_baja
                if (row[11] != null) dto.setFechaBaja(((java.sql.Timestamp) row[11]).toLocalDateTime());

                // 12 activo
                if (row[12] != null) dto.setActivo((Boolean) row[12]);

                datos.add(dto);
            }

            ConsultaRespuesta<List<CatMomentoContableDTO>> respuesta = new ConsultaRespuesta<>();
            respuesta.setExito(true);
            respuesta.setMensaje("Consulta exitosa");
            respuesta.setDatos(datos);
            respuesta.setTotal(totalRegistros);
            respuesta.setPagina(page);
            respuesta.setTamano(pageSize);

            return respuesta;

        } catch (Exception e) {
            ConsultaRespuesta<List<CatMomentoContableDTO>> r = new ConsultaRespuesta<>();
            r.setExito(false);
            r.setMensaje("Error al consultar Momento Contable: " + e.getMessage());
            r.setDatos(new ArrayList<>());
            r.setTotal(0);
            r.setPagina(page != null ? page : 1);
            r.setTamano(pageSize != null ? pageSize : 10);
            return r;
        }
    }

    @Override
    @Transactional
    public ConsultaRespuesta<String> createMomentoContable(CatMomentoContableUpdateDTO dto) {
        ConsultaRespuesta<String> r = new ConsultaRespuesta<>();
        try {
            // clave máx 1 caracter :contentReference[oaicite:11]{index=11}
            if (dto.getClave() == null || dto.getClave().trim().isEmpty()) {
                r.setExito(false); r.setMensaje("La clave es requerida"); return r;
            }
            if (dto.getClave().trim().length() > 1) {
                r.setExito(false); r.setMensaje("La clave no puede exceder 1 caracter"); return r;
            }

            // momento_contable min 5, max 250 :contentReference[oaicite:12]{index=12}
            if (dto.getMomentoContable() == null || dto.getMomentoContable().trim().isEmpty()) {
                r.setExito(false); r.setMensaje("El momento contable es requerido"); return r;
            }
            String mc = dto.getMomentoContable().trim();
            if (mc.length() < 5) { r.setExito(false); r.setMensaje("El momento contable debe tener mínimo 5 caracteres"); return r; }
            if (mc.length() > 250) { r.setExito(false); r.setMensaje("El momento contable no puede exceder 250 caracteres"); return r; }

            if (dto.getTipoPolizaId() == null) { r.setExito(false); r.setMensaje("El tipo de póliza es requerido"); return r; }

            if (dto.getIdUsuarioCreacion() == null) {
                r.setExito(false); r.setMensaje("El usuario de creación es requerido"); return r;
            }

            // Unicidad (no duplicados) - doc lo pide a nivel de negocio
            if (repository.existsByClave(dto.getClave().trim())) {
                r.setExito(false); r.setMensaje("Ya existe un registro con la clave: " + dto.getClave()); return r;
            }
            if (repository.existsByMomentoContable(mc)) {
                r.setExito(false); r.setMensaje("Ya existe un registro con el momento contable: " + mc); return r;
            }

            CatMomentoContable entity = new CatMomentoContable();
            entity.setClave(dto.getClave().trim().toUpperCase());
            entity.setMomentoContable(mc.toUpperCase());
            entity.setTipoPolizaId(dto.getTipoPolizaId());
            entity.setEsPresupuestal(dto.getEsPresupuestal() != null ? dto.getEsPresupuestal() : Boolean.FALSE);
            entity.setIdUsuarioCreacion(dto.getIdUsuarioCreacion());
            entity.setFechaAlta(LocalDateTime.now());
            entity.setActivo(true);

            repository.save(entity);

            r.setExito(true);
            r.setMensaje("Momento contable creado exitosamente");
            r.setDatos("Clave: " + dto.getClave());

        } catch (Exception e) {
            r.setExito(false);
            r.setMensaje("Error al crear Momento contable: " + e.getMessage());
        }
        return r;
    }

    @Override
    @Transactional
    public ConsultaRespuesta<String> updateMomentoContable(Integer id, CatMomentoContableUpdateDTO dto) {
        ConsultaRespuesta<String> r = new ConsultaRespuesta<>();
        try {
            Optional<CatMomentoContable> existente = repository.findById(id);
            if (!existente.isPresent()) {
                r.setExito(false); r.setMensaje("No se encontró el registro con ID: " + id); return r;
            }

            if (dto.getClave() == null || dto.getClave().trim().isEmpty()) {
                r.setExito(false); r.setMensaje("La clave es requerida"); return r;
            }
            if (dto.getClave().trim().length() > 1) {
                r.setExito(false); r.setMensaje("La clave no puede exceder 1 caracter"); return r;
            }

            if (dto.getMomentoContable() == null || dto.getMomentoContable().trim().isEmpty()) {
                r.setExito(false); r.setMensaje("El momento contable es requerido"); return r;
            }
            String mc = dto.getMomentoContable().trim();
            if (mc.length() < 5) { r.setExito(false); r.setMensaje("El momento contable debe tener mínimo 5 caracteres"); return r; }
            if (mc.length() > 250) { r.setExito(false); r.setMensaje("El momento contable no puede exceder 250 caracteres"); return r; }

            if (dto.getIdUsuarioModificacion() == null) {
                r.setExito(false); r.setMensaje("El usuario de modificación es requerido"); return r;
            }

            if (repository.existsByClaveAndIdNot(dto.getClave().trim(), id)) {
                r.setExito(false); r.setMensaje("Ya existe un registro con la clave: " + dto.getClave()); return r;
            }
            if (repository.existsByMomentoContableAndIdNot(mc, id)) {
                r.setExito(false); r.setMensaje("Ya existe un registro con el momento contable: " + mc); return r;
            }

            CatMomentoContable entity = existente.get();
            entity.setClave(dto.getClave().trim().toUpperCase());
            entity.setMomentoContable(mc.toUpperCase());
            if (dto.getTipoPolizaId() != null) {
                entity.setTipoPolizaId(dto.getTipoPolizaId());
            }
            entity.setEsPresupuestal(dto.getEsPresupuestal() != null ? dto.getEsPresupuestal() : Boolean.FALSE);
            entity.setIdUsuarioModificacion(dto.getIdUsuarioModificacion());

            repository.save(entity);

            r.setExito(true);
            r.setMensaje("Momento contable actualizado exitosamente");
            r.setDatos("ID: " + id);

        } catch (Exception e) {
            r.setExito(false);
            r.setMensaje("Error al actualizar Momento contable: " + e.getMessage());
        }
        return r;
    }

    @Override
    @Transactional
    public ConsultaRespuesta<String> deleteMomentoContable(Integer id, Integer idUsuarioBaja) {
        ConsultaRespuesta<String> r = new ConsultaRespuesta<>();
        try {
            if (idUsuarioBaja == null) {
                r.setExito(false); r.setMensaje("El usuario de baja es requerido"); return r;
            }

            Optional<CatMomentoContable> existente = repository.findById(id);
            if (!existente.isPresent()) {
                r.setExito(false); r.setMensaje("No se encontró el registro con ID: " + id); return r;
            }

            CatMomentoContable entity = existente.get();
            entity.setActivo(false);
            entity.setIdUsuarioBaja(idUsuarioBaja);
            entity.setIdUsuarioModificacion(idUsuarioBaja);

            repository.save(entity);

            r.setExito(true);
            r.setMensaje("Momento contable eliminado exitosamente");
            r.setDatos("ID: " + id);

        } catch (Exception e) {
            r.setExito(false);
            r.setMensaje("Error al eliminar Momento contable: " + e.getMessage());
        }
        return r;
    }
}
