import { Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { ActivatedRoute, Router } from '@angular/router';
import { Operation } from 'src/app/models/operation.model';
import { CompteService } from 'src/app/services/compte.service';
import { OperationService } from 'src/app/services/operation.service';

@Component({
  selector: 'app-dialog-valide',
  templateUrl: './dialog-valide.component.html',
  styleUrls: ['./dialog-valide.component.css']
})
export class DialogValideComponent {

  Operation!:Operation;
  constructor(private operationService: OperationService,
    private activatedRoute: ActivatedRoute,
    private router: Router,
    
    private compteService: CompteService,
   
    public dialogRef: MatDialogRef<DialogValideComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) {
    this.operationService.getOperationById(data.id).subscribe((res:Operation) => {
      this.Operation = res;
      console.log(res) ;
         });
    console.log(data)}

  onNoClick(): void {
    this.dialogRef.close();
  }

}