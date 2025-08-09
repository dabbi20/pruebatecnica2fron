import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { EmpleadoService } from '../../services/empleado.service';
import { Empleado } from '../../models/empleado';
import { ReactiveFormsModule } from '@angular/forms';
import { EmpleadoFormComponent } from '../empleado-form/empleado-form.component';

@Component({
  selector: 'app-empleado-list',
  templateUrl: './empleado-list.component.html',
  styleUrls: ['./empleado-list.component.css'],
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, EmpleadoFormComponent]
})
export class EmpleadoListComponent implements OnInit {
  empleados: Empleado[] = [];
  selectedEmpleado: Empleado | null = null;

  constructor(private empleadoService: EmpleadoService) {}

  ngOnInit() {
    this.loadEmpleados();
  }

  loadEmpleados() {
    this.empleadoService.getEmpleados().subscribe({
      next: (empleados: Empleado[]) => {
        this.empleados = empleados;
        this.selectedEmpleado = null;
      },
      error: (error: any) => {
        console.error('Error loading empleados:', error);
      }
    });
  }

  onNewEmpleado(): void {
    this.selectedEmpleado = {
      codigo: 0,
      nombre: '',
      apellido1: '',
      apellido2: '',
      codigo_departamento: 0
    };
  }

  clearSelection(): void {
    this.selectedEmpleado = null;
  }

  editEmpleado(empleado: Empleado): void {
    this.selectedEmpleado = empleado;
  }

  selectEmpleado(empleado: Empleado): void {
    this.selectedEmpleado = empleado;
  }

  deleteEmpleado(codigo: number): void {
    if (confirm('¿Está seguro de que desea eliminar este empleado?')) {
      this.empleadoService.deleteEmpleado(codigo)
        .subscribe({
          next: () => this.loadEmpleados(),
          error: (error: any) => console.error('Error deleting empleado:', error)
        });
    }
  }

  onUpdateEmpleado(empleado: Empleado): void {
    const isEditing = this.selectedEmpleado && this.selectedEmpleado._id;
    
    if (isEditing && this.selectedEmpleado?._id) {
      // Para actualizar, usamos el _id de MongoDB
      this.empleadoService.updateEmpleado(this.selectedEmpleado._id, empleado)
        .subscribe({
          next: () => {
            this.loadEmpleados();
            this.clearSelection();
          },
          error: (error: any) => {
            console.error('Error actualizando empleado:', error);
            alert('Error al actualizar el empleado: ' + (error.error?.message || error.message));
          }
        });
    } else {
      // Para crear un nuevo empleado
      this.empleadoService.createEmpleado(empleado)
        .subscribe({
          next: () => {
            this.loadEmpleados();
            this.clearSelection();
          },
          error: (error: any) => {
            console.error('Error creando empleado:', error);
            alert('Error al crear el empleado: ' + (error.error?.message || error.message));
          }
        });
    }
  }
}
