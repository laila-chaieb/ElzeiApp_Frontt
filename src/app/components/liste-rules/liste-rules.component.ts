import { Component } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Rule } from 'src/app/models/Rule.model';
import { RuleService } from 'src/app/services/Rule.service';

@Component({
  selector: 'app-liste-rules',
  templateUrl: './liste-rules.component.html',
  styleUrls: ['./liste-rules.component.css']
})
export class ListeRulesComponent {
// search.component.ts

Rules: Rule[] = [];
searchTerm: string = '';
searchPrenom: string = ''; // Ajoutez cette propriété pour le prénom
searchMatricule: string = ''; // Ajoutez cette propriété pour le matricule
selectedSalary: Rule | null = null;



constructor(private RulesService: RuleService, private router: Router,private activatedRoute: ActivatedRoute,) { }

ngOnInit(): void {
  this.loadRules();
}

loadRules(): void {
  this.RulesService.getRules().subscribe(Rules => {
    this.Rules = Rules;
  });
}



viewDetails(salarie: Rule): void {
  this.router.navigate(['Rulesdetails', salarie.id]);
}

selectSalary(Rules: Rule): void {
  this.selectedSalary = Rules;
}
}

