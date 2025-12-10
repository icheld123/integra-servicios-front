import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { InicioComponent } from './feature/inicio/inicio.component';
import { DashboardComponent } from './feature/dashboard/dashboard.component';
import { MiPerfilComponent } from './feature/mi-perfil/mi-perfil.component';
import { PrestamoComponent } from './feature/prestamo/prestamo.component';
import { PanelAdminComponent } from './feature/panel-admin/panel-admin.component';

const routes: Routes = [
  { path: '', redirectTo: '/inicio', pathMatch: 'full' },
  { path: 'inicio', component: InicioComponent },
  { path: 'dashboard', component: DashboardComponent },
  { path: 'mi-perfil', component:  MiPerfilComponent},
  { path: 'genera-prestamo', component:  PrestamoComponent},
  { path: 'administracion', component:  PanelAdminComponent}
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
