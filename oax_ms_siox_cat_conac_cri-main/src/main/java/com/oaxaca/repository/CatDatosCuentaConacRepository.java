package com.oaxaca.repository;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.oaxaca.entity.CatDatosCuentaConac;

@Repository
public interface CatDatosCuentaConacRepository extends JpaRepository<CatDatosCuentaConac, Integer> {

    List<CatDatosCuentaConac> findByEjercicio(Integer ejercicio);

    List<CatDatosCuentaConac> findByIdGenero(Integer id);

    List<CatDatosCuentaConac> findByIdGrupo(Integer id);

    List<CatDatosCuentaConac> findByIdRubro(Integer id);

    List<CatDatosCuentaConac> findByIdCuenta(Integer id);

    List<CatDatosCuentaConac> findByIdSubCuenta(Integer id);

}
