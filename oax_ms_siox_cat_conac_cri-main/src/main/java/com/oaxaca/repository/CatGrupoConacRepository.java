package com.oaxaca.repository;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.oaxaca.entity.CatGrupoConac;

@Repository
public interface CatGrupoConacRepository extends JpaRepository<CatGrupoConac, Integer> {

    CatGrupoConac findByClaveAndEjercicio(String grupoClave, Integer ejercicio);

    CatGrupoConac findByClaveCompuestaAndEjercicio(String grupoClave, Integer ejercicio);

    List<CatGrupoConac> findAllByEjercicio(Integer ejercicio);

    List<CatGrupoConac> findAllByEjercicioAndIdgenero(Integer ejercicio, Integer idGenero);
}
