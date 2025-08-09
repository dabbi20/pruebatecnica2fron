import { Component, OnInit } from '@angular/core';
import { DepartamentoService } from '../../services/departamento.service';
import { Departamento } from '../../models/departamento';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { DepartamentoFormComponent } from '../departamento-form/departamento-form.component';

@Component({
  selector: 'app-departamento-list',
  templateUrl: './departamento-list.component.html',
  styleUrls: ['./departamento-list.component.css'],
  standalone: true,
  imports: [CommonModule, FormsModule, ReactiveFormsModule, DepartamentoFormComponent]
})
export class DepartamentoListComponent implements OnInit {
  departamentos: Departamento[] = [];
  selectedDepartamento: Departamento | null = null;

  constructor(private departamentoService: DepartamentoService) {}

  ngOnInit() {
    this.loadDepartamentos();
  }

  loadDepartamentos() {
    this.departamentoService.getDepartamentos().subscribe({
      next: (departamentos) => {
        this.departamentos = departamentos;
        this.selectedDepartamento = null;
      },
      error: (error) => {
        console.error('Error loading departamentos:', error);
      }
    });
  }

  onNewDepartamento(): void {
    this.selectedDepartamento = {
      codigo: 0,
      nombre: ''
    };
    console.log('Nuevo departamento creado:', this.selectedDepartamento);
  }

  clearSelection() {
    this.selectedDepartamento = null;
  }

  editDepartamento(departamento: Departamento) {
    this.selectDepartamento(departamento);
  }

  selectDepartamento(departamento: Departamento) {
    this.selectedDepartamento = departamento;
  }

  onUpdateDepartamento(updatedDepartamento: Departamento) {
    const isEditing = this.selectedDepartamento && this.selectedDepartamento.codigo !== 0;
    
    if (isEditing) {
      this.departamentoService.updateDepartamento(this.selectedDepartamento!.codigo, updatedDepartamento)
        .subscribe({
          next: () => {
            this.loadDepartamentos();
            this.clearSelection();
          },
          error: (error) => console.error('Error actualizando departamento:', error)
        });
    } else {
      this.departamentoService.createDepartamento(updatedDepartamento)
        .subscribe({
          next: () => {
            this.loadDepartamentos();
            this.clearSelection();
          },
          error: (error) => console.error('Error creando departamento:', error)
        });
    }
  }

  deleteDepartamento(codigo: number) {
    if (confirm('¿Estás seguro de eliminar este departamento?')) {
      this.departamentoService.deleteDepartamento(codigo)
        .subscribe({
          next: () => this.loadDepartamentos(),
          error: (error) => console.error('Error deleting departamento:', error)
        });
    }
  }
}
