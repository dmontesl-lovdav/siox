package com.oaxaca.service.impl;

import java.util.Date;
import java.util.List;
import java.util.Optional;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.oaxaca.entity.CatDatosCuentaConac;
import com.oaxaca.entity.CatGeneroConac;
import com.oaxaca.entity.CatGrupoConac;
import com.oaxaca.repository.CatDatosCuentaConacRepository;
import com.oaxaca.repository.CatGeneroConacRepository;
import com.oaxaca.repository.CatGrupoConacRepository;
import com.oaxaca.service.ICatGrupoConacService;
import com.oaxaca.util.VigenciaUtils;

@Service
public class CatGrupoConacServiceImpl implements ICatGrupoConacService {
    @Autowired
    private CatGrupoConacRepository grupoRepo;
    @Autowired
    private CatGeneroConacRepository generoRepository;
    @Autowired
    private CatDatosCuentaConacRepository datosCuentaRepo;

    @Override
    public CatGrupoConac insertarGrupo(String clave, String descripcion, Integer ejercicio, Integer idGenero) {
        if (!VigenciaUtils.claveValida(clave)) {
            throw new IllegalArgumentException(
                    "La clave debe tener exactamente dos caracteres alfanuméricos (A-Z, 0-9)");
        }
        CatGrupoConac grupoExistente = grupoRepo.findByClaveAndEjercicio(clave, ejercicio);
        if (grupoExistente != null) {
            throw new IllegalArgumentException(
                    "El grupo con clave " + clave + " ya existe para el ejercicio " + ejercicio);
        }
        CatGeneroConac generoExistente = generoRepository.findById(idGenero)
                .orElseThrow(() -> new IllegalArgumentException(
                        "No se encontró el género con id " + idGenero));
        String claveCompuesta = generoExistente.getClave() + "." + clave;
        Date fechaAlta = new Date();
        CatGrupoConac grupoEntidad = new CatGrupoConac(clave,
                descripcion, claveCompuesta, idGenero, ejercicio, fechaAlta);

        Integer idGrupo = grupoRepo.save(grupoEntidad).getId();
        CatDatosCuentaConac datosCuenta = new CatDatosCuentaConac(
                null, // idNaturaleza
                null, // idEstadoFinanciero
                null, // idPosicion
                null, // idEstructura
                null, // idGenero
                idGrupo, // idGrupo
                null, // idRubro
                null, // idCuenta
                null, // idSubCuenta
                null, // inicioVigencia
                null, // finVigencia
                grupoEntidad.getEjercicio()); // ejercicio
        datosCuentaRepo.save(datosCuenta);
        return grupoEntidad;
    }

    @Override
    public CatGrupoConac updateGrupo(Integer id, String descripcion) {
        Optional<CatGrupoConac> grupoExistente = grupoRepo.findById(id);
        if (grupoExistente.isPresent()) {
            CatGrupoConac grupo = grupoExistente.get();
            grupo.setDescripcion(descripcion);
            return grupoRepo.save(grupo);
        }
        throw new IllegalArgumentException("No se encontró el grupo con id " + id);
    }

    @Override
    public List<CatGrupoConac> findAllByEjercicio(Integer ejercicio, Integer idGenero) {
        return grupoRepo.findAllByEjercicioAndIdgenero(ejercicio, idGenero);
    }

}
