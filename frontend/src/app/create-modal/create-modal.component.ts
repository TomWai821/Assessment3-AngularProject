import { CommonModule } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { Component } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatDialog, MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { ComfirmModalComponent } from '../comfirm-modal/comfirm-modal.component';
import { ResponseInterface } from '../model/ResponseData';

@Component({
  selector: 'app-create-modal',
  standalone: true,
  imports: [
      CommonModule,
      MatButtonModule,
      ReactiveFormsModule,
      MatDialogModule,
      MatFormFieldModule, 
      MatInputModule, 
      MatSelectModule 
  ],
  templateUrl: './create-modal.component.html',
  styleUrl: './create-modal.component.css'
})

export class CreateModalComponent 
{
    CreateStudentForm:FormGroup;
    http: HttpClient;
    message = "";

    constructor(fb: FormBuilder, http: HttpClient, private dialogRef: MatDialogRef<CreateModalComponent>, private dialog: MatDialog)
    {
        this.http = http;
        this.CreateStudentForm = fb.group
        (
            {
                'student_id': ['', Validators.required],
                'student_name': ['', Validators.required],
                'email': ['',  [Validators.email, Validators.required]]
            }
        )
    }

    onSubmit(formValue: any) 
    {
        if(formValue.student_id.length < 8)
        {
            this.setMessage("Student ID required 8 digits");
            return;
        }

        if(!formValue.student_id)
        {
            this.setMessage("Please input Student ID!");
            return;
        }

        if(!formValue.student_name)
        {
            this.setMessage("Please input Student Name!");
            return;
        }

        if(!this.CreateStudentForm.controls['email'].valid)
        {
            this.setMessage("Email format is incorrect!");
            return;
        }
        this.openConfirmModal(formValue);
    }


    setMessage(message: string)
    {
        this.message = message;
        setTimeout(() => { this.message = ""; }, 3000);
    }

    onCreate(formValue: any)
    {
        const url = "http://localhost/Student/Student.php/Student/";

        const payload = 
        {
            student_id: formValue.student_id,
            student_name: formValue.student_name,
            email: formValue.email
        };
      
    
        this.http.post(url, payload).subscribe(
        {
            next: (response) => 
            {
                const ReponseData = response as ResponseInterface;
                if(ReponseData.status == 'error')
                {
                    this.message = "Student with current Student ID are already exist!";
                    return;
                }
                this.dialogRef.close(response);
            },
            error: (error) => 
            {
                this.message = "Creation failed: " + error;
            }
        });
    }
        
    closeModal()
    {
        this.dialogRef.close();
    }

    openConfirmModal(formValue: any) 
    {
        const ConfirmModal = this.dialog.open(ComfirmModalComponent,
        {
            width: '800px',
            data: 
            {
                method: 'Create'
            }
        });

        ConfirmModal.afterClosed().subscribe((response: { status: string }) => 
        {
            console.log(response.status);
            if (response && response.status == 'Yes') 
            {
                this.onCreate(formValue);
            }
        });
    }  
}
