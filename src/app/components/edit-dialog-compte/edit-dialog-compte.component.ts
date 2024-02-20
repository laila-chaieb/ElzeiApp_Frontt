import { Component,Inject} from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';

@Component({
  selector: 'app-edit-dialog-compte',
  templateUrl: './edit-dialog-compte.component.html',
  styleUrls: ['./edit-dialog-compte.component.css']
})
export class EditDialogCompteComponent {
  constructor(
    public dialogRef: MatDialogRef<EditDialogCompteComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) {}

  onNoClick(): void {
    this.dialogRef.close();
  }

}
