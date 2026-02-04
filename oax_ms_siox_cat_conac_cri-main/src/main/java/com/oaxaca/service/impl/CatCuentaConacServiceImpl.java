package com.oaxaca.service.impl;

import java.util.Date;
import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.oaxaca.entity.CatCuentaConac;
import com.oaxaca.entity.CatDatosCuentaConac;
import com.oaxaca.entity.CatGeneroConac;
import com.oaxaca.entity.CatGrupoConac;
import com.oaxaca.entity.CatRubroConac;
import com.oaxaca.repository.CatCuentaConacRepository;
import com.oaxaca.repository.CatDatosCuentaConacRepository;
import com.oaxaca.repository.CatGeneroConacRepository;
import com.oaxaca.repository.CatGrupoConacRepository;
import com.oaxaca.repository.CatRubroConacRepository;
import com.oaxaca.service.ICatCuentaConacService;
import com.oaxaca.util.VigenciaUtils;

@Service
public class CatCuentaConacServiceImpl implements ICatCuentaConacService {
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

        @Override
        public CatCuentaConac insertarCuenta(String clave, String descripcion, Integer ejercicio, Integer idGenero,
                        Integer idGrupo,
                        Integer idRubro) {
                if (!VigenciaUtils.claveValida(clave)) {
                        throw new IllegalArgumentException(
                                        "La clave debe tener exactamente dos caracteres alfanuméricos (A-Z, 0-9)");
                }
                CatCuentaConac cuentaExistente = cuentaRepo.findByClaveAndEjercicio(clave, ejercicio);
                if (cuentaExistente != null) {
                        throw new IllegalArgumentException(
                                        "La cuenta con clave " + clave + " ya existe para el ejercicio " + ejercicio);
                }
                CatGeneroConac generoExistente = generoRepo.findById(idGenero)
                                .orElseThrow(() -> new IllegalArgumentException(
                                                "No se encontró el género con id " + idGenero));
                CatGrupoConac grupo = grupoRepo.findById(idGrupo).orElseThrow(() -> new IllegalArgumentException(
                                "No se encontró el grupo con id " + idGrupo));
                CatRubroConac rubro = rubroRepo.findById(idRubro).orElseThrow(() -> new IllegalArgumentException(
                                "No se encontró el rubro con id " + idRubro));

                String claveCompuesta = generoExistente.getClave() + "." + grupo.getClave() + "." + rubro.getClave()
                                + "."
                                + clave;
                Date fechaAlta = new Date();
                CatCuentaConac cuentaEntidad = new CatCuentaConac(clave,
                                descripcion, claveCompuesta, idRubro, ejercicio, fechaAlta);

                Integer idCuenta = cuentaRepo.save(cuentaEntidad).getId();
                CatDatosCuentaConac datosCuenta = new CatDatosCuentaConac(
                                null, // idNaturaleza
                                null, // idEstadoFinanciero
                                null, // idPosicion
                                null, // idEstructura
                                null, // idGenero
                                null, // idGrupo
                                null, // idRubro
                                idCuenta, // idCuenta
                                null, // idSubCuenta
                                null, // inicioVigencia
                                null, // finVigencia
                                cuentaEntidad.getEjercicio()); // ejercicio
                datosCuentaRepo.save(datosCuenta);
                return cuentaEntidad;
        }

        @Override
        public CatCuentaConac updateCuenta(Integer id, String descripcion) {
                CatCuentaConac cuentaExistente = cuentaRepo.findById(id)
                                .orElseThrow(() -> new IllegalArgumentException(
                                                "No se encontró la cuenta con id " + id));
                cuentaExistente.setDescripcion(descripcion);
                return cuentaRepo.save(cuentaExistente);
        }

        @Override
        public List<CatCuentaConac> findAllByEjercicio(Integer ejercicio, Integer idRubro) {
                return cuentaRepo.findByEjercicioAndIdRubro(ejercicio, idRubro);
        }

}
