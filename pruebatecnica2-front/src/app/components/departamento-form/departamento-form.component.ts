import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { Departamento } from '../../models/departamento';

@Component({
  selector: 'app-departamento-form',
  templateUrl: './departamento-form.component.html',
  styleUrls: ['./departamento-form.component.css'],
  standalone: true,
  imports: [CommonModule, FormsModule, ReactiveFormsModule]
})
export class DepartamentoFormComponent implements OnInit {
  @Input() departamento: Departamento | null = null;
  @Output() submit = new EventEmitter<Departamento>();
  @Output() cancel = new EventEmitter<void>();
  
  departamentoForm: FormGroup;
  isEditing = false;

  constructor(private fb: FormBuilder) {
    this.departamentoForm = this.fb.group({
      codigo: ['', Validators.required],
      nombre: ['', Validators.required]
    });
  }

  ngOnInit() {
    if (this.departamento) {
      this.isEditing = true;
      this.departamentoForm.patchValue(this.departamento);
    }
  }

  onSubmit() {
    if (this.departamentoForm.valid) {
      const formData = { ...this.departamentoForm.value };
      this.submit.emit(formData);
    }
  }

  onCancel() {
    this.cancel.emit();
    this.departamentoForm.reset();
  }

  get form() {
    return this.departamentoForm.controls;
  }
}
