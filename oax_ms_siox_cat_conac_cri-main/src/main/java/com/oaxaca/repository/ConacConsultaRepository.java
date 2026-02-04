package com.oaxaca.repository;

import java.util.Date;
import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import com.oaxaca.entity.CatDatosCuentaConac;

@Repository
public interface ConacConsultaRepository extends JpaRepository<CatDatosCuentaConac, Integer> {

        @Query(value = "SELECT * FROM siox.get_conac(" +
                        ":pCuenta, :pDescripcion, :pNaturaleza, :pEstructura, :pEstadoFinanciero, " +
                        ":pPosicionFinanciera, :pFechaAlta, :pInicioVigencia, :pFinVigencia, " +
                        ":pEstatus, :pEjercicio, :pSort, :pPage, :pPageSize)", nativeQuery = true)
        List<Object[]> getConacData(
                        @Param("pCuenta") String cuenta,
                        @Param("pDescripcion") String descripcion,
                        @Param("pNaturaleza") String naturaleza,
                        @Param("pEstructura") String estructura,
                        @Param("pEstadoFinanciero") String estadoFinanciero,
                        @Param("pPosicionFinanciera") String posicionFinanciera,
                        @Param("pFechaAlta") Date fechaAlta,
                        @Param("pInicioVigencia") Date inicioVigencia,
                        @Param("pFinVigencia") Date finVigencia,
                        @Param("pEstatus") String estatus,
                        @Param("pEjercicio") Integer ejercicio,
                        @Param("pSort") String sort,
                        @Param("pPage") Integer page,
                        @Param("pPageSize") Integer pageSize);
}