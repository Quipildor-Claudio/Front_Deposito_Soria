import { Injectable } from '@angular/core';
import { API_URI } from '../../../config/config';
import { map, Observable } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { Tipo } from '../models/tipo';

@Injectable({
  providedIn: 'root'
})
export class TipoService {
  constructor(private http: HttpClient) { }

  getAll(): Observable<any[]> {
    return this.http.get(`${API_URI}/tipos`).pipe(
      map(response => response as any[])
    );
  }
  get(id: any): Observable<Tipo> {
    return this.http.get<Tipo>(`${API_URI}/tipo/${id}`);
  }

  create(data: any): Observable<any> {
    return this.http.post(`${API_URI}/tipo`, data);
  }

  update(id: any, data: any): Observable<any> {
    return this.http.put(`${API_URI}/tipo/${id}`, data);
  }

  delete(id: any): Observable<any> {
    return this.http.delete(`${API_URI}/tipo/${id}`);
  }
}
