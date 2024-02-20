import { Component } from '@angular/core';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
 // Dans le fichier app.component.ts
 isDropdownOpen: boolean[] = [false, false];

 toggleDropdown(index: number): void {
   this.isDropdownOpen[index] = !this.isDropdownOpen[index];
 }
 closeDropdown() {
  this.isDropdownOpen[0] = false;
  this.isDropdownOpen[1] = false;
}
  title = 'gestion_Compte';
}