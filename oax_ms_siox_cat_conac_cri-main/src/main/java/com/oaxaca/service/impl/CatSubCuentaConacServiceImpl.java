package com.oaxaca.service.impl;

import java.util.Date;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.oaxaca.entity.CatCuentaConac;
import com.oaxaca.entity.CatDatosCuentaConac;
import com.oaxaca.entity.CatGeneroConac;
import com.oaxaca.entity.CatGrupoConac;
import com.oaxaca.entity.CatRubroConac;
import com.oaxaca.entity.CatSubCuentaConac;
import com.oaxaca.repository.CatCuentaConacRepository;
import com.oaxaca.repository.CatDatosCuentaConacRepository;
import com.oaxaca.repository.CatGeneroConacRepository;
import com.oaxaca.repository.CatGrupoConacRepository;
import com.oaxaca.repository.CatRubroConacRepository;
import com.oaxaca.repository.CatSubCuentaConacRepository;
import com.oaxaca.service.ICatSubCuentaConacService;
import com.oaxaca.util.VigenciaUtils;

@Service
public class CatSubCuentaConacServiceImpl implements ICatSubCuentaConacService {
        @Autowired
        private CatDatosCuentaConacRepository datosCuentaRepo;
        @Autowired
        private CatCuentaConacRepository cuentaRepo;
        @Autowired
        private CatGeneroConacRepository generoRepo;
        @Autowired
        private CatGrupoConacRepository grupoRepo;
        @Autowired
        private CatRubroConacRepository rubroRepo;
        @Autowired
        private CatSubCuentaConacRepository subCuentaRepo;

        @Override
        public CatSubCuentaConac insertarSubcuenta(String clave, String descripcion, Integer ejercicio,
                        Integer idGenero,
                        Integer idGrupo, Integer idRubro, Integer idCuenta) {
                if (!VigenciaUtils.claveValida(clave)) {
                        throw new IllegalArgumentException(
                                        "La clave debe tener exactamente dos caracteres alfanuméricos (A-Z, 0-9)");
                }
                CatSubCuentaConac subCuentaConac = subCuentaRepo.findByClaveAndEjercicio(clave, ejercicio);
                if (subCuentaConac != null) {
                        throw new IllegalArgumentException(
                                        "La subcuenta con clave " + clave + " ya existe para el ejercicio "
                                                        + ejercicio);
                }
                CatGeneroConac generoExistente = generoRepo.findById(idGenero)
                                .orElseThrow(() -> new IllegalArgumentException(
                                                "No se encontró el género con id " + idGenero));
                CatGrupoConac grupo = grupoRepo.findById(idGrupo).orElseThrow(() -> new IllegalArgumentException(
                                "No se encontró el grupo con id " + idGrupo));
                CatRubroConac rubro = rubroRepo.findById(idRubro).orElseThrow(() -> new IllegalArgumentException(
                                "No se encontró el rubro con id " + idRubro));
                CatCuentaConac cuenta = cuentaRepo.findById(idCuenta).orElseThrow(() -> new IllegalArgumentException(
                                "No se encontró la cuenta con id " + idCuenta));

                String claveCompuesta = generoExistente.getClave() + "." + grupo.getClave() + "." + rubro.getClave()
                                + "."
                                + cuenta.getClave()
                                + "." + clave;
                Date fechaAlta = new Date();
                CatSubCuentaConac subCuentaEntidad = new CatSubCuentaConac(clave,
                                descripcion, claveCompuesta, idCuenta, ejercicio, fechaAlta);

                Integer idSubCuenta = subCuentaRepo.save(subCuentaEntidad).getId();
                CatDatosCuentaConac datosCuenta = new CatDatosCuentaConac(
                                null, // idNaturaleza
                                null, // idEstadoFinanciero
                                null, // idPosicion
                                null, // idEstructura
                                null, // idGenero
                                null, // idGrupo
                                null, // idRubro
                                null, // idCuenta
                                idSubCuenta, // idSubCuenta
                                null, // inicioVigencia
                                null, // finVigencia
                                subCuentaEntidad.getEjercicio()); // ejercicio
                datosCuentaRepo.save(datosCuenta);

                return subCuentaEntidad;
        }

        @Override
        public CatSubCuentaConac updateSubcuenta(Integer id, String descripcion) {
                CatSubCuentaConac subCuentaConac = subCuentaRepo.findById(id)
                                .orElseThrow(() -> new IllegalArgumentException(
                                                "No se encontró la subcuenta con id " + id));
                subCuentaConac.setDescripcion(descripcion);
                return subCuentaRepo.save(subCuentaConac);
        }

        @Override
        public Object findAllByEjercicio(Integer ejercicio, Integer idCuenta) {
                return subCuentaRepo.findAllByEjercicioAndIdCuenta(ejercicio, idCuenta);
        }

}
