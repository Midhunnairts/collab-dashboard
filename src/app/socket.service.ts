import { Injectable } from '@angular/core';
import { io, Socket } from 'socket.io-client';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class SocketService {
  private socket: Socket;

  constructor() {
    // Connect to the backend server
    this.socket = io('http://localhost:3000');
  }

  // Listen for document load
  loadDocument(): Observable<any> {
    return new Observable((observer) => {
      this.socket.on('load-document', (content: any) => {
        observer.next(content);
      });
    });
  }

  // Listen for text updates
  onTextUpdated(): Observable<any> {
    return new Observable((observer) => {
      this.socket.on('text-change', (newContent: any) => {
        observer.next(newContent);
      });
    });
  }

  // Emit text changes
  sendTextChange(content: any): void {
    this.socket.emit('editor-change', content);
  }
}
