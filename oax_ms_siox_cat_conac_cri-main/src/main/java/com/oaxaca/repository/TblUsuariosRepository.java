package com.oaxaca.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.JpaSpecificationExecutor;

import com.oaxaca.entity.TblUsuarios;

public interface TblUsuariosRepository extends JpaRepository<TblUsuarios, Long>, JpaSpecificationExecutor<TblUsuarios> {
    
}
