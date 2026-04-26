import { Injectable } from '@angular/core';

export interface ThemeColors {
  primary: string;
  secondary: string;
  background: string;
  text: string;
  isDark: boolean;
}

@Injectable({
  providedIn: 'root'
})
export class ThemeService {
  private readonly STORAGE_KEY = 'asynchronous_theme_config';

  private themes: Record<string, ThemeColors> = {
    minimal: {
      primary: '#8b5e3c', // Coffee Brown
      secondary: '#d2b48c', // Tan
      background: '#fdfbf7', // Beige Light
      text: '#2d241e',
      isDark: false
    },
    royal: {
      primary: '#1e3a8a', // Royal Blue
      secondary: '#b45309', // Amber
      background: '#ffffff',
      text: '#1e293b',
      isDark: false
    },
    modern_light: {
      primary: '#6366f1', // Indigo
      secondary: '#06b6d4', // Cyan
      background: '#f8fafc',
      text: '#0f172a',
      isDark: false
    },
    deep_ocean: {
      primary: '#0284c7', // Deep ocean blue
      secondary: '#0ea5e9',
      background: '#f8fafc',
      text: '#0f172a',
      isDark: false
    },
    forest_night: {
      primary: '#166534', // Deep forest green
      secondary: '#22c55e',
      background: '#f8fafc',
      text: '#0f172a',
      isDark: false
    }
  };

  constructor() {
    this.loadTheme();
  }

  setTheme(name: string): void {
    const theme = this.themes[name];
    if (theme) {
      this.applyTheme(theme);
      localStorage.setItem(this.STORAGE_KEY, name);
    }
  }

  setCustomColors(colors: ThemeColors): void {
    this.applyTheme(colors);
    localStorage.setItem(this.STORAGE_KEY, 'custom');
    localStorage.setItem(this.STORAGE_KEY + '_custom', JSON.stringify(colors));
  }

  private loadTheme(): void {
    const saved = localStorage.getItem(this.STORAGE_KEY);
    if (saved === 'custom') {
      const custom = localStorage.getItem(this.STORAGE_KEY + '_custom');
      if (custom) this.applyTheme(JSON.parse(custom));
    } else if (saved && this.themes[saved]) {
      this.applyTheme(this.themes[saved]);
    } else {
      this.applyTheme(this.themes['modern_light']);
    }
  }

  private applyTheme(colors: ThemeColors): void {
    const root = document.documentElement;
    root.style.setProperty('--accent-primary', colors.primary);
    root.style.setProperty('--accent-secondary', colors.secondary);
    root.style.setProperty('--bg-deep', colors.background);
    root.style.setProperty('--text-primary', colors.text);

    if (colors.isDark) {
      root.setAttribute('data-theme', 'dark');
      root.style.setProperty('--text-secondary', '#a0a0b0');
      root.style.setProperty('--glass-bg', 'rgba(20, 21, 30, 0.7)');
      root.style.setProperty('--glass-border', 'rgba(255, 255, 255, 0.1)');
    } else {
      root.removeAttribute('data-theme');
      root.style.setProperty('--text-secondary', '#64748b');
      root.style.setProperty('--glass-bg', 'rgba(255, 255, 255, 0.7)');
      root.style.setProperty('--glass-border', 'rgba(255, 255, 255, 0.5)');
    }
  }

  getAvailableThemes() {
    return Object.keys(this.themes);
  }

  getTheme(name: string): ThemeColors {
    return this.themes[name] || this.themes['modern_light'];
  }
}
