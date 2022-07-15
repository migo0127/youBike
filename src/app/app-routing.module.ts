import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { MapComponent } from './components';

const routes: Routes = [
  { path: "", redirectTo: "map", pathMatch: "full" },
  { path: "map", component: MapComponent },
  { path: "**", component: MapComponent },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
