package com.oaxaca.service;

import com.oaxaca.dto.CatTipoPolizaDTO;
import com.oaxaca.dto.CatTipoPolizaUpdateDTO;
import com.oaxaca.dto.ConsultaRespuesta;
import com.oaxaca.entity.CatTipoPoliza;
import com.oaxaca.repository.CatTipoPolizaRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.sql.Timestamp;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

@Service
public class CatTipoPolizaServiceImpl implements ICatTipoPolizaService {

    @Autowired
    private CatTipoPolizaRepository catTipoPolizaRepository;

    @Override
    public List<CatTipoPolizaDTO> consultarCatTipoPoliza(Integer page, Integer pageSize, String sort, String clave, String tipo, Boolean activo) {
        List<Object[]> results = catTipoPolizaRepository.findCatTipoPoliza(page, pageSize, sort, clave, tipo, activo);
        List<CatTipoPolizaDTO> dtoList = new ArrayList<>();

        for (Object[] row : results) {
            CatTipoPolizaDTO dto = new CatTipoPolizaDTO();
            dto.setTotalRegistros((Integer) row[0]);
            dto.setId((Integer) row[1]);
            dto.setClave((String) row[2]);
            dto.setTipo((String) row[3]);
            dto.setIdUsuarioCreacion((Integer) row[4]);
            dto.setFechaAlta(row[5] != null ? ((Timestamp) row[5]).toLocalDateTime() : null);
            dto.setIdUsuarioModificacion((Integer) row[6]);
            dto.setFechaModificacion(row[7] != null ? ((Timestamp) row[7]).toLocalDateTime() : null);
            dto.setIdUsuarioBaja((Integer) row[8]);
            dto.setFechaBaja(row[9] != null ? ((Timestamp) row[9]).toLocalDateTime() : null);
            dto.setActivo((Boolean) row[10]);
            dtoList.add(dto);
        }

        return dtoList;
    }

    @Override
    public ConsultaRespuesta<String> crearCatTipoPoliza(CatTipoPolizaUpdateDTO dto) {
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
            if (dto.getTipo() == null || dto.getTipo().trim().isEmpty()) {
                r.setExito(false);
                r.setMensaje("El tipo es obligatorio");
                return r;
            }
            if (dto.getTipo().trim().length() > 250) {
                r.setExito(false);
                r.setMensaje("El tipo no puede exceder 250 caracteres");
                return r;
            }
            if (dto.getIdUsuarioCreacion() == null) {
                r.setExito(false);
                r.setMensaje("El usuario de creación es requerido");
                return r;
            }

            CatTipoPoliza entity = new CatTipoPoliza();
            entity.setClave(dto.getClave().trim());
            entity.setTipo(dto.getTipo().trim());
            entity.setIdUsuarioCreacion(dto.getIdUsuarioCreacion());
            entity.setFechaAlta(LocalDateTime.now());
            entity.setActivo(true);

            catTipoPolizaRepository.save(entity);

            r.setExito(true);
            r.setMensaje("Tipo de póliza creado exitosamente");
            r.setDatos("Clave: " + dto.getClave());

        } catch (Exception e) {
            r.setExito(false);
            r.setMensaje("Error al crear tipo de póliza: " + e.getMessage());
        }
        return r;
    }

    @Override
    public ConsultaRespuesta<String> actualizarCatTipoPoliza(CatTipoPolizaUpdateDTO updateDTO) {
        ConsultaRespuesta<String> r = new ConsultaRespuesta<>();
        try {
            if (updateDTO.getTipo() == null || updateDTO.getTipo().trim().isEmpty()) {
                r.setExito(false);
                r.setMensaje("El tipo es obligatorio");
                return r;
            }
            if (updateDTO.getTipo().trim().length() > 250) {
                r.setExito(false);
                r.setMensaje("El tipo no puede exceder 250 caracteres");
                return r;
            }
            if (updateDTO.getIdUsuarioModificacion() == null) {
                r.setExito(false);
                r.setMensaje("El usuario de modificación es requerido");
                return r;
            }

            CatTipoPoliza entity = catTipoPolizaRepository.findById(updateDTO.getId())
                    .orElse(null);

            if (entity == null) {
                r.setExito(false);
                r.setMensaje("No se encontró el tipo de póliza con ID: " + updateDTO.getId());
                return r;
            }

            entity.setTipo(updateDTO.getTipo().trim());
            entity.setIdUsuarioModificacion(updateDTO.getIdUsuarioModificacion());
            entity.setFechaModificacion(LocalDateTime.now());

            catTipoPolizaRepository.save(entity);

            r.setExito(true);
            r.setMensaje("Tipo de póliza actualizado exitosamente");
            r.setDatos("ID: " + updateDTO.getId());

        } catch (Exception e) {
            r.setExito(false);
            r.setMensaje("Error al actualizar tipo de póliza: " + e.getMessage());
        }
        return r;
    }

    @Override
    public ConsultaRespuesta<String> eliminarCatTipoPoliza(Integer id, Integer idUsuarioBaja) {
        ConsultaRespuesta<String> r = new ConsultaRespuesta<>();
        try {
            if (idUsuarioBaja == null) {
                r.setExito(false);
                r.setMensaje("El usuario de baja es requerido");
                return r;
            }

            CatTipoPoliza entity = catTipoPolizaRepository.findById(id)
                    .orElse(null);

            if (entity == null) {
                r.setExito(false);
                r.setMensaje("No se encontró el tipo de póliza con ID: " + id);
                return r;
            }

            entity.setActivo(false);
            entity.setIdUsuarioBaja(idUsuarioBaja);
            entity.setFechaBaja(LocalDateTime.now());

            catTipoPolizaRepository.save(entity);

            r.setExito(true);
            r.setMensaje("Tipo de póliza eliminado exitosamente");
            r.setDatos("ID: " + id);

        } catch (Exception e) {
            r.setExito(false);
            r.setMensaje("Error al eliminar tipo de póliza: " + e.getMessage());
        }
        return r;
    }
}
