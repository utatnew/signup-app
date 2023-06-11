import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import {SignUpFormComponent} from "./sign-up-form/sign-up-form.component";

const routes: Routes = [
  { path: 'signup', component: SignUpFormComponent },
  { path: '',   redirectTo: '/signup', pathMatch: 'full' }
];


@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
