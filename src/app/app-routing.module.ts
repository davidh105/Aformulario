import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { HomeComponent } from './component/home/home.component';
import { Pagina1Component } from './component/pagina1/pagina1.component';
import { Pagina2Component } from './component/pagina2/pagina2.component';

// Rutas de navegacion
const routes: Routes = [
  {path:'', redirectTo: '/home', pathMatch: 'full'},
  {path:'home', component: HomeComponent},
  {path:'pagina1', component: Pagina1Component},
  {path:'pagina2', component: Pagina2Component}


];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
