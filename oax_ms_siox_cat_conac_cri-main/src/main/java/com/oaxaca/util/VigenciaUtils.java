package com.oaxaca.util;

import java.util.Calendar;
import java.util.Date;

public class VigenciaUtils {
    public static int getYear(java.util.Date date) {
        java.util.Calendar cal = java.util.Calendar.getInstance();
        cal.setTime(date);
        return cal.get(java.util.Calendar.YEAR);
    }

    public static boolean claveValida(String clave) {
        return clave != null && clave.matches("^[A-Z0-9]{2}$");
    }

    public static Date getInicioVigencia(Integer ejercicio) {
        Calendar cal = Calendar.getInstance();
        cal.set(Calendar.YEAR, ejercicio);
        cal.set(Calendar.MONTH, Calendar.JANUARY);
        cal.set(Calendar.DAY_OF_MONTH, 1);
        return cal.getTime();
    }

    public static Date getFinVigencia(Integer ejercicio) {
        Calendar cal = Calendar.getInstance();
        cal.set(Calendar.YEAR, ejercicio);
        cal.set(Calendar.MONTH, Calendar.DECEMBER);
        cal.set(Calendar.DAY_OF_MONTH, 31);
        return cal.getTime();
    }
}
