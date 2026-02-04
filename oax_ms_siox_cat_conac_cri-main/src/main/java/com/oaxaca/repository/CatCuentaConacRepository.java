package com.oaxaca.repository;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.oaxaca.entity.CatCuentaConac;

@Repository
public interface CatCuentaConacRepository extends JpaRepository<CatCuentaConac, Integer> {

    CatCuentaConac findByClaveAndEjercicio(String clave, Integer ejercicio);

    CatCuentaConac findByClaveCompuestaAndEjercicio(String clave, Integer ejercicio);

    List<CatCuentaConac> findByEjercicio(Integer ejercicio);

    List<CatCuentaConac> findByEjercicioAndIdRubro(Integer ejercicio, Integer idRubro);
}
