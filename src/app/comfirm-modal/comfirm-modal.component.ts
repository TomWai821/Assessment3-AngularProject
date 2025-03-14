import { Component, Inject } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { MatButtonModule } from '@angular/material/button';

@Component({
  selector: 'app-comfirm-modal',
  standalone: true,
  imports: [MatButtonModule],
  templateUrl: './comfirm-modal.component.html',
  styleUrl: './comfirm-modal.component.css'
})

export class ComfirmModalComponent 
{
    ConfirmForm: FormGroup;

    constructor(private dialogRef: MatDialogRef<ComfirmModalComponent>, fb:FormBuilder, @Inject(MAT_DIALOG_DATA) public data: any)
    {
        this.ConfirmForm = fb.group
        (
            {
                'method': [data.method, Validators.required],
                'color': [data.color, Validators.required]
            }
        )
    }

    closeModal(value: string) 
    {
        const response = { status: value }; 
        this.dialogRef.close(response);
    }

}
