import { Injectable } from '@angular/core';
import { API_URI } from '../../../config/config';
import { map, Observable } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { UnidadMedida } from '../models/unidad-medida';

@Injectable({
  providedIn: 'root'
})
export class UnidadService {
  constructor(private http: HttpClient) { }

  getAll(): Observable<any[]> {
    return this.http.get(`${API_URI}/unidadMedidas`).pipe(
      map(response => response as any[])
    );
  }
  get(id: any): Observable<UnidadMedida> {
    return this.http.get<UnidadMedida>(`${API_URI}/unidadMedida/${id}`);
  }

  create(data: any): Observable<any> {
    return this.http.post(`${API_URI}/unidadMedida`, data);
  }

  update(id: any, data: any): Observable<any> {
    return this.http.put(`${API_URI}/unidadMedida/${id}`, data);
  }

  delete(id: any): Observable<any> {
    return this.http.delete(`${API_URI}/unidadMedida/${id}`);
  }
}
