import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { InicioComponent } from './feature/inicio/inicio.component';
import { DashboardComponent } from './feature/dashboard/dashboard.component';
import { MiPerfilComponent } from './feature/mi-perfil/mi-perfil.component';

const routes: Routes = [
  { path: '', redirectTo: '/inicio', pathMatch: 'full' },
  { path: 'inicio', component: InicioComponent },
  { path: 'dashboard', component: DashboardComponent },
  { path: 'mi-perfil', component:  MiPerfilComponent}
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
