import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AdminComponent } from './admin.component';
import { MainComponent } from './main/main.component';

const routes: Routes = [
  { path: '', component: AdminComponent,
    children: [
      { path: 'main', component: MainComponent}
    ]
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class AdminRoutingModule { }
