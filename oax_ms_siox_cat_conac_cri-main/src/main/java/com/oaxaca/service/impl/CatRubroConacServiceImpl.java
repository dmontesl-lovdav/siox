package com.oaxaca.service.impl;

import java.util.Date;
import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.oaxaca.entity.CatDatosCuentaConac;
import com.oaxaca.entity.CatGeneroConac;
import com.oaxaca.entity.CatGrupoConac;
import com.oaxaca.entity.CatRubroConac;
import com.oaxaca.repository.CatDatosCuentaConacRepository;
import com.oaxaca.repository.CatGeneroConacRepository;
import com.oaxaca.repository.CatGrupoConacRepository;
import com.oaxaca.repository.CatRubroConacRepository;
import com.oaxaca.service.ICatRubroConacService;
import com.oaxaca.util.VigenciaUtils;

@Service
public class CatRubroConacServiceImpl implements ICatRubroConacService {
        @Autowired
        private CatDatosCuentaConacRepository datosCuentaRepo;
        @Autowired
        private CatGeneroConacRepository generoRepo;
        @Autowired
        private CatGrupoConacRepository grupoRepo;
        @Autowired
        private CatRubroConacRepository rubroRepo;

        @Override
        public CatRubroConac insertarRubro(String clave, String descripcion, Integer ejercicio, Integer idGrupo,
                        Integer idGenero) {
                if (!VigenciaUtils.claveValida(clave)) {
                        throw new IllegalArgumentException(
                                        "La clave debe tener exactamente dos caracteres alfanuméricos (A-Z, 0-9)");
                }

                CatRubroConac rubro = rubroRepo.findByClaveAndEjercicio(clave, ejercicio);
                if (rubro != null) {
                        throw new IllegalArgumentException(
                                        "Ya existe un rubro con clave " + clave + " y ejercicio " + ejercicio);
                }
                CatGeneroConac generoExistente = generoRepo.findById(idGenero)
                                .orElseThrow(() -> new IllegalArgumentException(
                                                "No se encontró el género con id " + idGenero));
                CatGrupoConac grupo = grupoRepo.findById(idGrupo).orElseThrow(() -> new IllegalArgumentException(
                                "No se encontró el grupo con id " + idGrupo));

                String claveCompuesta = generoExistente.getClave() + "." + grupo.getClave() + "." + clave;
                Date fechaAlta = new Date();
                CatRubroConac rubroEntidad = new CatRubroConac(clave, descripcion,
                                claveCompuesta, idGrupo,
                                ejercicio, fechaAlta);
                Integer idRubro = rubroRepo.save(rubroEntidad).getId();

                CatDatosCuentaConac datosCuenta = new CatDatosCuentaConac(
                                null, // idNaturaleza
                                null, // idEstadoFinanciero
                                null, // idPosicion
                                null, // idEstructura
                                null, // idGenero
                                null, // idGrupo
                                idRubro, // idRubro
                                null, // idCuenta
                                null, // idSubCuenta
                                null, // inicioVigencia
                                null, // finVigencia
                                rubroEntidad.getEjercicio()); // ejercicio
                datosCuentaRepo.save(datosCuenta);
                return rubroEntidad;
        }

        @Override
        public CatRubroConac updateRubro(Integer id, String descripcion) {

                CatRubroConac rubroExistente = rubroRepo.findById(id)
                                .orElseThrow(() -> new IllegalArgumentException(
                                                "No se encontró el rubro con id " + id));
                rubroExistente.setDescripcion(descripcion);
                return rubroRepo.save(rubroExistente);
        }

        @Override
        public List<CatRubroConac> findAllByEjercicio(Integer ejercicio, Integer idGrupo) {
                return rubroRepo.findAllByEjercicioAndIdGrupo(ejercicio, idGrupo);
        }

}
