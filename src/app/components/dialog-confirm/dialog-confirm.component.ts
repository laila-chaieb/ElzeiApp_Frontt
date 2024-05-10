import { Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { Rule } from 'src/app/models/Rule.model';

@Component({
  selector: 'app-dialog-confirm',
  templateUrl: './dialog-confirm.component.html',
  styleUrls: ['./dialog-confirm.component.css']
})
export class DialogConfirmComponent {
  constructor(
    public dialogRef: MatDialogRef<DialogConfirmComponent>,
    @Inject(MAT_DIALOG_DATA)
     public data: Rule
  ) {console.log(Rule)}

  onNoClick(): void {
    this.dialogRef.close();
  } 
}
