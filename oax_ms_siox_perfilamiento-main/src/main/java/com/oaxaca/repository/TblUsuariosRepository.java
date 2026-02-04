package com.oaxaca.repository;

import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;

import com.oaxaca.entity.TblLicencia;
import com.oaxaca.entity.TblUsuarios;

public interface TblUsuariosRepository extends JpaRepository<TblUsuarios, Integer> {
    
    Optional<TblUsuarios> findByCorreo(String correo);
    
    Optional<TblUsuarios> findByCorreoAndLicencia(String correo, TblLicencia licencia);
    
    Optional<TblUsuarios> findByCorreoAndPassword(String correo, String password);
}
