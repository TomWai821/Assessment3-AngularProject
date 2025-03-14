import { HttpClient, } from '@angular/common/http';
import { Component, Inject } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialog, MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { StudentInterface } from '../model/ResponseData';
import { CommonModule } from '@angular/common';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { ComfirmModalComponent } from '../comfirm-modal/comfirm-modal.component';

@Component({
    selector: 'app-delete-modal',
    standalone: true,
    imports: [CommonModule,
      MatButtonModule,
      ReactiveFormsModule,
      MatDialogModule,
      MatFormFieldModule, 
      MatInputModule, 
      MatSelectModule 
    ],
    templateUrl: './delete-modal.component.html',
    styleUrl: './delete-modal.component.css'
})

export class DeleteModalComponent 
{
    dialogRef: MatDialogRef<DeleteModalComponent>;
    private http: HttpClient;
    DeleteStudentForm: FormGroup;
    message: string = "";
    isDeleting = false;

    constructor(dialogRef: MatDialogRef<DeleteModalComponent>, http: HttpClient, fb: FormBuilder, private dialog: MatDialog, @Inject(MAT_DIALOG_DATA) public data: StudentInterface)
    {
        this.dialogRef = dialogRef;
        this.http = http;
        this.DeleteStudentForm = fb.group
        (
            {
                'student_id': [{value: data.student_id, disabled: true}, Validators.required],
                'student_name': [{value: data.student_name, disabled: true}, Validators.required],
                'email': [{value: data.email, disabled: true}]
            }
        )
    }

    confirmDelete() 
    {
        if(this.isDeleting)
        {
            return;
        }
        this.openConfirmModal();
    }

    onDelete()
    {
        const url = `http://localhost:4433/Student/Student.php/Student/StudentID/${this.data.student_id}`;

        this.http.delete<{success: boolean, message: string}>(url)
        .subscribe(
            {
                next:(response: any) => 
                {
                    console.log(response); 
                    this.dialogRef.close(response);
                }, 
                error:(error: any) => 
                {
                    console.log(error); 
                    this.dialogRef.close(error);
                },
            }
        )
    }


    openConfirmModal() 
    {
        const ConfirmModal = this.dialog.open(ComfirmModalComponent,
        {
            width: '800px',
            data: 
            {
                method: 'Delete' 
            }
        });

        ConfirmModal.afterClosed().subscribe((response: { status: string }) => 
        {
            if (response && response.status == 'Yes') 
            {
                this.isDeleting = true;
                this.onDelete();
            }
        });
    }  


    closeModal() 
    {
        this.dialogRef.close();
    }
}


