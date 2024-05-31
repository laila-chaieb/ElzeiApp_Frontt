import { Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { ActivatedRoute, Router } from '@angular/router';
import { Operation } from 'src/app/models/operation.model';
import { CompteService } from 'src/app/services/compte.service';
import { OperationService } from 'src/app/services/operation.service';

@Component({
  selector: 'app-dialog-delete',
  templateUrl: './dialog-delete.component.html',
  styleUrls: ['./dialog-delete.component.css']
})
export class DialogDeleteComponent {

  Operation!:Operation;
  constructor(private operationService: OperationService,
    private activatedRoute: ActivatedRoute,
    private router: Router,
    
    private compteService: CompteService,
   
    public dialogRef: MatDialogRef<DialogDeleteComponent>,
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

