import { Injectable } from '@angular/core';

export interface GeoConfig {
  latitude: number;
  longitude: number;
  radius: number; // in meters
}

@Injectable({
  providedIn: 'root'
})
export class ConfiguracionService {
  private readonly STORAGE_KEY = 'async_geo_config';

  private defaultConfig: GeoConfig = {
    latitude: -12.046374, // Lima default
    longitude: -77.042793,
    radius: 50 // 50 meters
  };

  getGeoConfig(): GeoConfig {
    const saved = localStorage.getItem(this.STORAGE_KEY);
    return saved ? JSON.parse(saved) : this.defaultConfig;
  }

  saveGeoConfig(config: GeoConfig): void {
    localStorage.setItem(this.STORAGE_KEY, JSON.stringify(config));
  }
}
