package com.oaxaca.repository;

import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;

import com.oaxaca.entity.TblLicencia;

public interface TblLicenciaRepository extends JpaRepository<TblLicencia, Integer> {
    
    Optional<TblLicencia> findByCorreo(String correo);
    
    Optional<TblLicencia> findByCorreoAndContrasenia(String correo, String contrasenia);
}
