import { CommonModule } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { Component, Inject } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MAT_DIALOG_DATA, MatDialog, MatDialogRef } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { ResponseInterface, StudentInterface } from '../model/ResponseData';
import { ComfirmModalComponent } from '../comfirm-modal/comfirm-modal.component';

@Component({
  selector: 'app-edit-modal',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,
    MatButtonModule
  ],
  templateUrl: './edit-modal.component.html',
  styleUrl: './edit-modal.component.css'
})

export class EditModalComponent 
{
    dialogRef: MatDialogRef<EditModalComponent>;
    EditStudentForm: FormGroup;
    http: HttpClient;
    message:string = "";
    responseData: ResponseInterface | undefined;

    constructor(dialogRef: MatDialogRef<EditModalComponent>, http: HttpClient, private dialog: MatDialog, fb: FormBuilder, @Inject(MAT_DIALOG_DATA) public data: StudentInterface)
    {
        this.dialogRef = dialogRef;
        this.http = http;
        this.EditStudentForm = fb.group
        (
            {
                'student_id': [{value: data.student_id, disabled: true}, Validators.required],
                'student_name': [data.student_name, Validators.required],
                'email': [data.email, [Validators.email, Validators.required]]
            }
        )
    }

    onSubmit(formValue: any) 
    {
        if(!formValue.student_name)
        {
            this.setMessage("Please input Student Name!");
            return;
        }

        if(!this.EditStudentForm.controls['email'].valid)
        {
            this.setMessage("Email format is incorrect!");
            return;
        }

        this.openConfirmModal(formValue);
    }

    onEdit(formValue: any)
    {
        const url = `http://localhost/Student/Student.php/Student/`;

        const updatedData = 
        {
            student_id: this.data.student_id,
            student_name: formValue.student_name,
            email: formValue.email || null,
        };

        this.http.put(url, updatedData).subscribe
        (
            {
                next:(response) =>
                {
                    console.log(response)
                    this.dialogRef.close(response);
                },
                error: (error) => 
                {
                    console.log(error);
                    this.message = "SQL failure while update, please try it again later";
                }
            }
        )
    }

    openConfirmModal(formValue: any) 
    {
        const ConfirmModal = this.dialog.open(ComfirmModalComponent,
        {
            width: '800px',
            data: 
            {
                method: 'Edit'
            }
        });
        
        ConfirmModal.afterClosed().subscribe((response: { status: string }) => 
        {
            if (response && response.status == 'Yes') 
            {
                this.onEdit(formValue);
            }
        });
    }

    closeModal() 
    {
        this.dialogRef.close();
    }

    setMessage(message: string)
    {
        this.message = message;
        setTimeout(() => { this.message = ""; }, 3000);
    }
}
