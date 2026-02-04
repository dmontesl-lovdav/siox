package com.oaxaca.service.impl;

import java.sql.Timestamp;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.oaxaca.dto.CatEstatusPolizaDTO;
import com.oaxaca.dto.CatEstatusPolizaUpdateDTO;
import com.oaxaca.dto.ConsultaRespuesta;
import com.oaxaca.entity.CatEstatusPoliza;
import com.oaxaca.repository.CatEstatusPolizaRepository;
import com.oaxaca.service.ICatEstatusPolizaService;

@Service
public class CatEstatusPolizaServiceImpl implements ICatEstatusPolizaService {

    @Autowired
    private CatEstatusPolizaRepository catEstatusPolizaRepository;

    @Override
    public List<CatEstatusPolizaDTO> consultarCatEstatusPoliza(Integer page, Integer pageSize, String sort,
            String clave, String estatus, Boolean activo, Boolean bloqueo) {
        List<Object[]> results = catEstatusPolizaRepository.findCatEstatusPoliza(page, pageSize, sort, clave, estatus,
                activo, bloqueo);
        List<CatEstatusPolizaDTO> dtoList = new ArrayList<>();

        for (Object[] row : results) {
            CatEstatusPolizaDTO dto = new CatEstatusPolizaDTO();
            dto.setTotalRegistros((Integer) row[0]);
            dto.setId((Integer) row[1]);
            dto.setClave((String) row[2]);
            dto.setEstatus((String) row[3]);
            dto.setBloqueo((Boolean) row[4]);
            dto.setIdUsuarioCreacion((Integer) row[5]);
            dto.setFechaAlta(row[6] != null ? ((Timestamp) row[6]).toLocalDateTime() : null);
            dto.setIdUsuarioModificacion((Integer) row[7]);
            dto.setFechaModificacion(row[8] != null ? ((Timestamp) row[8]).toLocalDateTime() : null);
            dto.setIdUsuarioBaja((Integer) row[9]);
            dto.setFechaBaja(row[10] != null ? ((Timestamp) row[10]).toLocalDateTime() : null);
            dto.setActivo((Boolean) row[11]);
            dtoList.add(dto);
        }

        return dtoList;
    }

    @Override
    public ConsultaRespuesta<String> crearCatEstatusPoliza(CatEstatusPolizaUpdateDTO dto) {
        ConsultaRespuesta<String> r = new ConsultaRespuesta<>();
        try {
            if (dto.getClave() == null || dto.getClave().trim().isEmpty()) {
                r.setExito(false);
                r.setMensaje("La clave es obligatoria");
                return r;
            }
            if (dto.getClave().trim().length() != 1) {
                r.setExito(false);
                r.setMensaje("La clave debe tener exactamente 1 carácter");
                return r;
            }
            if (dto.getEstatus() == null || dto.getEstatus().trim().isEmpty()) {
                r.setExito(false);
                r.setMensaje("El estatus es obligatorio");
                return r;
            }
            if (dto.getEstatus().trim().length() < 5 || dto.getEstatus().trim().length() > 250) {
                r.setExito(false);
                r.setMensaje("El estatus debe tener entre 5 y 250 caracteres");
                return r;
            }
            if (dto.getIdUsuarioModificacion() == null) {
                r.setExito(false);
                r.setMensaje("El usuario de creación es requerido");
                return r;
            }

            CatEstatusPoliza entity = new CatEstatusPoliza();
            entity.setClave(dto.getClave().trim());
            entity.setEstatus(dto.getEstatus().trim());
            entity.setBloqueo(false);
            entity.setIdUsuarioCreacion(dto.getIdUsuarioModificacion());
            entity.setFechaAlta(LocalDateTime.now());
            entity.setActivo(true);

            catEstatusPolizaRepository.save(entity);

            r.setExito(true);
            r.setMensaje("Estatus de póliza creado exitosamente");
            r.setDatos("Clave: " + dto.getClave());

        } catch (Exception e) {
            r.setExito(false);
            r.setMensaje("Error al crear estatus de póliza: " + e.getMessage());
        }
        return r;
    }

    @Override
    public ConsultaRespuesta<String> actualizarCatEstatusPoliza(Integer id, CatEstatusPolizaUpdateDTO updateDTO) {
        ConsultaRespuesta<String> r = new ConsultaRespuesta<>();
        try {
            if (updateDTO.getEstatus() == null || updateDTO.getEstatus().trim().isEmpty()) {
                r.setExito(false);
                r.setMensaje("El estatus es obligatorio");
                return r;
            }
            if (updateDTO.getEstatus().trim().length() < 5 || updateDTO.getEstatus().trim().length() > 250) {
                r.setExito(false);
                r.setMensaje("El estatus debe tener entre 5 y 250 caracteres");
                return r;
            }
            if (updateDTO.getIdUsuarioModificacion() == null) {
                r.setExito(false);
                r.setMensaje("El usuario de modificación es requerido");
                return r;
            }

            CatEstatusPoliza entity = catEstatusPolizaRepository.findById(id)
                    .orElse(null);

            if (entity == null) {
                r.setExito(false);
                r.setMensaje("No se encontró el estatus de póliza con ID: " + updateDTO.getId());
                return r;
            }

            if (entity.getBloqueo() != null && entity.getBloqueo()) {
                r.setExito(false);
                r.setMensaje(
                        "No se puede modificar un estatus de póliza bloqueado (asociado a póliza con afectación contable)");
                return r;
            }

            entity.setEstatus(updateDTO.getEstatus().trim());
            entity.setIdUsuarioModificacion(updateDTO.getIdUsuarioModificacion());
            entity.setFechaModificacion(LocalDateTime.now());

            catEstatusPolizaRepository.save(entity);

            r.setExito(true);
            r.setMensaje("Estatus de póliza actualizado exitosamente");
            r.setDatos("ID: " + updateDTO.getId());

        } catch (Exception e) {
            r.setExito(false);
            r.setMensaje("Error al actualizar estatus de póliza: " + e.getMessage());
        }
        return r;
    }

    @Override
    public ConsultaRespuesta<String> eliminarCatEstatusPoliza(Integer id, Integer idUsuarioBaja) {
        ConsultaRespuesta<String> r = new ConsultaRespuesta<>();
        try {
            if (idUsuarioBaja == null) {
                r.setExito(false);
                r.setMensaje("El usuario de baja es requerido");
                return r;
            }

            CatEstatusPoliza entity = catEstatusPolizaRepository.findById(id)
                    .orElse(null);

            if (entity == null) {
                r.setExito(false);
                r.setMensaje("No se encontró el estatus de póliza con ID: " + id);
                return r;
            }

            if (entity.getBloqueo() != null && entity.getBloqueo()) {
                r.setExito(false);
                r.setMensaje(
                        "No se puede eliminar un estatus de póliza bloqueado (asociado a póliza con afectación contable)");
                return r;
            }

            entity.setActivo(false);
            entity.setIdUsuarioBaja(idUsuarioBaja);
            entity.setFechaBaja(LocalDateTime.now());

            catEstatusPolizaRepository.save(entity);

            r.setExito(true);
            r.setMensaje("Estatus de póliza eliminado exitosamente");
            r.setDatos("ID: " + id);

        } catch (Exception e) {
            r.setExito(false);
            r.setMensaje("Error al eliminar estatus de póliza: " + e.getMessage());
        }
        return r;
    }
}
