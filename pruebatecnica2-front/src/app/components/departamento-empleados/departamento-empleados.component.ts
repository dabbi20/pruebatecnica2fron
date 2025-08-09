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
  
  departamentos: Departamento[] = [];
  
  
  empleados: Empleado[] = [];
  
  
  empleadosPorDepartamento: { [key: number]: Empleado[] } = {};
  
  
  selectedDept: Departamento | null = null;
  
  
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

 
  loadDepartamentosYEmpleados(): void {
    this.loading = true;
    this.error = null;
    
  
    this.departamentoService.getDepartamentos()
      .pipe(first())
      .subscribe({
        next: (departamentos) => {
          this.departamentos = departamentos;
          
          
          this.loadEmpleados();
        },
        error: (error) => {
          console.error('Error al cargar departamentos:', error);
          this.error = 'Error al cargar la lista de departamentos';
          this.loading = false;
        }
      });
  }

  
  private loadEmpleados(): void {
    this.empleadoService.getEmpleados()
      .pipe(first())
      .subscribe({
        next: (empleados) => {
          this.empleados = empleados;
          this.organizarEmpleadosPorDepartamento();
          
          
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

 
  private organizarEmpleadosPorDepartamento(): void {
    
    this.empleadosPorDepartamento = {};
    
    
    this.departamentos.forEach(dept => {
      this.empleadosPorDepartamento[dept.codigo] = [];
    });
    
   
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
