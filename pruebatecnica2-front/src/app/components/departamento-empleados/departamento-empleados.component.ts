import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { first } from 'rxjs/operators';

import { DepartamentoService } from '../../services/departamento.service';
import { EmpleadoService } from '../../services/empleado.service';
import { Departamento } from '../../models/departamento';
import { Empleado } from '../../models/empleado';

@Component({
  standalone: true,
  imports: [CommonModule, FormsModule],
  selector: 'app-departamento-empleados',
  templateUrl: './departamento-empleados.component.html',
  styleUrls: ['./departamento-empleados.component.css']
})
export class DepartamentoEmpleadosComponent implements OnInit {
  // Lista de departamentos
  departamentos: Departamento[] = [];
  
  // Lista de todos los empleados
  empleados: Empleado[] = [];
  
  // Empleados agrupados por departamento
  empleadosPorDepartamento: { [key: number]: Empleado[] } = {};
  
  // Departamento actualmente seleccionado
  selectedDept: Departamento | null = null;
  
  // Estados de carga y error
  loading = true;
  error: string | null = null;

  constructor(
    private departamentoService: DepartamentoService,
    private empleadoService: EmpleadoService
  ) {}

  ngOnInit() {
    this.loadDepartamentosYEmpleados();
  }

  /**
   * Maneja la selección de un departamento
   * @param dept Departamento seleccionado
   */
  selectDepartamento(dept: Departamento): void {
    this.selectedDept = dept;
  }

  /**
   * Carga los departamentos y empleados
   */
  loadDepartamentosYEmpleados(): void {
    this.loading = true;
    this.error = null;
    
    // Cargar departamentos
    this.departamentoService.getDepartamentos()
      .pipe(first())
      .subscribe({
        next: (departamentos) => {
          this.departamentos = departamentos;
          
          // Cargar empleados después de cargar los departamentos
          this.loadEmpleados();
        },
        error: (error) => {
          console.error('Error al cargar departamentos:', error);
          this.error = 'Error al cargar la lista de departamentos';
          this.loading = false;
        }
      });
  }

  /**
   * Carga los empleados y los organiza por departamento
   */
  private loadEmpleados(): void {
    this.empleadoService.getEmpleados()
      .pipe(first())
      .subscribe({
        next: (empleados) => {
          this.empleados = empleados;
          this.organizarEmpleadosPorDepartamento();
          
          // Seleccionar el primer departamento por defecto si hay departamentos
          if (this.departamentos.length > 0) {
            this.selectedDept = this.departamentos[0];
          }
          
          this.loading = false;
        },
        error: (error) => {
          console.error('Error al cargar empleados:', error);
          this.error = 'Error al cargar la lista de empleados';
          this.loading = false;
        }
      });
  }

  /**
   * Organiza los empleados por departamento
   */
  private organizarEmpleadosPorDepartamento(): void {
    // Inicializar el objeto para cada departamento
    this.empleadosPorDepartamento = {};
    
    // Inicializar un array vacío para cada departamento
    this.departamentos.forEach(dept => {
      this.empleadosPorDepartamento[dept.codigo] = [];
    });
    
    // Agrupar empleados por departamento
    this.empleados.forEach(empleado => {
      if (empleado.codigo_departamento !== undefined) {
        if (!this.empleadosPorDepartamento[empleado.codigo_departamento]) {
          this.empleadosPorDepartamento[empleado.codigo_departamento] = [];
        }
        this.empleadosPorDepartamento[empleado.codigo_departamento].push(empleado);
      }
    });
  }
}
