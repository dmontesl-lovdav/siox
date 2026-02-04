package com.oaxaca.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.oaxaca.entity.CatTipoAsentamiento;

@Repository
public interface ICatTipoAsentamientoRepository extends JpaRepository<CatTipoAsentamiento, Integer> {
    boolean existsByClave(String clave);

}
