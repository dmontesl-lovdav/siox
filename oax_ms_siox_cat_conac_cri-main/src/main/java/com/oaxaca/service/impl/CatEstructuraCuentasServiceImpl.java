package com.oaxaca.service.impl;

import java.util.ArrayList;
import java.util.Date;
import java.util.List;
import java.util.Optional;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.oaxaca.dto.CatEstructuraCuentasDTO;
import com.oaxaca.dto.ConsultaRespuesta;
import com.oaxaca.entity.CatEstructuraCuentas;
import com.oaxaca.repository.CatEstructuraCuentasRepository;
import com.oaxaca.service.ICatEstructuraCuentasService;

@Service
public class CatEstructuraCuentasServiceImpl implements ICatEstructuraCuentasService {

    @Autowired
    private CatEstructuraCuentasRepository repository;

    @Override
    public ConsultaRespuesta<List<CatEstructuraCuentasDTO>> getCatEstructuraCuentas(
            Integer page,
            Integer pageSize,
            String sort,
            String descripcion,
            Integer niveles,
            Boolean visible,
            Boolean estatus,
            Integer longitud) {
        try {
            // Valores por defecto
            if (page == null || page < 1) {
                page = 1;
            }
            if (pageSize == null || pageSize < 1) {
                pageSize = 10;
            }
            if (sort == null || sort.trim().isEmpty()) {
                sort = "id ASC";
            }

            // Llamar a la función de PostgreSQL
            List<Object[]> resultados = repository.getCatEstructuraCuentas(
                    page, pageSize, sort, descripcion, niveles, visible, estatus, longitud);

            // Convertir los resultados a DTOs
            List<CatEstructuraCuentasDTO> datos = new ArrayList<>();
            Integer totalRegistros = 0;

            for (Object[] row : resultados) {
                CatEstructuraCuentasDTO dto = new CatEstructuraCuentasDTO();

                // total_registros
                if (row[0] != null) {
                    totalRegistros = ((Number) row[0]).intValue();
                    dto.setTotalRegistros(totalRegistros);
                }

                // id
                if (row[1] != null) {
                    dto.setId(((Number) row[1]).intValue());
                }

                // descripcion_estructura
                if (row[2] != null) {
                    dto.setDescripcionEstructura(String.valueOf(row[2]).trim());
                }

                // n1
                if (row[3] != null) {
                    dto.setN1(String.valueOf(row[3]).trim());
                }

                // des_n1
                if (row[4] != null) {
                    dto.setDesN1(String.valueOf(row[4]).trim());
                }

                // n2
                if (row[5] != null) {
                    dto.setN2(String.valueOf(row[5]).trim());
                }

                // des_n2
                if (row[6] != null) {
                    dto.setDesN2(String.valueOf(row[6]).trim());
                }

                // n3
                if (row[7] != null) {
                    dto.setN3(String.valueOf(row[7]).trim());
                }

                // des_n3
                if (row[8] != null) {
                    dto.setDesN3(String.valueOf(row[8]).trim());
                }

                // n4
                if (row[9] != null) {
                    dto.setN4(String.valueOf(row[9]).trim());
                }

                // des_n4
                if (row[10] != null) {
                    dto.setDesN4(String.valueOf(row[10]).trim());
                }

                // n5
                if (row[11] != null) {
                    dto.setN5(String.valueOf(row[11]).trim());
                }

                // des_n5
                if (row[12] != null) {
                    dto.setDesN5(String.valueOf(row[12]).trim());
                }

                // n6
                if (row[13] != null) {
                    dto.setN6(String.valueOf(row[13]).trim());
                }

                // des_n6
                if (row[14] != null) {
                    dto.setDesN6(String.valueOf(row[14]).trim());
                }

                // secuencia
                if (row[15] != null) {
                    dto.setSecuencia(String.valueOf(row[15]).trim());
                }

                // fecha_creacion
                if (row[16] != null) {
                    dto.setFechaCreacion((Date) row[16]);
                }

                // estatus
                if (row[17] != null) {
                    dto.setEstatus((Boolean) row[17]);
                }

                // visible
                if (row[18] != null) {
                    dto.setVisible((Boolean) row[18]);
                }

                // longitud
                if (row[19] != null) {
                    dto.setLongitud(((Number) row[19]).intValue());
                }

                // niveles
                if (row[20] != null) {
                    dto.setNiveles(((Number) row[20]).intValue());
                }

                datos.add(dto);
            }

            // Crear la respuesta
            ConsultaRespuesta<List<CatEstructuraCuentasDTO>> respuesta = new ConsultaRespuesta<>();
            respuesta.setExito(true);
            respuesta.setMensaje("Consulta exitosa");
            respuesta.setDatos(datos);
            respuesta.setTotal(totalRegistros);
            respuesta.setPagina(page);
            respuesta.setTamano(pageSize);

            return respuesta;

        } catch (Exception e) {
            ConsultaRespuesta<List<CatEstructuraCuentasDTO>> respuesta = new ConsultaRespuesta<>();
            respuesta.setExito(false);
            respuesta.setMensaje("Error al consultar estructura de cuentas: " + e.getMessage());
            respuesta.setDatos(new ArrayList<>());
            respuesta.setTotal(0);
            respuesta.setPagina(page != null ? page : 1);
            respuesta.setTamano(pageSize != null ? pageSize : 10);
            return respuesta;
        }
    }

    @Override
    public ConsultaRespuesta<CatEstructuraCuentas> getById(Integer id) {
        ConsultaRespuesta<CatEstructuraCuentas> respuesta = new ConsultaRespuesta<>();
        try {
            Optional<CatEstructuraCuentas> optional = repository.findById(id);

            if (optional.isPresent()) {
                respuesta.setExito(true);
                respuesta.setMensaje("Registro encontrado");
                respuesta.setDatos(optional.get());
            } else {
                respuesta.setExito(false);
                respuesta.setMensaje("No se encontró el registro con id: " + id);
                respuesta.setDatos(null);
            }

            return respuesta;
        } catch (Exception e) {
            respuesta.setExito(false);
            respuesta.setMensaje("Error al consultar el registro: " + e.getMessage());
            respuesta.setDatos(null);
            return respuesta;
        }
    }

    @Override
    public ConsultaRespuesta<CatEstructuraCuentas> create(CatEstructuraCuentas catEstructuraCuentas) {
        ConsultaRespuesta<CatEstructuraCuentas> respuesta = new ConsultaRespuesta<>();
        try {
            // Validar que la descripción de estructura no sea nula o vacía
            if (catEstructuraCuentas.getDescripcionEstructura() == null ||
                    catEstructuraCuentas.getDescripcionEstructura().trim().isEmpty()) {
                respuesta.setExito(false);
                respuesta.setMensaje("La descripción de estructura es requerida");
                respuesta.setDatos(null);
                return respuesta;
            }

            // Validar que no exista una estructura con la misma descripción
            if (repository.existsByDescripcionEstructura(catEstructuraCuentas.getDescripcionEstructura())) {
                respuesta.setExito(false);
                respuesta.setMensaje("Ya existe una estructura de cuentas con la descripción: " +
                        catEstructuraCuentas.getDescripcionEstructura());
                respuesta.setDatos(null);
                return respuesta;
            }

            // Calcular longitud como la suma de n1 a n6
            catEstructuraCuentas.setLongitud(calcularLongitud(catEstructuraCuentas));

            // Generar secuencia automáticamente
            catEstructuraCuentas.setSecuencia(generarSecuencia(catEstructuraCuentas));

            // Calcular niveles (cantidad de niveles con valor > 0)
            catEstructuraCuentas.setNiveles(calcularNiveles(catEstructuraCuentas));

            // Establecer fecha de creación si no se proporciona
            if (catEstructuraCuentas.getFechaCreacion() == null) {
                catEstructuraCuentas.setFechaCreacion(new Date());
            }

            // Establecer valores por defecto si no se proporcionan
            if (catEstructuraCuentas.getEstatus() == null) {
                catEstructuraCuentas.setEstatus(false);
            }

            if (catEstructuraCuentas.getVisible() == null) {
                catEstructuraCuentas.setVisible(true);
            }
            CatEstructuraCuentas saved = repository.save(catEstructuraCuentas);

            respuesta.setExito(true);
            respuesta.setMensaje("Registro creado exitosamente");
            respuesta.setDatos(saved);

            return respuesta;
        } catch (Exception e) {
            respuesta.setExito(false);
            respuesta.setMensaje("Error al crear el registro: " + e.getMessage());
            respuesta.setDatos(null);
            return respuesta;
        }
    }

    @Override
    public ConsultaRespuesta<CatEstructuraCuentas> update(Integer id, CatEstructuraCuentas catEstructuraCuentas) {
        ConsultaRespuesta<CatEstructuraCuentas> respuesta = new ConsultaRespuesta<>();
        try {
            Optional<CatEstructuraCuentas> optional = repository.findById(id);

            if (!optional.isPresent()) {
                respuesta.setExito(false);
                respuesta.setMensaje("No se encontró el registro con id: " + id);
                respuesta.setDatos(null);
                return respuesta;
            }

            CatEstructuraCuentas existing = optional.get();

            // Validar que la estructura no esté en uso
            if (existing.getEstatus() != null && existing.getEstatus()) {
                respuesta.setExito(false);
                respuesta.setMensaje("La estructura está en uso y no puede ser modificada");
                respuesta.setDatos(null);
                return respuesta;
            }

            // Calcular el número de niveles que se están enviando en la actualización
            Integer nivelesActualizados = calcularNiveles(catEstructuraCuentas);

            // Actualizar campos
            if (catEstructuraCuentas.getDescripcionEstructura() != null) {
                existing.setDescripcionEstructura(catEstructuraCuentas.getDescripcionEstructura());
            }

            // Actualizar niveles según el número de niveles enviados
            if (catEstructuraCuentas.getN1() != null) {
                existing.setN1(catEstructuraCuentas.getN1());
            }
            if (catEstructuraCuentas.getDesN1() != null) {
                existing.setDesN1(catEstructuraCuentas.getDesN1());
            }

            if (nivelesActualizados >= 2) {
                if (catEstructuraCuentas.getN2() != null) {
                    existing.setN2(catEstructuraCuentas.getN2());
                }
                if (catEstructuraCuentas.getDesN2() != null) {
                    existing.setDesN2(catEstructuraCuentas.getDesN2());
                }
            } else {
                // Limpiar nivel 2 si no se envía
                existing.setN2(null);
                existing.setDesN2(null);
            }

            if (nivelesActualizados >= 3) {
                if (catEstructuraCuentas.getN3() != null) {
                    existing.setN3(catEstructuraCuentas.getN3());
                }
                if (catEstructuraCuentas.getDesN3() != null) {
                    existing.setDesN3(catEstructuraCuentas.getDesN3());
                }
            } else {
                // Limpiar nivel 3 si no se envía
                existing.setN3(null);
                existing.setDesN3(null);
            }

            if (nivelesActualizados >= 4) {
                if (catEstructuraCuentas.getN4() != null) {
                    existing.setN4(catEstructuraCuentas.getN4());
                }
                if (catEstructuraCuentas.getDesN4() != null) {
                    existing.setDesN4(catEstructuraCuentas.getDesN4());
                }
            } else {
                // Limpiar nivel 4 si no se envía
                existing.setN4(null);
                existing.setDesN4(null);
            }

            if (nivelesActualizados >= 5) {
                if (catEstructuraCuentas.getN5() != null) {
                    existing.setN5(catEstructuraCuentas.getN5());
                }
                if (catEstructuraCuentas.getDesN5() != null) {
                    existing.setDesN5(catEstructuraCuentas.getDesN5());
                }
            } else {
                // Limpiar nivel 5 si no se envía
                existing.setN5(null);
                existing.setDesN5(null);
            }

            if (nivelesActualizados >= 6) {
                if (catEstructuraCuentas.getN6() != null) {
                    existing.setN6(catEstructuraCuentas.getN6());
                }
                if (catEstructuraCuentas.getDesN6() != null) {
                    existing.setDesN6(catEstructuraCuentas.getDesN6());
                }
            } else {
                // Limpiar nivel 6 si no se envía
                existing.setN6(null);
                existing.setDesN6(null);
            }

            if (catEstructuraCuentas.getSecuencia() != null) {
                existing.setSecuencia(catEstructuraCuentas.getSecuencia());
            }
            if (catEstructuraCuentas.getEstatus() != null) {
                existing.setEstatus(catEstructuraCuentas.getEstatus());
            }
            if (catEstructuraCuentas.getVisible() != null) {
                existing.setVisible(catEstructuraCuentas.getVisible());
            }

            // Recalcular longitud y secuencia después de actualizar los campos
            existing.setLongitud(calcularLongitud(existing));
            existing.setSecuencia(generarSecuencia(existing));
            existing.setNiveles(calcularNiveles(existing));

            CatEstructuraCuentas updated = repository.save(existing);
            respuesta.setExito(true);
            respuesta.setMensaje("Registro actualizado exitosamente");
            respuesta.setDatos(updated);

            return respuesta;
        } catch (Exception e) {
            respuesta.setExito(false);
            respuesta.setMensaje("Error al actualizar el registro: " + e.getMessage());
            respuesta.setDatos(null);
            return respuesta;
        }
    }

    @Override
    public ConsultaRespuesta<CatEstructuraCuentas> updateVisible(Integer id, Boolean visible) {
        ConsultaRespuesta<CatEstructuraCuentas> respuesta = new ConsultaRespuesta<>();
        try {
            // Validar que el parámetro visible no sea nulo
            if (visible == null) {
                respuesta.setExito(false);
                respuesta.setMensaje("El valor de visible no puede ser nulo");
                respuesta.setDatos(null);
                return respuesta;
            }

            Optional<CatEstructuraCuentas> optional = repository.findById(id);

            if (!optional.isPresent()) {
                respuesta.setExito(false);
                respuesta.setMensaje("No se encontró el registro con id: " + id);
                respuesta.setDatos(null);
                return respuesta;
            }

            CatEstructuraCuentas existing = optional.get();

            // Actualizar solo el campo visible
            existing.setVisible(visible);

            CatEstructuraCuentas updated = repository.save(existing);

            respuesta.setExito(true);
            respuesta.setMensaje("Campo visible actualizado exitosamente a " + visible);
            respuesta.setDatos(updated);

            return respuesta;
        } catch (Exception e) {
            respuesta.setExito(false);
            respuesta.setMensaje("Error al actualizar el campo visible: " + e.getMessage());
            respuesta.setDatos(null);
            return respuesta;
        }
    }

    @Override
    public ConsultaRespuesta<Void> delete(Integer id) {
        ConsultaRespuesta<Void> respuesta = new ConsultaRespuesta<>();
        try {
            Optional<CatEstructuraCuentas> optional = repository.findById(id);

            if (!optional.isPresent()) {
                respuesta.setExito(false);
                respuesta.setMensaje("No se encontró el registro con id: " + id);
                return respuesta;
            }

            CatEstructuraCuentas existing = optional.get();

            // Validar que la estructura no esté en uso
            if (existing.getEstatus() != null && existing.getEstatus()) {
                respuesta.setExito(false);
                respuesta.setMensaje("La estructura está en uso y no puede ser eliminada");
                return respuesta;
            }

            repository.deleteById(id);

            respuesta.setExito(true);
            respuesta.setMensaje("Registro eliminado exitosamente");

            return respuesta;
        } catch (Exception e) {
            respuesta.setExito(false);
            respuesta.setMensaje("Error al eliminar el registro: " + e.getMessage());
            return respuesta;
        }
    }

    /**
     * Calcula la cantidad de niveles con valor mayor a 0
     * 
     * @param catEstructuraCuentas Entidad con los valores de n1 a n6
     * @return Cantidad de niveles activos
     */
    private Integer calcularNiveles(CatEstructuraCuentas catEstructuraCuentas) {
        return (int) java.util.Arrays.stream(new String[] {
                catEstructuraCuentas.getN1(),
                catEstructuraCuentas.getN2(),
                catEstructuraCuentas.getN3(),
                catEstructuraCuentas.getN4(),
                catEstructuraCuentas.getN5(),
                catEstructuraCuentas.getN6()
        })
                .mapToInt(this::parseIntSafe)
                .filter(valor -> valor > 0)
                .count();
    }

    /**
     * Genera la secuencia en formato de ceros separados por puntos
     * Ejemplo: n1=5, n2=3, n3=3, n4=4, n5=4, n6=5 -> 00000.000.000.0000.0000.00000
     * 
     * @param catEstructuraCuentas Entidad con los valores de n1 a n6
     * @return Secuencia formateada con ceros
     */
    private String generarSecuencia(CatEstructuraCuentas catEstructuraCuentas) {
        String[] niveles = {
                catEstructuraCuentas.getN1(),
                catEstructuraCuentas.getN2(),
                catEstructuraCuentas.getN3(),
                catEstructuraCuentas.getN4(),
                catEstructuraCuentas.getN5(),
                catEstructuraCuentas.getN6()
        };

        String resultado = java.util.Arrays.stream(niveles)
                .map(this::parseIntSafe)
                .filter(longitud -> longitud > 0)
                .map(longitud -> "0".repeat(longitud))
                .collect(java.util.stream.Collectors.joining("."));

        return resultado.isEmpty() ? null : resultado;
    }

    /**
     * Calcula la longitud como la sumatoria de los valores numéricos de n1 a n6
     * 
     * @param catEstructuraCuentas Entidad con los valores de n1 a n6
     * @return Suma de los valores de n1 a n6
     */
    private Integer calcularLongitud(CatEstructuraCuentas catEstructuraCuentas) {
        return java.util.Arrays.stream(new String[] {
                catEstructuraCuentas.getN1(),
                catEstructuraCuentas.getN2(),
                catEstructuraCuentas.getN3(),
                catEstructuraCuentas.getN4(),
                catEstructuraCuentas.getN5(),
                catEstructuraCuentas.getN6()
        })
                .mapToInt(this::parseIntSafe)
                .sum();
    }

    /**
     * Convierte un String a Integer de forma segura
     * 
     * @param value Valor a convertir
     * @return Valor entero o 0 si es null o no válido
     */
    private int parseIntSafe(String value) {
        if (value == null || value.trim().isEmpty()) {
            return 0;
        }
        try {
            return Integer.parseInt(value.trim());
        } catch (NumberFormatException e) {
            return 0;
        }
    }
}
