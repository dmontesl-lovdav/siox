package com.oaxaca.repository;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.oaxaca.entity.CatRubroConac;

@Repository
public interface CatRubroConacRepository extends JpaRepository<CatRubroConac, Integer> {

    CatRubroConac findByClaveAndEjercicio(String clave, Integer ejercicio);

    CatRubroConac findByClaveCompuestaAndEjercicio(String claveCompuesta, Integer ejercicio);

    List<CatRubroConac> findAllByEjercicio(Integer ejercicio);

    List<CatRubroConac> findAllByEjercicioAndIdGrupo(Integer ejercicio, Integer idGrupo);
}
