package com.oaxaca.service;

import java.io.ByteArrayOutputStream;
import java.io.IOException;
import java.util.Base64;
import java.util.Date;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.google.zxing.BarcodeFormat;
import com.google.zxing.WriterException;
import com.google.zxing.client.j2se.MatrixToImageWriter;
import com.google.zxing.common.BitMatrix;
import com.google.zxing.qrcode.QRCodeWriter;
import com.oaxaca.dto.AuthResponse;
import com.oaxaca.dto.LoginRequest;
import com.oaxaca.dto.TwoFactorRequest;
import com.oaxaca.dto.TwoFactorSetupResponse;
import com.oaxaca.entity.TblLicencia;
import com.oaxaca.entity.TblUsuarios;
import com.oaxaca.exception.InvalidCredentialsException;
import com.oaxaca.exception.TwoFactorAuthenticationException;
import com.oaxaca.repository.TblLicenciaRepository;
import com.oaxaca.repository.TblUsuariosRepository;
import com.warrenstrange.googleauth.GoogleAuthenticator;
import com.warrenstrange.googleauth.GoogleAuthenticatorKey;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;

@Service
@RequiredArgsConstructor
@Slf4j
public class AuthenticationService {

    private final TblUsuariosRepository usuariosRepository;
    private final TblLicenciaRepository licenciaRepository;
    private final GoogleAuthenticator googleAuthenticator = new GoogleAuthenticator();

    // 2FA Bypass for Development
    @Value("${auth.2fa.dev-bypass-enabled:false}")
    private boolean devBypassEnabled;

    @Value("${auth.2fa.dev-bypass-code:}")
    private String devBypassCode;

    /**
     * Validación de credenciales:
     * - Usuario ROOT: Registrado solo en tbl_licencia (perfil/empresa)
     * - Usuario Operativo: Registrado en tbl_usuarios con rol específico
     */
    @Transactional
    public AuthResponse login(LoginRequest request) {
        log.debug("Iniciando proceso de login para: {}", request.getCorreo());

        // 1. Validar contra tabla de licencias
        TblLicencia licencia = licenciaRepository
                .findByCorreoAndContrasenia(request.getCorreo(), request.getPassword())
                .orElseThrow(() -> new InvalidCredentialsException(
                        "No se encontró una licencia válida con las credenciales proporcionadas"));

        // 2. Validar que la licencia esté activa
        if (!Boolean.TRUE.equals(licencia.getEstatus())) {
            throw new InvalidCredentialsException("La licencia no está activa");
        }

        // 3. Validar vigencia de la licencia
        Date ahora = new Date();
        if (licencia.getFinVigencia() != null && licencia.getFinVigencia().before(ahora)) {
            throw new InvalidCredentialsException("La licencia ha expirado");
        }

        // 4. Intentar buscar usuario operativo en tbl_usuarios
        TblUsuarios usuarioOperativo = usuariosRepository
                .findByCorreoAndLicencia(request.getCorreo(), licencia)
                .orElse(null);

        // 5. Determinar tipo de usuario
        if (usuarioOperativo != null) {
            // ES UN USUARIO OPERATIVO
            log.info("Usuario operativo detectado: {}", request.getCorreo());
            return procesarUsuarioOperativo(usuarioOperativo, request.getPassword());
        } else {
            // ES UN USUARIO ROOT (solo en licencia, no en tbl_usuarios)
            log.info("Usuario ROOT detectado: {}", request.getCorreo());
            return procesarUsuarioRoot(licencia);
        }
    }

    /**
     * Procesar login de usuario ROOT (perfil/empresa)
     */
    private AuthResponse procesarUsuarioRoot(TblLicencia licencia) {
        // Verificar si tiene 2FA configurado en la licencia
        if (licencia.getSecret() == null || licencia.getSecret().isEmpty()) {
            // Primera vez - configurar 2FA para ROOT
            TwoFactorSetupResponse setup = setupTwoFactorAuthenticationForRoot(licencia);
            
            return AuthResponse.builder()
                    .userId(licencia.getId())
                    .licenciaId(licencia.getId())
                    .nombre(licencia.getNombre())
                    .correo(licencia.getCorreo())
                    .rol("ROOT")
                    .tipoUsuario("ROOT")
                    .requiere2FA(true)
                    .setup2FA(setup)
                    .mensaje("Configure la autenticación de dos factores escaneando el código QR")
                    .build();
        }

        // Si ya tiene 2FA configurado, requerir validación
        return AuthResponse.builder()
                .userId(licencia.getId())
                .licenciaId(licencia.getId())
                .correo(licencia.getCorreo())
                .rol("ROOT")
                .tipoUsuario("ROOT")
                .requiere2FA(true)
                .mensaje("Ingrese el código de autenticación de dos factores")
                .build();
    }

    /**
     * Procesar login de usuario operativo
     */
    private AuthResponse procesarUsuarioOperativo(TblUsuarios usuario, String password) {
        // Validar password del usuario
        if (!password.equals(usuario.getPassword())) {
            throw new InvalidCredentialsException("Contraseña incorrecta");
        }

        // Validar que el usuario esté activo
        if (!Boolean.TRUE.equals(usuario.getActivo())) {
            throw new InvalidCredentialsException("El usuario no está activo");
        }

        // Validar que la licencia asociada esté vigente y activa
        TblLicencia licencia = usuario.getLicencia();
        if (licencia == null) {
            throw new InvalidCredentialsException("El usuario no tiene una licencia asociada");
        }

        // Validar que la licencia esté activa
        if (!Boolean.TRUE.equals(licencia.getEstatus())) {
            throw new InvalidCredentialsException("La licencia asociada no está activa");
        }

        // Validar vigencia de la licencia
        Date ahora = new Date();
        if (licencia.getFinVigencia() != null && licencia.getFinVigencia().before(ahora)) {
            throw new InvalidCredentialsException("La licencia asociada ha expirado");
        }

        log.info("Licencia validada correctamente para usuario operativo. ID Licencia: {}, Nombre: {}", 
                 licencia.getId(), licencia.getNombre());

        // Obtener rol del usuario
        String rolNombre = usuario.getRol() != null ? usuario.getRol().getNombre() : "USER";

        // Verificar si tiene 2FA configurado
        if (usuario.getSecret() == null || usuario.getSecret().isEmpty()) {
            // Primera vez - configurar 2FA
            TwoFactorSetupResponse setup = setupTwoFactorAuthentication(usuario);
            
            return AuthResponse.builder()
                    .userId(usuario.getId())
                    .licenciaId(licencia.getId())
                    .nombre(usuario.getNombre() + " " + usuario.getAPaterno())
                    .correo(usuario.getCorreo())
                    .rol(rolNombre)
                    .tipoUsuario("OPERATIVO")
                    .requiere2FA(true)
                    .setup2FA(setup)
                    .mensaje("Configure la autenticación de dos factores escaneando el código QR")
                    .build();
        }

        // Si ya tiene 2FA configurado, requerir validación
        return AuthResponse.builder()
                .userId(usuario.getId())
                .licenciaId(licencia.getId())
                .correo(usuario.getCorreo())
                .rol(rolNombre)
                .tipoUsuario("OPERATIVO")
                .requiere2FA(true)
                .mensaje("Ingrese el código de autenticación de dos factores")
                .build();
    }

    /**
     * Configuración inicial del 2FA para usuario ROOT
     */
    @Transactional
    public TwoFactorSetupResponse setupTwoFactorAuthenticationForRoot(TblLicencia licencia) {
        log.debug("Configurando 2FA para usuario ROOT: {}", licencia.getCorreo());

        // Generar secret key
        GoogleAuthenticatorKey key = googleAuthenticator.createCredentials();
        String secret = key.getKey();

        // Guardar el secret en la licencia
        licencia.setSecret(secret);
        licenciaRepository.save(licencia);

        // Generar URL para QR Code con el formato correcto
        String issuer = "SIOXOaxaca"; // Sin espacios para evitar problemas de encoding
        String accountName = licencia.getCorreo();
        
        // Construir la URL OTP Auth manualmente para asegurar el formato correcto
        // Formato: otpauth://totp/Issuer:account?secret=SECRET&issuer=Issuer
        String qrCodeUrl = String.format(
            "otpauth://totp/%s:%s?secret=%s&issuer=%s",
            issuer,
            accountName,
            secret,
            issuer
        );
        
        log.debug("URL generada para QR: {}", qrCodeUrl);

        // Generar imagen QR en base64
        String qrCodeBase64 = generateQRCodeImage(qrCodeUrl);

        return TwoFactorSetupResponse.builder()
                .secret(secret)
                .qrCodeUrl(qrCodeBase64)
                .manualEntryKey(formatSecretKey(secret))
                .mensaje("Escanee el código QR con Google Authenticator o similar")
                .build();
    }

    /**
     * Configuración inicial del 2FA para un usuario
     */
    @Transactional
    public TwoFactorSetupResponse setupTwoFactorAuthentication(TblUsuarios usuario) {
        log.debug("Configurando 2FA para usuario: {}", usuario.getCorreo());

        // Generar secret key
        GoogleAuthenticatorKey key = googleAuthenticator.createCredentials();
        String secret = key.getKey();

        // Guardar el secret en el usuario (o en la licencia según tu lógica)
        usuario.setSecret(secret);
        usuariosRepository.save(usuario);

        // También podemos guardar en la licencia si es necesario
        if (usuario.getLicencia() != null) {
            TblLicencia licencia = usuario.getLicencia();
            licencia.setSecret(secret);
            licenciaRepository.save(licencia);
        }

        // Generar URL para QR Code con el formato correcto
        String issuer = "SIOXOaxaca"; // Sin espacios para evitar problemas de encoding
        String accountName = usuario.getCorreo();
        
        // Construir la URL OTP Auth manualmente para asegurar el formato correcto
        // Formato: otpauth://totp/Issuer:account?secret=SECRET&issuer=Issuer
        String qrCodeUrl = String.format(
            "otpauth://totp/%s:%s?secret=%s&issuer=%s",
            issuer,
            accountName,
            secret,
            issuer
        );
        
        log.debug("URL generada para QR: {}", qrCodeUrl);

        // Generar imagen QR en base64
        String qrCodeBase64 = generateQRCodeImage(qrCodeUrl);

        return TwoFactorSetupResponse.builder()
                .secret(secret)
                .qrCodeUrl(qrCodeBase64)
                .manualEntryKey(formatSecretKey(secret))
                .mensaje("Escanee el código QR con Google Authenticator o similar")
                .build();
    }

    /**
     * Validación del código 2FA para usuarios ROOT y OPERATIVOS
     */
    @Transactional
    public AuthResponse validateTwoFactorCode(TwoFactorRequest request) {
        log.debug("Validando código 2FA para: {}", request.getCorreo());

        // Intentar buscar primero como usuario operativo
        TblUsuarios usuarioOperativo = usuariosRepository.findByCorreo(request.getCorreo())
                .orElse(null);

        if (usuarioOperativo != null) {
            // ES USUARIO OPERATIVO
            return validateTwoFactorForOperativo(usuarioOperativo, request.getCodigo2FA());
        } else {
            // ES USUARIO ROOT - buscar en licencia
            TblLicencia licencia = licenciaRepository.findByCorreo(request.getCorreo())
                    .orElseThrow(() -> new InvalidCredentialsException("Usuario no encontrado"));
            
            return validateTwoFactorForRoot(licencia, request.getCodigo2FA());
        }
    }

    /**
     * Validar 2FA para usuario ROOT
     */
    private AuthResponse validateTwoFactorForRoot(TblLicencia licencia, String codigo2FA) {
        // Verificar que el ROOT tenga 2FA configurado
        if (licencia.getSecret() == null || licencia.getSecret().isEmpty()) {
            throw new TwoFactorAuthenticationException("2FA no está configurado para este usuario ROOT");
        }

        // DEV BYPASS: Aceptar código especial en modo desarrollo
        boolean isValid = false;
        if (devBypassEnabled && devBypassCode != null && devBypassCode.equals(codigo2FA)) {
            log.warn("DEV MODE: 2FA bypass usado para usuario ROOT: {}", licencia.getCorreo());
            isValid = true;
        } else {
            // Validar el código 2FA normalmente
            int code;
            try {
                code = Integer.parseInt(codigo2FA);
            } catch (NumberFormatException e) {
                throw new TwoFactorAuthenticationException("Código 2FA inválido");
            }
            isValid = googleAuthenticator.authorize(licencia.getSecret(), code);
        }

        if (!isValid) {
            throw new TwoFactorAuthenticationException("Código 2FA incorrecto o expirado");
        }

        // Autenticación exitosa - Kong manejará el token
        return AuthResponse.builder()
                .userId(licencia.getId())
                .licenciaId(licencia.getId())
                .nombre(licencia.getNombre())
                .correo(licencia.getCorreo())
                .rol("ROOT")
                .tipoUsuario("ROOT")
                .requiere2FA(false)
                .mensaje("Autenticación exitosa como usuario ROOT")
                .build();
    }

    /**
     * Validar 2FA para usuario OPERATIVO
     */
    private AuthResponse validateTwoFactorForOperativo(TblUsuarios usuario, String codigo2FA) {
        // Verificar que el usuario tenga 2FA configurado
        if (usuario.getSecret() == null || usuario.getSecret().isEmpty()) {
            throw new TwoFactorAuthenticationException("2FA no está configurado para este usuario");
        }

        // DEV BYPASS: Aceptar código especial en modo desarrollo
        boolean isValid = false;
        if (devBypassEnabled && devBypassCode != null && devBypassCode.equals(codigo2FA)) {
            log.warn("DEV MODE: 2FA bypass usado para usuario OPERATIVO: {}", usuario.getCorreo());
            isValid = true;
        } else {
            // Validar el código 2FA normalmente
            int code;
            try {
                code = Integer.parseInt(codigo2FA);
            } catch (NumberFormatException e) {
                throw new TwoFactorAuthenticationException("Código 2FA inválido");
            }
            isValid = googleAuthenticator.authorize(usuario.getSecret(), code);
        }

        if (!isValid) {
            throw new TwoFactorAuthenticationException("Código 2FA incorrecto o expirado");
        }

        // Autenticación exitosa - Kong manejará el token
        String rolNombre = usuario.getRol() != null ? usuario.getRol().getNombre() : "USER";
        Integer licenciaId = usuario.getLicencia() != null ? usuario.getLicencia().getId() : null;

        return AuthResponse.builder()
                .userId(usuario.getId())
                .licenciaId(licenciaId)
                .nombre(usuario.getNombre() + " " + usuario.getAPaterno())
                .correo(usuario.getCorreo())
                .rol(rolNombre)
                .tipoUsuario("OPERATIVO")
                .requiere2FA(false)
                .mensaje("Autenticación exitosa como usuario OPERATIVO")
                .build();
    }

    /**
     * Generar imagen QR Code en base64
     */
    private String generateQRCodeImage(String text) {
        try {
            QRCodeWriter qrCodeWriter = new QRCodeWriter();
            // Aumentar el tamaño y mejorar la calidad del QR
            BitMatrix bitMatrix = qrCodeWriter.encode(text, BarcodeFormat.QR_CODE, 400, 400);

            ByteArrayOutputStream outputStream = new ByteArrayOutputStream();
            MatrixToImageWriter.writeToStream(bitMatrix, "PNG", outputStream);
            byte[] qrCodeBytes = outputStream.toByteArray();

            String base64Image = Base64.getEncoder().encodeToString(qrCodeBytes);
            log.debug("QR Code generado exitosamente. Tamaño: {} bytes", qrCodeBytes.length);
            
            return "data:image/png;base64," + base64Image;
        } catch (WriterException | IOException e) {
            log.error("Error generando código QR para texto: {}", text, e);
            throw new RuntimeException("Error generando código QR", e);
        }
    }

    /**
     * Formatear secret key para entrada manual (grupos de 4 caracteres)
     */
    private String formatSecretKey(String secret) {
        StringBuilder formatted = new StringBuilder();
        for (int i = 0; i < secret.length(); i++) {
            if (i > 0 && i % 4 == 0) {
                formatted.append(" ");
            }
            formatted.append(secret.charAt(i));
        }
        return formatted.toString();
    }

    /**
     * Reconfigurar 2FA (en caso de pérdida del dispositivo)
     */
    @Transactional
    public TwoFactorSetupResponse resetTwoFactorAuthentication(LoginRequest request) {
        log.debug("Reconfigurando 2FA para: {}", request.getCorreo());

        // Validar credenciales primero
       TblLicencia licencia = licenciaRepository
                .findByCorreoAndContrasenia(request.getCorreo(), request.getPassword())
                .orElseThrow(() -> new InvalidCredentialsException(
                        "No se encontró una licencia válida con las credenciales proporcionadas"));

                        if (licencia !=null){
                            return setupTwoFactorAuthenticationForRoot(licencia);
                            
                        }
             TblUsuarios usuario = usuariosRepository
                .findByCorreoAndLicencia(request.getCorreo(), licencia)
                .orElseThrow(() -> new InvalidCredentialsException("Usuario no encontrado"));

        // Reconfigurar 2FA
        return setupTwoFactorAuthentication(usuario);
    }
}
