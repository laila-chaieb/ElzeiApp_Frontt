import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ComptesListComponent } from './components/comptes-list/comptes-list.component';
import { CompteDetailsComponent } from './components/compte-details/compte-details.component';
import { AddCompteComponent } from './components/add-compte/add-compte.component';
import { ListeClassesComponent } from './components/liste-classes/liste-classes.component';
import { IndexComponent } from './components/index/index.component';
import { AddClasseComponent } from './components/add-classe/add-classe.component';

import { TableauComptesComponent } from './components/tableau-comptes/tableau-comptes.component';
import { ListeOperationsComponent } from './components/liste-operations/liste-operations.component';
import { OpertationDetailsComponent } from './components/opertation-details/opertation-details.component';


const routes: Routes = [
  { path: '', redirectTo: 'home', pathMatch: 'full' },
  { path: 'Comptes', component: ComptesListComponent },
  { path: 'Comptes/:id', component: CompteDetailsComponent },
  { path: 'Classes', component: ListeClassesComponent },
  { path: 'home', component: IndexComponent },
  { path: 'addClass', component: AddClasseComponent },
  { path: 'add', component: AddCompteComponent },
  { path: 'PCG', component: TableauComptesComponent },
  { path: 'operation', component: ListeOperationsComponent },
  { path: 'detailsOperation/:id', component: OpertationDetailsComponent },


  { path: '**', redirectTo: 'home' } // Redirection vers 'home' pour les chemins inconnus
];


@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
