package com.oaxaca.service.impl;

import java.util.Date;
import java.util.List;
import java.util.Optional;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.oaxaca.entity.CatClaseCri;
import com.oaxaca.entity.CatConceptosCri;
import com.oaxaca.entity.CatRubroCri;
import com.oaxaca.entity.CatTipoCri;
import com.oaxaca.repository.CatClaseCriRepository;
import com.oaxaca.repository.CatConceptosCriRepository;
import com.oaxaca.repository.CatRubroCriRepository;
import com.oaxaca.repository.CatTipoCriRepository;
import com.oaxaca.service.ICatConceptosCriService;
import com.oaxaca.util.VigenciaUtils;

@Service
public class CatConceptosCriServiceImpl implements ICatConceptosCriService {
    @Autowired
    private CatConceptosCriRepository conceptosRepository;
    @Autowired
    private CatClaseCriRepository claseRepository;
    @Autowired
    private CatTipoCriRepository tipoRepository;
    @Autowired
    private CatRubroCriRepository rubroRepository;

    @Override
    public CatConceptosCri insertConceptoCri(String clave, String nombre, String descripcion, Integer idRubro,
            Integer idTipo, Integer idClase, Date inicioVigencia, Date finVigencia, Integer ejercicio) {
        if (!VigenciaUtils.claveValida(clave)) {
            throw new IllegalArgumentException(
                    "La clave debe tener exactamente dos caracteres alfanuméricos (A-Z, 0-9)");
        }
        if (inicioVigencia == null || finVigencia == null) {
            throw new IllegalArgumentException("Las fechas de vigencia son obligatorias");
        }
        // Validar que la clave no exista previamente
        CatConceptosCri existente = conceptosRepository.findByClaveAndIdClase(clave, idClase);
        if (existente != null) {
            throw new IllegalArgumentException("La clave ingresada ya existe");
        }
        if (VigenciaUtils.getYear(inicioVigencia) != ejercicio || VigenciaUtils.getYear(finVigencia) != ejercicio) {
            throw new IllegalArgumentException("El año de las fechas de vigencia debe coincidir con el ejercicio");
        }
        CatRubroCri rubro = rubroRepository.findById(idRubro)
                .orElseThrow(() -> new IllegalArgumentException("No se encontró el rubro"));
        CatTipoCri tipo = tipoRepository.findById(idTipo)
                .orElseThrow(() -> new IllegalArgumentException("No se encontró el tipo"));
        CatClaseCri clase = claseRepository.findById(idClase)
                .orElseThrow(() -> new IllegalArgumentException("No se encontró la clase"));
        String claveCompuesta = rubro.getClave() + "." + tipo.getClave() + "." + clase.getClave() + "." + clave;
        Date fechaAlta = new Date();
        CatConceptosCri concepto = new CatConceptosCri(clave, nombre, descripcion, idClase, claveCompuesta,
                inicioVigencia, finVigencia, fechaAlta, ejercicio);
        // Actualizar vigencias en clase, tipo y rubro
        clase.setInicioVigencia(inicioVigencia);
        clase.setFinVigencia(finVigencia);
        tipo.setInicioVigencia(inicioVigencia);
        tipo.setFinVigencia(finVigencia);
        rubro.setInicioVigencia(inicioVigencia);
        rubro.setFinVigencia(finVigencia);
        claseRepository.save(clase);
        tipoRepository.save(tipo);
        rubroRepository.save(rubro);
        return conceptosRepository.save(concepto);
    }

    @Override
    public CatConceptosCri updateConceptoCri(Integer id, String nombre, String descripcion,
            Integer idClase, Date inicioVigencia, Date finVigencia) {
        CatConceptosCri concepto = conceptosRepository.findById(id)
                .orElseThrow(() -> new IllegalArgumentException("No se encontró el concepto"));

        if (inicioVigencia == null || finVigencia == null) {
            throw new IllegalArgumentException("Las fechas de vigencia son obligatorias");
        }
        CatClaseCri clase = claseRepository.findById(idClase)
                .orElseThrow(() -> new IllegalArgumentException("No se encontró la clase"));
        CatTipoCri tipo = tipoRepository.findById(clase.getIdTipo())
                .orElseThrow(() -> new IllegalArgumentException("No se encontró el tipo"));
        CatRubroCri rubro = rubroRepository.findById(tipo.getIdRubro())
                .orElseThrow(() -> new IllegalArgumentException("No se encontró el rubro"));

        concepto.setNombre(nombre);
        concepto.setDescripcion(descripcion);
        concepto.setIdClase(idClase);
        concepto.setInicioVigencia(inicioVigencia);
        concepto.setFinVigencia(finVigencia);
        // Actualizar vigencias en clase, tipo y rubro
        clase.setInicioVigencia(inicioVigencia);
        clase.setFinVigencia(finVigencia);
        tipo.setInicioVigencia(inicioVigencia);
        tipo.setFinVigencia(finVigencia);
        rubro.setInicioVigencia(inicioVigencia);
        rubro.setFinVigencia(finVigencia);
        claseRepository.save(clase);
        tipoRepository.save(tipo);
        rubroRepository.save(rubro);
        return conceptosRepository.save(concepto);
    }

    @Override
    public Optional<CatConceptosCri> findById(Integer id) {
        return conceptosRepository.findById(id);
    }

    @Override
    public List<CatConceptosCri> findAllByEjercicioAndIdClase(Integer ejercicio, Integer idClase) {
        return conceptosRepository.findAllByEjercicioAndIdClase(ejercicio, idClase);
    }
}
