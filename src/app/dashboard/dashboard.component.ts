import { CommonModule } from '@angular/common';
import { Component, OnInit, ViewChild } from '@angular/core';
import { Router, RouterModule } from '@angular/router';
import { DocumentService } from '../services/document.service';
import { FormsModule } from '@angular/forms';
import { HTTP_INTERCEPTORS, HttpClientModule } from '@angular/common/http';
import { AlertComponent, AlertService } from 'angular-alerts'
import { navigateToUrl } from 'single-spa';
@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [
    CommonModule,
    RouterModule,
    FormsModule,
    HttpClientModule,
    AlertComponent
  ],
  providers: [
    DocumentService,
    AlertService
  ],
  templateUrl: './dashboard.component.html',
  styleUrl: './dashboard.component.scss'
})
export class DashboardComponent implements OnInit {
  files: any;
  isCreateModalOpen = false;
  newFileTitle = '';

  constructor(private documentService: DocumentService, private alertService: AlertService, private router: Router) {
  }


  ngOnInit(): void {
    this.files = {
      createdByMe: [],
      sharedWithMe: [],
    };
    this.fetchDocuments();
  }

  fetchDocuments(): void {
    this.documentService.getDocuments().subscribe(
      (data) => {
        this.files = data;
      },
      (error) => {
        console.error('Failed to fetch documents:', error);
        if (error.error.message == "Invalid token.") {
          navigateToUrl('/login')
        }
      }
    );
  }

  openCreateModal(): void {
    this.isCreateModalOpen = true;
  }

  closeCreateModal(): void {
    this.isCreateModalOpen = false;
    this.newFileTitle = '';
  }

  createFile(): void {
    if (!this.newFileTitle.trim()) {
      this.alertService.showAlert({
        title: 'Warning!',
        text: 'File title cannot be empty!',
        icon: 'warning',
        iconColor: 'orange',
        showConfirmButton: true,
        confirmButtonText: 'Proceed',
        showCancelButton: true,
        cancelButtonText: 'Cancel',
        animation: true,
      });
      return;
    }

    this.documentService.createDocument(this.newFileTitle).subscribe(
      () => {
        this.fetchDocuments(); // Refresh documents
        this.closeCreateModal();
        this.alertService.showAlert({
          title: 'Success!',
          text: 'File created successfully!',
          icon: 'success',
          iconColor: 'green',
          showConfirmButton: true,
          confirmButtonText: 'OK',
          animation: true,
          backdrop: true,
          html: '<h1>This is heading 1</h1><h2>This is heading 2</h2><h3>This is heading 3</h3><h4>This is heading 4</h4><h5>This is heading 5</h5><h6>This is heading 6</h6>'
        });
      },
      (error) => {
        console.error('Failed to create file:', error);
      }
    );
  }

  deleteFile(id: string): void {
    this.documentService.deleteDocument(id).subscribe(
      () => {
        this.fetchDocuments(); // Refresh documents
        alert('File deleted successfully!');
      },
      (error) => {
        console.error('Failed to delete file:', error);
        if(error.error.message=="Invalid token."){
          navigateToUrl('/login')
        }
      }
    );
  }

  goToEditor(fileId: string): void {
    this.router.navigate(['/editor', fileId]); // Navigate to the editor with the fileId
  }
}
