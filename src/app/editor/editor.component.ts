import { AfterViewChecked, Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { SocketService } from '../socket.service';
import { FormsModule } from '@angular/forms';
import { BrowserModule } from '@angular/platform-browser';
import { CommonModule } from '@angular/common';
import Quill from 'quill';
import * as Prism from 'prismjs';  // Import Prism.js
import { io, Socket } from 'socket.io-client';
import hljs from 'highlight.js';
import { ActivatedRoute, Router } from '@angular/router';
import { DocumentService } from '../services/document.service';
import { navigateToUrl } from 'single-spa';
import { AlertComponent, AlertService } from 'angular-alerts';

@Component({
  selector: 'app-editor',
  templateUrl: './editor.component.html',
  styleUrls: ['./editor.component.scss'],
  standalone: true,
  imports: [FormsModule, CommonModule, AlertComponent],
  providers: [AlertService]
})
export class EditorComponent implements OnInit {
  @ViewChild('editor', { static: true }) editor!: ElementRef;
  socket!: Socket;
  quillEditor!: Quill;
  documentContent: string = '';
  delta: any;
  documentId!: string;
  document: any = {
    title: '',
    content: '',
    collaborators: [],
  };
  newCollaborator: string = '';
  isTyping = false;
  constructor(private route: ActivatedRoute,
    private documentService: DocumentService,
    private router: Router,
    private alertService: AlertService
  ) { }


  ngOnInit(): void {
    this.documentId = this.route.snapshot.paramMap.get('fileId')!;
    this.socket = io('http://localhost:5000'); // Backend URL
    this.socket.emit('join-document', this.documentId);

    if (this.documentId) {
      this.loadDocument(this.documentId);
    }
    // this.connectToSocket();
  }
  initializeQuill(): void {
    this.quillEditor = new Quill(this.editor.nativeElement, {
      theme: 'snow', // or 'bubble'
      modules: {
        toolbar: [
          [{ 'header': [1, 2, false] }],
          ['bold', 'italic', 'underline'],
          ['link', 'image'],
          [{ 'list': 'ordered' }, { 'list': 'bullet' }]
        ]
      },

      formats: ['bold', 'italic', 'underline', 'link', 'image', 'list', 'header']
    });
      this.quillEditor.on('text-change', (delta, oldDelta, source) => {
        if (source === 'user' && !this.isTyping) {
          this.socket.emit('update-document', { documentId: this.documentId, delta });
        }
      });
      document.querySelectorAll('pre').forEach((block) => {
        hljs.highlightBlock(block);  // Apply syntax highlighting
      });
  }

  loadDocument(documentId: string): void {
    this.documentService.getDocumentById(documentId).subscribe(
      (data) => {
        this.document = data;
        // this.quillEditor.updateContents(data.content);
        this.documentContent = data.content || '';
        this.initializeQuill();
        this.socket.on('receive-changes', (delta: any) => {
          this.isTyping = true;
          this.quillEditor.updateContents(delta); // Apply the Delta changes
          this.isTyping = false;
        });

        // Load initial document content
        this.socket.on('load-document', (content: any) => {
          this.quillEditor.setContents(content); // Load Delta content
        });
      },
      (error) => {
        console.error('Failed to load document:', error);
        if (error.error.message == "Invalid token." || error.error.message == "Invalid token") {
          navigateToUrl('/login')
        }
      }
    );
  }

  addCollaborator(): void {
    if (this.newCollaborator.trim()) {
      // Call API to add collaborator
      this.documentService.shareDocument(this.document._id, this.newCollaborator, 'write').subscribe(
        (data) => {
          this.document.collaborators.push(data);
          this.newCollaborator = '';
        },
        (error) => {
          console.error('Failed to add collaborator:', error);
          if (error.error.message == 'User is already a collaborator.' || error.error.message == 'User not found.') {
            this.alertService.showAlert({
              title: 'Warning!',
              text: error.error.message,
              icon: 'warning',
              iconColor: 'orange',
              showConfirmButton: true,
              confirmButtonText: 'Close',
              animation: true,
              backdrop: true
            });
          }
          if (error.error.message == "Invalid token.") {
            navigateToUrl('/login')
          }
        }
      );
    }
  }

  saveDocument(): void {
    console.log('Document Content:', this.documentContent);
    this.document.content = this.documentContent
    this.documentService.updateDocument(this.document).subscribe(
      () => {
        this.alertService.showAlert({
          title: 'Success!',
          text: 'Document saved successfully!',
          icon: 'success',
          iconColor: 'green',
          showConfirmButton: true,
          confirmButtonText: 'OK',
          animation: true,
          backdrop: true,
        });
      },
      (error) => {
        console.error('Failed to save document:', error);
        if (error.error.message == "Invalid token.") {
          navigateToUrl('/login')
        }
      }
    );
  }

  ngOnDestroy(): void {
    // Disconnect the socket when the component is destroyed
    this.socket.disconnect();
  }
}
