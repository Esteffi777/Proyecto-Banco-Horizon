import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError, tap } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  //private apiUrl = 'http://localhost:4000/api';
  private apiUrl = 'https://base-datos-api-rest.vercel.app/api'; 
  private userCedula: string | null = null; // Variable para almacenar la cédula
  private userNombre: string | null = null; // Variable para almacenar el nombre de usuario

  constructor(private http: HttpClient) { }

login(nombreUsuario: string, contraseña: string, recaptchaToken: string): Observable<any> {
  this.userNombre = nombreUsuario;//Almacena el nombre de usuario
  console.log('Usuario :',this.userNombre);
  return this.http.post<any>(`${this.apiUrl}/login`, { nombreUsuario, contraseña, recaptchaToken }).pipe(
    tap((response: any) => {
      this.userCedula = response.cedula; // Almacenar la cédula en la variable
    }),
    catchError((error) => {
      console.error('Error en el login:', error);
      return throwError(error);
    })
  );
}

  getUserCedula(): string | null {
    return this.userCedula; // Método para obtener la cédula del usuario
  }

  getUserNombre(): string | null {
    console.log('Usuario :', this.userNombre);
    return this.userNombre; // Método para obtener el usuario
  }

  verificarPassword(nombreUsuario: string, passwordActual: string): Observable<any> {
    return this.http.post<any>(`${this.apiUrl}/verificar-password`, { nombreUsuario, passwordActual }).pipe(
      catchError((error) => {
        console.error('Error en verificar contraseña:', error);
        return throwError(error);
      })
    );
  }
}