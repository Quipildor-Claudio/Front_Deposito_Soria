import { Injectable } from '@angular/core';
import { API_URI } from '../../../config/config';
import { map, Observable } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { Marca } from '../models/marca';

@Injectable({
  providedIn: 'root'
})
export class MarcaService {
  constructor(private http: HttpClient) { }

  getAll(): Observable<any[]> {
    return this.http.get(`${API_URI}/marcas`).pipe(
      map(response => response as any[])
    );
  }
  get(id: any): Observable<Marca> {
    return this.http.get<Marca>(`${API_URI}/marca/${id}`);
  }

  create(data: any): Observable<any> {
    return this.http.post(`${API_URI}/marca`, data);
  }

  update(id: any, data: any): Observable<any> {
    return this.http.put(`${API_URI}/marca/${id}`, data);
  }

  delete(id: any): Observable<any> {
    return this.http.delete(`${API_URI}/marca/${id}`);
  }
}
