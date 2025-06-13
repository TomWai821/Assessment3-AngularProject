import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { HttpClient } from '@angular/common/http';

// For MUI
import { MatFormFieldModule } from '@angular/material/form-field'
import { MatTableModule } from '@angular/material/table';
import { MatInputModule } from '@angular/material/input'; 
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatSelectModule } from '@angular/material/select';
import { MatDialogModule, MatDialog } from '@angular/material/dialog';

// For Modal Import
import { EditModalComponent } from '../edit-modal/edit-modal.component';
import { DeleteModalComponent } from '../delete-modal/delete-modal.component';

// For model
import { ErrorMessageInerface, ResponseInterface, StudentInterface } from '../model/ResponseData';
import { CreateModalComponent } from '../create-modal/create-modal.component';

@Component({
  selector: 'app-search-student',
  standalone: true,
  imports: [
    MatFormFieldModule, 
    ReactiveFormsModule, 
    CommonModule, 
    MatTableModule, 
    MatInputModule, 
    MatButtonModule,
    MatIconModule,
    MatSelectModule, 
    MatDialogModule
],
  templateUrl: './search-student.component.html',
  styleUrl: './search-student.component.css'
})

export class SearchStudentComponent
{
    displayedColumn: string[] = ['student_id', 'student_name', 'email', 'actions'];
    isStudentIDSelected: boolean = false;
    http: HttpClient;
    searchForm: FormGroup;
    serverData: any | null;
    serverDataArray: any;
    message: string = "";

    constructor(private fb: FormBuilder, http: HttpClient, private dialog: MatDialog)
    {   
        this.http = http;
        this.searchForm = this.fb.group(
            {
                student_id: [''],     
                student_name: ['']       
            }
        )
    }

    toggleInput(selectValue: string) 
    {
        this.isStudentIDSelected = selectValue === 'student_id';
        console.log(selectValue);

        if(!this.isStudentIDSelected)
        {
            // set email InputField as null while user select student_name
            this.searchForm.get('student_id')?.setValue('');
        }
        else
        {
            // set student_name InputField as null while user select email
            this.searchForm.get('student_name')?.setValue('');
        }
    }

    onSubmit(formValue: any)
    {
        if(this.isStudentIDSelected == true && (formValue.student_id.length < 8 || formValue.student_id.length > 8))
        {
            this.setMessage("Student ID required 8 digits!");
            return;
        }
        this.onGet(formValue);
    }

    onGet(formValue: any)
    {
        let url = "http://localhost/Student/Student.php/Student/";

        if(formValue.student_name)
        {
            url += "StudentName/" + encodeURIComponent(formValue.student_name);
        }

        if(formValue.student_id)
        {
           url += "StudentID/" + encodeURIComponent(formValue.student_id);
        }

        this.http.get(url).subscribe
        (
            {
                next: (res: any) =>
                {
                    this.serverData = res as ResponseInterface | ErrorMessageInerface;

                    if(this.serverData.status == 'success')
                    {
                        if(Array.isArray(this.serverData.messageReturn))
                        {
                            this.serverDataArray = this.serverData.messageReturn;
                            this.setMessage("Fetch data successfully!");
                        }
                        else
                        {
                            this.setMessage("There are no record with current value!");
                        }
                    }
                },
                error: (error) => 
                {
                    this.setMessage("Failed to fetch Data");
                }
            }
        )
    }

    setMessage(message: string)
    {
        this.message = message;
        setTimeout(() => { this.message = ""; }, 3000);
    }

    createModalButton() 
    {
        const CreateDialogRef = this.dialog.open(CreateModalComponent,
        {
            width: '500px',
        });
        this.reloadAfterSuccess(CreateDialogRef);
    }

    openEditModal(data: StudentInterface) 
    {
        const EditDialogRef = this.dialog.open(EditModalComponent,
        {
            width: '500px',
            data: 
            {
                student_id: data.student_id,
                student_name: data.student_name,
                email: data.email
            }
        });

        this.reloadAfterSuccess(EditDialogRef);
    }  

    openDeleteModal(data: any) 
    {
        const DeleteDialogRef = this.dialog.open(DeleteModalComponent, 
        {
            width: '800px',
            data: 
            {
                student_id: data.student_id,
                student_name: data.student_name,
                email: data.email
            }
        });

        this.reloadAfterSuccess(DeleteDialogRef);
    }

    reloadAfterSuccess(dialogRef: any)
    {
        dialogRef.afterClosed().subscribe((response: { status: string }) => 
        {
            if (response && response.status) 
            {
                this.onGet(this.searchForm.value);
            }
        });
    }

}
