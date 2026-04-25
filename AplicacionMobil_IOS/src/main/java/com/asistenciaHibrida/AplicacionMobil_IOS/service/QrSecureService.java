package com.asistenciaHibrida.AplicacionMobil_IOS.service;

import org.springframework.stereotype.Service;
import java.time.LocalDateTime;
import java.util.UUID;

@Service
public class QrSecureService {

    private String currentToken;
    private String previousToken;
    private LocalDateTime expiryTime;
    private LocalDateTime previousExpiryTime;
    private final int ROTATION_MINUTES = 5;
    private final int GRACE_PERIOD_SECONDS = 60;

    public QrSecureService() {
        rotateToken();
    }

    private java.time.LocalDateTime getPeruTime() {
        return java.time.ZonedDateTime.now(java.time.ZoneId.of("America/Lima")).toLocalDateTime();
    }

    public synchronized String getActiveToken() {
        if (currentToken == null || getPeruTime().isAfter(expiryTime)) {
            rotateToken();
        }
        return currentToken;
    }

    public synchronized boolean isValidToken(String token) {
        if (token == null) return false;
        
        // Validar contra el token actual
        if (token.equals(currentToken) && getPeruTime().isBefore(expiryTime)) {
            return true;
        }
        
        // Validar contra el token anterior (periodo de gracia)
        if (token.equals(previousToken) && previousExpiryTime != null) {
            // Permitimos el token anterior hasta N segundos después de su expiración
            return getPeruTime().isBefore(previousExpiryTime.plusSeconds(GRACE_PERIOD_SECONDS));
        }
        
        return false;
    }

    public synchronized void rotateToken() {
        this.previousToken = this.currentToken;
        this.previousExpiryTime = this.expiryTime;
        this.currentToken = UUID.randomUUID().toString();
        this.expiryTime = getPeruTime().plusMinutes(ROTATION_MINUTES);
    }

    public long getSecondsUntilNextRotation() {
        if (expiryTime == null) return 0;
        long seconds = java.time.Duration.between(getPeruTime(), expiryTime).getSeconds();
        return Math.max(0, seconds);
    }
}
