import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';
import { RouterModule, Routes } from '@angular/router';

import { AppComponent } from './app.component';
import { EmpleadoFormComponent } from './components/empleado-form/empleado-form.component';
import { EmpleadoListComponent } from './components/empleado-list/empleado-list.component';
import { DepartamentoFormComponent } from './components/departamento-form/departamento-form.component';
import { DepartamentoListComponent } from './components/departamento-list/departamento-list.component';
import { DepartamentoEmpleadosComponent } from './components/departamento-empleados/departamento-empleados.component';

const routes: Routes = [
  { path: 'empleados', component: EmpleadoListComponent },
  { path: 'departamentos', component: DepartamentoListComponent },
  { path: 'departamentos-empleados', component: DepartamentoEmpleadosComponent },
  { path: '', redirectTo: '/empleados', pathMatch: 'full' }
];

@NgModule({
  declarations: [],
  imports: [
    BrowserModule,
    FormsModule,
    ReactiveFormsModule,
    HttpClientModule,
    RouterModule.forRoot(routes),

    AppComponent,
    EmpleadoListComponent,
    DepartamentoListComponent,
    DepartamentoEmpleadosComponent
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
