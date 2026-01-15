import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ChatbotService {
  //private apiUrl = 'http://localhost:4000/api/webhook';
  private apiUrl = 'https://base-datos-api-rest.vercel.app/api/webhook'; 

  constructor(private http: HttpClient) {}

  sendMessage(query: string): Observable<any> {
    return this.http.post<any>(this.apiUrl, { query });
  }
}
