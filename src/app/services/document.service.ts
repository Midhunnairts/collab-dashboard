import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class DocumentService {
  private apiUrl = 'http://localhost:5000/api/documents';

  constructor(private http: HttpClient) {}

  // Fetch grouped documents
  getDocuments(): Observable<any> {
    return this.http.get(`${this.apiUrl}`);
  }

  // Create a new document
  createDocument(title: string, content: string = ''): Observable<any> {
    return this.http.post(`${this.apiUrl}`, { title, content });
  }

  // Delete a document
  deleteDocument(id: string): Observable<any> {
    return this.http.delete(`${this.apiUrl}/${id}`);
  }

  // Share a document
  shareDocument(documentId: string, userId: string, access: string): Observable<any> {
    return this.http.post(`${this.apiUrl}/share`, { documentId, userId, access });
  }

  getDocumentById(id: string): Observable<any> {
    return this.http.get(`${this.apiUrl}/${id}`);
  }
  
  updateDocument(document: any): Observable<any> {
    return this.http.put(`${this.apiUrl}/${document._id}`, document);
  }
  
//   shareDocument(documentId: string, email: string): Observable<any> {
//     return this.http.post(`${this.apiUrl}/share`, { documentId, email, access: 'read' });
//   }
  
}
