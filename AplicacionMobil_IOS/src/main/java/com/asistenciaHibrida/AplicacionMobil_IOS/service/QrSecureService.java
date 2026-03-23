package com.asistenciaHibrida.AplicacionMobil_IOS.service;

import org.springframework.stereotype.Service;
import java.time.LocalDateTime;
import java.util.UUID;

@Service
public class QrSecureService {

    private String currentToken;
    private LocalDateTime expiryTime;
    private final int ROTATION_MINUTES = 5;

    public QrSecureService() {
        rotateToken();
    }

    public synchronized String getActiveToken() {
        if (currentToken == null || LocalDateTime.now().isAfter(expiryTime)) {
            rotateToken();
        }
        return currentToken;
    }

    public synchronized boolean isValidToken(String token) {
        return token != null && token.equals(currentToken) && LocalDateTime.now().isBefore(expiryTime);
    }

    public synchronized void rotateToken() {
        this.currentToken = UUID.randomUUID().toString();
        this.expiryTime = LocalDateTime.now().plusMinutes(ROTATION_MINUTES);
    }

    public long getSecondsUntilNextRotation() {
        if (expiryTime == null) return 0;
        long seconds = java.time.Duration.between(LocalDateTime.now(), expiryTime).getSeconds();
        return Math.max(0, seconds);
    }
}
