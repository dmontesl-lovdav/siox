package com.oaxaca.repository;

import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.oaxaca.entity.TblParametros;

@Repository
public interface TblParametrosRepository extends JpaRepository<TblParametros, Integer> {
    Optional<TblParametros> findByIdSistemaAndParametro(Integer idSistema, String parametro);
}
