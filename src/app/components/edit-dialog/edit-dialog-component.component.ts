import { Component,Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';

@Component({
  selector: 'app-edit-dialog-component',
  templateUrl: './edit-dialog-component.component.html',
  styleUrls: ['./edit-dialog-component.component.css']
})
export class EditDialogComponentComponent {
  constructor(
    public dialogRef: MatDialogRef<EditDialogComponentComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) {}

  onNoClick(): void {
    this.dialogRef.close();
  }
}



