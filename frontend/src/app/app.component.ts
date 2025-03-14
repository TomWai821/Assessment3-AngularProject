import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { MatDividerModule } from '@angular/material/divider';
import { SearchStudentComponent } from './search-student/search-student.component';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, MatDividerModule, SearchStudentComponent],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css'
})
export class AppComponent {
  title = 'Assessment3';
}

