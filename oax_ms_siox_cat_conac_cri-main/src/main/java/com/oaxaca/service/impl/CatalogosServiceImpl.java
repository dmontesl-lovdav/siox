package com.oaxaca.service.impl;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.oaxaca.entity.CatEstadoFinanciero;
import com.oaxaca.entity.CatEstructura;
import com.oaxaca.entity.CatNaturaleza;
import com.oaxaca.entity.CatPosicion;
import com.oaxaca.repository.CatEstadoFinancieroRepository;
import com.oaxaca.repository.CatEstructuraRepository;
import com.oaxaca.repository.CatNaturalezaRepository;
import com.oaxaca.repository.CatPosicionRepository;
import com.oaxaca.service.ICatalogosService;

@Service
public class CatalogosServiceImpl implements ICatalogosService {
    @Autowired
    private CatNaturalezaRepository catNaturalezaRepository;

    @Autowired
    private CatEstructuraRepository catEstructuraRepository;

    @Autowired
    private CatPosicionRepository catPosicionRepository;

    @Autowired
    private CatEstadoFinancieroRepository catEstadoFinancieroRepository;

    @Override
    public List<CatNaturaleza> findAllNaturaleza() {
        return catNaturalezaRepository.findAll();
    }

    @Override
    public List<CatEstructura> findAllEstructura() {
        return catEstructuraRepository.findAll();
    }

    @Override
    public List<CatPosicion> findAllPosicion() {
        return catPosicionRepository.findAll();
    }

    @Override
    public List<CatEstadoFinanciero> findAllEstadoFinanciero() {
        return catEstadoFinancieroRepository.findAll();
    }

}
