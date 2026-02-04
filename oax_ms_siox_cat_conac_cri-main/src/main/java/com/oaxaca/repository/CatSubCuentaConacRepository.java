package com.oaxaca.repository;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.oaxaca.entity.CatSubCuentaConac;

@Repository
public interface CatSubCuentaConacRepository extends JpaRepository<CatSubCuentaConac, Integer> {

    CatSubCuentaConac findByClaveAndEjercicio(String clave, Integer ejercicio);

    CatSubCuentaConac findByClaveCompuestaAndEjercicio(String claveCompuesta, Integer ejercicio);

    List<CatSubCuentaConac> findAllByEjercicio(Integer ejercicio);

    List<CatSubCuentaConac> findAllByEjercicioAndIdCuenta(Integer ejercicio, Integer idCuenta);
}
