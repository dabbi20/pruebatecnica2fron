import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule } from '@angular/forms';
import { Empleado } from '../../models/empleado';
import { DepartamentoService } from '../../services/departamento.service';

@Component({
  selector: 'app-empleado-form',
  templateUrl: './empleado-form.component.html',
  styleUrls: ['./empleado-form.component.css'],
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule]
})
export class EmpleadoFormComponent implements OnInit {
  @Input() empleado: Empleado | null = null;
  @Output() submit = new EventEmitter<Empleado>();
  @Output() cancel = new EventEmitter<void>();
  
  empleadoForm: FormGroup;
  departamentos: any[] = [];
  isEditing = false;

  constructor(
    private fb: FormBuilder,
    private departamentoService: DepartamentoService
  ) {
    this.empleadoForm = this.fb.group({
      codigo: ['', Validators.required],
      nombre: ['', Validators.required],
      apellido1: ['', Validators.required],
      apellido2: ['', Validators.required],
      codigo_departamento: ['', Validators.required]
    });
  }

  ngOnInit() {
    this.departamentoService.getDepartamentos().subscribe(departamentos => {
      this.departamentos = departamentos;
    });

    if (this.empleado) {
      this.isEditing = true;
      this.empleadoForm.patchValue(this.empleado);
    }
  }

  onSubmit() {
    if (this.empleadoForm.valid) {
      this.submit.emit(this.empleadoForm.value);
      this.empleadoForm.reset();
    }
  }

  onCancel() {
    this.cancel.emit();
    this.empleadoForm.reset();
  }

  get form() {
    return this.empleadoForm.controls;
  }
}
