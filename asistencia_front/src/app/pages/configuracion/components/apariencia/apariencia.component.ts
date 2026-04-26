import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ThemeService, ThemeColors } from '../../../../services/theme.service';
import { NotificationService } from '../../../../services/notification.service';

@Component({
  selector: 'app-config-apariencia',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './apariencia.component.html',
  styleUrls: ['./apariencia.component.css']
})
export class AparienciaComponent implements OnInit {
  @Input() customColors: ThemeColors = { primary: '#6366f1', secondary: '#06b6d4', background: '#f8fafc', text: '#0f172a', isDark: false };
  @Output() colorsChanged = new EventEmitter<ThemeColors>();

  themeList: any[] = [];

  constructor(
    private themeService: ThemeService,
    private notify: NotificationService
  ) { }

  ngOnInit(): void {
    this.initThemes();
  }

  private initThemes(): void {
    const available = this.themeService.getAvailableThemes();
    this.themeList = available.map(id => ({
      id,
      name: id.replace('_', ' ').toUpperCase(),
      colors: this.themeService.getTheme(id)
    }));
  }

  selectTheme(id: string): void {
    const theme = this.themeService.getTheme(id);
    this.customColors = { ...theme };
    this.themeService.setTheme(id);
    this.colorsChanged.emit(this.customColors);
    this.notify.success(`Esquema ${id} seleccionado`);
  }

  onColorChange(): void {
    this.colorsChanged.emit(this.customColors);
  }

  applyCustom(): void {
    this.themeService.setCustomColors(this.customColors);
    this.notify.success('Configuración visual guardada correctamente');
  }
}
