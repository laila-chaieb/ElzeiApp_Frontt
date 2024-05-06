import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Rule } from 'src/app/models/Rule.model';
import { RuleService } from 'src/app/services/Rule.service';

@Component({
  selector: 'app-create-rule',
  templateUrl: './create-rule.component.html',
  styleUrls: ['./create-rule.component.css']
})
export class CreateRuleComponent implements OnInit{
  Rule :Rule= {
    id: 0,
    description: "",
    condition: "",
    tauxTVA:0,
    type: "",
    code: "",
    
  }
  
  myForm!: FormGroup;
  router: any;
  showParagraph: boolean | undefined;
  coefficientOptions: string[] = [];
  constructor(private fb: FormBuilder, private RuleService: RuleService) {} // Inject RuleService

  ngOnInit(): void {
    this.myForm = this.fb.group({
 
      description: [''],
      condition: [''],
      tauxTVA: [''],
      type: [''],
      code: [''],
      
    });
  }

  submitForm(): void {
    const description = this.myForm.get('description')?.value;
    const condition = this.myForm.get('condition')?.value;
    const tauxTVA = this.myForm.get('tauxTVA')?.value;
    const type = this.myForm.get('type')?.value;
    const code = this.myForm.get('code')?.value;

    console.log(description, condition, tauxTVA, type,code);
  }

  
  save(): void {
  
    const formData = this.myForm.value;
    const bodyData = {
      description: formData.description,
      condition: formData.condition,
      tauxTVA: formData.tauxTVA,
      type: formData.type,  
      code: formData.code,    
    };
    console.log( bodyData);

    this.RuleService.create(bodyData).subscribe(
      (res) => {
        console.log('rule created successfully:', res);
      },
      (error) => {
        console.error('Error occurred while creating rule:', error);
      }
    );
  }



}
