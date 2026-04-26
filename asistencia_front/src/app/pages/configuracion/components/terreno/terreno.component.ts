import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { PuntoTerrenoService } from '../../../../services/punto-terreno.service';
import { TrabajadorService } from '../../../../services/trabajador.service';
import { NotificationService } from '../../../../services/notification.service';
import { TrabajadorResponse } from '../../../../models/trabajador.interface';

@Component({
  selector: 'app-config-terreno',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './terreno.component.html',
  styleUrls: ['./terreno.component.css']
})
export class TerrenoComponent implements OnInit {
  trabajadoresTerreno: any[] = [];
  jefes: TrabajadorResponse[] = [];
  newPuntoTerreno: any = { trabajadorId: null, latitud: null, longitud: null, nombreUbicacion: '' };

  constructor(
    private puntoTerrenoService: PuntoTerrenoService,
    private trabajadorService: TrabajadorService,
    private notify: NotificationService
  ) { }

  ngOnInit(): void {
    this.loadTerrenoData();
  }

  loadTerrenoData(): void {
    this.puntoTerrenoService.listarPuntos().subscribe(data => this.trabajadoresTerreno = data);
    this.trabajadorService.listar().subscribe(data => {
      this.jefes = data.filter(t => t.esJefeTerreno === true || t.rolId === 3 || t.rolId === 4);
    });
  }

  saveTerreno(): void {
    if (!this.newPuntoTerreno.trabajadorId || !this.newPuntoTerreno.latitud || !this.newPuntoTerreno.longitud) {
      this.notify.warning('Complete todos los campos requeridos');
      return;
    }
    this.puntoTerrenoService.crearPunto(this.newPuntoTerreno).subscribe({
      next: () => {
        this.notify.success('Punto registrado');
        this.loadTerrenoData();
        this.newPuntoTerreno = { trabajadorId: null, latitud: null, longitud: null, nombreUbicacion: '' };
      },
      error: () => this.notify.error('Error al registrar punto')
    });
  }
}
